  // Sample Medicine Data
const medicines = [
    {
        id: 1,
        name: "Amoxicillin 500mg",
        description: "Antibiotic for bacterial infections",
        price: 45.50,
        pharmacy: "MediCare Main",
        distance: "1.2 km",
        category: "antibiotics",
        prescription: true,
        image: "fa-capsules"
    },
    {
        id: 2,
        name: "Paracetamol 500mg",
        description: "Pain reliever and fever reducer",
        price: 15.00,
        pharmacy: "City Pharmacy",
        distance: "0.8 km",
        category: "pain",
        prescription: false,
        image: "fa-tablets"
    },
    {
        id: 3,
        name: "Losartan 50mg",
        description: "Blood pressure medication",
        price: 85.75,
        pharmacy: "Heart Care Pharmacy",
        distance: "2.5 km",
        category: "cardiac",
        prescription: true,
        image: "fa-heart"
    },
    {
        id: 4,
        name: "Metformin 850mg",
        description: "Diabetes medication",
        price: 62.30,
        pharmacy: "MediCare Branch",
        distance: "1.8 km",
        category: "diabetes",
        prescription: true,
        image: "fa-prescription-bottle"
    },
    {
        id: 5,
        name: "Vitamin C 1000mg",
        description: "Immune system support",
        price: 25.00,
        pharmacy: "Wellness Pharmacy",
        distance: "3.0 km",
        category: "supplements",
        prescription: false,
        image: "fa-apple-alt"
    },
    {
        id: 6,
        name: "Cetirizine 10mg",
        description: "Antihistamine for allergies",
        price: 32.50,
        pharmacy: "Allergy Care",
        distance: "1.5 km",
        category: "allergy",
        prescription: false,
        image: "fa-allergies"
    }
];

// Cart System
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    loadMedicines();
    initModals();
    initCart();
    initChat();
    initPrescriptionUpload();
    initAISearch();
    initPaymentMethods();
});

// Navigation and Mobile Menu
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const dropdowns = document.querySelectorAll('.dropdown');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Handle dropdowns on mobile
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.nav-link');
        trigger.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Load and Display Medicines
function loadMedicines(filter = 'all') {
    const medicineList = document.getElementById('medicine-list');
    medicineList.innerHTML = '';

    let filteredMedicines = [...medicines];

    // Apply filters
    if (filter === 'low-price') {
        filteredMedicines.sort((a, b) => a.price - b.price);
    } else if (filter === 'nearby') {
        filteredMedicines.sort((a, b) => {
            const distA = parseFloat(a.distance);
            const distB = parseFloat(b.distance);
            return distA - distB;
        });
    } else if (filter === 'prescription') {
        filteredMedicines = filteredMedicines.filter(m => m.prescription);
    }

    filteredMedicines.forEach(medicine => {
        const medicineCard = createMedicineCard(medicine);
        medicineList.appendChild(medicineCard);
    });

    // Initialize filter buttons
    initFilterButtons();
}

function createMedicineCard(medicine) {
    const card = document.createElement('div');
    card.className = 'medicine-card';
    card.innerHTML = `
        <div class="medicine-image">
            <i class="fas ${medicine.image}"></i>
        </div>
        <div class="medicine-info">
            <h3 class="medicine-name">${medicine.name}</h3>
            <p class="medicine-desc">${medicine.description}</p>
            <div class="pharmacy-info">
                <span class="pharmacy-name">${medicine.pharmacy}</span>
                <span class="pharmacy-distance"><i class="fas fa-map-marker-alt"></i> ${medicine.distance}</span>
            </div>
            <div class="medicine-price">${medicine.price.toFixed(2)} ETB</div>
            <div class="medicine-actions">
                <button class="btn-add-cart" data-id="${medicine.id}">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
                <button class="btn-compare" data-id="${medicine.id}">
                    <i class="fas fa-balance-scale"></i> Compare
                </button>
            </div>
        </div>
    `;

    // Add event listeners
    const addToCartBtn = card.querySelector('.btn-add-cart');
    addToCartBtn.addEventListener('click', () => addToCart(medicine));

    const compareBtn = card.querySelector('.btn-compare');
    compareBtn.addEventListener('click', () => compareMedicine(medicine));

    return card;
}

function initFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Load medicines with filter
            const filter = btn.getAttribute('data-filter');
            loadMedicines(filter);
        });
    });
}

// Modal System
function initModals() {
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const closeModals = document.querySelectorAll('.close-modal');
    const switchToRegister = document.getElementById('switch-to-register');
    const switchToLogin = document.getElementById('switch-to-login');

    // Open login modal
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.classList.add('active');
    });

    // Open register modal
    registerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        registerModal.classList.add('active');
    });

    // Close modals
    closeModals.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            loginModal.classList.remove('active');
            registerModal.classList.remove('active');
        });
    });

    // Switch between login and register
    switchToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.classList.remove('active');
        registerModal.classList.add('active');
    });

    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerModal.classList.remove('active');
        loginModal.classList.add('active');
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
        }
        if (e.target === registerModal) {
            registerModal.classList.remove('active');
        }
    });

    // Form submissions
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
}

