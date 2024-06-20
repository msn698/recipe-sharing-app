const db = require('../config/db');

const Recipe = {
  getAll: (callback) => {
    db.query('SELECT * FROM recipes', callback);
  },
  getById: (id, callback) => {
    db.query('SELECT * FROM recipes WHERE id = ?', [id], callback);
  },
  create: (data, callback) => {
    db.query('INSERT INTO recipes SET ?', data, callback);
  },
  update: (id, data, callback) => {
    db.query('UPDATE recipes SET ? WHERE id = ?', [data, id], callback);
  },
  delete: (id, callback) => {
    db.query('DELETE FROM recipes WHERE id = ?', [id], callback);
  }
};

module.exports = Recipe;
