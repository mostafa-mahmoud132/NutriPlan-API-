
import {
  fetchAPI
} from './modules/api.js';

import {
  getTodayDateKey,
  showToast
} from './modules/utils.js';

import {
  toggleSidebar,
  ListViwe,
  gridViwe
} from './modules/ui.js';

import {
  renderFoodLog,
  renderWeeklyStats,
  renderQuickActions
} from './modules/foodlog.js';

import {
  SearchName,
  loadProduct,
  getAllProductCategories,
  getByQrCode,
  filterByNutriScore
} from './modules/products.js';

import {
  SearchByName,
  getRandomMeals,
  getRandomMealsareas,
  categories,
  searchByArea,
  nameCatg
} from './modules/meals.js';

// --- global selections ---
let searchyVal = document.querySelector("#search-input");
let tooggleList = document.getElementById("list-view-btn");
let tooggleGrid = document.querySelector("#grid-view-btn");
let tooggle = document.querySelectorAll("#view-toggle button");

let btnSaidBar = document.getElementById("header-menu-btn");
let SaidBar = document.getElementById("sidebar");
let closeSaidBar = document.getElementById("sidebar-close-btn");
let isSidebarOpen = false;

let NavLinks = document.querySelectorAll(".nav-link");
let inputScanner = document.getElementById("product-search-input");
let btnsearch = document.getElementById("search-product-btn");
let lookupBtn = document.getElementById("lookup-barcode-btn");
let barcode = document.getElementById("barcode-inpu-t"); 
let probtn = document.querySelectorAll("button[data-grade]"); 


// View Toggles
if (tooggleGrid) tooggleGrid.addEventListener("click", gridViwe);
if (tooggleList) tooggleList.addEventListener("click", ListViwe);

if (tooggle) {
  tooggle.forEach((tooggleIcon) => {
    tooggleIcon.addEventListener("click", () => {
      tooggle.forEach((btn) => {
        btn.classList.remove("bg-white", "shadow-sm");
      });
      tooggleIcon.classList.add("bg-white", "shadow-sm");
    });
  });
}

// Sidebar
if (btnSaidBar) {
  btnSaidBar.addEventListener("click", function (e) {
    e.stopPropagation();
    toggleSidebar(true);
    isSidebarOpen = true;
  });
}
if (closeSaidBar) {
  closeSaidBar.addEventListener("click", function (e) {
    e.stopPropagation();
    toggleSidebar(false);
    isSidebarOpen = false;
  });
}
document.body.addEventListener("click", function () {
  if (isSidebarOpen) {
    toggleSidebar(false);
    isSidebarOpen = false;
  }
});
if (SaidBar) {
  SaidBar.addEventListener("click", (e) => {
    e.stopPropagation();
  });
}

// Navigation
NavLinks.forEach((link) => {
  const target = link.dataset.target;
  link.setAttribute("data-target", link.textContent.trim().toLowerCase());

  link.addEventListener("click", () => {
    NavLinks.forEach(l => {
      l.classList.remove("bg-emerald-50", "text-emerald-700", "font-semibold");
      l.classList.add("text-gray-600", "font-medium", "hover:bg-gray-50");
    });
    link.classList.remove("text-gray-600", "font-medium", "hover:bg-gray-50");
    link.classList.add("bg-emerald-50", "text-emerald-700", "font-semibold");

    const allSections = document.querySelectorAll("#main-content section");
    const targetId = link.dataset.target;

    allSections.forEach((sec) => {
      if (sec.id === 'meal-details-section') {
        sec.classList.add('hidden');
        return;
      }
      if (sec.dataset.target) {
        sec.classList.toggle("hidden", sec.dataset.target !== targetId);
      }
    });

    const headerTitle = document.querySelector('#header h1');
    const headerDesc = document.querySelector('#header p');

    const detailsSection = document.getElementById('meal-details-section');
    const isDetailsActive = detailsSection && !detailsSection.classList.contains('hidden');

    if (!isDetailsActive) {
      if (headerTitle) headerTitle.innerHTML = link.querySelector('span')?.innerText || "NutriPlan";
      if (headerDesc) headerDesc.textContent = "Manage your wellness journey";

      if (targetId === "meals & recipes") {
        if (headerTitle) headerTitle.textContent = "Meals & Recipes";
        if (headerDesc) headerDesc.textContent = "Discover delicious and nutritious recipes tailored for you";
      } else if (targetId === "food log") {
        if (headerTitle) headerTitle.textContent = "Food Log";
        if (headerDesc) headerDesc.textContent = "Track and monitor your daily nutrition intake";
      } else if (targetId === "product scanner") {
        if (headerTitle) headerTitle.textContent = "Product Scanner";
        if (headerDesc) headerDesc.textContent = "Scan and analyze products for healthier choices";
      }
    }
  });
});

// Search Logic (Meals)
if (searchyVal) {
  searchyVal.addEventListener("input", function () {
    SearchByName(searchyVal.value.toLowerCase());
  });
}

// Search Logic (Products)
if (btnsearch && inputScanner) {
  btnsearch.addEventListener("click", () => {
    let inputValue = inputScanner.value.trim();
    SearchName(inputValue);
  });
}

// Barcode Lookup
if (lookupBtn && barcode) {
  lookupBtn.addEventListener("click", () => {
    getByQrCode(barcode.value);
  });
}

loadProduct(true);
nameCatg();
filterByNutriScore();

(async () => {
  getRandomMeals();
  getRandomMealsareas();

  getAllProductCategories();

  renderFoodLog();
  renderWeeklyStats();
  renderQuickActions();
})();
