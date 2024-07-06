// frontend/js/edit-recipe.js
document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const recipeId = params.get('id');

    if (!recipeId) {
        showErrorMessage('Recipe ID not provided');
        return;
    }

    try {
        const [categoriesResponse, recipeResponse] = await Promise.all([
            fetch('http://157.230.25.150:3000/categories'),
            fetch(`http://157.230.25.150:3000/recipes/${recipeId}`)
        ]);

        if (!categoriesResponse.ok || !recipeResponse.ok) {
            throw new Error('Network response was not ok');
        }

        const categories = await categoriesResponse.json();
        const recipe = await recipeResponse.json();

        const categorySelect = document.getElementById('category');
        if (!categorySelect) {
            throw new Error('Category select element not found');
        }

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            if (category.id === recipe.category_id) {
                option.selected = true;
            }
            categorySelect.appendChild(option);
        });

        document.getElementById('title').value = recipe.title;
        document.getElementById('ingredients').value = recipe.ingredients;
        document.getElementById('instructions').value = recipe.instructions;
        document.getElementById('cookingTime').value = recipe.cooking_time;
        document.getElementById('servingSize').value = recipe.serving_size;

        if (recipe.image_urls) {
            const imageLabel = document.querySelector('label[for="image"]');
            const existingImages = document.createElement('div');
            existingImages.innerHTML = `
                <p>Current Images:</p>
                ${recipe.image_urls.map(url => `<img src="http://157.230.25.150:3000${url}" alt="Current Image" style="width:100px;">`).join('')}
            `;
            imageLabel.parentNode.insertBefore(existingImages, imageLabel.nextSibling);
        }

    } catch (error) {
        console.error('Error loading recipe or categories:', error);
        showErrorMessage(error.message);
    }
});

document.getElementById('editRecipeForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!confirm('Are you sure you want to edit this recipe?')) {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const recipeId = params.get('id');

    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('ingredients', document.getElementById('ingredients').value);
    formData.append('instructions', document.getElementById('instructions').value);
    formData.append('cooking_time', document.getElementById('cookingTime').value);
    formData.append('serving_size', document.getElementById('servingSize').value);
    formData.append('category_id', document.getElementById('category').value);
    formData.append('user_id', 1); // Replace with actual user_id after implementing authentication

    const imageInput = document.getElementById('image');
    const removeImage = document.getElementById('removeImage').checked;

    for (const file of imageInput.files) {
        formData.append('images', file);
    }

    if (removeImage) {
        formData.append('remove_images', 'true');
    }

    try {
        const response = await fetch(`http://157.230.25.150:3000/recipes/${recipeId}`, {
            method: 'PUT',
            body: formData
        });

        if (response.ok) {
            console.log('Recipe updated successfully!');
            showSuccessMessage('Recipe updated successfully!');
            document.getElementById('editRecipeForm').reset(); // Reset form after successful submission
            // Optionally redirect to another page or reload the current page
        } else {
            const responseData = await response.json();
            throw new Error(responseData.message || 'Failed to update recipe');
        }
    } catch (error) {
        console.error('Error updating recipe:', error.message);
        showErrorMessage(error.message);
    }
});

function showSuccessMessage(message) {
    const successMessage = document.getElementById('successMessage');
    successMessage.textContent = message;
    successMessage.style.display = 'block';

    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000); // 3000 milliseconds = 3 seconds
}

function showErrorMessage(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';

    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 3000); // 3000 milliseconds = 3 seconds
}
