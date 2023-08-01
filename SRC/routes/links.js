const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

// Función para registrar una acción en la tabla "tbl_logs"
async function registerLog(user_id, movie_id, action) {
  const newLog = {
    FKLOG_USERID: user_id,
    LOG_CMOVIEID: movie_id,
    LOG_CACTION: action
  };
  await pool.query('INSERT INTO tbl_logs SET ?', [newLog]);
}

router.get('/add', (req, res) => {
  res.render('links/add');
});

router.post('/add', async (req, res) => {
  const { title, director, year, rating, seen, description } = req.body;
  const newLink = {
    MOV_CTITLE: title,
    MOV_CDIRECTOR: director,
    MOV_CYEAR: year,
    MOV_CRATING: rating,
    MOV_CSEEN: seen,
    MOV_CDESCRIPTION: description,
    FKMOV_USERID: req.user.PKUSU_NCODIGO
  };

  // Insertar la nueva película y obtener el ID de la película insertada
  const insertResult = await pool.query('INSERT INTO tbl_movies SET ?', [newLink]);
  const movieId = insertResult.insertId;

  // Registro de acción en la tabla "tbl_logs" - create
  await registerLog(req.user.PKUSU_NCODIGO, movieId, 'create');

  req.flash('success', 'Movie Saved Successfully');
  res.redirect('/links');
});

router.get('/', isLoggedIn, async (req, res) => {
  const links = await pool.query('SELECT * FROM tbl_movies WHERE FKMOV_USERID = ? AND MOV_CESTADO = ?', [req.user.PKUSU_NCODIGO, 1]);
  res.render('links/list', { links });
});

router.get('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Actualizar el campo "MOV_CESTADO" a 'false' para ocultar la película
    await pool.query('UPDATE tbl_movies SET MOV_CESTADO = ? WHERE PKMOV_NCODIGO = ?', [false, id]);

    // Registro de acción en la tabla "tbl_logs" - delete
    await registerLog(req.user.PKUSU_NCODIGO, id, 'delete');

    req.flash('success', 'Movie deleted Successfully');
    res.redirect('/links');
  } catch (err) {
    console.error('Error deleting the movie:', err);
    req.flash('error', 'Error deleting the movie');
    res.redirect('/links');
  }
});

router.get('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const links = await pool.query('SELECT * FROM tbl_movies WHERE PKMOV_NCODIGO = ?', [id]);
  res.render('links/edit', { link: links[0] });
});

router.post('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { title, director, year, rating, seen, description } = req.body;
  const newLink = {
    MOV_CTITLE: title,
    MOV_CDIRECTOR: director,
    MOV_CYEAR: year,
    MOV_CRATING: rating,
    MOV_CSEEN: seen,
    MOV_CDESCRIPTION: description,
    FKMOV_USERID: req.user.PKUSU_NCODIGO
  };
  await pool.query('UPDATE tbl_movies SET ? WHERE PKMOV_NCODIGO = ?', [newLink, id]);

  // Registro de acción en la tabla "tbl_logs" - edit
  await registerLog(req.user.PKUSU_NCODIGO, id, 'edit');

  req.flash('success', 'Movie Updated Successfully');
  res.redirect('/links');
});

module.exports = router;