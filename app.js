// The Picnic Story - Boho Picnic Experience JavaScript

// Menu Data
const menuData = {
    foodList: [
        "Plain Omelette", "Cheese Burst Omelette", "Chicken Omelette", "Bread Omelette", "Egg Bhurji",
        "Aloo Paratha", "Aloo Pyaz Paratha", "Gobi Paratha", "Paneer Paratha", "Egg Paratha", "Chicken Paratha",
        "Garden Fresh Sandwich", "Cheese Corn Sandwich", "Paneer Tikka Sandwich", "Chicken Tikka Sandwich",
        "Plain Maggi", "Veg Maggi", "Egg & Cheese Maggi", "Cheese Maggi", "Chicken Maggi",
        "Salted Fries", "Peri Peri Fries", "Mix Fries", "Paneer Pakoda", "Bun Maska", "Masala Bun", "Malai Bun",
        "Anda Bun", "Aloo Bun", "Keema Bun", "Cheesy Crazy", "Chicken Chakna", "Peanut Masala", "Crispy Corn",
        "Loaded Nachos", "Chicken Nuggets", "Chicken Strips", "Chicken Popcorn", "Veg Hakka Noodles",
        "Chilli Garlic Noodles", "Egg Noodles", "Chicken Noodles", "Veg Fried Rice", "Egg Fried Rice",
        "Chicken Fried Rice", "Honey Chilli Potato", "Chilli Mushroom", "Chilli Paneer", "Veg Manchurian",
        "Chilli Chicken", "Crispy Chicken", "Chicken Manchurian", "Paneer Tikka", "Paneer Malai Tikka",
        "Mushroom Tikka", "Dahi Kebab", "Hara Bhara Kebab", "Tandoori Chicken", "Chicken Tikka",
        "Chicken Malai Tikka", "Chicken Seekh Kebab", "Paneer Butter Masala", "Kadhai Paneer", "Dal Makhni",
        "Dal Tadka", "Mix Veg", "Butter Chicken", "Kadhai Chicken", "Chicken Curry", "Roti", "Naan",
        "Garlic Naan", "Steamed Rice", "Jeera Rice"
    ],
    bevList: [
        "Ginger Tea", "Black Tea", "Masala Tea", "Elaichi Tea", "Green Tea", "Lemon Ginger Tea",
        "Hot Coffee", "Americano", "Cold Coffee", "Ice Tea", "Virgin Mojito", "Fresh Lime", "Lemonade",
        "Blue Lagoon", "Watermelon Mojito", "Watermelon Lemonade", "Oreo Shake", "KitKat Shake",
        "Chocolate Shake", "Sweet Lassi", "Salty Lassi", "Mineral Water", "Soda", "Mixers"
    ]
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    // Check which page we're on and initialize accordingly
    const urlParams = new URLSearchParams(window.location.search);
    const hasGuestParam = urlParams.has('guest');
    
    if (hasGuestParam) {
        initializeCustomerPage();
    } else {
        initializeLandingPage();
    }
    
    // Initialize common functionality
    initializeAnimations();
});

// Landing Page Functionality
function initializeLandingPage() {
    const form = document.getElementById('linkGeneratorForm');
    const linkResult = document.getElementById('linkResult');
    const generatedLink = document.getElementById('generatedLink');
    const copyBtn = document.getElementById('copyBtn');
    const createNewBtn = document.getElementById('createNewBtn');

    if (!form) return; // Exit if not on landing page

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();
        generateLink();
    });

    // Handle copy button
    if (copyBtn) {
        copyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            copyLink();
        });
    }

    // Handle create new button
    if (createNewBtn) {
        createNewBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            resetForm();
        });
    }

    // Add input validation and enhancements
    addInputEnhancements();
}

