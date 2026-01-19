
import { fetchAPI } from './api.js';
import { renderMealDetails } from './ui.js';
import { logMealOrProduct } from './foodLog.js';
import { getTodayDateKey } from './utils.js';

function getRecipesGrid() { return document.querySelector("#recipes-grid"); }
function getRecipesCount() { return document.querySelector("#recipes-count"); }
function getLoading() { return document.querySelector("#app-loading-overlay"); }
function getCountryDiv() { return document.querySelector("#country"); }
function getCategoriesGrid() { return document.querySelector("#categories-grid"); }

let currentMeal;

export function SearchByName(val) {
    const query = val.length > 1 ? `q=${val}` : `f=${val}`;
    fetchAPI(`/meals/search?${query}&page=1&limit=20`).then((data) =>
        displayCategories(data.results),
    );
}

export function nameCatg() {
    fetchAPI("/meals/categories").then((data) => showCategoriesAll(data.results));
}

export function getRandomMeals() {
    const loading = getLoading();
    if (loading) loading.style.display = "flex";

    fetchAPI("/meals/random?count=25")
        .then((data) => {
            displayCategories(data.results);
            if (loading) loading.style.display = "none";
        })
        .catch((err) => {
            console.error(err);
            if (loading) loading.style.display = "none";
        });
}

export function searchByArea(area) {
    fetchAPI(`/meals/filter?area=${area}&limit=20`).then((data) =>
        displayCategories(data.results),
    );
}

export function categories(cat) {
    fetchAPI(`/meals/filter?category=${cat}&page=1&limit=20`).then((data) =>
        displayCategories(data.results),
    );
}

export function getRandomMealsareas() {
    fetchAPI("/meals/areas").then((data) => DisplayAllMealsareas(data.results));
}

export function showCategoriesAll(AllCat) {
    const categoryStyles = {
        Beef: { bg: "from-red-50 to-rose-50", border: "border-red-200 hover:border-red-400", iconBg: "from-red-400 to-rose-500", icon: "fa-drumstick-bite" },
        Chicken: { bg: "from-amber-50 to-orange-50", border: "border-amber-200 hover:border-amber-400", iconBg: "from-amber-400 to-orange-500", icon: "fa-drumstick-bite" },
        Dessert: { bg: "from-pink-50 to-fuchsia-50", border: "border-pink-200 hover:border-pink-400", iconBg: "from-pink-400 to-fuchsia-500", icon: "fa-cake-candles" },
        Lamb: { bg: "from-rose-50 to-red-50", border: "border-rose-200 hover:border-rose-400", iconBg: "from-rose-400 to-red-500", icon: "fa-drumstick-bite" },
        Pasta: { bg: "from-yellow-50 to-amber-50", border: "border-yellow-200 hover:border-yellow-400", iconBg: "from-yellow-400 to-amber-500", icon: "fa-bowl-food" },
        Pork: { bg: "from-rose-50 to-pink-50", border: "border-rose-200 hover:border-rose-400", iconBg: "from-rose-400 to-pink-500", icon: "fa-bacon" },
        Seafood: { bg: "from-cyan-50 to-blue-50", border: "border-cyan-200 hover:border-cyan-400", iconBg: "from-cyan-400 to-blue-500", icon: "fa-fish" },
        Side: { bg: "from-lime-50 to-green-50", border: "border-lime-200 hover:border-lime-400", iconBg: "from-lime-400 to-green-500", icon: "fa-plate-wheat" },
        Vegan: { bg: "from-emerald-50 to-green-50", border: "border-emerald-200 hover:border-emerald-400", iconBg: "from-emerald-400 to-green-500", icon: "fa-leaf" },
        Vegetarian: { bg: "from-green-50 to-lime-50", border: "border-green-200 hover:border-green-400", iconBg: "from-green-400 to-lime-500", icon: "fa-seedling" },
        Breakfast: { bg: "from-orange-50 to-yellow-50", border: "border-orange-200 hover:border-orange-400", iconBg: "from-orange-400 to-yellow-500", icon: "fa-mug-hot" },
        Goat: { bg: "from-stone-50 to-neutral-50", border: "border-stone-200 hover:border-stone-400", iconBg: "from-stone-400 to-neutral-500", icon: "fa-drumstick-bite" },
    };

    let categoriesHTML = "";

    [...AllCat].slice(0, 12).forEach((cat) => {
        let style = categoryStyles[cat.name] || categoryStyles.Beef;
        categoriesHTML += `
            <div data-category="${cat.name}" class="category-card bg-gradient-to-br ${style.bg} rounded-xl p-4 border ${style.border} hover:shadow-lg cursor-pointer transition-all group">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gradient-to-br ${style.iconBg} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                        <i class="fas ${style.icon} text-white text-lg"></i>
                    </div>
                    <h3 class="text-base font-semibold text-gray-800">${cat.name}</h3>
                </div>
            </div>
        `;
    });

    const grid = getCategoriesGrid();
    if (grid) grid.innerHTML = categoriesHTML;

    document.querySelectorAll("#categories-grid .category-card").forEach((card) => {
        card.addEventListener("click", () => {
            categories(card.dataset.category);
        });
    });
}

