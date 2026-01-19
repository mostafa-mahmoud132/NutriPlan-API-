export function getTodayDateKey() {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const localDate = new Date(today.getTime() - (offset * 60 * 1000));
  return localDate.toISOString().split("T")[0];
}

export function showToast(message) {
  const toastId = 'custom-toast-notification';
  const existingToast = document.getElementById(toastId);
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.id = toastId;

  toast.style.cssText = `
    position: fixed !important;
    bottom: 20px !important;
    right: 20px !important;
    z-index: 999999 !important;
    background-color: #2563eb;
    color: white;
    padding: 12px 24px;
    border-radius: 12px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  `;

  toast.innerHTML = `
    <i class="fa-solid fa-circle-check" style="font-size: 1.2em;"></i>
    <span>${message}</span>
  `;

  document.body.appendChild(toast);

  void toast.offsetHeight;

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

export function navigateToSection(sectionName) {
  const link = document.querySelector(`.nav-link[data-target="${sectionName}"]`) ||
    Array.from(document.querySelectorAll('.nav-link')).find(l => l.textContent.trim().toLowerCase() === sectionName);

  if (link) {
    link.click();
    const sidebar = document.getElementById("sidebar");
    if (window.innerWidth < 1024 && sidebar && sidebar.style.transform === "translate(0px, 10px)") {
    }
  }
}

export function showClearLogConfirmation(onConfirm) {
  const styleId = "custom-swal-styles";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      #custom-clear-modal {
        display: flex;
        position: fixed;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.4);
        align-items: center;
        justify-content: center;
        z-index: 10000;
        font-family: 'Inter', sans-serif;
        opacity: 0;
        transition: opacity 0.3s ease-out;
      }
      #custom-clear-modal.visible {
        opacity: 1;
      }
      #custom-clear-modal .swal2-popup {
        display: grid;
        background: #fff;
        border-radius: 1rem;
        width: 32rem;
        max-width: 95%;
        padding: 1.5rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        transform: scale(0.9);
        transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
      #custom-clear-modal.visible .swal2-popup {
        transform: scale(1);
      }
      .swal2-icon.swal2-warning {
        border-color: #f8bb86;
        color: #f8bb86;
        border-width: 4px;
        border-style: solid;
        border-radius: 50%;
        width: 5em;
        height: 5em;
        margin: 1.5em auto 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
      }
      .swal2-icon-content {
        font-size: 3.75em;
        font-weight: 300;
      }
      .swal2-title {
        text-align: center;
        font-size: 1.5rem;
        font-weight: 600;
        color: #1f2937;
        margin: 0 0 0.5rem;
      }
      .swal2-html-container {
        text-align: center;
        font-size: 1rem;
        color: #4b5563;
        margin: 0 0 1.5rem;
      }
      .swal2-actions {
        display: flex;
        justify-content: center;
        gap: 0.75rem;
      }
      .swal2-styled {
        border: none;
        border-radius: 0.5rem;
        font-weight: 500;
        font-size: 1rem;
        padding: 0.625em 1.5em;
        cursor: pointer;
        transition: background-color 0.2s, box-shadow 0.2s;
        color: #fff;
      }
      .swal2-confirm {
        background-color: #ef4444;
      }
      .swal2-confirm:hover {
        background-color: #dc2626;
      }
      .swal2-cancel {
        background-color: #6b7280;
      }
      .swal2-cancel:hover {
        background-color: #4b5563;
      }
    `;
    document.head.appendChild(style);
  }

  const modalHTML = `
    <div id="custom-clear-modal" role="dialog" aria-modal="true">
      <div class="swal2-popup">
        <div class="swal2-icon swal2-warning">
          <div class="swal2-icon-content">!</div>
        </div>
        <h2 class="swal2-title">Clear Today's Log?</h2>
        <div class="swal2-html-container">This will remove all logged food items for today.</div>
        <div class="swal2-actions">
          <button type="button" class="swal2-confirm swal2-styled">Yes, clear it!</button>
          <button type="button" class="swal2-cancel swal2-styled">Cancel</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  const modal = document.getElementById("custom-clear-modal");
  const confirmBtn = modal.querySelector(".swal2-confirm");
  const cancelBtn = modal.querySelector(".swal2-cancel");

  requestAnimationFrame(() => {
    modal.classList.add("visible");
  });

  const close = () => {
    modal.classList.remove("visible");
    setTimeout(() => modal.remove(), 300);
  };

  confirmBtn.onclick = () => {
    onConfirm();
    close();
  };

  cancelBtn.onclick = () => close();

  modal.onclick = (e) => {
    if (e.target === modal) close();
  };
}

