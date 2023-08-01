const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const { check, validationResult } = require('express-validator');
const passport = require('passport');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const Handlebars = require('handlebars');

const { database } = require('./keys');

// Intializations
const app = express();
require('./lib/passport');

// Settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.engine({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs');

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

try {
  app.use(session({
    secret: 'faztmysqlnodemysql',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
  }));
} catch (error) {
  console.error('Error setting up session:', error);
}

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Global variables
app.use((req, res, next) => {
  try {
    app.locals.message = req.flash('message');
    app.locals.success = req.flash('success');
    app.locals.user = req.user;
    next();
  } catch (error) {
    console.error('Error setting up global variables:', error);
    next(error);
  }
});

// Routes
try {
  app.use(require('./routes/index'));
  app.use(require('./routes/authentication'));
  app.use('/links', require('./routes/links'));
} catch (error) {
  console.error('Error setting up routes:', error);
}

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Starting
const port = app.get('port');
try {
  app.listen(port, () => {
    console.log('Server is running on port', port);
  });
} catch (error) {
  console.error('Error starting the server:', error);
}