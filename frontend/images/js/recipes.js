document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://157.230.25.150:3000/categories');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const categories = await response.json();
        console.log('Fetched categories:', categories);

        const categorySelect = document.getElementById('category');
        if (!categorySelect) {
            throw new Error('Category select element not found');
        }

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });

        // Load user recipes
        await loadMyRecipes();
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
});

document.getElementById('recipeForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('ingredients', document.getElementById('ingredients').value);
    formData.append('instructions', document.getElementById('instructions').value);
    formData.append('cooking_time', document.getElementById('cookingTime').value);
    formData.append('serving_size', document.getElementById('servingSize').value);
    formData.append('category_id', document.getElementById('category').value);
    formData.append('user_id', 1); // Replace with actual user_id after implementing authentication
    formData.append('image', document.getElementById('image').files[0]);

    try {
        const response = await fetch('http://157.230.25.150:3000/recipes', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            console.log('Recipe added successfully!');
            showSuccessMessage('Recipe added successfully!');
            document.getElementById('recipeForm').reset(); // Reset form after successful submission
            await loadMyRecipes(); // Reload recipes after adding a new one
        } else {
            const responseData = await response.json();
            throw new Error(responseData.message || 'Failed to add recipe');
        }
    } catch (error) {
        console.error('Error adding recipe:', error.message);
        showErrorMessage(error.message);
    }
});

async function loadMyRecipes() {
    try {
        const response = await fetch('http://157.230.25.150:3000/recipes');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const recipes = await response.json();
        console.log('Fetched recipes:', recipes);

        displayRecipes(recipes);
    } catch (error) {
        console.error('Error loading recipes:', error);
    }
}

// Function to display recipes
function displayRecipes(recipes) {
    const recipeList = document.getElementById('recipeList');
    recipeList.innerHTML = ''; // Clear existing recipes

    recipes.forEach(recipe => {
        const listItem = document.createElement('li');
        const recipeTitle = document.createElement('h3');
        recipeTitle.textContent = recipe.title;

        if (recipe.image_url) {
            const recipeImage = document.createElement('img');
            recipeImage.src = `http://157.230.25.150:3000${recipe.image_url}`;
            recipeImage.alt = recipe.title;
            recipeImage.style.width = '100px'; // Adjust image size as needed
            listItem.appendChild(recipeImage);
        }

        listItem.appendChild(recipeTitle);
        recipeList.appendChild(listItem);
    });
}

function showSuccessMessage(message) {
    const successMessage = document.getElementById('successMessage');
    successMessage.textContent = message;
    successMessage.style.display = 'block';

    // Hide the message after a few seconds
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000); // 3000 milliseconds = 3 seconds
}

function showErrorMessage(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';

    // Hide the message after a few seconds
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 3000); // 3000 milliseconds = 3 seconds
}
