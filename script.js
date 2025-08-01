// Global Variables
let cart = [];
let currentStep = 'menu';
let studentInfo = {
    name: '',
    rollNumber: '',
    branch: '',
    phone: '',
    pickupSpot: 'A'
};
let isOrderingClosed = false;

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen after 2 seconds
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        showSection('menu-section');
    }, 2000);
    
    // Check ordering time
    checkOrderingTime();
    setInterval(checkOrderingTime, 60000); // Update every minute
    
    // Initialize form validation
    setupFormValidation();
});

// Time Management
function checkOrderingTime() {
    const now = new Date();
    const cutoffTime = new Date();
    cutoffTime.setHours(7, 25, 0, 0);
    
    const timeStatus = document.getElementById('time-status');
    const timeRemaining = document.getElementById('time-remaining');
    
    if (now > cutoffTime) {
        isOrderingClosed = true;
        timeStatus.className = 'time-status closed';
        timeRemaining.textContent = 'Ordering closed for today';
        disableOrdering();
    } else {
        const timeDiff = cutoffTime.getTime() - now.getTime();
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (hours === 0 && minutes <= 30) {
            timeStatus.className = 'time-status warning';
            timeRemaining.textContent = `⚠️ Only ${minutes}m remaining to order!`;
        } else {
            timeStatus.className = 'time-status open';
            timeRemaining.textContent = `${hours}h ${minutes}m remaining to order`;
        }
    }
}

function disableOrdering() {
    const addButtons = document.querySelectorAll('.add-btn');
    addButtons.forEach(btn => {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-times"></i>';
    });
    
    const proceedBtn = document.getElementById('proceed-btn');
    if (proceedBtn) {
        proceedBtn.disabled = true;
        proceedBtn.innerHTML = '<i class="fas fa-clock"></i> Ordering Closed';
    }
}

// Section Management
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.classList.add('fade-in');
    }
    
    // Update current step
    currentStep = sectionId.replace('-section', '');
}

// Cart Management
function addToCart(id, name, price) {
    if (isOrderingClosed) {
        alert('Sorry, ordering is closed for today. Please try again tomorrow before 7:25 AM.');
        return;
    }
    
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    showCartSummary();
    
    // Add visual feedback
    const button = event.target.closest('.add-btn');
    button.style.transform = 'scale(1.2)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 200);
}

function updateQuantity(id, newQuantity) {
    if (newQuantity === 0) {
        cart = cart.filter(item => item.id !== id);
    } else {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity = newQuantity;
        }
    }
    
    updateCartDisplay();
    
    if (cart.length === 0) {
        hideCartSummary();
    }
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const formCartItemsContainer = document.getElementById('form-cart-items');
    const cartTotal = document.getElementById('cart-total');
    const formTotal = document.getElementById('form-total');
    
    let cartHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        cartHTML += `
            <div class="cart-item">
                <span class="item-name">${item.name}</span>
                <div class="quantity-controls">
                    <button class="qty-btn minus" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="qty-btn plus" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                </div>
                <span class="item-total">₹${itemTotal}</span>
            </div>
        `;
    });
    
    if (cartItemsContainer) cartItemsContainer.innerHTML = cartHTML;
    if (formCartItemsContainer) formCartItemsContainer.innerHTML = cartHTML;
    if (cartTotal) cartTotal.textContent = total;
    if (formTotal) formTotal.textContent = total;
    
    // Update payment amounts
    const paymentTotal = document.getElementById('payment-total');
    const payAmount = document.getElementById('pay-amount');
    if (paymentTotal) paymentTotal.textContent = total;
    if (payAmount) payAmount.textContent = total;
}

function showCartSummary() {
    const cartSummary = document.getElementById('cart-summary');
    if (cartSummary) {
        cartSummary.style.display = 'block';
        cartSummary.classList.add('slide-in');
    }
}

function hideCartSummary() {
    const cartSummary = document.getElementById('cart-summary');
    if (cartSummary) {
        cartSummary.style.display = 'none';
    }
}

// Navigation Functions
function showOrderForm() {
    if (cart.length === 0) {
        alert('Please add items to your cart first!');
        return;
    }
    
    updateCartDisplay();
    showSection('order-section');
}

function showMenuSection() {
    showSection('menu-section');
}

function proceedToPayment() {
    if (!validateForm()) {
        return;
    }
    
    // Update payment summary
    document.getElementById('payment-name').textContent = studentInfo.name;
    document.getElementById('payment-pickup').textContent = studentInfo.pickupSpot;
    
    showSection('payment-section');
}

// Form Management
function setupFormValidation() {
    const form = document.getElementById('order-form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', validateFormField);
        input.addEventListener('blur', validateFormField);
    });
}

