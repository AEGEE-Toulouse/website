/**
 * AEGEE Toulouse - Components JavaScript
 * Logique des composants: sticky header, scroll spy, menu mobile, animations
 */

(function() {
    'use strict';

    // Attendre que l'app principale soit chargée
    function waitForApp() {
        if (typeof window.AEGEEApp !== 'undefined' && window.AEGEEApp.elements) {
            initComponents();
        } else {
            setTimeout(waitForApp, 50);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForApp);
    } else {
        waitForApp();
    }

    function initComponents() {
        const { config, state, elements } = window.AEGEEApp;

        /**
         * Composant Menu Mobile
         */
        const MobileMenu = {
            init() {
                this.bindEvents();
            },

            bindEvents() {
                // Toggle du menu burger
                if (elements.menuToggle) {
                    elements.menuToggle.addEventListener('click', this.toggle.bind(this));
                }

                // Fermeture par clic sur l'overlay
                if (elements.mobileOverlay) {
                    elements.mobileOverlay.addEventListener('click', (e) => {
                        if (e.target === elements.mobileOverlay) {
                            this.close();
                        }
                    });
                }

                // Fermeture par clic sur un lien de navigation
                elements.navLinks.forEach(link => {
                    if (link.classList.contains('mobile-nav__link')) {
                        link.addEventListener('click', () => {
                            this.close();
                        });
                    }
                });
            },

            toggle() {
                if (state.isMenuOpen) {
                    this.close();
                } else {
                    this.open();
                }
            },

            open() {
                state.isMenuOpen = true;
                
                if (elements.menuToggle) {
                    elements.menuToggle.classList.add(config.classes.menuActive);
                    elements.menuToggle.setAttribute('aria-expanded', 'true');
                }
                
                if (elements.mobileOverlay) {
                    elements.mobileOverlay.classList.add(config.classes.overlayActive);
                }
                
                elements.body.classList.add(config.classes.bodyMenuOpen);

                // Focus sur le premier élément du menu
                requestAnimationFrame(() => {
                    const firstLink = elements.mobileOverlay?.querySelector('.mobile-nav__link');
                    if (firstLink) firstLink.focus();
                });
            },

            close() {
                window.AEGEEApp.closeMenu();
            }
        };

        /**
         * Composant Navigation Smooth Scroll
         */
        const SmoothScroll = {
            init() {
                this.bindEvents();
                this.bindFooterEvents();
            },

            bindEvents() {
                elements.navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    const scrollTarget = link.getAttribute('data-scroll');
                    
                    if ((href && href.startsWith('#')) || scrollTarget) {
                        link.addEventListener('click', this.handleClick.bind(this));
                    }
                });
            },

            bindFooterEvents() {
                // Gérer les liens de navigation du footer
                if (elements.footerNavLinks) {
                    elements.footerNavLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        const scrollTarget = link.getAttribute('data-scroll');
                        
                        if ((href && href.startsWith('#')) || scrollTarget) {
                            link.addEventListener('click', this.handleClick.bind(this));
                        }
                    });
                }
            },

            handleClick(e) {
                e.preventDefault();
                
                const link = e.currentTarget;
                const targetId = link.getAttribute('data-scroll') || 
                               link.getAttribute('href')?.substring(1);
                
                if (!targetId) return;
                
                const targetElement = document.getElementById(targetId);
                if (!targetElement) return;

                this.scrollToElement(targetElement);
            },

            scrollToElement(element) {
                const headerHeight = elements.header?.offsetHeight || 0;
                const targetPosition = element.offsetTop - headerHeight - 20;
                
                // Smooth scroll natif avec fallback
                if ('scrollBehavior' in document.documentElement.style) {
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                } else {
                    // Fallback pour les navigateurs plus anciens
                    this.animateScroll(targetPosition);
                }
            },

            animateScroll(targetPosition) {
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = config.options.smoothScrollDuration;
                let startTime = null;

                function animation(currentTime) {
                    if (startTime === null) startTime = currentTime;
                    const timeElapsed = currentTime - startTime;
                    const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
                    window.scrollTo(0, run);
                    if (timeElapsed < duration) requestAnimationFrame(animation);
                }

                requestAnimationFrame(animation.bind(this));
            },

            easeInOutQuad(t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            }
        };

        /**
         * Composant Ripple Effect (délégué aux utils)
         */
        const RippleEffect = {
            init() {
                // L'effet ripple est maintenant géré par AEGEEUtils.RippleManager
                console.log('Ripple effect délégué à AEGEEUtils.RippleManager');
            }
        };

        /**
         * Composant Back to Top
         */
        const BackToTop = {
            init() {
                this.bindEvents();
                this.setupVisibilityToggle();
            },

            bindEvents() {
                if (elements.backToTop) {
                    elements.backToTop.addEventListener('click', this.handleClick.bind(this));
                }
            },

            setupVisibilityToggle() {
                // Afficher/masquer le bouton selon le scroll
                const toggleVisibility = () => {
                    if (elements.backToTop) {
                        const shouldShow = window.pageYOffset > 300;
                        elements.backToTop.style.opacity = shouldShow ? '1' : '0';
                        elements.backToTop.style.visibility = shouldShow ? 'visible' : 'hidden';
                        elements.backToTop.style.transform = shouldShow ? 'translateY(0)' : 'translateY(10px)';
                    }
                };

                // État initial
                toggleVisibility();

                // Écouter le scroll avec throttle
                let ticking = false;
                const throttledToggle = () => {
                    if (!ticking) {
                        requestAnimationFrame(() => {
                            toggleVisibility();
                            ticking = false;
                        });
                        ticking = true;
                    }
                };

                window.addEventListener('scroll', throttledToggle);
            },

            handleClick(e) {
                e.preventDefault();
                
                // Smooth scroll vers le haut
                if ('scrollBehavior' in document.documentElement.style) {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                } else {
                    // Fallback animation
                    this.animateScrollToTop();
                }

                // Focus management pour l'accessibilité
                setTimeout(() => {
                    const firstFocusable = document.querySelector('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
                    if (firstFocusable) {
                        firstFocusable.focus();
                    }
                }, config.options.smoothScrollDuration);
            },

            animateScrollToTop() {
                const startPosition = window.pageYOffset;
                const duration = config.options.smoothScrollDuration;
                let startTime = null;

                function animation(currentTime) {
                    if (startTime === null) startTime = currentTime;
                    const timeElapsed = currentTime - startTime;
                    const progress = Math.min(timeElapsed / duration, 1);
                    
                    // Easing function (easeOutCubic)
                    const easeProgress = 1 - Math.pow(1 - progress, 3);
                    const currentPosition = startPosition * (1 - easeProgress);
                    
                    window.scrollTo(0, currentPosition);
                    
                    if (timeElapsed < duration) {
                        requestAnimationFrame(animation);
                    }
                }

                requestAnimationFrame(animation);
            }
        };

        /**
         * Composant Language Selector
         */
        const LanguageSelector = {
            init() {
                this.bindEvents();
            },

            bindEvents() {
                elements.languageBtns.forEach(btn => {
                    btn.addEventListener('click', this.handleLanguageChange.bind(this));
                });
            },

            handleLanguageChange(e) {
                const btn = e.currentTarget;
                const lang = btn.getAttribute('data-lang');
                
                if (lang && lang !== state.currentLanguage) {
                    window.AEGEEApp.updateLanguage(lang);
                    
                    // Sauvegarder la préférence
                    try {
                        localStorage.setItem('aegee-language', lang);
                    } catch (error) {
                        console.warn('Impossible de sauvegarder la langue:', error);
                    }
                }
            }
        };

        /**
         * Composant Lazy Loading Images (délégué aux utils)
         */
        const LazyImages = {
            init() {
                // Le lazy loading est maintenant géré par AEGEEUtils.LazyLoadManager
                console.log('Lazy loading délégué à AEGEEUtils.LazyLoadManager');
            }
        };

        /**
         * Composant Performance Monitor
         */
        const PerformanceMonitor = {
            init() {
                this.measureCoreWebVitals();
                this.setupErrorTracking();
            },

            measureCoreWebVitals() {
                // Largest Contentful Paint (LCP)
                if ('PerformanceObserver' in window) {
                    try {
                        const observer = new PerformanceObserver((list) => {
                            const entries = list.getEntries();
                            const lastEntry = entries[entries.length - 1];
                            console.log('LCP:', lastEntry.startTime);
                        });
                        observer.observe({ entryTypes: ['largest-contentful-paint'] });
                    } catch (error) {
                        console.warn('Performance Observer non supporté:', error);
                    }
                }

                // First Input Delay (FID)
                if ('PerformanceObserver' in window) {
                    try {
                        const observer = new PerformanceObserver((list) => {
                            const entries = list.getEntries();
                            entries.forEach(entry => {
                                console.log('FID:', entry.processingStart - entry.startTime);
                            });
                        });
                        observer.observe({ entryTypes: ['first-input'] });
                    } catch (error) {
                        console.warn('FID Observer non supporté:', error);
                    }
                }

                // Cumulative Layout Shift (CLS)
                if ('PerformanceObserver' in window) {
                    try {
                        let clsValue = 0;
                        const observer = new PerformanceObserver((list) => {
                            for (const entry of list.getEntries()) {
                                if (!entry.hadRecentInput) {
                                    clsValue += entry.value;
                                    console.log('CLS:', clsValue);
                                }
                            }
                        });
                        observer.observe({ entryTypes: ['layout-shift'] });
                    } catch (error) {
                        console.warn('CLS Observer non supporté:', error);
                    }
                }
            },

            setupErrorTracking() {
                // Tracker les erreurs de chargement des ressources
                window.addEventListener('error', (e) => {
                    if (e.target !== window) {
                        console.error('Erreur de chargement:', e.target.src || e.target.href);
                    }
                }, true);
            }
        };

        /**
         * Composant Accessibility Enhancements
         */
        const AccessibilityEnhancements = {
            init() {
                this.setupKeyboardNavigation();
                this.setupAriaAttributes();
                this.setupFocusManagement();
            },

            setupKeyboardNavigation() {
                // Navigation au clavier dans le header
                elements.navLinks.forEach((link, index) => {
                    link.addEventListener('keydown', (e) => {
                        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                            e.preventDefault();
                            const direction = e.key === 'ArrowRight' ? 1 : -1;
                            const nextIndex = (index + direction + elements.navLinks.length) % elements.navLinks.length;
                            elements.navLinks[nextIndex].focus();
                        }
                    });
                });
            },

            setupAriaAttributes() {
                // Mise à jour des attributs ARIA
                if (elements.menuToggle) {
                    elements.menuToggle.setAttribute('aria-label', 'Menu de navigation');
                    elements.menuToggle.setAttribute('aria-expanded', 'false');
                }

                // Labels pour les liens sociaux
                document.querySelectorAll('.social-link, .mobile-social__link').forEach(link => {
                    const href = link.getAttribute('href');
                    if (href.includes('facebook')) {
                        link.setAttribute('aria-label', 'Facebook AEGEE Toulouse');
                    } else if (href.includes('instagram')) {
                        link.setAttribute('aria-label', 'Instagram AEGEE Toulouse');
                    } else if (href.includes('linkedin')) {
                        link.setAttribute('aria-label', 'LinkedIn AEGEE Toulouse');
                    }
                });
            },

            setupFocusManagement() {
                // Gestion du focus lors de l'ouverture/fermeture du menu
                let lastFocusedElement = null;

                // Sauvegarder le focus avant ouverture du menu
                if (elements.menuToggle) {
                    elements.menuToggle.addEventListener('click', () => {
                        if (!state.isMenuOpen) {
                            lastFocusedElement = document.activeElement;
                        }
                    });
                }

                // Restaurer le focus à la fermeture du menu
                const originalCloseMenu = window.AEGEEApp.closeMenu;
                window.AEGEEApp.closeMenu = function() {
                    originalCloseMenu();
                    if (lastFocusedElement) {
                        lastFocusedElement.focus();
                        lastFocusedElement = null;
                    }
                };
            }
        };


        /**
         * Initialisation de tous les composants
         */
        function initializeComponents() {
            const components = [
                MobileMenu,
                SmoothScroll,
                RippleEffect,
                BackToTop,
                LanguageSelector,
                LazyImages,
                PerformanceMonitor,
                AccessibilityEnhancements
            ];

            components.forEach(component => {
                try {
                    component.init();
                    console.log(`${component.constructor.name || 'Component'} initialisé`);
                } catch (error) {
                    console.error(`Erreur lors de l'initialisation du composant:`, error);
                }
            });
        }

        // Charger la langue sauvegardée
        function loadSavedLanguage() {
            try {
                const savedLang = localStorage.getItem('aegee-language');
                if (savedLang && config.i18n[savedLang]) {
                    window.AEGEEApp.updateLanguage(savedLang);
                }
            } catch (error) {
                console.warn('Impossible de charger la langue sauvegardée:', error);
            }
        }

        // Initialiser tous les composants
        initializeComponents();
        loadSavedLanguage();

        // API publique pour les composants
        window.AEGEEComponents = {
            MobileMenu,
            SmoothScroll,
            RippleEffect,
            BackToTop,
            LanguageSelector,
            LazyImages,
            PerformanceMonitor,
            AccessibilityEnhancements
        };

        console.log('AEGEE Components - Tous les composants initialisés');
    }

})();