export function DisplayAllMealsareas(areas) {
    const loading = getLoading();
    if (loading) loading.style.display = "flex";

    let areaCarton = `    <button
              class="px-4 py-2 bg-emerald-600 text-white rounded-full font-medium text-sm whitespace-nowrap hover:bg-emerald-700 transition-all"
            >
              All Cuisines
            </button>`;
    let countryDiv = getCountryDiv();

    areas.forEach((area) => {
        areaCarton += `
      <button
        class="px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm whitespace-nowrap hover:bg-gray-200 transition-all" data-area='${area.name}'
      >
        ${area.name}
      </button>
    `;
    });

    if (countryDiv) {
        countryDiv.innerHTML = areaCarton;

        countryDiv.onclick = (e) => {
            if (e.target.tagName !== "BUTTON") return;
            const areaName = e.target.dataset.area;

            areaName ? searchByArea(areaName) : getRandomMeals();

            document.querySelectorAll("#country button").forEach((btn) => {
                btn.classList.remove("bg-emerald-600", "text-white");
                btn.classList.add("bg-gray-100", "text-gray-700");
            });

            e.target.classList.add("bg-emerald-600", "text-white");
            e.target.classList.remove("bg-gray-100", "text-gray-700");
        };
    }
}

export function displayCategories(cards) {
    const recipesGrid = getRecipesGrid();
    const recipesCont = getRecipesCount();

    if (!cards || !cards.length) {
        if (recipesGrid) {
            recipesGrid.innerHTML = `<div class="flex flex-col items-center justify-center py-12 w-full">
            <div class="mb-4">
                <i class="fa-solid fa-circle-notch fa-spin text-4xl text-emerald-500"></i>
            </div>
            <div class="text-center">
                <p class="text-gray-500 font-medium animate-pulse">Loading recipes...</p>
            </div>
        </div>`;
        }
        return;
    }

    if (recipesGrid) recipesGrid.innerHTML = "";
    if (recipesCont && cards[0].category)
        recipesCont.innerHTML = ` Showing ${cards.length} ${cards[0].category} recipes`;

    let html = "";
    cards.forEach((card) => {
        html += `
        <div class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group" data-meal-id="${card.id}">
                <div class="relative h-48 overflow-hidden">
                  <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="${card.thumbnail}" alt="${card.name}" loading="lazy">
                  <div class="absolute bottom-3 left-3 flex gap-2">
                    <span class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700">
                    ${card.category}
                    </span>
                    <span class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white">
                                          ${card.area}

                    </span>
                  </div>
                </div>
                <div class="p-4">
                  <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
                      ${card.name}
                  </h3>
                  <p class="text-xs text-gray-600 mb-3 line-clamp-2">
                   ${card.instructions ? card.instructions[0] : 'Delicious recipe'}
                  </p>
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-semibold text-gray-900">
                      <i class="fa-solid fa-utensils mr-1 text-emerald-600"></i>
                    ${card.category}
                    </span>
                    <span class="font-semibold text-gray-500">
                      <i class="fa-solid fa-globe mr-1 text-blue-500"></i>
                          ${card.area}
                    </span>
                  </div>
                </div>
              </div>
        `;
    });

    if (recipesGrid) recipesGrid.innerHTML = html;

    MealPage();
}