function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simulate login process
    if (username && password) {
        alert('Login successful! Welcome to MediCare Pharmacy.');
        document.getElementById('login-modal').classList.remove('active');
        document.getElementById('login-form').reset();
        
        // Update UI for logged in user
        const accountBtn = document.querySelector('.account-btn');
        accountBtn.innerHTML = '<i class="fas fa-user-circle"></i> My Account';
    } else {
        alert('Please fill in all fields.');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    // Simulate registration
    if (fullname && email && phone && password) {
        alert('Registration successful! Please login.');
        document.getElementById('register-modal').classList.remove('active');
        document.getElementById('login-modal').classList.add('active');
        document.getElementById('register-form').reset();
    }
}

// Cart System
function initCart() {
    updateCartCount();
    renderCart();
    
    // Clear cart button
    document.getElementById('clear-cart').addEventListener('click', clearCart);
    
    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', checkout);
}

function addToCart(medicine) {
    // Check if already in cart
    const existingItem = cart.find(item => item.id === medicine.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...medicine,
            quantity: 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update UI
    updateCartCount();
    renderCart();
    
    // Show notification
    showNotification(`${medicine.name} added to cart!`);
}

function removeFromCart(medicineId) {
    cart = cart.filter(item => item.id !== medicineId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

function updateQuantity(medicineId, change) {
    const item = cart.find(item => item.id === medicineId);
    if (item) {
        item.quantity += change;
        if (item.quantity < 1) {
            removeFromCart(medicineId);
            return;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCount();
    }
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
    document.getElementById('cart-items-count').textContent = totalItems;
}

function renderCart() {
    const cartList = document.getElementById('cart-list');
    const emptyCart = document.getElementById('empty-cart');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    
    if (cart.length === 0) {
        cartList.innerHTML = `
            <div class="empty-cart" id="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Add medicines to get started</p>
            </div>
        `;
        subtotalEl.textContent = '0.00 ETB';
        totalEl.textContent = '50.00 ETB';
        return;
    }
    
    // Clear cart list
    cartList.innerHTML = '';
    
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <i class="fas ${item.image}"></i>
            </div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>${item.pharmacy} • ${item.distance}</p>
                <div class="medicine-price">${item.price.toFixed(2)} ETB</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn minus" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn plus" data-id="${item.id}">+</button>
            </div>
            <button class="cart-item-remove" data-id="${item.id}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        cartList.appendChild(cartItem);
    });
    
    // Add event listeners for quantity buttons
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-id'));
            updateQuantity(id, -1);
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-id'));
            updateQuantity(id, 1);
        });
    });
    
    // Add event listeners for remove buttons
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-id'));
            removeFromCart(id);
        });
    });
    
    // Update totals
    const deliveryFee = 50.00;
    const total = subtotal + deliveryFee;
    
    subtotalEl.textContent = `${subtotal.toFixed(2)} ETB`;
    totalEl.textContent = `${total.toFixed(2)} ETB`;
}

function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        localStorage.removeItem('cart');
        updateCartCount();
        renderCart();
        showNotification('Cart cleared!');
    }
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Check prescription requirement
    const hasPrescriptionItems = cart.some(item => item.prescription);
    
    if (hasPrescriptionItems) {
        const hasPrescription = confirm('Your cart contains prescription medicines. Have you uploaded a prescription?');
        if (!hasPrescription) {
            alert('Please upload your prescription before checkout.');
            return;
        }
    }
    
    // Get selected payment method
    const selectedPayment = document.querySelector('.payment-icon.active');
    if (!selectedPayment) {
        alert('Please select a payment method.');
        return;
    }
    
    const paymentMethod = selectedPayment.getAttribute('data-method');
    const total = parseFloat(document.getElementById('total').textContent);
    
    // Simulate payment process
    alert(`Processing payment of ${total.toFixed(2)} ETB via ${paymentMethod.toUpperCase()}...\nOrder placed successfully!`);
    
    // Clear cart after successful order
    clearCart();
}

// Prescription Upload
function initPrescriptionUpload() {
    const uploadBtn = document.getElementById('upload-btn');
    const fileInput = document.getElementById('prescription-file');
    const fileName = document.getElementById('file-name');
    const submitBtn = document.getElementById('submit-prescription');
    
    uploadBtn.addEventListener('click', () => {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            fileName.textContent = file.name;
        } else {
            fileName.textContent = 'No file chosen';
        }
    });
    
    submitBtn.addEventListener('click', () => {
        if (fileInput.files.length === 0) {
            alert('Please select a prescription file first.');
            return;
        }
        
        // Simulate prescription upload and verification
        alert('Prescription uploaded successfully! Our pharmacists will verify it within 30 minutes.');
        fileInput.value = '';
        fileName.textContent = 'No file chosen';
    });
}

