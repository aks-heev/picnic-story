// Beige Restaurant Menu JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the menu functionality
    initializeNavigation();
    initializeSearch();
    initializeScrollEffects();
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.menu-section');

    // Add click handlers for smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active link
                updateActiveNavLink(this);
            }
        });
    });

    // Update active navigation link based on scroll position
    window.addEventListener('scroll', function() {
        let current = '';
        const navbarHeight = document.getElementById('navbar').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 50;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// Update active navigation link
function updateActiveNavLink(activeLink) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const menuItems = document.querySelectorAll('.menu-item');
    const menuCards = document.querySelectorAll('.menu-card');
    const menuSections = document.querySelectorAll('.menu-section');
    let searchTimeout;

    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(this.value.toLowerCase().trim());
        }, 300);
    });

    function performSearch(searchTerm) {
        let hasResults = false;
        
        if (searchTerm === '') {
            // Show all items when search is empty
            showAllItems();
            removeNoResultsMessage();
            return;
        }

        // Hide all items first
        menuItems.forEach(item => {
            item.classList.add('hidden');
            item.classList.remove('highlighted');
        });

        // Search through menu items
        menuItems.forEach(item => {
            const itemText = item.textContent.toLowerCase();
            if (itemText.includes(searchTerm)) {
                item.classList.remove('hidden');
                item.classList.add('highlighted');
                hasResults = true;
                
                // Show parent card and section
                const parentCard = item.closest('.menu-card');
                const parentSection = item.closest('.menu-section');
                if (parentCard) parentCard.classList.remove('hidden');
                if (parentSection) parentSection.classList.remove('hidden');
            }
        });

        // Hide empty cards and sections
        menuCards.forEach(card => {
            const visibleItems = card.querySelectorAll('.menu-item:not(.hidden)');
            if (visibleItems.length === 0) {
                card.classList.add('hidden');
            }
        });

        menuSections.forEach(section => {
            const visibleCards = section.querySelectorAll('.menu-card:not(.hidden)');
            if (visibleCards.length === 0) {
                section.classList.add('hidden');
            }
        });

        // Show/hide no results message
        if (!hasResults) {
            showNoResultsMessage(searchTerm);
        } else {
            removeNoResultsMessage();
        }

        // Remove highlights after a delay
        setTimeout(() => {
            menuItems.forEach(item => {
                item.classList.remove('highlighted');
            });
        }, 2000);
    }

    function showAllItems() {
        menuItems.forEach(item => {
            item.classList.remove('hidden', 'highlighted');
        });
        menuCards.forEach(card => {
            card.classList.remove('hidden');
        });
        menuSections.forEach(section => {
            section.classList.remove('hidden');
        });
    }

    function showNoResultsMessage(searchTerm) {
        removeNoResultsMessage();
        const main = document.querySelector('.main .container');
        const noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'no-results';
        noResultsDiv.id = 'no-results-message';
        noResultsDiv.innerHTML = `
            <h3>No results found for "${searchTerm}"</h3>
            <p>Try searching for different dishes or ingredients.</p>
        `;
        main.appendChild(noResultsDiv);
    }

    function removeNoResultsMessage() {
        const existingMessage = document.getElementById('no-results-message');
        if (existingMessage) {
            existingMessage.remove();
        }
    }
}

// Scroll effects and animations
function initializeScrollEffects() {
    // Add scroll-based animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);

    // Observe menu cards for entrance animations
    const menuCards = document.querySelectorAll('.menu-card');
    menuCards.forEach(card => {
        observer.observe(card);
    });

    // Add entrance animation to section titles
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach((title, index) => {
        title.style.opacity = '0';
        title.style.transform = 'translateY(30px)';
        title.style.transition = 'all 0.6s ease-out';
        title.style.animationDelay = `${index * 0.2}s`;
        
        observer.observe(title);
        
        // Animate when in view
        title.addEventListener('animationstart', () => {
            title.style.opacity = '1';
            title.style.transform = 'translateY(0)';
        });
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Allow Escape key to clear search
    if (e.key === 'Escape') {
        const searchInput = document.getElementById('searchInput');
        if (searchInput === document.activeElement) {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
            searchInput.blur();
        }
    }
    
    // Allow Enter key to focus search
    if (e.key === '/' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
});

// Add touch-friendly interactions for mobile
function addTouchSupport() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('touchstart', function() {
            this.style.transform = 'translateX(4px)';
        });
        
        item.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// Initialize touch support on mobile devices
if ('ontouchstart' in window) {
    addTouchSupport();
}

// Add loading state management
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Trigger entrance animations
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.animationPlayState = 'running';
        }, index * 50);
    });
});

// Performance optimization: Lazy load content
function initializeLazyLoading() {
    const sections = document.querySelectorAll('.menu-section');
    
    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
                lazyObserver.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '50px'
    });

    sections.forEach(section => {
        lazyObserver.observe(section);
    });
}

// Initialize lazy loading
initializeLazyLoading();

// Add search suggestions functionality
function initializeSearchSuggestions() {
    const searchInput = document.getElementById('searchInput');
    const allMenuItems = Array.from(document.querySelectorAll('.menu-item')).map(item => 
        item.textContent.replace('•', '').trim()
    );
    
    searchInput.addEventListener('focus', function() {
        this.placeholder = 'Try searching for "paneer", "chicken", "tea"...';
    });
    
    searchInput.addEventListener('blur', function() {
        this.placeholder = 'Search menu items...';
    });
}

// Initialize search suggestions
initializeSearchSuggestions();