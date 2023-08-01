const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('./helpers');

try {
  passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, username, password, done) => {
    try {
      const rows = await pool.query('SELECT * FROM tbl_users WHERE USU_CUSUARIO = ?', [username]);
      if (rows.length > 0) {
        const user = rows[0];
        console.log(user);
        const validPassword = await helpers.matchPassword(password, user.USU_CPASSWORD);
        console.log(validPassword);
        if (validPassword) {
          done(null, user, req.flash('success', 'Welcome ' + user.USU_CUSUARIO));
        } else {
          done(null, false, req.flash('message', 'Incorrect Password'));
        }
      } else {
        return done(null, false, req.flash('message', 'The Username does not exist.'));
      }
    } catch (error) {
      console.error('Error during local.signin:', error);
      done(error); // Pass the error to the done function to handle it properly
    }
  }));

  passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, username, password, done) => {
    try {
      const { fullname } = req.body;
      let newUser = {
        USU_CNOMBRES_APELLIDOS: fullname,
        USU_CUSUARIO: username,
        USU_CPASSWORD: await helpers.encryptPassword(password),
      };
      // Saving in the Database
      const result = await pool.query('INSERT INTO tbl_users SET ?', [newUser]);
      newUser.PKUSU_NCODIGO = result.insertId;
      return done(null, newUser);
    } catch (error) {
      console.error('Error during local.signup:', error);
      done(error); // Pass the error to the done function to handle it properly
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user.PKUSU_NCODIGO);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const rows = await pool.query('SELECT * FROM tbl_users WHERE PKUSU_NCODIGO = ?', [id]);
      done(null, rows[0]);
    } catch (error) {
      console.error('Error during deserialization:', error);
      done(error); // Pass the error to the done function to handle it properly
    }
  });
} catch (error) {
  console.error('Error setting up passport:', error);
}