// AI Search
function initAISearch() {
    const aiSearchBtn = document.getElementById('ai-search-btn');
    const aiSearchInput = document.getElementById('ai-search');
    const aiResults = document.getElementById('ai-results');
    
    aiSearchBtn.addEventListener('click', performAISearch);
    aiSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performAISearch();
        }
    });
    
    function performAISearch() {
        const query = aiSearchInput.value.trim();
        if (!query) {
            alert('Please enter a medicine name to search.');
            return;
        }
        
        // Show loading state
        aiResults.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Searching across pharmacies...</div>';
        
        // Simulate AI search with delay
        setTimeout(() => {
            const mockResults = [
                {
                    pharmacy: 'MediCare Main',
                    distance: '1.2 km',
                    price: 45.50,
                    availability: 'In Stock',
                    rating: '4.8'
                },
                {
                    pharmacy: 'City Pharmacy',
                    distance: '0.8 km',
                    price: 48.75,
                    availability: 'In Stock',
                    rating: '4.5'
                },
                {
                    pharmacy: 'Health Plus',
                    distance: '2.1 km',
                    price: 42.90,
                    availability: 'Low Stock',
                    rating: '4.7'
                },
                {
                    pharmacy: 'PharmaDirect',
                    distance: '3.5 km',
                    price: 41.25,
                    availability: 'In Stock',
                    rating: '4.3'
                }
            ];
            
            displayAIResults(query, mockResults);
        }, 1500);
    }
    
    function displayAIResults(query, results) {
        let html = `<h3>AI Results for "${query}"</h3>`;
        
        results.forEach((result, index) => {
            const isBest = index === results.length - 1; // Last one is best price
            html += `
                <div class="ai-result-item ${isBest ? 'best-choice' : ''}">
                    <div class="ai-result-header">
                        <h4>${result.pharmacy}</h4>
                        ${isBest ? '<span class="best-badge"><i class="fas fa-crown"></i> Best Price</span>' : ''}
                    </div>
                    <div class="ai-result-details">
                        <span><i class="fas fa-map-marker-alt"></i> ${result.distance}</span>
                        <span><i class="fas fa-tag"></i> ${result.price.toFixed(2)} ETB</span>
                        <span><i class="fas fa-box"></i> ${result.availability}</span>
                        <span><i class="fas fa-star"></i> ${result.rating}</span>
                    </div>
                    ${isBest ? `<button class="ai-add-cart" data-price="${result.price}" data-pharmacy="${result.pharmacy}">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>` : ''}
                </div>
            `;
        });
        
        aiResults.innerHTML = html;
        
        // Add event listener for add to cart button
        document.querySelector('.ai-add-cart')?.addEventListener('click', function() {
            const price = parseFloat(this.getAttribute('data-price'));
            const pharmacy = this.getAttribute('data-pharmacy');
            
            const aiMedicine = {
                id: Date.now(),
                name: query,
                description: 'AI recommended medicine',
                price: price,
                pharmacy: pharmacy,
                distance: 'AI Optimized',
                prescription: false,
                image: 'fa-robot'
            };
            
            addToCart(aiMedicine);
        });
    }
}

// Payment Methods Selection
function initPaymentMethods() {
    const paymentIcons = document.querySelectorAll('.payment-icon');
    
    paymentIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            paymentIcons.forEach(i => i.classList.remove('active'));
            icon.classList.add('active');
        });
    });
}

