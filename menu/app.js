// Menu Application JavaScript
class MenuApp {
    constructor() {
        this.searchInput = document.getElementById('searchInput');
        this.navPills = document.querySelectorAll('.nav-pill');
        this.menuSections = document.querySelectorAll('.menu-section');
        this.menuItems = document.querySelectorAll('.menu-item');
        this.subsectionCards = document.querySelectorAll('.subsection-card');
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupSearch();
        this.setupScrollSpy();
        this.setupSmoothScrolling();
    }

    setupNavigation() {
        this.navPills.forEach(pill => {
            pill.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = e.target.getAttribute('data-section');
                this.navigateToSection(targetSection);
                this.updateActiveNavPill(e.target);
            });
        });
    }

    navigateToSection(sectionId) {
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 120; // Account for sticky nav
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    updateActiveNavPill(activePill) {
        this.navPills.forEach(pill => pill.classList.remove('active'));
        activePill.classList.add('active');
    }

    setupSearch() {
        this.searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            this.filterMenuItems(searchTerm);
        });

        // Clear search on escape key
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.clearSearch();
            }
        });
    }

    filterMenuItems(searchTerm) {
        if (searchTerm === '') {
            this.showAllItems();
            return;
        }

        let hasVisibleItems = false;

        // Hide all sections first
        this.menuSections.forEach(section => {
            section.classList.add('hidden');
        });

        // Check each menu item
        this.menuItems.forEach(item => {
            const itemText = item.textContent.toLowerCase();
            const subsectionCard = item.closest('.subsection-card');
            const menuSection = item.closest('.menu-section');

            if (itemText.includes(searchTerm)) {
                // Show matching item
                item.classList.remove('hidden');
                item.classList.add('highlight');
                
                // Show parent containers
                if (subsectionCard) {
                    subsectionCard.classList.remove('hidden');
                }
                if (menuSection) {
                    menuSection.classList.remove('hidden');
                }
                
                hasVisibleItems = true;

                // Remove highlight after animation
                setTimeout(() => {
                    item.classList.remove('highlight');
                }, 500);
            } else {
                item.classList.add('hidden');
            }
        });

        // Hide subsection cards that have no visible items
        this.subsectionCards.forEach(card => {
            const visibleItems = card.querySelectorAll('.menu-item:not(.hidden)');
            if (visibleItems.length === 0) {
                card.classList.add('hidden');
            }
        });

        // Hide sections that have no visible subsection cards
        this.menuSections.forEach(section => {
            const visibleCards = section.querySelectorAll('.subsection-card:not(.hidden)');
            if (visibleCards.length === 0) {
                section.classList.add('hidden');
            }
        });

        // Show "no results" message if needed
        this.handleNoResults(hasVisibleItems, searchTerm);
    }

    showAllItems() {
        // Remove all hidden classes
        this.menuSections.forEach(section => {
            section.classList.remove('hidden');
        });
        
        this.subsectionCards.forEach(card => {
            card.classList.remove('hidden');
        });
        
        this.menuItems.forEach(item => {
            item.classList.remove('hidden', 'highlight');
        });

        // Remove no results message if it exists
        this.removeNoResultsMessage();
    }

    handleNoResults(hasResults, searchTerm) {
        this.removeNoResultsMessage();
        
        if (!hasResults && searchTerm !== '') {
            const noResultsDiv = document.createElement('div');
            noResultsDiv.className = 'no-results';
            noResultsDiv.innerHTML = `
                <div class="no-results-content">
                    <h3>No items found 🌸</h3>
                    <p>Sorry, we couldn't find any menu items matching "${searchTerm}".</p>
                    <p>Try searching for something else or browse our full menu below.</p>
                    <button class="btn-clear-search">Clear Search</button>
                </div>
            `;
            
            // Add styles for no results
            noResultsDiv.style.cssText = `
                background: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(15px);
                border-radius: 20px;
                padding: 40px;
                text-align: center;
                margin: 20px 0;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            `;
            
            const mainContent = document.querySelector('.menu-sections');
            mainContent.insertBefore(noResultsDiv, mainContent.firstChild);
            
            // Add click handler for clear search button
            const clearButton = noResultsDiv.querySelector('.btn-clear-search');
            clearButton.addEventListener('click', () => {
                this.clearSearch();
            });
            
            // Style the clear button
            clearButton.style.cssText = `
                background: linear-gradient(135deg, #eec4d2, #fadbe5);
                color: #2d3748;
                border: none;
                border-radius: 25px;
                padding: 12px 24px;
                font-family: 'Inter', sans-serif;
                font-weight: 500;
                cursor: pointer;
                margin-top: 15px;
                transition: all 0.3s ease;
            `;
        }
    }

    removeNoResultsMessage() {
        const noResults = document.querySelector('.no-results');
        if (noResults) {
            noResults.remove();
        }
    }

    clearSearch() {
        this.searchInput.value = '';
        this.showAllItems();
        this.searchInput.focus();
    }

    setupScrollSpy() {
        const options = {
            root: null,
            rootMargin: '-120px 0px -60% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    const correspondingPill = document.querySelector(`[data-section="${sectionId}"]`);
                    if (correspondingPill) {
                        this.updateActiveNavPill(correspondingPill);
                    }
                }
            });
        }, options);

        this.menuSections.forEach(section => {
            observer.observe(section);
        });
    }

    setupSmoothScrolling() {
        // Add smooth scrolling to all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 120;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Enhanced Menu Interactions
class MenuInteractions {
    constructor() {
        this.init();
    }

    init() {
        this.setupHoverEffects();
        this.setupKeyboardNavigation();
        this.setupAccessibility();
    }

    setupHoverEffects() {
        // Add subtle animations to menu items
        this.menuItems = document.querySelectorAll('.menu-item');
        
        this.menuItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateX(5px)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateX(0)';
            });
        });
    }

    setupKeyboardNavigation() {
        // Add keyboard navigation for nav pills
        const navPills = document.querySelectorAll('.nav-pill');
        
        navPills.forEach((pill, index) => {
            pill.addEventListener('keydown', (e) => {
                let targetIndex;
                
                switch(e.key) {
                    case 'ArrowRight':
                    case 'ArrowDown':
                        e.preventDefault();
                        targetIndex = (index + 1) % navPills.length;
                        navPills[targetIndex].focus();
                        break;
                        
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        e.preventDefault();
                        targetIndex = (index - 1 + navPills.length) % navPills.length;
                        navPills[targetIndex].focus();
                        break;
                        
                    case 'Enter':
                    case ' ':
                        e.preventDefault();
                        pill.click();
                        break;
                }
            });
        });
    }

    setupAccessibility() {
        // Add ARIA labels and improve accessibility
        const searchInput = document.getElementById('searchInput');
        searchInput.setAttribute('aria-label', 'Search menu items');
        
        const navPills = document.querySelectorAll('.nav-pill');
        navPills.forEach(pill => {
            pill.setAttribute('role', 'button');
            pill.setAttribute('tabindex', '0');
        });
        
        // Add skip link for keyboard users
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #2d3748;
            color: white;
            padding: 8px;
            text-decoration: none;
            z-index: 1000;
            border-radius: 4px;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add main content id
        const mainContent = document.querySelector('.main-content');
        mainContent.id = 'main-content';
    }
}