// Generate personalized link
function generateLink() {
    const guestNameInput = document.getElementById('guestName');
    const foodItemsInput = document.getElementById('foodItems');
    const bevItemsInput = document.getElementById('bevItems');
    
    if (!guestNameInput || !foodItemsInput || !bevItemsInput) {
        showNotification('Form elements not found', 'error');
        return;
    }
    
    const guestName = guestNameInput.value.trim();
    const foodItems = parseInt(foodItemsInput.value) || 0;
    const bevItems = parseInt(bevItemsInput.value) || 0;
    
    // Validation
    if (!guestName) {
        showNotification('Please enter a guest name', 'error');
        guestNameInput.focus();
        return;
    }
    
    if (foodItems < 1 || foodItems > 20) {
        showNotification('Food items must be between 1 and 20', 'error');
        foodItemsInput.focus();
        return;
    }
    
    if (bevItems < 0 || bevItems > 10) {
        showNotification('Beverage items must be between 0 and 10', 'error');
        bevItemsInput.focus();
        return;
    }

    // Create the customer URL
    const baseUrl = window.location.origin + window.location.pathname.replace('index.html', '');
    const customerUrl = `${baseUrl}index.html?guest=${encodeURIComponent(guestName)}&food=${foodItems}&bev=${bevItems}`;
    
    // Show the result with animation
    const linkResult = document.getElementById('linkResult');
    const generatedLinkInput = document.getElementById('generatedLink');
    
    if (linkResult && generatedLinkInput) {
        generatedLinkInput.value = customerUrl;
        linkResult.classList.remove('hidden');
        
        // Add entrance animation
        linkResult.style.opacity = '0';
        linkResult.style.transform = 'translateY(20px)';
        linkResult.style.transition = 'all 0.6s ease-out';
        
        setTimeout(() => {
            linkResult.style.opacity = '1';
            linkResult.style.transform = 'translateY(0)';
        }, 100);
        
        showNotification(`Link generated for ${guestName}!`, 'success');
    }
}

// Copy link to clipboard
function copyLink() {
    const generatedLinkInput = document.getElementById('generatedLink');
    const copyBtn = document.getElementById('copyBtn');
    
    if (!generatedLinkInput) return;
    
    try {
        generatedLinkInput.select();
        generatedLinkInput.setSelectionRange(0, 99999);
        
        const successful = document.execCommand('copy');
        
        if (successful && copyBtn) {
            // Update button text temporarily
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<span class="btn-icon">✅</span>Copied!';
            copyBtn.style.background = 'linear-gradient(135deg, #9CAF88, #B8C5A6)';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
                copyBtn.style.background = '';
            }, 2000);
            
            showNotification('Link copied to clipboard!', 'success');
        }
    } catch (err) {
        // Fallback for modern browsers
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(generatedLinkInput.value).then(() => {
                showNotification('Link copied to clipboard!', 'success');
            }).catch(() => {
                showNotification('Failed to copy link', 'error');
            });
        } else {
            showNotification('Failed to copy link', 'error');
        }
    }
}

// Reset form
function resetForm() {
    const form = document.getElementById('linkGeneratorForm');
    const linkResult = document.getElementById('linkResult');
    
    if (form) {
        form.reset();
        // Reset to default values
        const foodItemsInput = document.getElementById('foodItems');
        const bevItemsInput = document.getElementById('bevItems');
        if (foodItemsInput) foodItemsInput.value = '3';
        if (bevItemsInput) bevItemsInput.value = '2';
    }
    
    if (linkResult) {
        linkResult.classList.add('hidden');
    }
    
    // Add gentle animation
    if (form) {
        form.style.animation = 'gentleBounce 0.6s ease-out';
        setTimeout(() => {
            form.style.animation = '';
        }, 600);
    }
}

// Customer Page Functionality
function initializeCustomerPage() {
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('guest');
    const foodCount = parseInt(urlParams.get('food')) || 0;
    const bevCount = parseInt(urlParams.get('bev')) || 0;
    
    if (!guestName) {
        showErrorPage('Invalid link - missing guest information');
        return;
    }
    
    // Update the page content for customer view
    updatePageForCustomer();
    
    // Update welcome message
    updateWelcomeMessage(guestName, foodCount, bevCount);
    
    // Generate selectors
    generateFoodSelectors(foodCount);
    generateBeverageSelectors(bevCount);
    
    // Initialize order preview
    initializeOrderPreview();
    
    // Initialize confirm button
    initializeConfirmButton();
}

// Update page content for customer view
function updatePageForCustomer() {
    // Hide the form if it exists and show customer content
    const formWrapper = document.querySelector('.form-wrapper');
    const menuWrapper = document.querySelector('.menu-wrapper');
    
    if (formWrapper) {
        formWrapper.style.display = 'none';
    }
    
    // Create customer content if it doesn't exist
    if (!menuWrapper) {
        createCustomerContent();
    } else {
        menuWrapper.style.display = 'block';
    }
}

