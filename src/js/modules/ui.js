
// UI Handling Functions

export function toggleSidebar(open) {
  const sidebar = document.getElementById("sidebar");
  let isSidebarOpen = open; 
  if (sidebar) {
    sidebar.style.transform = open
      ? "translate(0px, 10px)"
      : "translate(-100%, 0px)";
  }
}

export function ListViwe() {
  let recipesGrid = document.querySelector("#recipes-grid");
  if (!recipesGrid) return;
  let recipeCards = document.querySelectorAll(".recipe-card");
  recipesGrid.classList.remove("grid-cols-4", "gap-5");
  recipesGrid.classList.add("grid-cols-2", "gap-4");
  recipeCards.forEach((card) => {
    card.style.cssText = `
    display: flex ;
    flex-direction: row ;
    height: 10rem ;
    width: 100% ;
    display: flex;
  
    `;
    const img = card.querySelector("img");
    const span = card.querySelectorAll(".absolute.flex.gap-2 span");
    const content = card.querySelector(".p-4");

    if (span)
      span.forEach((span) => {
        span.style.cssText = "display: none ";
      });
    if (img)
      img.style.cssText = `
    height: 100% ;
    object-fit: cover ;
    `;
    if (content) {
      content.classList.add("flex-1");
    }
  });

  recipesGrid.classList.add("list-view");
  recipesGrid.classList.remove("grid-view");
}

export function gridViwe() {
  let recipesGrid = document.querySelector("#recipes-grid");
  if (!recipesGrid) return;
  let recipeCards = document.querySelectorAll(".recipe-card");
  recipesGrid.classList.remove("grid-cols-2", "gap-4");
  recipesGrid.classList.add("grid-cols-4", "gap-5");
  recipeCards.forEach((card) => {
    card.style.cssText = `
    display: flex ;
   flex-direction: column;
    width: 100% ;
    display: flex;
  
    `;
    const img = document.querySelector(".recipe-card img"); 

    const imgInCard = card.querySelector("img");

    const spans = card.querySelectorAll(".absolute.flex.gap-2 span");

    spans.forEach((span) => {
      span.style.cssText = "display: block ";
    });

    if (imgInCard) {
      imgInCard.style.cssText = `
        height: 100% ;
        width:100%;
        object-fit: cover ;
        `;
    }
  });

  recipesGrid.classList.add("grid-view");
  recipesGrid.classList.remove("list-view");
}

export function updateNutritionBar(idPrefix, current, max, unit) {
  const textEl = document.getElementById(`${idPrefix}-text`);
  const barEl = document.getElementById(`${idPrefix}-bar`);

  if (textEl && barEl) {
    textEl.textContent = `${current} / ${max} ${unit}`;
    const pct = Math.min((current / max) * 100, 100);
    barEl.style.width = `${pct}%`;

    if (pct >= 100) {
      barEl.classList.remove('bg-emerald-500', 'bg-blue-500', 'bg-amber-500', 'bg-purple-500');
      barEl.classList.add('bg-red-500');
    }
  }
}

