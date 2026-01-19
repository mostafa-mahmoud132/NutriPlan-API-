
import { fetchAPI } from './api.js';
import { getTodayDateKey } from './utils.js';
import { logMealOrProduct } from './foodLog.js';

function getLoading() { return document.querySelector("#app-loading-overlay"); }
function getProductGrid() { return document.getElementById("products-grid"); }
function getCatContainer() { return document.getElementById("product-categories"); }

let allProductsData = [];

export function loadProduct(isEmpty) {
    const ProadactGrid = getProductGrid();
    if (isEmpty && ProadactGrid) {
        ProadactGrid.innerHTML = `
 <div class="flex flex-col items-center justify-center py-12 w-full">
   <div class="mb-4 text-gray-300">
     <i class="fa-solid fa-box-open text-6xl"></i>
   </div>
   
   <div class="text-center">
     <h3 class="text-lg font-semibold text-gray-600">No products found</h3>
     <p class="text-gray-400 text-sm">Try searching for something else or reset filters.</p>
   </div>
 </div>
 `;
    }
}

export function SearchName(SearchNAme) {
    const loading = getLoading();
    if (loading) loading.style.display = "flex";

    fetchAPI(`/products/search?q=${SearchNAme}&page=1&limit=24`)
        .then((result) => {
            allProductsData = result.results;
            displayProduct(allProductsData);
            if (loading) loading.style.display = "none";
        })
        .catch(() => {
            if (loading) loading.style.display = "none";
        });
}

export function displayProduct(res) {
    if (!res) return;
    const ProadactGrid = getProductGrid();
    if (!ProadactGrid) return;

    let cartona = "";
    res.forEach((pro) => {
        cartona += ` <div
                class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                data-barcode="${pro.barcode}"
              >
                <div
                  class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden"
                >
                  <img
                    class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    src="${pro.image}"
                    alt="${pro.name}"
                    loading="lazy"
                  />

                  <div
                    class="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded uppercase"
                  >
                    Nutri-Score ${pro.nutritionGrade || "z"}
                  </div>

                  <div
                    class="absolute top-2 right-2 bg-lime-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
                    title="NOVA ${pro.novaGroup || 0}"
                  >
                    ${pro.novaGroup || 0}
                  </div>
                </div>

                <div class="p-4">
                  <p
                    class="text-xs text-emerald-600 font-semibold mb-1 truncate"
                  >
                    ${pro.brand}
                  </p>
                  <h3
                    class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors"
                  >
                   ${pro.name}
                  </h3>

                  <div
                    class="flex items-center gap-3 text-xs text-gray-500 mb-3"
                  >
                    <span
                      ><i class="fa-solid fa-weight-scale mr-1"></i>${pro.serving || '100g'}</span
                    >
                    <span
                      ><i class="fa-solid fa-fire mr-1"></i>${pro.nutrients.calories} kcal</span
                    >
                  </div>

                  <div class="grid grid-cols-4 gap-1 text-center">
                    <div class="bg-emerald-50 rounded p-1.5">
                      <p class="text-xs font-bold text-emerald-700">${pro.nutrients.protein}g</p>
                      <p class="text-[10px] text-gray-500">Pro</p>
                    </div>
                    <div class="bg-blue-50 rounded p-1.5">
                      <p class="text-xs font-bold text-blue-700">${pro.nutrients.carbs}g</p>
                      <p class="text-[10px] text-gray-500">Carb</p>
                    </div>
                    <div class="bg-purple-50 rounded p-1.5">
                      <p class="text-xs font-bold text-purple-700">${pro.nutrients.fat}g</p>
                      <p class="text-[10px] text-gray-500">Fat</p>
                    </div>
                    <div class="bg-orange-50 rounded p-1.5">
                      <p class="text-xs font-bold text-orange-700">${pro.nutrients.sugar}g</p>
                      <p class="text-[10px] text-gray-500">Sug</p>
                    </div>
                  </div>
                </div>
              </div>`;
    });

    ProadactGrid.innerHTML = cartona;

    document.querySelectorAll(".product-card").forEach((card) => {
        card.addEventListener("click", () => {
            const barcode = card.dataset.barcode;
            const product = allProductsData.find((p) => p.barcode === barcode);
            if (product) {
                openProductModal(product);
            }
        });
    });
}

