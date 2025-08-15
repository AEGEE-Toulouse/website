/**
 * AEGEE Toulouse - Main JavaScript
 * Initialisation de l'application
 */

(function() {
    'use strict';

        // Configuration de l'application
    const CONFIG = {
        // Sélecteurs DOM
        selectors: {
            header: '.header',
            menuToggle: '[data-menu-toggle]',
            mobileOverlay: '[data-mobile-overlay]',
            navLinks: '.nav__link, .mobile-nav__link',
            footerNavLinks: '.footer-nav__link',
            languageBtns: '.language-btn, .mobile-language-btn',
            rippleElements: '[data-ripple]',
            backToTop: '[data-back-to-top]',
        },        // Classes CSS
        classes: {
            headerScrolled: 'scrolled',
            menuActive: 'active',
            bodyMenuOpen: 'menu-open',
            overlayActive: 'active',
            navLinkActive: 'active'
        },
        
        // Options
        options: {
            scrollThreshold: 50, // Seuil de scroll pour le header sticky
            scrollSpyOffset: 100, // Offset pour le scroll spy
            rippleDuration: 600, // Durée de l'effet ripple en ms
            smoothScrollDuration: 800, // Durée du smooth scroll
            debounceDelay: 16 // Délai de debounce pour le scroll (60fps)
        },
        
        // Textes multilingues
        i18n: {
            fr: {
                sections: {
                    accueil: 'Accueil',
                    evenements: 'Événements',
                    partenaires: 'Partenaires',
                    projets: 'Projets',
                    contact: 'Contact'
                }
            },
            en: {
                sections: {
                    accueil: 'Home',
                    evenements: 'Events',
                    partenaires: 'Partners',
                    projets: 'Projects',
                    contact: 'Contact'
                }
            }
        }
    };

    // État de l'application
    const state = {
        currentLanguage: 'fr',
        isMenuOpen: false,
        currentSection: 'accueil',
        isScrolling: false,
        lastScrollY: 0
    };

    // Cache des éléments DOM
    const elements = {};

    /**
     * Initialisation de l'application
     */
    function init() {
        // Vérifier que le DOM est chargé
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        try {
            // Cache des éléments DOM
            cacheElements();
            
            // Initialisation des composants
            initializeComponents();
            
            // Événements globaux
            bindEvents();
            
            // État initial
            setInitialState();
            
            console.log('AEGEE Toulouse - Application initialisée avec succès');
        } catch (error) {
            console.error('Erreur lors de l\'initialisation:', error);
        }
    }

    /**
     * Cache les éléments DOM fréquemment utilisés
     */
    function cacheElements() {
        elements.header = document.querySelector(CONFIG.selectors.header);
        elements.menuToggle = document.querySelector(CONFIG.selectors.menuToggle);
        elements.mobileOverlay = document.querySelector(CONFIG.selectors.mobileOverlay);
        elements.navLinks = document.querySelectorAll(CONFIG.selectors.navLinks);
        elements.footerNavLinks = document.querySelectorAll(CONFIG.selectors.footerNavLinks);
        elements.languageBtns = document.querySelectorAll(CONFIG.selectors.languageBtns);
        elements.rippleElements = document.querySelectorAll(CONFIG.selectors.rippleElements);
        elements.backToTop = document.querySelector(CONFIG.selectors.backToTop);
        elements.body = document.body;
        elements.window = window;
        elements.document = document;
        
        // Debug: vérifier que les éléments du menu mobile existent
        if (!elements.menuToggle) {
            console.warn('Menu toggle button not found');
        }
        if (!elements.mobileOverlay) {
            console.warn('Mobile overlay not found');
        }
        
        console.log('Elements cached:', {
            menuToggle: !!elements.menuToggle,
            mobileOverlay: !!elements.mobileOverlay,
            navLinks: elements.navLinks.length,
            footerNavLinks: elements.footerNavLinks.length,
            backToTop: !!elements.backToTop
        });

        // Exposer une API publique minimale pour que components.js puisse
        // récupérer config/state/elements et appeler certaines fonctions
        // (components.js attend window.AEGEEApp). On met ici après le
        // cache des éléments pour garantir que `elements` est disponible.
        try {
            window.AEGEEApp = window.AEGEEApp || {};
            window.AEGEEApp.config = CONFIG;
            window.AEGEEApp.state = state;
            window.AEGEEApp.elements = elements;
            // exposer quelques méthodes publiques utilisées par components
            window.AEGEEApp.updateLanguage = updateLanguage;
            window.AEGEEApp.closeMenu = closeMenu;
        } catch (err) {
            console.warn('Impossible d\'exposer window.AEGEEApp:', err);
        }
    }

    /**
     * Initialise les composants
     */
    function initializeComponents() {
        // Initialiser les composants uniquement si les éléments existent
        if (typeof window.AEGEEComponents !== 'undefined') {
            // Les composants seront initialisés par components.js
            console.log('Préparation pour l\'initialisation des composants...');
        }
    }

    /**
     * Lie les événements globaux
     */
    function bindEvents() {
        // Événements de la fenêtre
        elements.window.addEventListener('scroll', window.AEGEEUtils.debounce(handleScroll, CONFIG.options.debounceDelay));
        elements.window.addEventListener('resize', window.AEGEEUtils.debounce(handleResize, CONFIG.options.debounceDelay));
        elements.window.addEventListener('load', handleWindowLoad);
        
        // Événements du document
        elements.document.addEventListener('keydown', handleKeyDown);
        
        // Bouton retour en haut
        if (elements.backToTop) {
            elements.backToTop.addEventListener('click', handleBackToTop);
        }
        
        // Liens de navigation du footer
        elements.footerNavLinks.forEach(link => {
            link.addEventListener('click', handleSmoothScroll);
        });
        
        // Gestion des erreurs JavaScript globales
        elements.window.addEventListener('error', handleGlobalError);
        
        // Gestion des erreurs de chargement des ressources
        elements.window.addEventListener('unhandledrejection', handleUnhandledRejection);
    }

    /**
     * Définit l'état initial de l'application
     */
    function setInitialState() {
        // Détecter la langue préférée de l'utilisateur
        const userLang = navigator.language || navigator.userLanguage;
        if (userLang.startsWith('en')) {
            state.currentLanguage = 'en';
        }
        
        // Mettre à jour l'interface avec la langue détectée
        updateLanguage(state.currentLanguage);
        
        // Gérer l'état de scroll initial
        handleScroll();
        
        // Gérer la section active initiale
        updateActiveSection();
    }

    /**
     * Gère l'événement de scroll
     */
    function handleScroll() {
        const scrollY = elements.window.scrollY;
        
        // Header sticky avec shadow
        if (elements.header) {
            if (scrollY > CONFIG.options.scrollThreshold) {
                elements.header.classList.add(CONFIG.classes.headerScrolled);
            } else {
                elements.header.classList.remove(CONFIG.classes.headerScrolled);
            }
        }
        
        // Scroll spy - mettre à jour la section active
        updateActiveSection();
        
        state.lastScrollY = scrollY;
    }

    /**
     * Met à jour la section active dans la navigation
     */
    function updateActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = elements.window.scrollY + CONFIG.options.scrollSpyOffset;
        
        let currentSection = 'accueil';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSection = section.id;
            }
        });
        
        // Mettre à jour l'état si la section a changé
        if (state.currentSection !== currentSection) {
            state.currentSection = currentSection;
            updateNavigationState();
        }
    }

    /**
     * Met à jour l'état de la navigation
     */
    function updateNavigationState() {
        // Mettre à jour les liens de navigation du header
        elements.navLinks.forEach(link => {
            const targetSection = link.getAttribute('data-scroll') || 
                                link.getAttribute('href')?.substring(1);
            
            if (targetSection === state.currentSection) {
                link.classList.add(CONFIG.classes.navLinkActive);
            } else {
                link.classList.remove(CONFIG.classes.navLinkActive);
            }
        });
        
        // Mettre à jour les liens de navigation du footer
        elements.footerNavLinks.forEach(link => {
            const targetSection = link.getAttribute('data-scroll') || 
                                link.getAttribute('href')?.substring(1);
            
            if (targetSection === state.currentSection) {
                link.classList.add(CONFIG.classes.navLinkActive);
            } else {
                link.classList.remove(CONFIG.classes.navLinkActive);
            }
        });
    }


    /**
     * Gère le bouton retour en haut
     */
    function handleBackToTop(event) {
        event.preventDefault();
        
        // Smooth scroll vers le haut
        elements.window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Focus sur le premier élément focusable de la page pour l'accessibilité
        setTimeout(() => {
            const firstFocusable = document.querySelector('a, button, input, textarea, select');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }, CONFIG.options.smoothScrollDuration);
    }

    /**
     * Gère le smooth scroll vers les sections
     */
    function handleSmoothScroll(event) {
        event.preventDefault();
        
        const targetId = event.currentTarget.getAttribute('data-scroll') || 
                        event.currentTarget.getAttribute('href')?.substring(1);
        
        if (!targetId) return;
        
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;
        
        // Calculer la position avec offset pour le header sticky
        const headerHeight = elements.header ? elements.header.offsetHeight : 0;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        
        // Smooth scroll
        elements.window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Fermer le menu mobile si ouvert
        if (state.isMenuOpen) {
            closeMenu();
        }
        
        // Mettre à jour l'URL sans déclencher un scroll
        if (history.pushState) {
            history.pushState(null, null, '#' + targetId);
        }
    }

    /**
     * Met à jour la langue de l'interface
     */
    function updateLanguage(lang) {
        state.currentLanguage = lang;
        
        // Mettre à jour les boutons de langue
        elements.languageBtns.forEach(btn => {
            const btnLang = btn.getAttribute('data-lang');
            if (btnLang === lang) {
                btn.classList.add(CONFIG.classes.navLinkActive);
            } else {
                btn.classList.remove(CONFIG.classes.navLinkActive);
            }
        });
        
        
        // Mettre à jour l'attribut lang du document
        elements.document.documentElement.lang = lang;
    }

    /**
     * Gère le redimensionnement de la fenêtre
     */
    function handleResize() {
        // Fermer le menu mobile si on passe en mode desktop
        if (elements.window.innerWidth >= 992 && state.isMenuOpen) {
            closeMenu();
        }
        
        // Recalculer les positions pour le scroll spy
        updateActiveSection();
    }

    /**
     * Gère le chargement complet de la fenêtre
     */
    function handleWindowLoad() {
        // Optimisations après chargement complet
        requestAnimationFrame(() => {
            // Recalculer les positions des sections
            updateActiveSection();
            
            // Initialiser les animations
            initializeAnimations();
        });
    }

    /**
     * Gère les touches clavier pour l'accessibilité
     */
    function handleKeyDown(event) {
        switch (event.key) {
            case 'Escape':
                if (state.isMenuOpen) {
                    closeMenu();
                    event.preventDefault();
                }
                break;
                
            case 'Tab':
                // Gérer la navigation au clavier dans le menu mobile
                if (state.isMenuOpen) {
                    handleTabNavigation(event);
                }
                break;
        }
    }

    /**
     * Gère la navigation Tab dans le menu mobile
     */
    function handleTabNavigation(event) {
        if (!elements.mobileOverlay) return;
        
        const focusableElements = elements.mobileOverlay.querySelectorAll(
            'a, button, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (event.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                event.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                event.preventDefault();
            }
        }
    }

    /**
     * Ferme le menu mobile
     */
    function closeMenu() {
        if (!state.isMenuOpen) return;
        
        state.isMenuOpen = false;
        
        if (elements.menuToggle) {
            elements.menuToggle.classList.remove(CONFIG.classes.menuActive);
            elements.menuToggle.setAttribute('aria-expanded', 'false');
        }
        
        if (elements.mobileOverlay) {
            elements.mobileOverlay.classList.remove(CONFIG.classes.overlayActive);
        }
        
        elements.body.classList.remove(CONFIG.classes.bodyMenuOpen);
        
        // Rendre le focus au bouton menu
        if (elements.menuToggle) {
            elements.menuToggle.focus();
        }
    }

    /**
     * Initialise les animations (déléguées aux utils)
     */
    function initializeAnimations() {
        // Les animations sont maintenant gérées par AEGEEUtils.AnimationManager
        console.log('Animations déléguées à AEGEEUtils.AnimationManager');
    }

    /**
     * Gestion des erreurs JavaScript globales
     */
    function handleGlobalError(event) {
        console.error('Erreur JavaScript globale:', event.error);
        
        // Envoyer l'erreur à un service de monitoring en production
        if (window.location.hostname !== 'localhost') {
            // reportError(event.error);
        }
    }

    /**
     * Gestion des promesses rejetées non gérées
     */
    function handleUnhandledRejection(event) {
        console.error('Promise rejetée non gérée:', event.reason);
        
        // Prévenir l'affichage de l'erreur dans la console
        event.preventDefault();
    }

    // Initialiser l'application
    init();

})();