// Create customer content dynamically
function createCustomerContent() {
    const main = document.querySelector('.main .container');
    if (!main) return;
    
    const customerHTML = `
        <div class="menu-wrapper fade-in">
            <!-- Food Selection Section -->
            <div class="selection-section" id="foodSection">
                <div class="section-header">
                    <div class="section-icon">🍽️</div>
                    <h2 class="section-title">Food Selection</h2>
                    <p class="section-description">Choose your delicious food items</p>
                </div>
                <div class="selectors-grid" id="foodSelectors">
                    <!-- Food selectors will be dynamically generated -->
                </div>
            </div>

            <!-- Beverage Selection Section -->
            <div class="selection-section" id="beverageSection">
                <div class="section-header">
                    <div class="section-icon">🥤</div>
                    <h2 class="section-title">Beverage Selection</h2>
                    <p class="section-description">Pick your refreshing drinks</p>
                </div>
                <div class="selectors-grid" id="beverageSelectors">
                    <!-- Beverage selectors will be dynamically generated -->
                </div>
            </div>

            <!-- Order Preview -->
            <div class="preview-card" id="orderPreview">
                <div class="preview-header">
                    <h3 class="preview-title">🌸 Your Picnic Selection</h3>
                    <p class="preview-description">Here's what you've chosen for your boho picnic experience</p>
                </div>
                
                <div class="preview-content">
                    <div class="preview-section">
                        <h4 class="preview-subtitle">
                            <span class="preview-icon">🍽️</span>
                            Food Items
                        </h4>
                        <ul class="preview-list" id="foodPreview">
                            <li class="preview-placeholder">Select your food items above</li>
                        </ul>
                    </div>

                    <div class="preview-section" id="beveragePreviewSection">
                        <h4 class="preview-subtitle">
                            <span class="preview-icon">🥤</span>
                            Beverages
                        </h4>
                        <ul class="preview-list" id="beveragePreview">
                            <li class="preview-placeholder">Select your beverages above</li>
                        </ul>
                    </div>
                </div>

                <div class="preview-actions">
                    <button type="button" id="confirmOrderBtn" class="btn btn--primary" disabled>
                        <span class="btn-icon">✨</span>
                        Confirm Order
                    </button>
                </div>
            </div>
        </div>

        <!-- Thank You Modal -->
        <div class="modal hidden" id="thankYouModal">
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">🎉 Order Confirmed!</h2>
                    <button type="button" class="modal-close" id="modalCloseBtn">×</button>
                </div>
                <div class="modal-body">
                    <div class="thank-you-content">
                        <div class="thank-you-icon">🌸</div>
                        <p class="thank-you-message">Thank you for your order! Your boho picnic experience awaits.</p>
                        
                        <div class="order-summary">
                            <h3 class="summary-title">Order Summary</h3>
                            <div class="summary-content" id="orderSummary">
                                <!-- Order summary will be populated here -->
                            </div>
                        </div>
                        
                        <p class="thank-you-note">
                            We'll prepare everything with love for your perfect picnic experience! 
                            <em>Stay tuned for updates.</em>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    main.innerHTML = customerHTML;
}

// Update welcome message for customer
function updateWelcomeMessage(guestName, foodCount, bevCount) {
    const welcomeTitle = document.getElementById('welcomeTitle');
    const instructions = document.getElementById('instructions');
    
    if (welcomeTitle) {
        welcomeTitle.textContent = `Hi ${guestName}! Welcome to your boho picnic experience.`;
    }
    
    if (instructions) {
        let instructionText = `Please select ${foodCount} food item${foodCount !== 1 ? 's' : ''}`;
        if (bevCount > 0) {
            instructionText += ` and ${bevCount} beverage item${bevCount !== 1 ? 's' : ''}`;
        }
        instructionText += ' for your perfect picnic menu.';
        instructions.textContent = instructionText;
    }
}

// Generate food selectors
function generateFoodSelectors(count) {
    const foodSelectors = document.getElementById('foodSelectors');
    if (!foodSelectors || count <= 0) return;
    
    foodSelectors.innerHTML = '';
    
    for (let i = 1; i <= count; i++) {
        const selectorGroup = document.createElement('div');
        selectorGroup.className = 'selector-group';
        
        const label = document.createElement('label');
        label.className = 'selector-label';
        label.textContent = `Food Item ${i}`;
        label.setAttribute('for', `food-${i}`);
        
        const select = document.createElement('select');
        select.className = 'selector';
        select.id = `food-${i}`;
        select.name = `food-${i}`;
        
        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Choose a food item...';
        select.appendChild(defaultOption);
        
        // Add food options
        menuData.foodList.forEach(food => {
            const option = document.createElement('option');
            option.value = food;
            option.textContent = food;
            select.appendChild(option);
        });
        
        // Add change event listener
        select.addEventListener('change', updateOrderPreview);
        
        selectorGroup.appendChild(label);
        selectorGroup.appendChild(select);
        foodSelectors.appendChild(selectorGroup);
        
        // Add entrance animation
        selectorGroup.style.opacity = '0';
        selectorGroup.style.transform = 'translateY(20px)';
        setTimeout(() => {
            selectorGroup.style.transition = 'all 0.4s ease-out';
            selectorGroup.style.opacity = '1';
            selectorGroup.style.transform = 'translateY(0)';
        }, i * 100);
    }
}

// Generate beverage selectors
function generateBeverageSelectors(count) {
    const beverageSelectors = document.getElementById('beverageSelectors');
    const beverageSection = document.getElementById('beverageSection');
    const beveragePreviewSection = document.getElementById('beveragePreviewSection');
    
    if (!beverageSelectors) return;
    
    if (count <= 0) {
        if (beverageSection) beverageSection.style.display = 'none';
        if (beveragePreviewSection) beveragePreviewSection.style.display = 'none';
        return;
    }
    
    beverageSelectors.innerHTML = '';
    
    for (let i = 1; i <= count; i++) {
        const selectorGroup = document.createElement('div');
        selectorGroup.className = 'selector-group';
        
        const label = document.createElement('label');
        label.className = 'selector-label';
        label.textContent = `Beverage ${i}`;
        label.setAttribute('for', `beverage-${i}`);
        
        const select = document.createElement('select');
        select.className = 'selector';
        select.id = `beverage-${i}`;
        select.name = `beverage-${i}`;
        
        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Choose a beverage...';
        select.appendChild(defaultOption);
        
        // Add beverage options
        menuData.bevList.forEach(beverage => {
            const option = document.createElement('option');
            option.value = beverage;
            option.textContent = beverage;
            select.appendChild(option);
        });
        
        // Add change event listener
        select.addEventListener('change', updateOrderPreview);
        
        selectorGroup.appendChild(label);
        selectorGroup.appendChild(select);
        beverageSelectors.appendChild(selectorGroup);
        
        // Add entrance animation
        selectorGroup.style.opacity = '0';
        selectorGroup.style.transform = 'translateY(20px)';
        setTimeout(() => {
            selectorGroup.style.transition = 'all 0.4s ease-out';
            selectorGroup.style.opacity = '1';
            selectorGroup.style.transform = 'translateY(0)';
        }, (i + 10) * 100);
    }
}

// Initialize order preview
function initializeOrderPreview() {
    updateOrderPreview();
}

// Update order preview
function updateOrderPreview() {
    const foodPreview = document.getElementById('foodPreview');
    const beveragePreview = document.getElementById('beveragePreview');
    const confirmBtn = document.getElementById('confirmOrderBtn');
    
    if (!foodPreview || !beveragePreview) return;
    
    // Get all food selections
    const foodSelects = document.querySelectorAll('select[name^="food-"]');
    const beverageSelects = document.querySelectorAll('select[name^="beverage-"]');
    
    let selectedFoods = [];
    let selectedBeverages = [];
    let allFoodSelected = true;
    let allBeverageSelected = true;
    
    // Collect food selections
    foodSelects.forEach(select => {
        if (select.value) {
            selectedFoods.push(select.value);
        } else {
            allFoodSelected = false;
        }
    });
    
    // Collect beverage selections
    beverageSelects.forEach(select => {
        if (select.value) {
            selectedBeverages.push(select.value);
        } else if (beverageSelects.length > 0) {
            allBeverageSelected = false;
        }
    });
    
    // Update food preview
    foodPreview.innerHTML = '';
    if (selectedFoods.length > 0) {
        selectedFoods.forEach((food, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${food}`;
            li.style.opacity = '0';
            li.style.transform = 'translateX(-10px)';
            foodPreview.appendChild(li);
            
            setTimeout(() => {
                li.style.transition = 'all 0.3s ease-out';
                li.style.opacity = '1';
                li.style.transform = 'translateX(0)';
            }, index * 50);
        });
    } else {
        const placeholder = document.createElement('li');
        placeholder.className = 'preview-placeholder';
        placeholder.textContent = 'Select your food items above';
        foodPreview.appendChild(placeholder);
    }
    
    // Update beverage preview
    beveragePreview.innerHTML = '';
    if (selectedBeverages.length > 0) {
        selectedBeverages.forEach((beverage, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${beverage}`;
            li.style.opacity = '0';
            li.style.transform = 'translateX(-10px)';
            beveragePreview.appendChild(li);
            
            setTimeout(() => {
                li.style.transition = 'all 0.3s ease-out';
                li.style.opacity = '1';
                li.style.transform = 'translateX(0)';
            }, index * 50);
        });
    } else if (beverageSelects.length > 0) {
        const placeholder = document.createElement('li');
        placeholder.className = 'preview-placeholder';
        placeholder.textContent = 'Select your beverages above';
        beveragePreview.appendChild(placeholder);
    }
    
    // Enable/disable confirm button
    const shouldEnable = allFoodSelected && (beverageSelects.length === 0 || allBeverageSelected);
    if (confirmBtn) {
        confirmBtn.disabled = !shouldEnable;
        if (shouldEnable) {
            confirmBtn.style.animation = 'gentlePulse 2s ease-in-out infinite';
        } else {
            confirmBtn.style.animation = '';
        }
    }
}

// Initialize confirm button
function initializeConfirmButton() {
    const confirmBtn = document.getElementById('confirmOrderBtn');
    const modal = document.getElementById('thankYouModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (!this.disabled) {
                showThankYouModal();
            }
        });
    }
    
    if (modalCloseBtn && modal) {
        modalCloseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            modal.classList.add('hidden');
        });
        
        // Close modal when clicking overlay
        modal.addEventListener('click', function(e) {
            if (e.target === modal || e.target.classList.contains('modal-overlay')) {
                modal.classList.add('hidden');
            }
        });
    }
}

// Show thank you modal with order summary
function showThankYouModal() {
    const modal = document.getElementById('thankYouModal');
    const orderSummary = document.getElementById('orderSummary');
    
    if (!modal || !orderSummary) return;
    
    // Collect order details
    const foodSelects = document.querySelectorAll('select[name^="food-"]');
    const beverageSelects = document.querySelectorAll('select[name^="beverage-"]');
    
    let orderHtml = '';
    
    // Food items
    if (foodSelects.length > 0) {
        orderHtml += '<div class="summary-section"><strong>🍽️ Food Items:</strong><ul>';
        foodSelects.forEach((select, index) => {
            if (select.value) {
                orderHtml += `<li>${index + 1}. ${select.value}</li>`;
            }
        });
        orderHtml += '</ul></div>';
    }
    
    // Beverage items
    if (beverageSelects.length > 0) {
        orderHtml += '<div class="summary-section"><strong>🥤 Beverages:</strong><ul>';
        beverageSelects.forEach((select, index) => {
            if (select.value) {
                orderHtml += `<li>${index + 1}. ${select.value}</li>`;
            }
        });
        orderHtml += '</ul></div>';
    }
    
    orderSummary.innerHTML = orderHtml;
    
    // Show modal with animation
    modal.classList.remove('hidden');
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.style.opacity = '0';
        modalContent.style.transform = 'scale(0.8) translateY(20px)';
        
        setTimeout(() => {
            modalContent.style.transition = 'all 0.4s ease-out';
            modalContent.style.opacity = '1';
            modalContent.style.transform = 'scale(1) translateY(0)';
        }, 100);
    }
}

// Show error page
function showErrorPage(message) {
    const main = document.querySelector('.main');
    if (main) {
        main.innerHTML = `
            <div class="container">
                <div style="display: flex; align-items: center; justify-content: center; min-height: 50vh; text-align: center; padding: 2rem;">
                    <div style="background: rgba(254, 252, 252, 0.9); padding: 3rem; border-radius: 20px; box-shadow: 0 20px 60px rgba(93, 74, 74, 0.15); max-width: 500px;">
                        <h1 style="font-family: 'Playfair Display', serif; color: #5D4A4A; margin-bottom: 1rem;">🌸 Oops!</h1>
                        <p style="color: #8B7070; font-size: 1.1rem; margin-bottom: 2rem;">${message}</p>
                        <button onclick="window.location.href='index.html'" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #EEC4D2, #F6D7E5); color: #FEFCFC; border: none; border-radius: 25px; font-weight: 500; cursor: pointer; text-decoration: none;">
                            🏠 Go to Homepage
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

// Add input enhancements
function addInputEnhancements() {
    const inputs = document.querySelectorAll('.form-control');
    
    inputs.forEach(input => {
        // Prevent the text selection bug
        input.addEventListener('keydown', function(e) {
            // Allow normal Ctrl+A behavior only within the input
            if (e.ctrlKey && e.key === 'a') {
                e.stopPropagation();
                this.select();
                e.preventDefault();
            }
        });
        
        // Add focus animations
        input.addEventListener('focus', function() {
            this.style.transform = 'translateY(-2px)';
            if (this.parentElement) {
                this.parentElement.style.transform = 'scale(1.02)';
            }
        });
        
        input.addEventListener('blur', function() {
            this.style.transform = '';
            if (this.parentElement) {
                this.parentElement.style.transform = '';
            }
        });
        
        // Add input validation styling
        input.addEventListener('input', function() {
            if (this.checkValidity()) {
                this.style.borderColor = 'rgba(238, 196, 210, 0.5)';
            } else {
                this.style.borderColor = 'rgba(255, 84, 89, 0.5)';
            }
        });
    });
}

// Initialize animations
function initializeAnimations() {
    // Add entrance animations to elements
    const animatedElements = document.querySelectorAll('.fade-in');
    animatedElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Add floating animation to decorative elements
    const flourishes = document.querySelectorAll('.header__flourish');
    flourishes.forEach((flourish, index) => {
        flourish.style.animationDelay = `${index * 1.5}s`;
    });
    
    // Add gentle animations to form elements
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(20px)';
        setTimeout(() => {
            group.style.transition = 'all 0.5s ease-out';
            group.style.opacity = '1';
            group.style.transform = 'translateY(0)';
        }, (index + 1) * 200);
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // Styling
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        font-size: 0.9rem;
        font-weight: 500;
        color: white;
        transform: translateX(100%);
        transition: all 0.4s ease-out;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Type-specific styling
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #9CAF88, #B8C5A6)';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #FF5459, #E68161)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #EEC4D2, #F6D7E5)';
        notification.style.color = '#5D4A4A';
    }
    
    document.body.appendChild(notification);
    
    // Slide in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Slide out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 400);
    }, 3500);
}

