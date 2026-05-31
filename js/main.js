// Beautiful Mess - Interactive JavaScript

let cart = [];

// Filter products by category
function filterProducts(category) {
  const cards = document.querySelectorAll('.product-card');
  const buttons = document.querySelectorAll('.filter-btn');

  // Update active button styles
  buttons.forEach(btn => {
    if (btn.dataset.category === category) {
      btn.classList.add('bg-amber-900', 'text-white');
      btn.classList.remove('bg-white', 'text-amber-900', 'border', 'border-amber-900');
    } else {
      btn.classList.remove('bg-amber-900', 'text-white');
      btn.classList.add('bg-white', 'text-amber-900', 'border', 'border-amber-900');
    }
  });

  cards.forEach(card => {
    if (category === 'all') {
      card.style.display = 'block';
    } else {
      if (card.dataset.category === category) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    }
  });
}

// Add item to cart
function addToCart(id, name, price, image) {
  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: id,
      name: name,
      price: price,
      image: image,
      quantity: 1
    });
  }

  updateCartUI();
  showToast(`${name} added to cart`);
}

// Update cart UI
function updateCartUI() {
  const cartCount = document.getElementById('cart-count');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');

  // Update count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  // Update items list
  cartItems.innerHTML = '';

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="text-center py-8 text-stone-500">
        <p class="font-serif text-lg">Your cart is empty</p>
        <p class="text-sm mt-1">Time to discover something beautiful.</p>
      </div>
    `;
    cartTotal.textContent = '$0';
    return;
  }

  let html = '';
  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    html += `
      <div class="flex gap-4 border-b border-stone-200 pb-4">
        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg flex-shrink-0">
        <div class="flex-1 min-w-0">
          <h4 class="font-medium text-stone-900 text-sm leading-tight">${item.name}</h4>
          <p class="text-amber-800 font-semibold mt-0.5">$${item.price}</p>
          
          <div class="flex items-center gap-3 mt-2">
            <div class="flex items-center border border-stone-300 rounded">
              <button onclick="changeQuantity(${index}, -1)" class="px-2 py-0.5 hover:bg-stone-100 active:bg-stone-200">−</button>
              <span class="px-3 text-sm font-medium">${item.quantity}</span>
              <button onclick="changeQuantity(${index}, 1)" class="px-2 py-0.5 hover:bg-stone-100 active:bg-stone-200">+</button>
            </div>
            <button onclick="removeFromCart(${index})" class="text-xs text-red-600 hover:text-red-700 font-medium">Remove</button>
          </div>
        </div>
        <div class="text-right">
          <p class="font-semibold text-stone-900">$${itemTotal}</p>
        </div>
      </div>
    `;
  });

  cartItems.innerHTML = html;
  cartTotal.textContent = '$' + total;
}

// Change item quantity
function changeQuantity(index, delta) {
  cart[index].quantity += delta;

  if (cart[index].quantity < 1) {
    cart.splice(index, 1);
  }

  updateCartUI();
}

// Remove from cart
function removeFromCart(index) {
  const removedName = cart[index].name;
  cart.splice(index, 1);
  updateCartUI();
  showToast(`${removedName} removed from cart`);
}

// Toggle cart sidebar
function toggleCart() {
  const sidebar = document.getElementById('cart-sidebar');
  sidebar.classList.toggle('translate-x-full');
}

// Show toast notification
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-6 left-1/2 -translate-x-1/2 bg-stone-900 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 z-[100] font-sans text-sm`;
  toast.innerHTML = `
    <span>${message}</span>
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'all 0.3s ease';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2200);
}

// Gallery modal
function openGalleryModal(imageSrc, title, artist, medium, description) {
  const modal = document.getElementById('gallery-modal');
  const modalImage = document.getElementById('modal-image');
  const modalTitle = document.getElementById('modal-title');
  const modalArtist = document.getElementById('modal-artist');
  const modalMedium = document.getElementById('modal-medium');
  const modalDesc = document.getElementById('modal-desc');

  modalImage.src = imageSrc;
  modalTitle.textContent = title;
  modalArtist.textContent = artist;
  modalMedium.textContent = medium;
  modalDesc.textContent = description;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

// Close gallery modal
function closeGalleryModal() {
  const modal = document.getElementById('gallery-modal');
  modal.classList.remove('flex');
  modal.classList.add('hidden');
}

// Simple checkout simulation (placeholder for future payment integration)
function checkout() {
  if (cart.length === 0) return;

  const modal = document.getElementById('checkout-modal');
  const summary = document.getElementById('checkout-summary');

  let html = '<div class="space-y-2">';
  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    html += `
      <div class="flex justify-between text-sm">
        <span>${item.name} × ${item.quantity}</span>
        <span class="font-medium">$${itemTotal}</span>
      </div>
    `;
  });

  html += `</div>
  <div class="border-t pt-3 mt-3 flex justify-between font-semibold text-lg">
    <span>Total</span>
    <span>$${total}</span>
  </div>`;

  summary.innerHTML = html;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

// Close checkout modal
function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  modal.classList.remove('flex');
  modal.classList.add('hidden');
}

// Fake order placement
function placeOrder() {
  const modal = document.getElementById('checkout-modal');
  modal.classList.remove('flex');
  modal.classList.add('hidden');

  // Clear cart
  cart = [];
  updateCartUI();

  // Show success
  const successModal = document.getElementById('success-modal');
  successModal.classList.remove('hidden');
  successModal.classList.add('flex');

  setTimeout(() => {
    successModal.classList.remove('flex');
    successModal.classList.add('hidden');
    showToast('Thank you! We\'ll be in touch about your order.');
  }, 2800);
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Set initial filter to 'all'
  const allBtn = document.querySelector('.filter-btn[data-category="all"]');
  if (allBtn) {
    allBtn.classList.add('bg-amber-900', 'text-white');
    allBtn.classList.remove('bg-white', 'text-amber-900', 'border', 'border-amber-900');
  }

  // Initialize cart UI
  updateCartUI();

  // Keyboard support for modals
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const openModals = document.querySelectorAll('.modal:not(.hidden)');
      if (openModals.length > 0) {
        openModals[openModals.length - 1].classList.add('hidden');
        openModals[openModals.length - 1].classList.remove('flex');
      }
    }
  });

  // Welcome toast for first visit (optional)
  // setTimeout(() => showToast('Welcome to Beautiful Mess'), 1800);
});