// Utility Functions
class Utils {
    static debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }
    
    static addLoadingState(element) {
        element.classList.add('loading');
        element.style.opacity = '0.6';
        element.style.pointerEvents = 'none';
    }
    
    static removeLoadingState(element) {
        element.classList.remove('loading');
        element.style.opacity = '1';
        element.style.pointerEvents = 'auto';
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const menuApp = new MenuApp();
    const menuInteractions = new MenuInteractions();
    
    // Add a welcome animation
    const header = document.querySelector('.header');
    const navigation = document.querySelector('.navigation');
    const menuSections = document.querySelectorAll('.menu-section');
    
    // Fade in header
    setTimeout(() => {
        if (header) {
            header.style.opacity = '0';
            header.style.transform = 'translateY(20px)';
            header.style.transition = 'all 0.8s ease';
            
            setTimeout(() => {
                header.style.opacity = '1';
                header.style.transform = 'translateY(0)';
            }, 100);
        }
    }, 100);
    
    // Fade in navigation
    setTimeout(() => {
        if (navigation) {
            navigation.style.opacity = '0';
            navigation.style.transform = 'translateY(-20px)';
            navigation.style.transition = 'all 0.8s ease';
            
            setTimeout(() => {
                navigation.style.opacity = '1';
                navigation.style.transform = 'translateY(0)';
            }, 200);
        }
    }, 200);
    
    // Stagger menu sections animation
    menuSections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.8s ease';
        
        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, 400 + (index * 150));
    });
    
    console.log('🌸 The Picnic Story menu loaded successfully! 🍃');
});

// Handle window resize for responsive behavior
window.addEventListener('resize', Utils.debounce(() => {
    // Recalculate any position-dependent elements if needed
    console.log('Window resized - adjusting layout');
}, 250));

// Add error handling
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.error);
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MenuApp, MenuInteractions, Utils };
}