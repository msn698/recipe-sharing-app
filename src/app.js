const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const recipeRoutes = require('./routes/routes');

app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/api', recipeRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
