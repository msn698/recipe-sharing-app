document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            // Add login functionality here
        });
    }

    fetch('/api/recipes')
        .then(response => response.json())
        .then(data => {
            const recipesDiv = document.getElementById('recipes');
            data.forEach(recipe => {
                const recipeElement = document.createElement('div');
                recipeElement.innerHTML = `<h2>${recipe.title}</h2><p>${recipe.ingredients}</p><p>${recipe.instructions}</p>`;
                recipesDiv.appendChild(recipeElement);
            });
        })
        .catch(error => console.error('Error:', error));
});
