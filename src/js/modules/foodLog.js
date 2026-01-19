import { getTodayDateKey, showToast, showClearLogConfirmation, navigateToSection } from './utils.js';
import { updateNutritionBar, showSuccessModal } from './ui.js';

let allLogs = JSON.parse(localStorage.getItem("foodLog") || "{}");

export function renderFoodLog() {
  const dateKey = getTodayDateKey();
  allLogs = JSON.parse(localStorage.getItem("foodLog") || "{}");
  let todayLog = allLogs[dateKey] || [];

  const foodLogList = document.getElementById("logged-items-list");
  const clearAllBtn = document.getElementById("clear-foodlog");

  if (!foodLogList) return;

  let totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  const goals = { calories: 2000, protein: 150, carbs: 250, fat: 70 };

  todayLog.forEach((item) => {
    let nutrition = item.nutrition || {};
    if (nutrition.totals) nutrition = nutrition.totals;

    totals.calories += parseFloat(nutrition.calories || 0);
    totals.protein += parseFloat(nutrition.protein || 0);
    totals.carbs += parseFloat(nutrition.carbs || 0);
    totals.fat += parseFloat(nutrition.fat || 0);
  });

  totals.calories = Math.round(totals.calories);
  totals.protein = Math.round(totals.protein);
  totals.carbs = Math.round(totals.carbs);
  totals.fat = Math.round(totals.fat);

  updateNutritionBar("cal", totals.calories, goals.calories, "kcal");
  updateNutritionBar("pro", totals.protein, goals.protein, "g");
  updateNutritionBar("carb", totals.carbs, goals.carbs, "g");
  updateNutritionBar("fat", totals.fat, goals.fat, "g");

  if (todayLog.length === 0) {
    if (clearAllBtn) clearAllBtn.style.display = "none";
    foodLogList.innerHTML = `
        <div class="text-center py-12">
            <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fa-solid fa-utensils text-3xl text-gray-300"></i>
            </div>
            <h3 class="text-gray-500 font-medium text-lg mb-1">No food logged today</h3>
            <p class="text-gray-400 text-sm mb-6">Start tracking your nutrition by logging meals or scanning products</p>
            
            <div class="flex items-center justify-center gap-3">
                <button class="browse-recipes-btn px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2">
                    <i class="fa-solid fa-plus"></i>
                    Browse Recipes
                </button>
                <button class="scan-product-btn px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2">
                    <i class="fa-solid fa-barcode"></i>
                    Scan Product
                </button>
            </div>
        </div>`;

    foodLogList.querySelector('.browse-recipes-btn').addEventListener('click', () => navigateToSection('meals & recipes'));
    foodLogList.querySelector('.scan-product-btn').addEventListener('click', () => navigateToSection('product scanner'));

    return;
  }

  if (clearAllBtn) {
    clearAllBtn.style.display = "block";
    clearAllBtn.onclick = () => {
      showClearLogConfirmation(() => {
        allLogs[dateKey] = [];
        localStorage.setItem("foodLog", JSON.stringify(allLogs));
        renderFoodLog();
        renderWeeklyStats();
        showToast("Today's log cleared");
      });
    };
  }

  foodLogList.innerHTML = todayLog
    .map((item, index) => renderLogItem(item, index))
    .join("");

  document.querySelectorAll(".delete-log-item").forEach((btn) => {
    btn.addEventListener("click", function () {
      const index = this.dataset.index;
      deleteLogItem(index);
    });
  });
}

function renderLogItem(item, index) {
  let nutrition = item.nutrition || {};
  if (nutrition.totals) nutrition = nutrition.totals;

  const image = item.image || item.thumbnail || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop";
  const calories = Math.round(parseFloat(nutrition.calories || 0));
  const protein = Math.round(parseFloat(nutrition.protein || 0));
  const carbs = Math.round(parseFloat(nutrition.carbs || 0));
  const fat = Math.round(parseFloat(nutrition.fat || 0));

  return `
    <div class="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
      <div class="w-16 h-16 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
          <img src="${image}" alt="${item.name}" class="w-full h-full object-cover">
      </div>
      
      <div class="flex-1 min-w-0">
          <div class="flex justify-between items-start mb-1">
              <div>
                  <h4 class="font-bold text-gray-900 truncate">${item.name}</h4>
                  <p class="text-xs text-gray-500">${item.brand || item.category || 'Generic'}</p>
              </div>
              <span class="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                 ${new Date(item.loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
          </div>
          
          <div class="flex items-center gap-3 text-xs text-gray-500">
              <span class="font-bold text-emerald-600">${calories} kcal</span>
              <span class="w-1 h-1 rounded-full bg-gray-300"></span>
              <span>P: ${protein}g</span>
              <span>C: ${carbs}g</span>
              <span>F: ${fat}g</span>
          </div>
      </div>

      <button 
          class="delete-log-item w-8 h-8 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
          title="Remove Item"
          data-index="${index}"
      >
          <i class="fa-solid fa-trash-can"></i>
      </button>
    </div>
  `;
}

export function deleteLogItem(index) {
  const dateKey = getTodayDateKey();
  if (allLogs[dateKey]) {
    allLogs[dateKey].splice(index, 1);
    localStorage.setItem("foodLog", JSON.stringify(allLogs));
    renderFoodLog();
    renderWeeklyStats();
    showToast("Item removed");
  }
}

