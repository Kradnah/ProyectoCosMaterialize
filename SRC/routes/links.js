const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

// Función para registrar una acción en la tabla "logs"
async function registerLog(user_id, movie_id, action) {
  const newLog = {
    user_id,
    movie_id,
    action
  };
  await pool.query('INSERT INTO logs SET ?', [newLog]);
}

router.get('/add', (req, res) => {
  res.render('links/add');
});

router.post('/add', async (req, res) => {
  const { title, director, year, rating, seen, description } = req.body;
  const newLink = {
    title,
    director,
    year,
    rating,
    seen,
    description,
    user_id: req.user.id
  };

  // Insertar la nueva película y obtener el ID de la película insertada
  const insertResult = await pool.query('INSERT INTO links SET ?', [newLink]);
  const movieId = insertResult.insertId;

  // Registro de acción en la tabla "logs" - create
  await registerLog(req.user.id, movieId, 'create');

  req.flash('success', 'Movie Saved Successfully');
  res.redirect('/links');
});

router.get('/', isLoggedIn, async (req, res) => {
  const links = await pool.query('SELECT * FROM links WHERE user_id = ? AND visible = ?', [req.user.id, 1]);
  res.render('links/list', { links });
});

router.get('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Actualizar el campo "visible" a false para ocultar la película
    await pool.query('UPDATE links SET visible = ? WHERE id = ?', [false, id]);

    // Registro de acción en la tabla "logs" - delete
    await registerLog(req.user.id, id, 'delete');

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
  const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
  res.render('links/edit', { link: links[0] });
});

router.post('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { title, director, year, rating, seen, description } = req.body;
  const newLink = {
    title,
    director,
    year,
    rating,
    seen,
    description,
    user_id: req.user.id
  };
  await pool.query('UPDATE links SET ? WHERE id = ?', [newLink, id]);

  // Registro de acción en la tabla "logs" - edit
  await registerLog(req.user.id, id, 'edit');

  req.flash('success', 'Movie Updated Successfully');
  res.redirect('/links');
});

module.exports = router;