// Chat System
function initChat() {
    const chatToggle = document.getElementById('chat-toggle');
    const chatBox = document.getElementById('chat-box');
    const closeChat = document.querySelector('.close-chat');
    const sendChatBtn = document.getElementById('send-chat');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    
    chatToggle.addEventListener('click', () => {
        chatBox.classList.toggle('active');
    });
    
    closeChat.addEventListener('click', () => {
        chatBox.classList.remove('active');
    });
    
    sendChatBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message
        addMessage(message, 'sent');
        chatInput.value = '';
        
        // Simulate bot response after delay
        setTimeout(() => {
            const responses = [
                "Thank you for your message. Our pharmacist will respond shortly.",
                "For prescription inquiries, please upload your prescription in the prescription section.",
                "Delivery usually takes 2-4 hours depending on your location.",
                "You can track your order in the 'Track Order' section.",
                "All our medicines are sourced from licensed pharmacies and are 100% genuine."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessage(randomResponse, 'received');
        }, 1000);
    }
    
    function addMessage(text, type) {
        const now = new Date();
        const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `
            <p>${text}</p>
            <span class="time">${time}</span>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Utility Functions
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius);
        z-index: 3000;
        animation: slideIn 0.3s ease;
        box-shadow: var(--shadow);
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .loading {
        text-align: center;
        padding: 2rem;
        color: var(--gray);
    }
    
    .ai-result-item {
        background: white;
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: var(--radius);
        box-shadow: var(--shadow);
    }
    
    .ai-result-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }
    
    .best-badge {
        background: var(--warning);
        color: var(--dark);
        padding: 0.3rem 0.8rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    
    .ai-result-details {
        display: flex;
        justify-content: space-between;
        font-size: 0.9rem;
        color: var(--gray);
        margin-bottom: 1rem;
    }
    
    .best-choice {
        border: 2px solid var(--primary);
    }
    
    .ai-add-cart {
        width: 100%;
        padding: 0.8rem;
        background: var(--primary);
        color: white;
        border: none;
        border-radius: var(--radius);
        cursor: pointer;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
    }
    
    .ai-add-cart:hover {
        background: var(--primary-dark);
    }
`;
document.head.appendChild(style);

// Search functionality
document.querySelector('.search-btn').addEventListener('click', performSearch);
document.getElementById('medicine-search').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

function performSearch() {
    const searchTerm = document.getElementById('medicine-search').value.trim().toLowerCase();
    const location = document.getElementById('location-select').value;
    
    if (!searchTerm) {
        alert('Please enter a search term');
        return;
    }
    
    // Filter medicines based on search
    const filtered = medicines.filter(medicine => 
        medicine.name.toLowerCase().includes(searchTerm) ||
        medicine.description.toLowerCase().includes(searchTerm) ||
        medicine.category.toLowerCase().includes(searchTerm)
    );
    
    if (filtered.length === 0) {
        alert('No medicines found. Try our AI search feature!');
        return;
    }
    
    // Display filtered results
    const medicineList = document.getElementById('medicine-list');
    medicineList.innerHTML = '';
    filtered.forEach(medicine => {
        const medicineCard = createMedicineCard(medicine);
        medicineList.appendChild(medicineCard);
    });
    
    showNotification(`Found ${filtered.length} medicine(s)`);
}

// Compare medicine function
function compareMedicine(medicine) {
    // In a real app, this would open a comparison modal
    showNotification(`Added ${medicine.name} to comparison list`);
    
    // Store comparison items
    const comparisons = JSON.parse(localStorage.getItem('comparisons')) || [];
    comparisons.push(medicine);
    localStorage.setItem('comparisons', JSON.stringify(comparisons));
}

// Location selector change
document.getElementById('location-select').addEventListener('change', function() {
    if (this.value) {
        showNotification(`Location set to: ${this.options[this.selectedIndex].text}`);
    }
});

// Simulate real-time features
function simulateRealTimeUpdates() {
    // Update medicine availability randomly
    setInterval(() => {
        const randomIndex = Math.floor(Math.random() * medicines.length);
        const medicine = medicines[randomIndex];
        showNotification(`Update: ${medicine.name} stock updated at ${medicine.pharmacy}`);
    }, 30000); // Every 30 seconds
}

// Start real-time updates
simulateRealTimeUpdates();

// Initialize with all medicines
loadMedicines();      
// Backend API Configuration
const API_BASE_URL = 'http://localhost/medicare-backend/api';
let currentUser = null;
let authToken = null;

// Initialize with backend integration
document.addEventListener('DOMContentLoaded', function() {
    initBackend();
    initNavigation();
    initModals();
    initCart();
    initChat();
    initPrescriptionUpload();
    initAISearch();
    initPaymentMethods();
    
    // Check if user is logged in
    checkAuthStatus();
    
    // Load medicines from backend
    loadMedicinesFromBackend();
});

// Backend initialization
function initBackend() {
    // Load user from localStorage
    const savedUser = localStorage.getItem('medicare_user');
    const savedToken = localStorage.getItem('medicare_token');
    
    if (savedUser && savedToken) {
        try {
            currentUser = JSON.parse(savedUser);
            authToken = savedToken;
            updateUIForLoggedInUser();
        } catch (e) {
            console.error('Error parsing saved user:', e);
            clearAuthData();
        }
    }
}

// Check authentication status
function checkAuthStatus() {
    if (!currentUser) return;
    
    // Verify token by making a simple API call
    fetch(`${API_BASE_URL}/users/profile.php`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'User-Id': currentUser.id
        }
    })
    .then(response => {
        if (!response.ok) {
            // Token expired or invalid
            clearAuthData();
            showNotification('Session expired. Please login again.');
        }
    })
    .catch(() => {
        clearAuthData();
    });
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
    if (!currentUser) return;
    
    // Update account button
    const accountBtn = document.querySelector('.account-btn');
    if (accountBtn) {
        accountBtn.innerHTML = `<i class="fas fa-user-circle"></i> ${currentUser.full_name}`;
    }
    
    // Load user's cart from backend
    loadCartFromBackend();
    
    // Load user's prescriptions
    loadUserPrescriptions();
}

// Clear authentication data
function clearAuthData() {
    localStorage.removeItem('medicare_user');
    localStorage.removeItem('medicare_token');
    currentUser = null;
    authToken = null;
    
    // Update UI
    const accountBtn = document.querySelector('.account-btn');
    if (accountBtn) {
        accountBtn.innerHTML = '<i class="fas fa-user-circle"></i> Account';
    }
}