export function logMealOrProduct(item) {
  const dateKey = getTodayDateKey();
  allLogs = JSON.parse(localStorage.getItem("foodLog") || "{}");

  if (!allLogs[dateKey]) allLogs[dateKey] = [];

  allLogs[dateKey].push({
    ...item,
    loggedAt: new Date().toISOString(),
  });

  localStorage.setItem("foodLog", JSON.stringify(allLogs));

  renderFoodLog();
  renderWeeklyStats();
  showSuccessModal(item);
}


export function renderWeeklyStats() {
  const container = document.getElementById("weekly-overview-container");
  if (!container) return;

  const today = new Date();
  const daysData = [];
  const logs = JSON.parse(localStorage.getItem("foodLog") || "{}");

  let totalWeeklyCalories = 0;
  let totalWeeklyItems = 0;
  let daysOnGoal = 0;

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - (offset * 60 * 1000));
    const key = localDate.toISOString().split('T')[0];

    const dayLogs = logs[key] || [];

    let dayCals = 0;
    dayLogs.forEach(item => {
      let cal = 0;
      if (item.nutrition) {
        if (item.nutrition.totals) cal = item.nutrition.totals.calories;
        else cal = item.nutrition.calories;
      }
      dayCals += parseFloat(cal || 0);
    });

    dayCals = Math.round(dayCals);

    totalWeeklyCalories += dayCals;
    totalWeeklyItems += dayLogs.length;
    if (dayCals > 0 && dayCals <= 2500) daysOnGoal++;

    daysData.push({
      dateObj: d,
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: d.getDate(),
      calories: dayCals,
      itemsCount: dayLogs.length,
      isToday: i === 0
    });
  }

  const weeklyAverage = Math.round(totalWeeklyCalories / 7);

  const calendarHTML = daysData.map(day => {
    const isActive = day.isToday;
    const hasData = day.calories > 0;

    return `
            <div class="flex flex-col items-center justify-center p-4 rounded-2xl transition-all ${isActive ? 'bg-blue-50 border-blue-100' : 'hover:bg-gray-50'}">
                <span class="text-xs font-semibold text-gray-500 mb-1">${day.dayName}</span>
                <span class="text-lg font-bold text-gray-900 mb-2">${day.dayNum}</span>
                
                <div class="text-center">
                    <span class="block text-sm font-bold ${hasData ? 'text-emerald-600' : 'text-gray-300'}">
                        ${day.calories}
                    </span>
                    <span class="text-[10px] text-gray-400">kcal</span>
                </div>
                
                ${hasData ? `
                <div class="mt-2 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    ${day.itemsCount} items
                </div>
                ` : `
                 <div class="mt-2 text-[10px] text-transparent select-none">.</div>
                `}
            </div>
        `;
  }).join('');

  container.innerHTML = `
        <div class="bg-white rounded-2xl p-6 mb-6 border-2 border-gray-200">
          <h3 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <i class="fa-solid fa-calendar-week text-indigo-500"></i>
            Weekly Overview
          </h3>

          <div class="grid grid-cols-7 gap-2 text-center">
            ${calendarHTML}
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white rounded-2xl p-6 border-2 border-gray-100 flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 text-xl">
                    <i class="fa-solid fa-chart-line"></i>
                </div>
                <div>
                    <p class="text-sm text-gray-500 font-medium">Weekly Average</p>
                    <p class="text-xl font-bold text-gray-900">${weeklyAverage} kcal</p>
                </div>
            </div>

            <div class="bg-white rounded-2xl p-6 border-2 border-gray-100 flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 text-xl">
                    <i class="fa-solid fa-utensils"></i>
                </div>
                <div>
                    <p class="text-sm text-gray-500 font-medium">Total Items This Week</p>
                    <p class="text-xl font-bold text-gray-900">${totalWeeklyItems} items</p>
                </div>
            </div>

            <div class="bg-white rounded-2xl p-6 border-2 border-gray-100 flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 text-xl">
                    <i class="fa-solid fa-bullseye"></i>
                </div>
                <div>
                    <p class="text-sm text-gray-500 font-medium">Days On Goal</p>
                    <p class="text-xl font-bold text-gray-900">${daysOnGoal} / 7</p>
                </div>
            </div>
        </div>
    `;
}

export function renderQuickActions() {
  const container = document.getElementById("quick-actions-container");
  if (!container) return;

  container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            class="action-btn-log-meal bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-emerald-500 transition-all text-left flex items-center gap-4 group">
            <div class="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-plus text-emerald-600 text-xl"></i>
            </div>
            <div>
              <p class="font-semibold text-gray-900">Log a Meal</p>
              <p class="text-sm text-gray-500">Add from recipes</p>
            </div>
          </button>

          <button
            class="action-btn-scan bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-teal-500 transition-all text-left flex items-center gap-4 group">
            <div class="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-barcode text-teal-600 text-xl"></i>
            </div>
            <div>
              <p class="font-semibold text-gray-900">Scan Product</p>
              <p class="text-sm text-gray-500">Use barcode scanner</p>
            </div>
          </button>

          <button
            class="action-btn-custom bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-purple-500 transition-all text-left flex items-center gap-4 group">
            <div class="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-pencil text-purple-600 text-xl"></i>
            </div>
            <div>
              <p class="font-semibold text-gray-900">Custom Entry</p>
              <p class="text-sm text-gray-500">Add custom food</p>
            </div>
          </button>
        </div>
    `;

  setTimeout(() => {
    const logBtn = container.querySelector(".action-btn-log-meal");
    const scanBtn = container.querySelector(".action-btn-scan");

    if (logBtn) logBtn.addEventListener("click", () => navigateToSection('meals & recipes'));
    if (scanBtn) scanBtn.addEventListener("click", () => navigateToSection('product scanner'));
  }, 0);
}