export function showDeleteConfirmation(onConfirm) {
  const styleId = "custom-swal-styles";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      #custom-clear-modal {
        display: flex;
        position: fixed;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.4);
        align-items: center;
        justify-content: center;
        z-index: 10000;
        font-family: 'Inter', sans-serif;
        opacity: 0;
        transition: opacity 0.3s ease-out;
      }
      #custom-clear-modal.visible {
        opacity: 1;
      }
      #custom-clear-modal .swal2-popup {
        display: grid;
        background: #fff;
        border-radius: 1rem;
        width: 32rem;
        max-width: 95%;
        padding: 1.5rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        transform: scale(0.9);
        transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
      #custom-clear-modal.visible .swal2-popup {
        transform: scale(1);
      }
      .swal2-icon.swal2-warning {
        border-color: #f8bb86;
        color: #f8bb86;
        border-width: 4px;
        border-style: solid;
        border-radius: 50%;
        width: 5em;
        height: 5em;
        margin: 1.5em auto 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
      }
      .swal2-icon-content {
        font-size: 3.75em;
        font-weight: 300;
      }
      .swal2-title {
        text-align: center;
        font-size: 1.5rem;
        font-weight: 600;
        color: #1f2937;
        margin: 0 0 0.5rem;
      }
      .swal2-html-container {
        text-align: center;
        font-size: 1rem;
        color: #4b5563;
        margin: 0 0 1.5rem;
      }
      .swal2-actions {
        display: flex;
        justify-content: center;
        gap: 0.75rem;
      }
      .swal2-styled {
        border: none;
        border-radius: 0.5rem;
        font-weight: 500;
        font-size: 1rem;
        padding: 0.625em 1.5em;
        cursor: pointer;
        transition: background-color 0.2s, box-shadow 0.2s;
        color: #fff;
      }
      .swal2-confirm {
        background-color: #ef4444;
        color: white; /* Ensure text is visible */
      }
      .swal2-confirm:hover {
        background-color: #dc2626;
      }
      .swal2-cancel {
        background-color: #6b7280;
        color: white;
      }
      .swal2-cancel:hover {
        background-color: #4b5563;
      }
    `;
    document.head.appendChild(style);
  }

  const modalHTML = `
    <div id="custom-clear-modal" role="dialog" aria-modal="true">
      <div class="swal2-popup">
        <div class="swal2-icon swal2-warning">
          <div class="swal2-icon-content">!</div>
        </div>
        <h2 class="swal2-title">Delete this item?</h2>
        <div class="swal2-html-container">This item will be removed from your log.</div>
        <div class="swal2-actions">
          <button type="button" class="swal2-confirm swal2-styled">Yes, delete it!</button>
          <button type="button" class="swal2-cancel swal2-styled">Cancel</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  const modal = document.getElementById("custom-clear-modal");
  const confirmBtn = modal.querySelector(".swal2-confirm");
  const cancelBtn = modal.querySelector(".swal2-cancel");

  requestAnimationFrame(() => {
    modal.classList.add("visible");
  });

  const close = () => {
    modal.classList.remove("visible");
    setTimeout(() => modal.remove(), 300);
  };

  confirmBtn.onclick = () => {
    onConfirm();
    close();
  };

  cancelBtn.onclick = () => close();

  modal.onclick = (e) => {
    if (e.target === modal) close();
  };
}