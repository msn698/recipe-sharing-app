// frontend/js/home.js
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch and display categories
        await fetchCategories();

        // Fetch and display all recipes initially
        await fetchAndDisplayRecipes();

        // Add event listener to category dropdown
        document.getElementById('categoryFilter').addEventListener('change', async (e) => {
            await fetchAndDisplayRecipes(e.target.value);
        });
    } catch (error) {
        console.error('Error initializing page:', error);
    }
});

// Function to fetch and display categories
async function fetchCategories() {
    try {
        const response = await fetch('http://157.230.25.150:3000/categories');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const categories = await response.json();
        const categoryFilter = document.getElementById('categoryFilter');

        // Populate category dropdown
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categoryFilter.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

// Function to fetch and display recipes based on category
async function fetchAndDisplayRecipes(categoryId = '') {
    try {
        const response = await fetch(`http://157.230.25.150:3000/recipes${categoryId ? `?category_id=${categoryId}` : ''}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const recipes = await response.json();
        displayRecipes(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
    }
}

// Function to display recipes on home page
function displayRecipes(recipes) {
    const recipeList = document.getElementById('recipeList');
    recipeList.innerHTML = ''; // Clear existing recipes

    recipes.forEach(recipe => {
        const listItem = document.createElement('li');
        const recipeLink = document.createElement('a');
        recipeLink.href = `recipe.html?id=${recipe.id}`;
        const recipeTitle = document.createElement('h3');
        recipeTitle.textContent = recipe.title;
        recipeLink.appendChild(recipeTitle);

        if (recipe.image_urls && recipe.image_urls.length > 0) {
            const imagesContainer = document.createElement('div');
            recipe.image_urls.forEach(url => {
                const recipeImage = document.createElement('img');
                recipeImage.src = `http://157.230.25.150:3000${url}`;
                recipeImage.alt = recipe.title;
                recipeImage.style.width = '100px'; // Adjust image size as needed
                imagesContainer.appendChild(recipeImage);
            });
            listItem.appendChild(imagesContainer);
        }

        listItem.appendChild(recipeLink);
        recipeList.appendChild(listItem);
    });
}
