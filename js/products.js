// Product Database
const products = [
    // Apparel
    {
        id: 1,
        name: "Performance Leggings",
        category: "apparel",
        price: 78.00,
        image: "images/products/leggings.jpg",
        description: "High-performance compression leggings with moisture-wicking technology"
    },
    {
        id: 2,
        name: "Sports Bra - High Support",
        category: "apparel",
        price: 52.00,
        image: "images/products/sports-bra.jpg",
        description: "Maximum support sports bra for high-intensity workouts"
    },
    {
        id: 3,
        name: "Training Tank Top",
        category: "apparel",
        price: 38.00,
        image: "images/products/tank-top.jpg",
        description: "Breathable mesh panel tank for ultimate comfort"
    },
    {
        id: 4,
        name: "Yoga Mat - Premium",
        category: "apparel",
        price: 65.00,
        image: "images/products/yoga-mat.jpg",
        description: "Eco-friendly, non-slip yoga mat with carrying strap"
    },
    {
        id: 5,
        name: "Resistance Bands Set",
        category: "apparel",
        price: 42.00,
        image: "images/products/resistance-bands.jpg",
        description: "5-piece resistance band set for full-body workouts"
    },
    {
        id: 6,
        name: "Gym Duffel Bag",
        category: "apparel",
        price: 85.00,
        image: "images/products/gym-bag.jpg",
        description: "Spacious duffel with shoe compartment and water bottle holder"
    },

    // Supplements
    {
        id: 7,
        name: "Plant-Based Protein Powder",
        category: "supplements",
        price: 48.00,
        image: "images/products/protein-powder.jpg",
        description: "Organic plant-based protein with 25g per serving - Vanilla flavor"
    },
    {
        id: 8,
        name: "Pre-Workout Energy Boost",
        category: "supplements",
        price: 42.00,
        image: "images/products/pre-workout.jpg",
        description: "Clean energy pre-workout formula with natural caffeine"
    },
    {
        id: 9,
        name: "BCAA Recovery Formula",
        category: "supplements",
        price: 38.00,
        image: "images/products/bcaa.jpg",
        description: "Branch chain amino acids for muscle recovery and endurance"
    },
    {
        id: 10,
        name: "Omega-3 Fish Oil",
        category: "supplements",
        price: 32.00,
        image: "images/products/fish-oil.jpg",
        description: "High-potency omega-3 for heart and brain health"
    },
    {
        id: 11,
        name: "Multivitamin Complex",
        category: "supplements",
        price: 35.00,
        image: "images/products/multivitamin.jpg",
        description: "Complete daily multivitamin with essential nutrients"
    },
    {
        id: 12,
        name: "Collagen Peptides",
        category: "supplements",
        price: 45.00,
        image: "images/products/collagen.jpg",
        description: "Grass-fed collagen for skin, hair, and joint health"
    }
];

// Render products to the page
function renderProducts(filter = 'all') {
    const productsGrid = document.getElementById('productsGrid');

    if (!productsGrid) return;

    const filteredProducts = filter === 'all'
        ? products
        : products.filter(product => product.category === filter);

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder-product.jpg'">
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Filter products
function setupProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Get filter value and render products
            const filter = button.getAttribute('data-filter');
            renderProducts(filter);
        });
    });
}

// Get product by ID
function getProductById(id) {
    return products.find(product => product.id === id);
}

// Initialize products section
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    setupProductFilters();
});