function validateFormField(event) {
    const field = event.target;
    const value = field.value.trim();
    
    // Remove existing error styling
    field.classList.remove('error');
    
    // Basic validation
    if (field.hasAttribute('required') && !value) {
        field.classList.add('error');
        return false;
    }
    
    // Phone validation
    if (field.type === 'tel' && value && !/^\d{10}$/.test(value)) {
        field.classList.add('error');
        return false;
    }
    
    return true;
}

function validateForm() {
    const name = document.getElementById('student-name').value.trim();
    const rollNumber = document.getElementById('roll-number').value.trim();
    const branch = document.getElementById('branch').value;
    const phone = document.getElementById('phone').value.trim();
    
    if (!name || !rollNumber || !branch || !phone) {
        alert('Please fill in all required fields.');
        return false;
    }
    
    if (!/^\d{10}$/.test(phone)) {
        alert('Please enter a valid 10-digit phone number.');
        return false;
    }
    
    if (cart.length === 0) {
        alert('Please add items to your cart.');
        return false;
    }
    
    // Update student info
    studentInfo = {
        name: name,
        rollNumber: rollNumber,
        branch: branch,
        phone: phone,
        pickupSpot: studentInfo.pickupSpot
    };
    
    return true;
}

// Pickup Spot Management
function assignPickupSpot() {
    const branch = document.getElementById('branch').value;
    let assignedSpot = 'A';
    
    // Auto-assign based on branch
    if (branch.includes('Computer Science') || branch.includes('Information Technology')) {
        assignedSpot = 'A';
    } else {
        assignedSpot = 'B';
    }
    
    selectPickupSpot(assignedSpot);
}

function selectPickupSpot(spot) {
    studentInfo.pickupSpot = spot;
    
    // Update UI
    const pickupButtons = document.querySelectorAll('.pickup-btn');
    pickupButtons.forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.spot === spot) {
            btn.classList.add('selected');
        }
    });
}

// Payment Processing
function processPayment() {
    if (!validateForm()) {
        return;
    }
    
    // Show loading state
    const payButton = event.target;
    const originalText = payButton.innerHTML;
    payButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    payButton.disabled = true;
    
    // Simulate payment processing
    setTimeout(() => {
        // In a real implementation, this would integrate with Razorpay
        // For now, we'll simulate a successful payment
        
        // Store order details
        const orderDetails = {
            studentInfo: studentInfo,
            cart: cart,
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            orderTime: new Date().toISOString(),
            paymentId: 'pay_' + Math.random().toString(36).substr(2, 9)
        };
        
        localStorage.setItem('lastOrder', JSON.stringify(orderDetails));
        
        showConfirmation();
        
        // Reset button
        payButton.innerHTML = originalText;
        payButton.disabled = false;
        
    }, 3000);
}

// Confirmation Display
function showConfirmation() {
    // Update confirmation details
    document.getElementById('conf-name').textContent = studentInfo.name;
    document.getElementById('conf-roll').textContent = studentInfo.rollNumber;
    document.getElementById('conf-branch').textContent = studentInfo.branch;
    document.getElementById('conf-phone').textContent = studentInfo.phone;
    document.getElementById('conf-pickup').textContent = studentInfo.pickupSpot;
    
    // Update order items
    const confItems = document.getElementById('conf-items');
    let itemsHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        itemsHTML += `
            <div class="cart-item">
                <span>${item.name} × ${item.quantity}</span>
                <span>₹${itemTotal}</span>
            </div>
        `;
    });
    
    confItems.innerHTML = itemsHTML;
    document.getElementById('conf-total').textContent = total;
    
    showSection('confirmation-section');
    
    // Add success animation
    const successIcon = document.querySelector('.success-icon');
    if (successIcon) {
        successIcon.classList.add('success-bounce');
    }
}

// Reset for New Order
function placeNewOrder() {
    // Reset all data
    cart = [];
    studentInfo = {
        name: '',
        rollNumber: '',
        branch: '',
        phone: '',
        pickupSpot: 'A'
    };
    
    // Clear form
    const form = document.getElementById('order-form');
    if (form) {
        form.reset();
    }
    
    // Clear pickup selection
    const pickupButtons = document.querySelectorAll('.pickup-btn');
    pickupButtons.forEach(btn => btn.classList.remove('selected'));
    
    // Hide cart summary
    hideCartSummary();
    
    // Return to menu
    showSection('menu-section');
}

// Utility Functions
function formatTime(date) {
    return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

function formatDate(date) {
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    // You could show a user-friendly error message here
});

// Add CSS for error styling
const style = document.createElement('style');
style.textContent = `
    .error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
`;
document.head.appendChild(style);