// Updated login function
async function handleLogin(e) {
    e.preventDefault();
    const identifier = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                identifier: identifier,
                password: password
            })
        });

        const data = await response.json();
        
        if (data.success) {
            // Save user data and token
            currentUser = data.user;
            authToken = data.token;
            
            localStorage.setItem('medicare_user', JSON.stringify(currentUser));
            localStorage.setItem('medicare_token', authToken);
            
            // Update UI
            updateUIForLoggedInUser();
            
            // Close modal and reset form
            document.getElementById('login-modal').classList.remove('active');
            document.getElementById('login-form').reset();
            
            showNotification('Login successful!');
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Network error. Please try again.');
    }
}

// Updated registration function
async function handleRegister(e) {
    e.preventDefault();
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                full_name: fullname,
                email: email,
                phone: phone,
                password: password
            })
        });

        const data = await response.json();
        
        if (data.success) {
            // Auto-login after registration
            currentUser = data.user;
            authToken = data.token;
            
            localStorage.setItem('medicare_user', JSON.stringify(currentUser));
            localStorage.setItem('medicare_token', authToken);
            
            // Update UI
            updateUIForLoggedInUser();
            
            // Switch to login modal
            document.getElementById('register-modal').classList.remove('active');
            document.getElementById('register-form').reset();
            
            showNotification('Registration successful! Welcome to MediCare Pharmacy.');
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('Network error. Please try again.');
    }
}

// Load medicines from backend
async function loadMedicinesFromBackend(filter = 'all') {
    try {
        const response = await fetch(`${API_BASE_URL}/medicines/search.php?keyword=&limit=20`);
        const data = await response.json();
        
        if (data.success) {
            displayMedicinesFromBackend(data.data, filter);
        } else {
            console.error('Error loading medicines:', data.message);
            // Fallback to local data
            loadMedicines(filter);
        }
    } catch (error) {
        console.error('Network error:', error);
        // Fallback to local data
        loadMedicines(filter);
    }
}

// Display medicines from backend
function displayMedicinesFromBackend(medicines, filter) {
    const medicineList = document.getElementById('medicine-list');
    medicineList.innerHTML = '';

    // Apply local filters
    let filteredMedicines = [...medicines];

    if (filter === 'low-price') {
        filteredMedicines.sort((a, b) => a.price - b.price);
    } else if (filter === 'nearby') {
        filteredMedicines.sort((a, b) => {
            const distA = parseFloat(a.distance);
            const distB = parseFloat(b.distance);
            return distA - distB;
        });
    } else if (filter === 'prescription') {
        filteredMedicines = filteredMedicines.filter(m => m.requires_prescription);
    }

    filteredMedicines.forEach(medicine => {
        const medicineCard = createMedicineCardFromBackend(medicine);
        medicineList.appendChild(medicineCard);
    });
}

// Create medicine card from backend data
function createMedicineCardFromBackend(medicine) {
    const card = document.createElement('div');
    card.className = 'medicine-card';
    
    const finalPrice = medicine.discount_price || medicine.price;
    const hasDiscount = medicine.discount_price !== null;
    
    card.innerHTML = `
        <div class="medicine-image">
            <i class="fas ${medicine.image_url || 'fa-capsules'}"></i>
            ${hasDiscount ? '<span class="discount-badge">Sale</span>' : ''}
        </div>
        <div class="medicine-info">
            <h3 class="medicine-name">${medicine.name}</h3>
            <p class="medicine-desc">${medicine.description || ''}</p>
            <div class="pharmacy-info">
                <span class="pharmacy-name">${medicine.pharmacy_name}</span>
                <span class="pharmacy-distance"><i class="fas fa-map-marker-alt"></i> ${medicine.distance}</span>
            </div>
            <div class="medicine-price">
                ${hasDiscount ? `<span class="original-price">${medicine.price} ETB</span>` : ''}
                <span class="final-price">${finalPrice} ETB</span>
            </div>
            <div class="stock-info">
                <span class="stock-status ${medicine.stock_quantity > 10 ? 'in-stock' : 'low-stock'}">
                    <i class="fas ${medicine.stock_quantity > 10 ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
                    ${medicine.stock_quantity > 10 ? 'In Stock' : 'Low Stock'}
                </span>
                <span class="requires-prescription ${medicine.requires_prescription ? 'required' : ''}">
                    <i class="fas fa-file-prescription"></i>
                    ${medicine.requires_prescription ? 'Prescription' : 'OTC'}
                </span>
            </div>
            <div class="medicine-actions">
                <button class="btn-add-cart" data-id="${medicine.id}" data-pharmacy="${medicine.pharmacy_id}">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
                <button class="btn-compare" data-id="${medicine.id}">
                    <i class="fas fa-balance-scale"></i> Compare
                </button>
            </div>
        </div>
    `;

    // Add event listeners
    const addToCartBtn = card.querySelector('.btn-add-cart');
    addToCartBtn.addEventListener('click', () => addToCartFromBackend(medicine));

    const compareBtn = card.querySelector('.btn-compare');
    compareBtn.addEventListener('click', () => compareMedicine(medicine));

    return card;
}