export function filterByNutriScore() {
    let probtn = document.querySelectorAll("button[data-grade]");

    probtn.forEach((btn) => {
        btn.addEventListener("click", () => {
            let grade = btn.getAttribute("data-grade");
            let result = [];

            if (grade === "") {
                result = [...allProductsData];
            } else {
                result = allProductsData.filter(
                    (p) => p.nutritionGrade.toUpperCase() === grade.toUpperCase(),
                );
            }

            result.length > 0 ? displayProduct(result) : loadProduct(true);
        });
    });
}

export function getAllProductCategories() {
    fetchAPI("/products/categories").then((result) => {
        let allCatogrey = result.results;

        allCatogrey.sort((a, b) => {
            const aWords = a.name.trim().split(/\s+/).length;
            const bWords = b.name.trim().split(/\s+/).length;
            if (aWords !== bWords) {
                return aWords - bWords;
            }
            return a.name.localeCompare(b.name);
        });
        RanderBtnCatg(allCatogrey);
    });
}

export function getByQrCode(barcodeVal) {
    let inputValue = barcodeVal;
    if (!inputValue) {
        const barcodeInput = document.getElementById("barcode-inpu-t");
        if (barcodeInput) inputValue = barcodeInput.value;
    }

    if (!inputValue) return;

    const loading = getLoading();
    if (loading) loading.style.display = "flex";

    fetchAPI(`/products/barcode/${inputValue}`)
        .then((result) => {
            if (result.result) {
                allProductsData = [result.result];
            } else {
                allProductsData = [];
            }

            displayProduct(allProductsData);
            if (loading) loading.style.display = "none";
        })
        .catch((err) => {
            console.error(err);
            if (loading) loading.style.display = "none";
        });
}

function RanderBtnCatg(categories) {
    if (!categories) return;
    const catgContainer = getCatContainer();
    if (!catgContainer) return;

    const bgColors = ["bg-emerald-100", "bg-blue-100", "bg-orange-100", "bg-purple-100", "bg-pink-100", "bg-amber-100"];
    const textColors = ["text-emerald-700", "text-blue-700", "text-orange-700", "text-purple-700", "text-pink-700", "text-amber-700"];
    const iconColors = ["text-emerald-500", "text-blue-500", "text-orange-500", "text-purple-500", "text-pink-500", "text-amber-500"];

    let btnCat = categories
        .map((cat) => {
            const randomIndex = Math.floor(Math.random() * bgColors.length);

            return `
      <button
        class="product-category-btn px-4 py-2 ${bgColors[randomIndex]} ${textColors[randomIndex]} rounded-lg text-sm font-medium whitespace-nowrap hover:opacity-80 transition-all"
      >
        <i class="fa-solid fa-cookie mr-1.5 ${iconColors[randomIndex]}"></i>
        ${cat.name}
      </button>
    `;
        })
        .join("");

    catgContainer.innerHTML = btnCat;

    catgContainer.querySelectorAll("button").forEach((btn) => {
        btn.addEventListener("click", () => getByCat(btn.textContent.trim()));
    });
}

function getByCat(CatName) {
    fetchAPI(`/products/category/${CatName.replace(" ", "-")}`).then((result) => {
        allProductsData = result.results;
        displayProduct(allProductsData);
    });
}

function closeProductModal() {
    const modal = document.getElementById("product-detail-modal");
    if (modal) modal.remove();
}

