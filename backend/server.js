const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sam@1234#',
    database: 'recipe_app'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err.stack);
        return;
    }
    console.log('Connected to database');
});

// Signup endpoint
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

// Login endpoint
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

// Example API endpoints for categories and recipes (optional for your application)
app.get('/categories', (req, res) => {
    db.query('SELECT * FROM categories', (err, results) => {
        if (err) {
            console.error('Error fetching categories:', err);
            return res.status(500).send('Server error');
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
 