// Add to cart with backend integration
async function addToCartFromBackend(medicine) {
    if (!currentUser) {
        alert('Please login to add items to cart');
        document.getElementById('login-modal').classList.add('active');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/cart/add.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
                'User-Id': currentUser.id
            },
            body: JSON.stringify({
                user_id: currentUser.id,
                medicine_id: medicine.id,
                pharmacy_id: medicine.pharmacy_id,
                quantity: 1
            })
        });

        const data = await response.json();
        
        if (data.success) {
            showNotification(`${medicine.name} added to cart!`);
            // Refresh cart from backend
            loadCartFromBackend();
        } else {
            alert(data.message || 'Failed to add to cart');
        }
    } catch (error) {
        console.error('Add to cart error:', error);
        alert('Network error. Please try again.');
    }
}

// Load cart from backend
async function loadCartFromBackend() {
    if (!currentUser) return;

    try {
        const response = await fetch(`${API_BASE_URL}/cart/get.php?user_id=${currentUser.id}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const data = await response.json();
        
        if (data.success) {
            displayCartFromBackend(data);
        }
    } catch (error) {
        console.error('Load cart error:', error);
    }
}

// Display cart from backend
function displayCartFromBackend(cartData) {
    const cartList = document.getElementById('cart-list');
    const emptyCart = document.getElementById('empty-cart');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    const cartCount = document.getElementById('cart-count');
    const cartItemsCount = document.getElementById('cart-items-count');
    
    if (!cartData.items || cartData.items.length === 0) {
        cartList.innerHTML = `
            <div class="empty-cart" id="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Add medicines to get started</p>
            </div>
        `;
        subtotalEl.textContent = '0.00 ETB';
        totalEl.textContent = '50.00 ETB';
        cartCount.textContent = '0';
        cartItemsCount.textContent = '0';
        return;
    }
    
    // Clear cart list
    cartList.innerHTML = '';
    
    cartData.items.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <i class="fas ${item.image_url || 'fa-capsules'}"></i>
            </div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>${item.pharmacy_name}</p>
                <div class="medicine-price">${item.final_price} ETB</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn minus" data-id="${item.item_id}">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn plus" data-id="${item.item_id}">+</button>
            </div>
            <button class="cart-item-remove" data-id="${item.item_id}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        cartList.appendChild(cartItem);
    });
    
    // Add event listeners
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', async () => {
            const itemId = btn.getAttribute('data-id');
            await updateCartItemQuantity(itemId, -1);
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', async () => {
            const itemId = btn.getAttribute('data-id');
            await updateCartItemQuantity(itemId, 1);
        });
    });
    
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', async () => {
            const itemId = btn.getAttribute('data-id');
            await removeCartItem(itemId);
        });
    });
    
    // Update totals
    const summary = cartData.summary;
    subtotalEl.textContent = `${summary.subtotal.toFixed(2)} ETB`;
    totalEl.textContent = `${summary.total.toFixed(2)} ETB`;
    cartCount.textContent = summary.item_count;
    cartItemsCount.textContent = summary.item_count;
}

// Update cart item quantity
async function updateCartItemQuantity(itemId, change) {
    if (!currentUser) return;

    try {
        // First get current quantity
        const response = await fetch(`${API_BASE_URL}/cart/get.php?user_id=${currentUser.id}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const cartData = await response.json();
        
        if (cartData.success) {
            const item = cartData.items.find(i => i.item_id == itemId);
            if (item) {
                const newQuantity = item.quantity + change;
                
                const updateResponse = await fetch(`${API_BASE_URL}/cart/update.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    body: JSON.stringify({
                        user_id: currentUser.id,
                        item_id: itemId,
                        quantity: newQuantity
                    })
                });
                
                const updateData = await updateResponse.json();
                
                if (updateData.success) {
                    loadCartFromBackend();
                    showNotification('Cart updated');
                } else {
                    alert(updateData.message || 'Failed to update quantity');
                }
            }
        }
    } catch (error) {
        console.error('Update quantity error:', error);
        alert('Network error. Please try again.');
    }
}

// Remove cart item
async function removeCartItem(itemId) {
    if (!currentUser) return;

    try {
        const response = await fetch(`${API_BASE_URL}/cart/remove.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                user_id: currentUser.id,
                item_id: itemId
            })
        });

        const data = await response.json();
        
        if (data.success) {
            loadCartFromBackend();
            showNotification('Item removed from cart');
        } else {
            alert(data.message || 'Failed to remove item');
        }
    } catch (error) {
        console.error('Remove item error:', error);
        alert('Network error. Please try again.');
    }
}