export function showSuccessModal(item) {
  const existing = document.getElementById("success-modal");
  if (existing) existing.remove();

  const modalHTML = `
    <div id="success-modal"  class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm opacity-0 transition-opacity duration-300">
        <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-4/5 mx-4 text-center transform scale-95 transition-transform duration-300">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <!-- Image Check: Prefer item.image, fallback to thumbnail or placeholder -->
                <img src="${item.image || item.thumbnail || 'https://via.placeholder.com/150'}" class="w-full h-full object-cover rounded-full opacity-80" style="display: ${item.image || item.thumbnail ? 'block' : 'none'};">
                <i class="fa-solid fa-check text-4xl text-green-500 absolute" style="display: ${item.image || item.thumbnail ? 'none' : 'block'};"></i>
            </div>
            
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Meal Logged!</h3>
            <p class="text-gray-600 mb-6">
                <span class="font-semibold text-gray-900">${item.name}</span> 
                (${item.serving || "1 serving"}) has been added to your daily log.
            </p>
            
            <div class="inline-block bg-green-50 px-4 py-2 rounded-lg mb-6">
                <span class="text-green-600 font-bold text-lg">+${(item.nutrition && item.nutrition.calories) || 0} calories</span>
            </div>
        </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  const modal = document.getElementById("success-modal");
  if (!modal) return; 
  const content = modal.querySelector("div");

  requestAnimationFrame(() => {
    modal.classList.remove("opacity-0");
    content.classList.remove("scale-95");
    content.classList.add("scale-100");
  });

  setTimeout(() => {
    modal.classList.add("opacity-0");
    content.classList.remove("scale-100");
    content.classList.add("scale-95");
    setTimeout(() => modal.remove(), 300);
  }, 1000);
}

export function renderMealDetails(meal, nutrition = { perServing: {}, totals: {} }) {
  const perServing = nutrition.perServing || {};
  const totals = nutrition.totals || {};

  return `
    <div id="meal-details-content" class="max-w-7xl mx-auto">
          <!-- Back Button -->
          <button
            id="back-to-meals-btn"
            class="flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-medium mb-6 transition-colors"
          >
            <i class="fa-solid fa-arrow-left"></i>
            <br>
            <span style=" margin-top: 0.5rem;">Back to Recipes</span>
            <br>
          </button>

          <!-- Hero Section -->
          <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div class="relative h-80 md:h-96">
              <img
                src="${meal.thumbnail}"
                alt="${meal.name}"
                class="w-full h-full object-cover"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
              ></div>
              <div class="absolute bottom-0 left-0 right-0 p-8">
                <div class="flex items-center gap-3 mb-3">
                  <span
                    class="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full"
                    >${meal.category}</span
                  >
                  <span
                    class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full"
                    >${meal.area}</span
                  >
                  <span
                    class="px-3 py-1 bg-purple-500 text-white text-sm font-semibold rounded-full"
                    >${meal.tags ? meal.tags[0] : ''}</span
                  >
                </div>
                <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">
                  ${meal.name}
                </h1>
                <div class="flex items-center gap-6 text-white/90">
                  <span class="flex items-center gap-2">
                    <i class="fa-solid fa-clock"></i>
                    <span>30 min</span>
                  </span>
                  <span class="flex items-center gap-2">
                    <i class="fa-solid fa-utensils"></i>
                    <span id="hero-servings">4 servings</span>
                  </span>
                  <span class="flex items-center gap-2">
                    <i class="fa-solid fa-fire"></i>
                    <span id="hero-calories">Calc...</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-3 mb-8">
            <button
              id="log-meal-btn"
              class="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              data-meal-id="${meal.id}"
              disabled
            >
              <i class="fa-solid fa-spinner fa-spin hidden" id="log-btn-spinner"></i>
              <i class="fa-solid fa-clipboard-list" id="log-btn-icon"></i>
              <span id="log-btn-text">Calculating Nutrition...</span>
            </button>
          </div>

          <!-- Main Content Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left Column - Ingredients & Instructions -->
            <div class="lg:col-span-2 space-y-8">
              <!-- Ingredients -->
              <div class="bg-white rounded-2xl shadow-lg p-6">
                <h2
                  class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
                >
                  <i class="fa-solid fa-list-check text-emerald-600"></i>
                  Ingredients
                  <span class="text-sm font-normal text-gray-500 ml-auto"
                    >${meal.ingredients.length} items</span
                  >
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      
                 ${meal.ingredients
      .map(
        (ingredient) => `  <div
                    class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300"
                    />
                    <span class="text-gray-700">
                      <span class="font-medium text-gray-900">${ingredient.measure}</span> ${ingredient.ingredient}
                    </span>
                  </div>
                  `,
      )
      .join("")}
                </div>
              </div>


              <!-- Instructions -->
              <div class="bg-white rounded-2xl shadow-lg p-6">
                <h2
                  class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
                >
                  <i class="fa-solid fa-shoe-prints text-emerald-600"></i>
                  Instructions
                </h2>
                <div class="space-y-4">
                  ${meal.instructions
      .map(
        (step, index) => ` <div
                    class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div
                      class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0"
                    >
                     ${1 + index}
                    </div>
                    <p class="text-gray-700 leading-relaxed pt-2">
                      ${step}
                    </p>
                  </div>
                  `,
      )
      .join("")}
                </div>
              </div>

              <!-- Video Section -->
              <div class="bg-white rounded-2xl shadow-lg p-6">
                <h2
                  class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
                >
                  <i class="fa-solid fa-video text-red-500"></i>
                  Video Tutorial
                </h2>
                <div
                  class="relative aspect-video rounded-xl overflow-hidden bg-gray-100"
                >
                  <iframe
                    src="${meal.youtube ? meal.youtube.replace("youtube.com/watch?v=", "youtube.com/embed/") : ''}"
                    class="absolute inset-0 w-full h-full"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  >
                  </iframe>
                </div>
              </div>
            </div>

            <!-- Right Column - Nutrition -->
          
            <div class="space-y-6">
              <!-- Nutrition Facts -->
              <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2
                  class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
                >
                  <i class="fa-solid fa-chart-pie text-emerald-600"></i>
                  Nutrition Facts
                </h2>
                <div id="nutrition-facts-container">
                  ${!perServing.calories || perServing.calories === "Calc..." ? `
                    <div class="flex flex-col items-center justify-center py-12 text-center">
                      <div class="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 relative">
                        <i class="fa-solid fa-calculator text-2xl text-emerald-500 animate-pulse"></i>
                         <!-- Spinner overlay or just pulse -->
                         <div class="absolute inset-0 rounded-2xl border-2 border-emerald-100 animate-ping opacity-20"></div>
                      </div>
                      <h3 class="text-lg font-bold text-gray-900 mb-1">Calculating Nutrition</h3>
                      <p class="text-gray-500 text-sm mb-2">Analyzing ingredients...</p>
                      <div class="flex gap-1 justify-center">
                        <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style="animation-delay: 0s"></div>
                        <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                        <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                      </div>
                    </div>
                  ` : `
                  <p class="text-sm text-gray-500 mb-4">Per serving</p>

                  <div
                    class="text-center py-4 mb-4 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl"
                  >
                    <p class="text-sm text-gray-600">Calories per serving</p>
                    <p id="nutrition-calories-big" class="text-4xl font-bold text-emerald-600">${perServing.calories}</p>
                    <p id="nutrition-calories-total" class="text-xs text-gray-500 mt-1">Total:${totals.calories}</p>
                  </div>

                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span class="text-gray-700">Protein</span>
                      </div>
                      <span id="nutrition-protein" class="font-bold text-gray-900">${perServing.protein}</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-emerald-500 h-2 rounded-full"
                        style="width: ${perServing.protein === 'Calc...' ? 0 : perServing.protein}%"
                      ></div>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span class="text-gray-700">Carbs</span>
                      </div>
                      <span id="nutrition-carbs" class="font-bold text-gray-900">${perServing.carbs}</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-blue-500 h-2 rounded-full"
                        style="width: ${perServing.carbs === 'Calc...' ? 0 : perServing.carbs}%"
                      ></div>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span class="text-gray-700">Fat</span>
                      </div>
                      <span id="nutrition-fat" class="font-bold text-gray-900">${perServing.fat}</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-purple-500 h-2 rounded-full"
                        style="width: ${perServing.fat === 'Calc...' ? 0 : perServing.fat}%"
                      ></div>
                    </div>
                    
                     <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span class="text-gray-700">Fiber</span>
                      </div>
                      <span id="nutrition-fiber" class="font-bold text-gray-900">${perServing.fiber}</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-orange-500 h-2 rounded-full"
                        style="width: ${perServing.fiber === 'Calc...' ? 0 : perServing.fiber}%"
                      ></div>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-pink-500"></div>
                        <span class="text-gray-700">Sugar</span>
                      </div>
                      <span id="nutrition-sugar" class="font-bold text-gray-900">${perServing.sugar}</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-pink-500 h-2 rounded-full"
                        style="width: ${perServing.sugar === 'Calc...' ? 0 : perServing.sugar}%"
                      ></div>
                    </div>
                  </div>

                  <div class="mt-6 pt-6 border-t border-gray-100">
                    <h3 class="text-sm font-semibold text-gray-900 mb-3">
                      Vitamins & Minerals (% Daily Value)
                    </h3>
                    <div class="grid grid-cols-2 gap-3 text-sm">
                      <div class="flex justify-between">
                        <span class="text-gray-600">Vitamin A</span>
                        <span class="font-medium">15%</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Vitamin C</span>
                        <span class="font-medium">25%</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Calcium</span>
                        <span class="font-medium">4%</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Iron</span>
                        <span class="font-medium">12%</span>
                      </div>
                    </div>
                  </div>
                  `}
                </div>
              </div>
            </div>
          </div>
        </div>
        
  `;
}
