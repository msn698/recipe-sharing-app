# Recipe Sharing App

This project is a Recipe Sharing App built with a Node.js backend and a plain HTML/CSS/JavaScript frontend. The app allows users to sign up, log in, add, edit, delete recipes, and add categories.

## Table of Contents

- [Project Structure](#project-structure)
- [Modules and Dependencies](#modules-and-dependencies)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Installation and Setup](#installation-and-setup)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Deployment on Heroku](#deployment-on-heroku)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)

## Project Structure
```
recipe-sharing-app/
│
├── backend/
│ ├── server.js
│ ├── package.json
│ ├── package-lock.json
│ ├── images/
│ └── db/
│ └── schema.sql
│
├── frontend/
│ ├── index.html
│ ├── signup.html
│ ├── login.html
│ ├── recipe.html
│ ├── recipes.html
│ ├── edit-recipe.html
│ ├── css/
│ │ └── styles.css
│ ├── js/
│ │ ├── signup.js
│ │ ├── recipe.js
│ │ ├── login.js
│ │ ├── home.js
│ │ ├── recipes.js
│ │ └── edit-recipe.js
│ └── images/
│ └── logo.png
```

## Modules and Dependencies

### Backend

- **Express**: Web framework for Node.js.
- **MySQL**: Database to store user and recipe data.
- **Body-Parser**: Middleware to parse incoming request bodies.
- **Express-Session**: Middleware to manage user sessions.
- **Cors**: Middleware to enable Cross-Origin Resource Sharing.
- **Bcrypt**: Library to hash passwords.
- **Multer**: Middleware for handling multipart/form-data, used for file uploads.
- **Path**: Utility module to work with file and directory paths.

### Frontend

- Plain HTML, CSS, and JavaScript.

## Installation and Setup

### Prerequisites

- Node.js and npm (Node Package Manager) installed.
- MySQL installed and running.

### Backend Setup

1. **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/recipe-sharing-app.git
    cd recipe-sharing-app/backend
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Create the MySQL database:**

    Log in to your MySQL server and run the following SQL commands:

    ```sql
    CREATE DATABASE recipe_app;
    USE recipe_app;
    SOURCE db/schema.sql;
    ```

4. **Configure database connection:**

    Update the MySQL connection settings in `server.js`:

    ```javascript
    const db = mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'your_password', // Replace with your MySQL password
        database: 'recipe_app'
    });
    ```

5. **Start the server:**

    ```bash
    node server.js
    ```

### Frontend Setup

1. **Navigate to the frontend directory:**

    ```bash
    cd ../frontend
    ```

2. **Open `index.html` in your browser to access the app.**

### Deployment on Heroku

1. **Login to Heroku:**

    ```bash
    heroku login
    ```

2. **Create a new Heroku app:**

    ```bash
    heroku create your-app-name
    ```

3. **Add MySQL add-on (Heroku ClearDB):**

    ```bash
    heroku addons:create cleardb:ignite
    ```

4. **Configure the database connection in `server.js` using the environment variable provided by ClearDB:**

    ```javascript
    const db = mysql.createConnection(process.env.CLEARDB_DATABASE_URL);
    ```

5. **Create a `Procfile` in the backend directory:**

    ```Procfile
    web: node server.js
    ```

6. **Commit your changes and push to Heroku:**

    ```bash
    git add .
    git commit -m "Prepare for Heroku deployment"
    git push heroku main
    ```

7. **Open your app in the browser:**

    ```bash
    heroku open
    ```

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## Support

**Interested in supporting me? [Patreon](patreon.com/msaeed)**

## License

This project is licensed under the MIT License.