function MealPage() {
    const grid = document.querySelectorAll("#recipes-grid .recipe-card");
    if (!grid.length) return;

    grid.forEach((card) => {
        card.addEventListener("click", async () => {
            card.style.position = 'relative';
            const overlay = document.createElement('div');
            overlay.className = 'absolute inset-0 bg-white/60 flex items-center justify-center z-10 rounded-xl';
            overlay.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-emerald-600 text-3xl"></i>';
            card.appendChild(overlay);

            const mealId = card.dataset.mealId;

            let meal;
            try {
                const data = await fetchAPI(`/meals/${mealId}`);
                meal = data.result;
            } catch (e) {
                console.error(e);
            }

            overlay.remove();
            if (!meal) return;

            handleMealSelection(meal);
        });
    });
}

function handleMealSelection(meal) {
    currentMeal = meal;

    var myHeaders = new Headers();
    myHeaders.append("x-api-key", "KNYZ4wclzUDmesP1UQwZfsjCcWaR6RMu6QQMoIeM");
    myHeaders.append("Content-Type", "application/json");

    const ingredientsStr = meal.ingredients.map(
        (item) => `${item.measure} ${item.ingredient}`,
    );

    var bodyData = {
        recipeName: meal.name,
        ingredients: [...ingredientsStr],
    };
    var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(bodyData),
    };

    let itemHTML = renderMealDetails(meal);

    injectMealDetails(itemHTML);

    fetch("https://nutriplan-api.vercel.app/api/nutrition/analyze", requestOptions)
        .then((res) => res.json())
        .then((data) => {
            if (data && data.data) {
                currentMeal.nutrition = data.data;
                const contentEl = document.getElementById("meal-details-content");
                if (contentEl) {
                    contentEl.outerHTML = renderMealDetails(meal, data.data);
                    attachDetailsListeners();
                }
                enableLogButton(true);
            }
        })
        .catch((err) => {
            console.error("Nutrition Error:", err);
            enableLogButton(false);
        });
}

