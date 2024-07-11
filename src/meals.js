// Get categories from API
fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
   .then(response => response.json())
   .then(data => {
        const categories = data.categories;
        const categorySelect = document.getElementById('category-select');
        categories.forEach(category => {
            const option = document.createElement('option');
            option.text = category.strCategory;
            option.value = category.strCategory;
            categorySelect.appendChild(option);
        });
    });

// Add event listener to category select
document.getElementById('category-select').addEventListener('change', () => {
    const category = document.getElementById('category-select').value;
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
       .then(response => response.json())
       .then(data => {
            const meals = data.meals;
            const mealSelect = document.getElementById('meal-select');
            mealSelect.innerHTML = ''; // clear the select list
            meals.forEach(meal => {
                const option = document.createElement('option');
                option.text = meal.strMeal;
                option.value = meal.idMeal;
                mealSelect.appendChild(option);
            });
        });
});

// Add event listener to meal select
document.getElementById('meal-select').addEventListener('change', () => {
    const mealId = document.getElementById('meal-select').value;
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
       .then(response => response.json())
       .then(data => {
            const meal = data.meals[0];
            displayMealDetails(meal);
        });
});

// Display meal details
function displayMealDetails(meal) {
    const mealDetails = document.getElementById('meal-details');
    mealDetails.style.display = 'block';
    document.getElementById('meal-name').textContent = meal.strMeal;
    document.getElementById('meal-origin').textContent = `Origin: ${meal.strArea}`;
    const ingredients = document.getElementById('meal-ingredients');
    ingredients.innerHTML = ''; // clear the list
    for (let i = 1; i <= 20; i++) {
        const ingredient = `strIngredient${i}`;
        const measure = `strMeasure${i}`;
        if (meal[ingredient] && meal[measure]) {
            const li = document.createElement('li');
            li.textContent = `${meal[ingredient]} - ${meal[measure]}`;
            ingredients.appendChild(li);
        }
    }
    document.getElementById('meal-instructions').textContent = meal.strInstructions;
    document.getElementById('meal-url').innerHTML = `<a href="${meal.strYoutube}" target="_blank">View recipe</a>`;
    const favoriteButton = document.getElementById('favorite-button');
    favoriteButton.disabled = false;
    favoriteButton.addEventListener('click', () => {
        addMealToFavorites(meal);
    });
}

// Add meal to favorites
function addMealToFavorites(meal) {
    let favoriteMeals = JSON.parse(localStorage.getItem('favoriteMeals')) || [];
    if (!favoriteMeals.find(m => m.idMeal === meal.idMeal)) {
        favoriteMeals.push(meal);
        localStorage.setItem('favoriteMeals', JSON.stringify(favoriteMeals));
        alert(`Meal added to favorites!`);
    } else {
        alert(`Meal is already in favorites!`);
    }
}