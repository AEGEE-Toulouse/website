/**
 * AEGEE Toulouse - Utilities JavaScript
 * Utilitaires partagés pour éviter la duplication de code
 */

(function() {
    'use strict';

    /**
     * Utilitaire de debounce
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Utilitaire de throttle
     */
    function throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Factory pour créer des IntersectionObserver configurables
     */
    function createObserver(callback, options = {}) {
        const defaultOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observerOptions = { ...defaultOptions, ...options };
        
        if ('IntersectionObserver' in window) {
            return new IntersectionObserver(callback, observerOptions);
        }
        
        return null;
    }

    /**
     * Utilitaire pour le lazy loading d'images
     */
    function lazyLoadImage(img, src = null) {
        const imageSrc = src || img.getAttribute('data-src');
        if (!imageSrc) return;

        img.src = imageSrc;
        img.removeAttribute('data-src');
        img.classList.add('loaded');
        img.classList.remove('lazy');
    }

    /**
     * Gestionnaire d'animations au scroll unifié
     */
    const AnimationManager = {
        observer: null,
        
        init() {
            this.observer = createObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('animate-in');
                        }, index * 100);
                        this.observer.unobserve(entry.target);
                    }
                });
            });

            if (this.observer) {
                this.observeElements();
            }
        },

        observeElements() {
            // Observer les sections
            document.querySelectorAll('section').forEach(section => {
                section.classList.add('animate-on-scroll');
                this.observer.observe(section);
            });

            // Observer les cartes
            document.querySelectorAll('.card').forEach(card => {
                card.classList.add('animate-on-scroll');
                this.observer.observe(card);
            });

            // Observer les grilles text-media
            document.querySelectorAll('.grid--text-media').forEach(grid => {
                grid.classList.add('animate-on-scroll');
                this.observer.observe(grid);
            });
        }
    };

    /**
     * Gestionnaire de lazy loading unifié
     */
    const LazyLoadManager = {
        observer: null,

        init() {
            this.observer = createObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        lazyLoadImage(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '50px 0px' });

            if (this.observer) {
                this.observeImages();
            } else {
                this.fallbackLoad();
            }
        },

        observeImages() {
            document.querySelectorAll('img[data-src]').forEach(img => {
                this.observer.observe(img);
            });
        },

        fallbackLoad() {
            document.querySelectorAll('img[data-src]').forEach(img => {
                lazyLoadImage(img);
            });
        }
    };

    /**
     * Gestionnaire d'effet ripple unifié
     */
    const RippleManager = {
        init() {
            this.bindEvents();
        },

        bindEvents() {
            document.querySelectorAll('[data-ripple]').forEach(element => {
                element.addEventListener('click', this.createRipple.bind(this));
            });
        },

        createRipple(e) {
            const element = e.currentTarget;
            const existingRipple = element.querySelector('.ripple-effect');
            
            // Supprimer l'effet précédent s'il existe
            if (existingRipple) {
                existingRipple.remove();
            }

            // Créer le nouvel effet ripple
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            
            // Calculer la position et la taille
            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            // Appliquer les styles
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple-animation 600ms ease-out;
                pointer-events: none;
                z-index: 1;
            `;
            
            // Ajouter l'effet à l'élément
            element.style.position = 'relative';
            element.style.overflow = 'hidden';
            element.appendChild(ripple);
            
            // Supprimer l'effet après l'animation
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.remove();
                }
            }, 600);
        }
    };

    /**
     * Gestionnaire de compteurs animés
     */
    const CounterManager = {
        observer: null,

        init() {
            this.observer = createObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            if (this.observer) {
                document.querySelectorAll('[data-counter]').forEach(counter => {
                    this.observer.observe(counter);
                });
            }
        },

        animateCounter(element) {
            const target = parseInt(element.getAttribute('data-counter'));
            const duration = parseInt(element.getAttribute('data-duration')) || 2000;
            const start = performance.now();
            
            function updateCounter(currentTime) {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                
                // Fonction d'easing
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(easeOut * target);
                
                element.textContent = current.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = target.toLocaleString();
                }
            }
            
            requestAnimationFrame(updateCounter);
        }
    };

    /**
     * Injection des styles CSS nécessaires - SUPPRIMÉ
     * Styles maintenant dans effects.css
     */
    function injectStyles() {
        // Styles maintenant gérés par effects.css
        console.log('Styles gérés par effects.css - injection supprimée');
    }

    /**
     * Initialisation de tous les utilitaires
     */
    function initUtils() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initUtils);
            return;
        }

        try {
            // injectStyles(); // Supprimé - styles dans effects.css
            AnimationManager.init();
            LazyLoadManager.init();
            RippleManager.init();
            CounterManager.init();
            
            console.log('AEGEE Utils - Tous les utilitaires initialisés');
        } catch (error) {
            console.error('Erreur lors de l\'initialisation des utilitaires:', error);
        }
    }

    /**
     * API publique pour les autres scripts
     */
    window.AEGEEUtils = {
        debounce,
        throttle,
        createObserver,
        lazyLoadImage,
        AnimationManager,
        LazyLoadManager,
        RippleManager,
        CounterManager
    };

    // Auto-initialisation
    initUtils();

})();
