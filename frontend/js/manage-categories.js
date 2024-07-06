// frontend/js/manage-categories.js
document.addEventListener('DOMContentLoaded', async () => {
    await loadCategories();
});

document.getElementById('addCategoryForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const newCategoryName = document.getElementById('newCategoryName').value;

    try {
        const response = await fetch('http://157.230.25.150:3000/addCategory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: newCategoryName })
        });

        if (response.ok) {
            showSuccessMessage('Category added successfully!');
            document.getElementById('addCategoryForm').reset();
            await loadCategories();
        } else {
            const responseData = await response.json();
            throw new Error(responseData.message || 'Failed to add category');
        }
    } catch (error) {
        showErrorMessage(error.message);
    }
});

document.getElementById('editCategoryForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!confirm('Are you sure you want to edit this category?')) {
        return;
    }

    const categoryId = document.getElementById('editCategorySelect').value;
    const newCategoryName = document.getElementById('editCategoryName').value;

    try {
        const response = await fetch(`http://157.230.25.150:3000/categories/${categoryId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: newCategoryName })
        });

        if (response.ok) {
            showSuccessMessage('Category updated successfully!');
            document.getElementById('editCategoryForm').reset();
            await loadCategories();
        } else {
            const responseData = await response.json();
            throw new Error(responseData.message || 'Failed to update category');
        }
    } catch (error) {
        showErrorMessage(error.message);
    }
});

document.getElementById('deleteCategoryForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!confirm('Are you sure you want to delete this category?')) {
        return;
    }

    const categoryId = document.getElementById('deleteCategorySelect').value;

    try {
        const response = await fetch(`http://157.230.25.150:3000/categories/${categoryId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showSuccessMessage('Category deleted successfully!');
            document.getElementById('deleteCategoryForm').reset();
            await loadCategories();
        } else {
            const responseData = await response.json();
            throw new Error(responseData.message || 'Failed to delete category');
        }
    } catch (error) {
        showErrorMessage(error.message);
    }
});

async function loadCategories() {
    try {
        const response = await fetch('http://157.230.25.150:3000/categories');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const categories = await response.json();
        console.log('Fetched categories:', categories);  // Debugging: Log fetched categories
        displayCategories(categories);
        populateCategorySelects(categories);
    } catch (error) {
        showErrorMessage(error.message);
    }
}

function displayCategories(categories) {
    const categoryList = document.getElementById('categoryList');
    if (!categoryList) {
        console.error('Category list element not found');
        return;
    }

    categoryList.innerHTML = '';

    categories.forEach(category => {
        const listItem = document.createElement('li');
        listItem.textContent = `${category.id}: ${category.name}`;
        categoryList.appendChild(listItem);
    });
}

function populateCategorySelects(categories) {
    const editCategorySelect = document.getElementById('editCategorySelect');
    const deleteCategorySelect = document.getElementById('deleteCategorySelect');

    if (!editCategorySelect || !deleteCategorySelect) {
        console.error('Category select elements not found');
        return;
    }

    editCategorySelect.innerHTML = '';
    deleteCategorySelect.innerHTML = '';

    categories.forEach(category => {
        const editOption = document.createElement('option');
        editOption.value = category.id;
        editOption.textContent = category.name;
        editCategorySelect.appendChild(editOption);

        const deleteOption = document.createElement('option');
        deleteOption.value = category.id;
        deleteOption.textContent = category.name;
        deleteCategorySelect.appendChild(deleteOption);
    });
}

function showSuccessMessage(message) {
    const successMessage = document.getElementById('successMessage');
    successMessage.textContent = message;
    successMessage.style.display = 'block';

    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);
}

function showErrorMessage(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';

    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 3000);
}
