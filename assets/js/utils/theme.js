/**
 * Theme Manager - Handle dark/light mode switching with smooth transitions
 * Provides automatic theme detection and user preference persistence
 */

class ThemeManager {
    static currentTheme = 'light';
    static initialized = false;
    static transitionTimeout = null;

    /**
     * Initialize the theme system
     */
    static init() {
        if (this.initialized) return;

        // Get user preference or system preference
        const savedTheme = StorageManager.getItem('theme-preference');
        const systemTheme = this.getSystemTheme();
        
        this.currentTheme = savedTheme || systemTheme;
        
        // Apply initial theme
        this.applyTheme(this.currentTheme, false);
        
        // Setup theme toggle button
        this.setupThemeToggle();
        
        // Listen for system theme changes
        this.setupSystemThemeListener();
        
        this.initialized = true;
        console.log(`🎨 Theme system initialized (${this.currentTheme} mode)`);
    }

    /**
     * Get system color scheme preference
     * @returns {string} 'dark' or 'light'
     */
    static getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    /**
     * Apply theme to document
     * @param {string} theme - Theme name ('light' or 'dark')
     * @param {boolean} animate - Whether to animate the transition
     */
    static applyTheme(theme, animate = true) {
        const validThemes = ['light', 'dark'];
        if (!validThemes.includes(theme)) {
            console.warn(`Invalid theme: ${theme}. Using light theme.`);
            theme = 'light';
        }

        const html = document.documentElement;
        
        if (animate) {
            // Add transition class for smooth animation
            html.classList.add('theme-transitioning');
            
            // Clear any existing timeout
            if (this.transitionTimeout) {
                clearTimeout(this.transitionTimeout);
            }
            
            // Remove transition class after animation completes
            this.transitionTimeout = setTimeout(() => {
                html.classList.remove('theme-transitioning');
                this.transitionTimeout = null;
            }, 300);
        }

        // Apply theme data attribute
        html.setAttribute('data-theme', theme);
        
        // Update current theme
        this.currentTheme = theme;
        
        // Save user preference
        StorageManager.setItem('theme-preference', theme);
        
        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(theme);
        
        // Dispatch theme change event
        this.dispatchThemeChangeEvent(theme);
        
        console.log(`🎨 Applied ${theme} theme`);
    }

    /**
     * Toggle between light and dark themes
     */
    static toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme, true);
    }

    /**
     * Set specific theme
     * @param {string} theme - Theme name
     */
    static setTheme(theme) {
        this.applyTheme(theme, true);
    }

    /**
     * Get current theme
     * @returns {string} Current theme name
     */
    static getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * Setup theme toggle button functionality
     */
    static setupThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (!themeToggle) {
            console.warn('Theme toggle button not found');
            return;
        }

        // Update button state
        this.updateToggleButton();

        // Add click event listener
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
            this.updateToggleButton();
            
            // Provide feedback for screen readers
            const announcer = document.getElementById('announcer');
            if (announcer) {
                announcer.textContent = `Switched to ${this.currentTheme} mode`;
            }
        });

        // Keyboard support
        themeToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                themeToggle.click();
            }
        });
    }

    /**
     * Update theme toggle button state
     */
    static updateToggleButton() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (!themeToggle) return;

        const lightIcon = themeToggle.querySelector('.light-icon');
        const darkIcon = themeToggle.querySelector('.dark-icon');
        
        // Update aria-label for accessibility
        themeToggle.setAttribute('aria-label', 
            `Switch to ${this.currentTheme === 'light' ? 'dark' : 'light'} mode`
        );
        
        // Update title attribute
        themeToggle.setAttribute('title', 
            `Switch to ${this.currentTheme === 'light' ? 'dark' : 'light'} mode`
        );
    }

    /**
     * Setup listener for system theme changes
     */
    static setupSystemThemeListener() {
        if (!window.matchMedia) return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleSystemThemeChange = (e) => {
            // Only apply system theme if user hasn't set a preference
            const userPreference = StorageManager.getItem('theme-preference');
            if (!userPreference) {
                const systemTheme = e.matches ? 'dark' : 'light';
                this.applyTheme(systemTheme, true);
                this.updateToggleButton();
            }
        };

        // Modern browsers
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleSystemThemeChange);
        } else {
            // Fallback for older browsers
            mediaQuery.addListener(handleSystemThemeChange);
        }
    }

    /**
     * Update meta theme-color for mobile browsers
     * @param {string} theme - Current theme
     */
    static updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }

        // Set appropriate color based on theme
        const colors = {
            light: '#ffffff',
            dark: '#0f172a'
        };

        metaThemeColor.content = colors[theme] || colors.light;
    }

    /**
     * Dispatch theme change event for other components
     * @param {string} theme - New theme
     */
    static dispatchThemeChangeEvent(theme) {
        const event = new CustomEvent('themechange', {
            detail: { 
                theme,
                previousTheme: this.currentTheme === 'light' ? 'dark' : 'light'
            }
        });
        
        document.dispatchEvent(event);
    }

    /**
     * Get theme-aware color value
     * @param {string} lightColor - Color for light theme
     * @param {string} darkColor - Color for dark theme
     * @returns {string} Appropriate color for current theme
     */
    static getThemeColor(lightColor, darkColor) {
        return this.currentTheme === 'dark' ? darkColor : lightColor;
    }

    /**
     * Check if dark theme is active
     * @returns {boolean} True if dark theme is active
     */
    static isDarkTheme() {
        return this.currentTheme === 'dark';
    }

    /**
     * Check if light theme is active
     * @returns {boolean} True if light theme is active
     */
    static isLightTheme() {
        return this.currentTheme === 'light';
    }

    /**
     * Get all available themes
     * @returns {string[]} Array of available theme names
     */
    static getAvailableThemes() {
        return ['light', 'dark'];
    }

    /**
     * Reset theme to system preference
     */
    static resetToSystemTheme() {
        StorageManager.removeItem('theme-preference');
        const systemTheme = this.getSystemTheme();
        this.applyTheme(systemTheme, true);
        this.updateToggleButton();
    }

    /**
     * Generate CSS custom properties for current theme
     * @returns {Object} CSS custom properties object
     */
    static getThemeCustomProperties() {
        const themes = {
            light: {
                '--primary-color': '#2563eb',
                '--primary-hover': '#1d4ed8',
                '--background-color': '#ffffff',
                '--surface-color': '#f8fafc',
                '--text-primary': '#1e293b',
                '--text-secondary': '#64748b',
                '--border-color': '#e2e8f0'
            },
            dark: {
                '--primary-color': '#3b82f6',
                '--primary-hover': '#2563eb',
                '--background-color': '#0f172a',
                '--surface-color': '#1e293b',
                '--text-primary': '#f1f5f9',
                '--text-secondary': '#94a3b8',
                '--border-color': '#334155'
            }
        };

        return themes[this.currentTheme] || themes.light;
    }

    /**
     * Apply custom theme properties programmatically
     * @param {Object} properties - CSS custom properties to apply
     */
    static applyCustomProperties(properties) {
        const root = document.documentElement;
        
        Object.keys(properties).forEach(property => {
            root.style.setProperty(property, properties[property]);
        });
    }

    /**
     * Export theme configuration
     * @returns {Object} Theme configuration
     */
    static exportThemeConfig() {
        return {
            currentTheme: this.currentTheme,
            systemTheme: this.getSystemTheme(),
            userPreference: StorageManager.getItem('theme-preference'),
            customProperties: this.getThemeCustomProperties()
        };
    }
}

// Export for use in other modules
window.ThemeManager = ThemeManager;