function injectMealDetails(html) {
    let detailsSection = document.getElementById('meal-details-section');
    if (!detailsSection) {
        detailsSection = document.createElement('section');
        detailsSection.id = 'meal-details-section';

        const header = document.getElementById('header');
        if (header && header.nextSibling) {
            header.parentNode.insertBefore(detailsSection, header.nextSibling);
        } else {
            document.getElementById('main-content').appendChild(detailsSection);
        }
    }

    document.querySelectorAll('#main-content > section').forEach(sec => {
        if (sec.id !== 'meal-details-section') sec.classList.add('hidden');
    });

    detailsSection.classList.remove('hidden');
    detailsSection.innerHTML = html;

    attachDetailsListeners();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function attachDetailsListeners() {
    const backBtn = document.getElementById("back-to-meals-btn");
    if (backBtn) {
        backBtn.addEventListener("click", () => {
            const detailsSection = document.getElementById('meal-details-section');
            if (detailsSection) detailsSection.classList.add('hidden');

            document.querySelectorAll('#main-content > section').forEach(sec => {
                if (sec.id !== 'meal-details-section' && sec.dataset.target === 'meals & recipes') {
                    sec.classList.remove('hidden');
                }
            });
        });
    }

    const logBtn = document.getElementById("log-meal-btn");
    if (logBtn) {
        logBtn.addEventListener("click", () => {
            if (currentMeal) openLogMealModal(currentMeal);
        });
    }
}

function enableLogButton(hasNutrition) {
    const logBtn = document.getElementById("log-meal-btn");
    if (logBtn) {
        logBtn.disabled = false;
        logBtn.querySelector("#log-btn-text").innerText = hasNutrition ? "Log This Meal" : "Log This Meal (No Nutrition)";
        logBtn.querySelector("#log-btn-spinner")?.classList.add("hidden");
        logBtn.querySelector("#log-btn-icon")?.classList.remove("hidden");
    }
}

export function openLogMealModal(meal) {
    if (!meal) return;
    const modalHTML = `
    <div id="log-meal-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm opacity-0 transition-opacity duration-300">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform scale-95 transition-transform duration-300" id="log-meal-content">
            <div class="p-6 border-b border-gray-100 flex items-center gap-4">
                <img src="${meal.thumbnail}" alt="${meal.name}" class="w-16 h-16 rounded-xl object-cover shadow-sm">
                <div>
                    <h3 class="text-xl font-bold text-gray-900 leading-tight">Log This Meal</h3>
                    <p class="text-gray-500 text-sm">${meal.name}</p>
                </div>
            </div>

            <div class="p-6 space-y-6">
                <div id="servings-control">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Number of Servings</label>
                    <div class="flex items-center gap-3">
                        <button id="decrease-servings" class="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold flex items-center justify-center transition-colors">
                            <i class="fa-solid fa-minus"></i>
                        </button>
                        <input type="number" id="servings-input" value="1" min="1" class="w-16 text-center font-bold text-lg border-gray-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500">
                        <button id="increase-servings" class="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold flex items-center justify-center transition-colors">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                </div>

                <div class="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100">
                    <p class="text-xs text-gray-500 mb-3 font-medium">Estimated nutrition per serving:</p>
                    <div class="grid grid-cols-4 gap-2 text-center">
                        <div>
                            <p class="text-lg font-bold text-emerald-600">${meal.nutrition?.perServing?.calories || 0}</p>
                            <p class="text-[10px] text-gray-500 font-medium">Calories</p>
                        </div>
                        <div>
                            <p class="text-lg font-bold text-blue-600">${meal.nutrition?.perServing?.protein || 0}g</p>
                            <p class="text-[10px] text-gray-500 font-medium">Protein</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="p-6 pt-2 flex gap-3">
                <button id="cancel-log-btn" class="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
                <button id="confirm-log-btn" class="flex-1 py-3 px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                    <i class="fa-solid fa-clipboard-check"></i> Log Meal
                </button>
            </div>
        </div>
    </div>
  `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);
    const modal = document.getElementById("log-meal-modal");

    requestAnimationFrame(() => {
        modal.classList.remove("opacity-0");
        const content = modal.querySelector("#log-meal-content");
        content.classList.remove("scale-95");
    });

    const input = modal.querySelector("#servings-input");
    modal.querySelector("#increase-servings").onclick = () => input.value = Number(input.value) + 1;
    modal.querySelector("#decrease-servings").onclick = () => input.value = Math.max(1, Number(input.value) - 1);
    modal.querySelector("#cancel-log-btn").onclick = closeModal;

    modal.querySelector("#confirm-log-btn").onclick = () => {

        let finalNutrition = meal.nutrition?.totals || meal.nutrition || {};

        let finalStoreObj = {
            type: "meal",
            name: meal.name,
            mealId: meal.id,
            category: meal.category,
            image: meal.thumbnail,
            thumbnail: meal.thumbnail,
            nutrition: finalNutrition,
            date: getTodayDateKey(),
            servings: input.value
        };

        logMealOrProduct(finalStoreObj);
        closeModal();
    };
}

function closeModal() {
    document.getElementById("log-meal-modal")?.remove();
}