export function openProductModal(product) {
    if (!product) return;
    let productobj = {
        type: "product",
        name: product.name,
        brand: product.brand,
        barcode: product.barcode,
        serving: "100g",
        nutrition: {
            calories: product.nutrients.calories,
            fat: product.nutrients.fat,
            saturatedFat: product.nutrients.saturatedFat,
            carbs: product.nutrients.carbs,
            sugar: product.nutrients.sugar,
            fiber: product.nutrients.fiber,
            protein: product.nutrients.protein,
        },
        date: getTodayDateKey(),
        image: product.image,
        thumbnail: product.image
    };

    const modalHTML = `
<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" id="product-detail-modal">
            <div class="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div class="p-6">
                  <div class="flex items-start gap-6 mb-6">
                <div class="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                    
                        <img src="${product.image}" alt="${product.name}" class="w-full h-full object-contain">
                    
                </div>
                <div class="flex-1">
                    <p class="text-sm text-emerald-600 font-semibold mb-1">${product.brand}</p>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">${product.name}</h2>
                    <p class="text-sm text-gray-500 mb-3">100g / Serving</p>
                    
                    <div class="flex items-center gap-3">
                         ${product.nutritionGrade ? `
                            <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg" style="background-color: #e63e1120">
                                <span class="w-8 h-8 rounded flex items-center justify-center text-white font-bold" style="background-color: #e63e11">
                                    ${product.nutritionGrade.toUpperCase()}
                                </span>
                                <div>
                                    <p class="text-xs font-bold" style="color: #e63e11">Nutri-Score</p>
                                </div>
                            </div>` : ''}
                        
                         ${product.novaGroup ? `
                            <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg" style="background-color: #e63e1120">
                                <span class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style="background-color: #e63e11">
                                    ${product.novaGroup}
                                </span>
                                <div>
                                    <p class="text-xs font-bold" style="color: #e63e11">NOVA</p>
                                </div>
                            </div>` : ''}
                        
                    </div>
                </div>
                <button class="close-product-modal text-gray-400 hover:text-gray-600">
                    <i class="fa-solid fa-xmark text-2xl"></i>
                </button>
            </div>

            <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 mb-6 border border-emerald-200">
                <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <i class="fa-solid fa-chart-pie text-emerald-600"></i>
                    Nutrition Facts <span class="text-sm font-normal text-gray-500">(per 100g)</span>
                </h3>
                
                <div class="text-center mb-4 pb-4 border-b border-emerald-200">
                    <p class="text-4xl font-bold text-gray-900">${product.nutrients.calories}</p>
                    <p class="text-sm text-gray-500">Calories</p>
                </div>
                
                <div class="grid grid-cols-4 gap-4">
                    <div class="text-center">
                        <p class="text-lg font-bold text-emerald-600">${product.nutrients.protein}g</p>
                        <p class="text-xs text-gray-500">Protein</p>
                    </div>
                    <div class="text-center">
                        <p class="text-lg font-bold text-blue-600">${product.nutrients.carbs}g</p>
                        <p class="text-xs text-gray-500">Carbs</p>
                    </div>
                    <div class="text-center">
                        <p class="text-lg font-bold text-purple-600">${product.nutrients.fat}g</p>
                        <p class="text-xs text-gray-500">Fat</p>
                    </div>
                    <div class="text-center">
                        <p class="text-lg font-bold text-orange-600">${product.nutrients.sugar}g</p>
                        <p class="text-xs text-gray-500">Sugar</p>
                    </div>
                </div>
            </div>

            <div class="flex gap-3">
                <button class="add-product-to-log flex-1 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all">
                    <i class="fa-solid fa-plus mr-2"></i>Log This Food
                </button>
                <button class="close-product-modal flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                    Close
                </button>
            </div>
                </div>
            </div>
        </div>
  `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const modal = document.getElementById("product-detail-modal");
    const closeBtns = modal.querySelectorAll(".close-product-modal");
    const addBtn = modal.querySelector(".add-product-to-log");

    const closeFn = () => closeProductModal();

    closeBtns.forEach((btn) => btn.addEventListener("click", closeFn));
    addBtn.addEventListener("click", () => {
        logMealOrProduct(productobj);
        closeFn();
    });
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeFn();
    });
}
