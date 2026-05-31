// ==========================================
// BEAUTIFUL MESS — Shared Cart + Interactions
// ==========================================

let cart = JSON.parse(localStorage.getItem('bm_cart')) || [];

function saveCart() {
  localStorage.setItem('bm_cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const countEl = document.getElementById('cart-count');
  if (!countEl) return;
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  countEl.textContent = total;
}

function addToCart(id, name, price, image = '') {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, name, price, image, quantity: 1 });
  }
  saveCart();
  showToast(`${name} added to cart`);
}

function removeFromCart(index) {
  const removed = cart[index].name;
  cart.splice(index, 1);
  saveCart();
  renderCartItems();
  showToast(`${removed} removed`);
}

function changeCartQuantity(index, delta) {
  cart[index].quantity += delta;
  if (cart[index].quantity < 1) cart.splice(index, 1);
  saveCart();
  renderCartItems();
}

function renderCartItems() {
  const container = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  if (!container || !totalEl) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-center py-10 text-zinc-500">
        <p class="text-lg">Your cart is empty</p>
        <p class="text-sm mt-1">Time to discover something beautiful.</p>
      </div>`;
    totalEl.textContent = '$0';
    return;
  }

  let html = '';
  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    html += `
      <div class="flex gap-4 border-b border-zinc-800 pb-5">
        ${item.image ? `<img src="${item.image}" class="w-16 h-16 object-cover rounded-xl flex-shrink-0" alt="">` : ''}
        <div class="flex-1 min-w-0">
          <h4 class="font-medium text-sm leading-tight">${item.name}</h4>
          <p class="text-pink-500 font-semibold mt-1">$${item.price}</p>
          
          <div class="flex items-center gap-3 mt-3">
            <div class="flex items-center border border-zinc-700 rounded-lg text-sm">
              <button onclick="changeCartQuantity(${index}, -1)" class="px-3 py-1 hover:bg-zinc-800 active:bg-zinc-900">−</button>
              <span class="px-4 font-medium">${item.quantity}</span>
              <button onclick="changeCartQuantity(${index}, 1)" class="px-3 py-1 hover:bg-zinc-800 active:bg-zinc-900">+</button>
            </div>
            <button onclick="removeFromCart(${index})" class="text-xs text-red-400 hover:text-red-500 font-medium">Remove</button>
          </div>
        </div>
        <div class="text-right font-semibold">$${itemTotal}</div>
      </div>`;
  });

  container.innerHTML = html;
  totalEl.textContent = '$' + total;
}

function toggleCart() {
  const sidebar = document.getElementById('cart-sidebar');
  if (!sidebar) return;
  sidebar.classList.toggle('translate-x-full');
  if (!sidebar.classList.contains('translate-x-full')) {
    renderCartItems();
  }
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 z-[200] text-sm border border-pink-500/30`;
  toast.innerHTML = `<span>${message}</span>`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'all 0.3s ease';
    toast.style.opacity = '0';
    setTimeout(() => toast.parentNode.removeChild(toast), 200);
  }, 2200);
}

// Portal click animation + navigation
function initPortals() {
  document.querySelectorAll('.portal-card').forEach(card => {
    card.addEventListener('click', () => {
      const target = card.dataset.target;
      if (!target) return;

      card.classList.add('opening');

      // Play mechanical "garage opening" then navigate
      setTimeout(() => {
        window.location.href = target;
      }, 650);
    });
  });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  initPortals();

  // Keyboard escape for cart
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const sidebar = document.getElementById('cart-sidebar');
      if (sidebar && !sidebar.classList.contains('translate-x-full')) {
        sidebar.classList.add('translate-x-full');
      }
    }
  });

  // If cart sidebar exists on page, render items when opened
  const cartBtn = document.getElementById('cart-btn');
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      setTimeout(renderCartItems, 50);
    });
  }
});