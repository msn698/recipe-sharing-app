document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const recipeId = params.get('id');

    try {
        const response = await fetch(`http://157.230.25.150:3000/recipes/${recipeId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const recipe = await response.json();
        
        const recipeDiv = document.getElementById('recipe');
        recipeDiv.innerHTML = `
            <h2>${recipe.title}</h2>
            <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
            <p><strong>Instructions:</strong> ${recipe.instructions}</p>
            <p><strong>Cooking time:</strong> ${recipe.cooking_time} mins</p>
            <p><strong>Serving size:</strong> ${recipe.serving_size}</p>
            ${recipe.image_url ? `<img src="http://157.230.25.150:3000${recipe.image_url}" alt="${recipe.title}" style="width:200px;">` : ''}
        `;
    } catch (error) {
        console.error('Error fetching recipe details:', error);
    }
});
