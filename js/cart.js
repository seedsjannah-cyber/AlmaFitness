// Shopping Cart
let cart = [];

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('almasFitnessCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('almasFitnessCart', JSON.stringify(cart));
}

// Add item to cart
function addToCart(productId) {
    const product = getProductById(productId);

    if (!product) return;

    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    showNotification('Item added to cart!');
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCartItems();
}

// Update item quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        renderCartItems();
    }
}

// Calculate cart total
function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Update cart count in nav
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Render cart items in modal
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem 0;">
                <i class="fas fa-shopping-cart" style="font-size: 4rem; color: #d1d5db; margin-bottom: 1rem;"></i>
                <p style="color: #6b7280; font-size: 1.125rem;">Your cart is empty</p>
            </div>
        `;
        if (cartTotal) cartTotal.textContent = '$0.00';
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" style="display: flex; gap: 1rem; padding: 1.5rem; border-bottom: 1px solid #f3f4f6; align-items: center;">
            <img src="${item.image}" alt="${item.name}"
                 style="width: 80px; height: 80px; object-fit: cover; border-radius: 10px;"
                 onerror="this.src='images/placeholder-product.jpg'">
            <div style="flex: 1;">
                <h4 style="margin-bottom: 0.5rem;">${item.name}</h4>
                <p style="color: #10b981; font-weight: 600;">$${item.price.toFixed(2)}</p>
            </div>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <button onclick="updateQuantity(${item.id}, -1)"
                        style="width: 30px; height: 30px; border: 1px solid #d1d5db; background: white; border-radius: 50%; cursor: pointer;">
                    <i class="fas fa-minus" style="font-size: 0.75rem;"></i>
                </button>
                <span style="min-width: 30px; text-align: center; font-weight: 600;">${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)"
                        style="width: 30px; height: 30px; border: 1px solid #d1d5db; background: white; border-radius: 50%; cursor: pointer;">
                    <i class="fas fa-plus" style="font-size: 0.75rem;"></i>
                </button>
            </div>
            <button onclick="removeFromCart(${item.id})"
                    style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 1.25rem;">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    if (cartTotal) {
        cartTotal.textContent = `$${getCartTotal().toFixed(2)}`;
    }
}

// Show/hide cart modal
function toggleCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.classList.toggle('active');
        renderCartItems();
    }
}

// Setup cart modal
function setupCartModal() {
    // Open cart
    const cartIconLink = document.querySelector('.cart-icon-link');
    if (cartIconLink) {
        cartIconLink.addEventListener('click', (e) => {
            e.preventDefault();
            toggleCart();
        });
    }

    // Close cart
    const closeCart = document.getElementById('closeCart');
    if (closeCart) {
        closeCart.addEventListener('click', toggleCart);
    }

    // Close on outside click
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                toggleCart();
            }
        });
    }

    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }
}

// Proceed to checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }

    // Create checkout session with Stripe or PayPal
    showNotification('Redirecting to checkout...', 'info');

    // TODO: Integrate with Stripe/PayPal
    // For now, show a placeholder
    setTimeout(() => {
        showCheckoutModal();
    }, 500);
}

// Show checkout modal (placeholder)
function showCheckoutModal() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h3>Checkout</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <p style="margin-bottom: 1.5rem;">Total: <strong>$${getCartTotal().toFixed(2)}</strong></p>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <button class="btn btn-primary" onclick="processPayment('stripe')">
                        <i class="fab fa-cc-stripe"></i> Pay with Stripe
                    </button>
                    <button class="btn btn-primary" onclick="processPayment('paypal')"
                            style="background: #0070ba; border-color: #0070ba;">
                        <i class="fab fa-paypal"></i> Pay with PayPal
                    </button>
                </div>
                <p style="margin-top: 1.5rem; font-size: 0.875rem; color: #6b7280; text-align: center;">
                    <i class="fas fa-lock"></i> Secure payment processing
                </p>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Process payment (placeholder)
function processPayment(method) {
    showNotification(`Processing payment via ${method}...`, 'info');

    // TODO: Implement actual payment processing
    // This is where you would integrate Stripe or PayPal SDK

    // Simulate payment processing
    setTimeout(() => {
        // Clear cart
        cart = [];
        saveCart();
        updateCartCount();

        // Close all modals
        document.querySelectorAll('.modal').forEach(modal => modal.remove());

        // Show success message
        showSuccessMessage();
    }, 2000);
}

// Show success message
function showSuccessMessage() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px; text-align: center;">
            <div class="modal-body" style="padding: 3rem;">
                <div style="margin-bottom: 2rem;">
                    <i class="fas fa-check-circle" style="font-size: 5rem; color: #10b981;"></i>
                </div>
                <h3 style="margin-bottom: 1rem;">Order Successful!</h3>
                <p style="color: #6b7280; margin-bottom: 2rem;">
                    Thank you for your purchase. A confirmation email has been sent to your inbox.
                </p>
                <button class="btn btn-primary" onclick="this.closest('.modal').remove()">
                    Continue Shopping
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 3000;
        animation: slideInFromRight 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize cart
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    setupCartModal();
});