// Updated prescription upload
async function uploadPrescriptionToBackend(file) {
    if (!currentUser) {
        alert('Please login to upload prescription');
        document.getElementById('login-modal').classList.add('active');
        return;
    }

    const formData = new FormData();
    formData.append('prescription', file);
    formData.append('user_id', currentUser.id);
    
    // Optional fields
    const doctorName = prompt('Enter doctor name (optional):');
    const hospitalName = prompt('Enter hospital name (optional):');
    
    if (doctorName) formData.append('doctor_name', doctorName);
    if (hospitalName) formData.append('hospital_name', hospitalName);

    try {
        const response = await fetch(`${API_BASE_URL}/prescriptions/upload.php`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        
        if (data.success) {
            showNotification('Prescription uploaded successfully! It will be verified within 30 minutes.');
            return true;
        } else {
            alert(data.message || 'Upload failed');
            return false;
        }
    } catch (error) {
        console.error('Upload error:', error);
        alert('Network error. Please try again.');
        return false;
    }
}

// Updated AI search
async function performAISearchBackend(query) {
    if (!query) {
        alert('Please enter a medicine name to search.');
        return;
    }

    const aiResults = document.getElementById('ai-results');
    aiResults.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Searching across pharmacies...</div>';

    try {
        const params = new URLSearchParams({
            keyword: query,
            city: document.getElementById('location-select').value || '',
            user_id: currentUser ? currentUser.id : ''
        });

        const response = await fetch(`${API_BASE_URL}/medicines/ai-search.php?${params}`);
        const data = await response.json();
        
        if (data.success) {
            displayAIResultsBackend(query, data.data);
        } else {
            aiResults.innerHTML = `<p class="error">${data.message || 'Search failed'}</p>`;
        }
    } catch (error) {
        console.error('AI search error:', error);
        aiResults.innerHTML = '<p class="error">Network error. Please try again.</p>';
    }
}

// Display AI results from backend
function displayAIResultsBackend(query, results) {
    const aiResults = document.getElementById('ai-results');
    
    if (!results || results.length === 0) {
        aiResults.innerHTML = `<h3>No results found for "${query}"</h3>`;
        return;
    }

    let html = `<h3>AI Results for "${query}"</h3>`;
    
    // Find best price
    const bestPrice = Math.min(...results.map(r => r.discount_price || r.price));
    
    results.forEach((result, index) => {
        const finalPrice = result.discount_price || result.price;
        const isBest = finalPrice === bestPrice;
        
        html += `
            <div class="ai-result-item ${isBest ? 'best-choice' : ''}">
                <div class="ai-result-header">
                    <h4>${result.name} - ${result.pharmacy_name}</h4>
                    ${isBest ? '<span class="best-badge"><i class="fas fa-crown"></i> Best Price</span>' : ''}
                </div>
                <div class="ai-result-details">
                    <span><i class="fas fa-map-marker-alt"></i> ${result.city}</span>
                    <span><i class="fas fa-tag"></i> ${finalPrice.toFixed(2)} ETB</span>
                    <span><i class="fas fa-box"></i> ${result.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}</span>
                    <span><i class="fas fa-star"></i> ${result.rating || 'N/A'}</span>
                </div>
                ${result.stock_quantity > 0 ? `
                    <button class="ai-add-cart" data-id="${result.id}" data-pharmacy="${result.pharmacy_id}">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                ` : '<button class="ai-add-cart disabled" disabled>Out of Stock</button>'}
            </div>
        `;
    });
    
    aiResults.innerHTML = html;
    
    // Add event listeners for add to cart buttons
    document.querySelectorAll('.ai-add-cart:not(.disabled)').forEach(btn => {
        btn.addEventListener('click', function() {
            const medicineId = this.getAttribute('data-id');
            const pharmacyId = this.getAttribute('data-pharmacy');
            const medicine = results.find(r => r.id == medicineId && r.pharmacy_id == pharmacyId);
            
            if (medicine) {
                addToCartFromBackend(medicine);
            }
        });
    });
}

// Updated checkout function
async function checkoutBackend() {
    if (!currentUser) {
        alert('Please login to checkout');
        document.getElementById('login-modal').classList.add('active');
        return;
    }

    // Check prescription requirement
    const hasPrescriptionItems = await checkPrescriptionRequirements();
    if (hasPrescriptionItems) {
        const hasValidPrescription = await checkUserPrescriptions();
        if (!hasValidPrescription) {
            alert('Your cart contains prescription medicines. Please upload a valid prescription first.');
            return;
        }
    }

    // Get selected payment method
    const selectedPayment = document.querySelector('.payment-icon.active');
    if (!selectedPayment) {
        alert('Please select a payment method.');
        return;
    }

    const paymentMethod = selectedPayment.getAttribute('data-method');
    
    try {
        // Create order
        const response = await fetch(`${API_BASE_URL}/orders/create.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                user_id: currentUser.id,
                payment_method: paymentMethod,
                delivery_address: currentUser.address || prompt('Please enter delivery address:'),
                delivery_city: currentUser.city || document.getElementById('location-select').value
            })
        });

        const data = await response.json();
        
        if (data.success) {
            showNotification(`Order #${data.order_number} placed successfully!`);
            // Clear cart
            await clearCartBackend();
        } else {
            alert(data.message || 'Checkout failed');
        }
    } catch (error) {
        console.error('Checkout error:', error);
        alert('Network error. Please try again.');
    }
}

// Check prescription requirements
async function checkPrescriptionRequirements() {
    try {
        const response = await fetch(`${API_BASE_URL}/cart/get.php?user_id=${currentUser.id}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const cartData = await response.json();
        
        if (cartData.success) {
            return cartData.items.some(item => item.requires_prescription);
        }
        return false;
    } catch (error) {
        console.error('Check prescription error:', error);
        return false;
    }
}

// Check user prescriptions
async function checkUserPrescriptions() {
    try {
        const response = await fetch(`${API_BASE_URL}/prescriptions/list.php?user_id=${currentUser.id}&status=verified`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
            // Check if any prescription is still valid (not expired)
            const now = new Date();
            const validPrescription = data.data.find(p => new Date(p.expiry_date) > now);
            return !!validPrescription;
        }
        return false;
    } catch (error) {
        console.error('Check prescriptions error:', error);
        return false;
    }
}

// Clear cart on backend
async function clearCartBackend() {
    if (!currentUser) return;

    try {
        const response = await fetch(`${API_BASE_URL}/cart/clear.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                user_id: currentUser.id
            })
        });

        const data = await response.json();
        
        if (data.success) {
            loadCartFromBackend();
        }
    } catch (error) {
        console.error('Clear cart error:', error);
    }
}

