// backend/server.js

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');
const multer = require('multer');

const app = express();
const port = 3000;

// Middleware
app.use(cors({
    origin: 'http://157.230.25.150:8080',
    credentials: true
}));
app.use(bodyParser.json());
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, '../frontend')));

// Multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../frontend/images'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Appends the file extension
    }
});

const upload = multer({ storage: storage });

// MySQL Connection
let db;

function handleDisconnect() {
    db = mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '123456', // Replace with your MySQL password
        database: 'recipe_app'
    });

    db.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL:', err);
            setTimeout(handleDisconnect, 2000);
        } else {
            console.log('Connected to MySQL server');
            initializeDatabase();
        }
    });

    db.on('error', (err) => {
        console.error('MySQL error:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

function initializeDatabase() {
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        )
    `;
    const createCategoriesTable = `
        CREATE TABLE IF NOT EXISTS categories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE
        )
    `;
    const createRecipesTable = `
        CREATE TABLE IF NOT EXISTS recipes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            ingredients TEXT NOT NULL,
            instructions TEXT NOT NULL,
            cooking_time INT NOT NULL,
            serving_size INT NOT NULL,
            category_id INT,
            user_id INT,
            image_urls TEXT,
            FOREIGN KEY (category_id) REFERENCES categories(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `;

    db.query(createUsersTable, (err) => {
        if (err) {
            console.error('Error creating users table:', err);
            return;
        }
        console.log('Users table created or already exists');
    });

    db.query(createCategoriesTable, (err) => {
        if (err) {
            console.error('Error creating categories table:', err);
            return;
        }
        console.log('Categories table created or already exists');
    });

    db.query(createRecipesTable, (err) => {
        if (err) {
            console.error('Error creating recipes table:', err);
            return;
        }
        console.log('Recipes table created or already exists');

        const insertCategories = `
            INSERT INTO categories (name) VALUES
            ('Breakfast'),
            ('Lunch'),
            ('Dinner')
            ON DUPLICATE KEY UPDATE name=VALUES(name)
        `;
        db.query(insertCategories, (err) => {
            if (err) {
                console.error('Error inserting categories:', err);
                return;
            }
            console.log('Categories inserted or already exist');
        });
    });
}

handleDisconnect();

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
            if (err) {
                console.error('Signup error:', err);
                return res.status(500).send('Server error');
            }
            console.log('User signed up:', username);
            res.status(201).send('User created');
        });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).send('Server error');
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Server error');
            }

            if (results.length === 0) {
                console.log('User not found:', username);
                return res.status(401).send('Invalid credentials');
            }

            const user = results[0];

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                req.session.user = user;
                console.log('Login successful for:', username);
                return res.send('Login successful');
            } else {
                console.log('Invalid password for:', username);
                return res.status(401).send('Invalid credentials');
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Server error');
    }
});

app.get('/categories', (req, res) => {
    console.log('Fetching categories from database...');
    db.query('SELECT * FROM categories', (err, results) => {
        if (err) {
            console.error('Error fetching categories:', err);
            return res.status(500).send('Server error');
        }
        console.log('Categories fetched:', results);
        res.json(results);
    });
});

app.get('/recipes', (req, res) => {
    const referer = req.get('referer');
    const categoryId = req.query.category_id;

    if (referer && referer.includes('/recipes.html')) {
        // If the referer is from /recipes.html page, send an empty list
        res.json([]);
    } else {
        let query = 'SELECT * FROM recipes';
        const params = [];
        if (categoryId) {
            query += ' WHERE category_id = ?';
            params.push(categoryId);
        }
        db.query(query, params, (err, results) => {
            if (err) {
                console.error('Error fetching recipes:', err);
                return res.status(500).send('Server error');
            }
            results.forEach(recipe => {
                recipe.image_urls = recipe.image_urls ? recipe.image_urls.split(',') : [];
            });
            res.json(results);
        });
    }
});

app.get('/recipes/:id', (req, res) => {
    const recipeId = req.params.id;
    db.query('SELECT * FROM recipes WHERE id = ?', [recipeId], (err, results) => {
        if (err) {
            console.error('Error fetching recipe:', err);
            return res.status(500).send('Server error');
        }
        if (results.length === 0) {
            return res.status(404).send('Recipe not found');
        }
        const recipe = results[0];
        recipe.image_urls = recipe.image_urls ? recipe.image_urls.split(',') : [];
        res.json(recipe);
    });
});

app.post('/recipes', upload.array('images', 10), (req, res) => {
    const { title, ingredients, instructions, cooking_time, serving_size, category_id, user_id } = req.body;
    const imageUrls = req.files.map(file => `/images/${file.filename}`).join(',');

    db.query(
        'INSERT INTO recipes (title, ingredients, instructions, cooking_time, serving_size, category_id, user_id, image_urls) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [title, ingredients, instructions, cooking_time, serving_size, category_id, user_id, imageUrls],
        (err, result) => {
            if (err) {
                console.error('Error adding recipe:', err);
                return res.status(500).json({ message: 'Failed to add recipe' });
            }
            console.log('Recipe added:', title);
            res.status(201).json({ message: 'Recipe added' });
        }
    );
});

app.put('/recipes/:id', upload.array('images', 10), (req, res) => {
    const recipeId = req.params.id;
    const { title, ingredients, instructions, cooking_time, serving_size, category_id, user_id, remove_images } = req.body;
    const imageUrls = req.files.map(file => `/images/${file.filename}`).join(',');
    const imageUrlsClause = imageUrls ? `, image_urls = '${imageUrls}'` : '';

    let query = `UPDATE recipes SET title = ?, ingredients = ?, instructions = ?, cooking_time = ?, serving_size = ?, category_id = ?, user_id = ?${imageUrlsClause} WHERE id = ?`;
    let queryParams = [title, ingredients, instructions, cooking_time, serving_size, category_id, user_id, recipeId];

    if (remove_images === 'true') {
        query = `UPDATE recipes SET title = ?, ingredients = ?, instructions = ?, cooking_time = ?, serving_size = ?, category_id = ?, user_id = ?, image_urls = NULL WHERE id = ?`;
        queryParams = [title, ingredients, instructions, cooking_time, serving_size, category_id, user_id, recipeId];
    }

    db.query(query, queryParams, (err, result) => {
        if (err) {
            console.error('Error updating recipe:', err);
            return res.status(500).json({ message: 'Failed to update recipe' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        console.log('Recipe updated:', title);
        res.status(200).json({ message: 'Recipe updated' });
    });
});

// Endpoint to delete a recipe
app.delete('/recipes/:id', (req, res) => {
    const recipeId = req.params.id;
    db.query('DELETE FROM recipes WHERE id = ?', [recipeId], (err, result) => {
        if (err) {
            console.error('Error deleting recipe:', err);
            return res.status(500).json({ message: 'Failed to delete recipe' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        console.log('Recipe deleted:', recipeId);
        res.status(200).json({ message: 'Recipe deleted' });
    });
});

app.post('/addCategory', (req, res) => {
    const { name } = req.body;

    try {
        db.query('INSERT INTO categories (name) VALUES (?) ON DUPLICATE KEY UPDATE name=VALUES(name)', [name], (err, result) => {
            if (err) {
                console.error('Error adding category:', err);
                return res.status(500).send('Something went wrong');
            }
            console.log('Category added:', name);
            res.status(200).send('Category added');
        });
    } catch (error) {
        console.error('Error during category addition:', error);
        res.status(500).send('Something went wrong');
    }
});

// New endpoints for managing categories
app.put('/categories/:id', (req, res) => {
    const { name } = req.body;
    const categoryId = req.params.id;

    db.query('UPDATE categories SET name = ? WHERE id = ?', [name, categoryId], (err, result) => {
        if (err) {
            console.error('Error updating category:', err);
            return res.status(500).send('Failed to update category');
        }
        res.status(200).send('Category updated');
    });
});

app.delete('/categories/:id', (req, res) => {
    const categoryId = req.params.id;

    db.query('DELETE FROM categories WHERE id = ?', [categoryId], (err, result) => {
        if (err) {
            console.error('Error deleting category:', err);
            return res.status(500).send('Failed to delete category');
        }
        res.status(200).send('Category deleted');
    });
});

// Serve the landing page as the default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'landing.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

app.get('/recipes.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'recipes.html'));
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