// Add custom CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes gentlePulse {
        0%, 100% { 
            transform: scale(1); 
            box-shadow: 0 0 0 0 rgba(238, 196, 210, 0.4);
        }
        50% { 
            transform: scale(1.05); 
            box-shadow: 0 0 0 10px rgba(238, 196, 210, 0);
        }
    }
    
    @keyframes gentleBounce {
        0% { transform: scale(1); }
        30% { transform: scale(1.05); }
        60% { transform: scale(0.98); }
        100% { transform: scale(1); }
    }
    
    .summary-section {
        margin-bottom: 1rem;
    }
    
    .summary-section ul {
        margin: 0.5rem 0 0 1rem;
        padding: 0;
        list-style-type: none;
    }
    
    .summary-section li {
        margin-bottom: 0.25rem;
        color: var(--boho-text-dark);
    }
    
    /* Accessibility improvements */
    @media (prefers-reduced-motion: reduce) {
        @keyframes gentlePulse,
        @keyframes gentleBounce {
            0%, 100% { transform: none; }
        }
    }
`;
document.head.appendChild(style);

// Prevent global text selection issues
document.addEventListener('keydown', function(e) {
    // Escape to close modal
    if (e.key === 'Escape') {
        const modal = document.getElementById('thankYouModal');
        if (modal && !modal.classList.contains('hidden')) {
            modal.classList.add('hidden');
        }
    }
    
    // Prevent global Ctrl+A unless in an input field
    if (e.ctrlKey && e.key === 'a' && !e.target.matches('input, textarea')) {
        e.preventDefault();
    }
});

// Add touch support for mobile devices
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
    
    // Add touch feedback
    document.addEventListener('touchstart', function(e) {
        if (e.target.matches('.btn, .form-control, .selector')) {
            e.target.style.transform = 'scale(0.98)';
        }
    });
    
    document.addEventListener('touchend', function(e) {
        if (e.target.matches('.btn, .form-control, .selector')) {
            setTimeout(() => {
                e.target.style.transform = '';
            }, 150);
        }
    });
}