const Recipe = require('../models/recipe');

exports.getAllRecipes = (req, res) => {
  Recipe.getAll((err, results) => {
    if (err) res.status(500).send(err);
    res.json(results);
  });
};

exports.getRecipeById = (req, res) => {
  Recipe.getById(req.params.id, (err, results) => {
    if (err) res.status(500).send(err);
    res.json(results[0]);
  });
};

exports.createRecipe = (req, res) => {
  const data = req.body;
  Recipe.create(data, (err, results) => {
    if (err) res.status(500).send(err);
    res.status(201).json(results);
  });
};

exports.updateRecipe = (req, res) => {
  const data = req.body;
  Recipe.update(req.params.id, data, (err, results) => {
    if (err) res.status(500).send(err);
    res.json(results);
  });
};

exports.deleteRecipe = (req, res) => {
  Recipe.delete(req.params.id, (err, results) => {
    if (err) res.status(500).send(err);
    res.json(results);
  });
};