// Load user prescriptions
async function loadUserPrescriptions() {
    if (!currentUser) return;

    try {
        const response = await fetch(`${API_BASE_URL}/prescriptions/list.php?user_id=${currentUser.id}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const data = await response.json();
        
        if (data.success) {
            // You can display prescriptions in a dropdown or modal
            console.log('User prescriptions:', data.data);
        }
    } catch (error) {
        console.error('Load prescriptions error:', error);
    }
}

// Update your existing functions to use backend
function initPrescriptionUpload() {
    const uploadBtn = document.getElementById('upload-btn');
    const fileInput = document.getElementById('prescription-file');
    const fileName = document.getElementById('file-name');
    const submitBtn = document.getElementById('submit-prescription');
    
    uploadBtn.addEventListener('click', () => {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            fileName.textContent = file.name;
        } else {
            fileName.textContent = 'No file chosen';
        }
    });
    
    submitBtn.addEventListener('click', async () => {
        if (fileInput.files.length === 0) {
            alert('Please select a prescription file first.');
            return;
        }
        
        const success = await uploadPrescriptionToBackend(fileInput.files[0]);
        if (success) {
            fileInput.value = '';
            fileName.textContent = 'No file chosen';
        }
    });
}

function initAISearch() {
    const aiSearchBtn = document.getElementById('ai-search-btn');
    const aiSearchInput = document.getElementById('ai-search');
    const aiResults = document.getElementById('ai-results');
    
    aiSearchBtn.addEventListener('click', () => performAISearchBackend(aiSearchInput.value.trim()));
    aiSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performAISearchBackend(aiSearchInput.value.trim());
        }
    });
}

// Update modal form submissions
function initModals() {
    // ... existing modal initialization code ...
    
    // Update form submissions
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
}

// Update cart initialization
function initCart() {
    if (currentUser) {
        loadCartFromBackend();
    } else {
        // Use local cart
        updateCartCount();
        renderCart();
    }
    
    // Clear cart button
    document.getElementById('clear-cart').addEventListener('click', async () => {
        if (currentUser) {
            if (confirm('Are you sure you want to clear your cart?')) {
                await clearCartBackend();
                showNotification('Cart cleared!');
            }
        } else {
            clearCart();
        }
    });
    
    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', async () => {
        if (currentUser) {
            await checkoutBackend();
        } else {
            checkout();
        }
    });
}

// Add these CSS styles to your style.css
const backendStyles = `
.discount-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background: var(--accent);
    color: white;
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 600;
}

.original-price {
    text-decoration: line-through;
    color: var(--gray);
    font-size: 1rem;
    margin-right: 0.5rem;
}

.final-price {
    color: var(--primary);
    font-size: 1.5rem;
    font-weight: 700;
}

.stock-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    font-size: 0.9rem;
}

.stock-status.in-stock {
    color: var(--success);
}

.stock-status.low-stock {
    color: var(--warning);
}

.requires-prescription {
    color: var(--gray);
}

.requires-prescription.required {
    color: var(--accent);
}

.ai-result-item .disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.error {
    color: var(--danger);
    text-align: center;
    padding: 2rem;
}
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.textContent = backendStyles;
document.head.appendChild(styleSheet);