/**
 * ToolKit Pro - Professional Web Development Tools
 * Main Application Controller
 * 
 * @author Dean Billedo
 * @version 1.0.0
 * @description A comprehensive collection of web-based tools showcasing modern frontend development
 */

class ToolKitApp {
    constructor() {
        this.tools = new Map();
        this.currentTool = null;
        this.isInitialized = false;
        
        // Bind methods to maintain context
        this.handleToolClick = this.handleToolClick.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleKeyboardNavigation = this.handleKeyboardNavigation.bind(this);
        
        // Initialize app when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            console.log('🚀 Initializing ToolKit Pro...');
            
            // Initialize core utilities
            this.initializeUtilities();
            
            // Register all tools
            this.registerTools();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Render tools grid
            this.renderToolsGrid();
            
            // Initialize theme system
            ThemeManager.init();
            
            // Setup accessibility features
            this.setupAccessibility();
            
            // Setup navigation
            this.setupNavigation();
            
            this.isInitialized = true;
            console.log('✅ ToolKit Pro initialized successfully');
            
            // Show welcome notification
            NotificationManager.show({
                type: 'success',
                title: 'Welcome to ToolKit Pro!',
                message: 'Professional web development tools at your fingertips.'
            });
            
        } catch (error) {
            console.error('❌ Failed to initialize ToolKit Pro:', error);
            NotificationManager.show({
                type: 'error',
                title: 'Initialization Error',
                message: 'Failed to load the application. Please refresh the page.'
            });
        }
    }

    /**
     * Initialize utility managers
     */
    initializeUtilities() {
        // Utilities are already loaded via individual script tags
        // This method can be used for any additional setup
        if (typeof NotificationManager === 'undefined') {
            throw new Error('NotificationManager not loaded');
        }
        if (typeof ModalManager === 'undefined') {
            throw new Error('ModalManager not loaded');
        }
        if (typeof ThemeManager === 'undefined') {
            throw new Error('ThemeManager not loaded');
        }
    }

    /**
     * Register all available tools
     */
    registerTools() {
        const toolConfigs = [
            {
                id: 'qr-generator',
                title: 'QR Code Generator',
                description: 'Generate QR codes from text or URLs with customizable options and downloadable output.',
                icon: '📱',
                tags: ['QR Code', 'Generator', 'Download'],
                category: 'utility',
                className: 'QRGenerator'
            },
            {
                id: 'background-remover',
                title: 'Background Remover',
                description: 'Remove backgrounds from images using advanced Canvas API processing techniques.',
                icon: '🖼️',
                tags: ['Image', 'Background', 'Canvas API'],
                category: 'image',
                className: 'BackgroundRemover'
            },
            {
                id: 'pdf-converter',
                title: 'PDF Converter',
                description: 'Convert documents between PDF and Word formats using client-side processing.',
                icon: '📄',
                tags: ['PDF', 'Word', 'Convert'],
                category: 'document',
                className: 'PDFConverter'
            },
            {
                id: 'text-diff',
                title: 'Text Difference Checker',
                description: 'Compare two texts side-by-side with highlighted differences and change detection.',
                icon: '🔍',
                tags: ['Text', 'Compare', 'Diff'],
                category: 'text',
                className: 'TextDiffChecker'
            },
            {
                id: 'lorem-generator',
                title: 'Lorem Ipsum Generator',
                description: 'Generate customizable placeholder text with options for paragraphs, words, and sentences.',
                icon: '📝',
                tags: ['Lorem', 'Text', 'Placeholder'],
                category: 'text',
                className: 'LoremGenerator'
            },
            {
                id: 'image-converter',
                title: 'Image Format Converter',
                description: 'Convert images between formats (PNG, JPG, WEBP) using HTML5 Canvas API.',
                icon: '🔄',
                tags: ['Image', 'Convert', 'Format'],
                category: 'image',
                className: 'ImageConverter'
            },
            {
                id: 'password-generator',
                title: 'Password Generator',
                description: 'Generate cryptographically secure passwords using Web Crypto API with customizable options.',
                icon: '🔐',
                tags: ['Password', 'Security', 'Crypto'],
                category: 'security',
                className: 'PasswordGenerator'
            },
            {
                id: 'color-palette',
                title: 'Color Palette Generator',
                description: 'Extract color palettes from images and generate harmonious color schemes.',
                icon: '🎨',
                tags: ['Color', 'Palette', 'Design'],
                category: 'design',
                className: 'ColorPaletteGenerator'
            },
            {
                id: 'markdown-converter',
                title: 'Markdown Converter',
                description: 'Convert Markdown to HTML with real-time preview and syntax highlighting.',
                icon: '📋',
                tags: ['Markdown', 'HTML', 'Preview'],
                category: 'text',
                className: 'MarkdownConverter'
            },
            {
                id: 'json-formatter',
                title: 'JSON Formatter',
                description: 'Format, validate, and beautify JSON data with error highlighting and minification.',
                icon: '📊',
                tags: ['JSON', 'Format', 'Validate'],
                category: 'data',
                className: 'JSONFormatter'
            },
            {
                id: 'url-shortener',
                title: 'URL Shortener',
                description: 'Create shortened URLs with analytics tracking and custom aliases.',
                icon: '🔗',
                tags: ['URL', 'Shorten', 'Analytics'],
                category: 'utility',
                className: 'URLShortener'
            },
            {
                id: 'base64-converter',
                title: 'Base64 Encoder/Decoder',
                description: 'Encode and decode Base64 data with support for text and file uploads.',
                icon: '🔤',
                tags: ['Base64', 'Encode', 'Decode'],
                category: 'utility',
                className: 'Base64Converter'
            },
            {
                id: 'image-optimizer',
                title: 'Image Optimizer',
                description: 'Compress and optimize images with quality controls and size reduction.',
                icon: '⚡',
                tags: ['Image', 'Optimize', 'Compress'],
                category: 'image',
                className: 'ImageOptimizer'
            },
            {
                id: 'hash-generator',
                title: 'Hash Generator',
                description: 'Generate MD5, SHA-256, and other hash algorithms using Web Crypto API.',
                icon: '#️⃣',
                tags: ['Hash', 'MD5', 'SHA-256'],
                category: 'security',
                className: 'HashGenerator'
            }
        ];

        // Register each tool
        toolConfigs.forEach(config => {
            this.tools.set(config.id, config);
        });

        console.log(`📦 Registered ${this.tools.size} tools`);
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Modal close events
        document.addEventListener('click', this.handleModalClose);
        document.addEventListener('keydown', this.handleKeyboardNavigation);
        
        // Navigation toggle for mobile
        const navToggle = document.querySelector('.nav-toggle');
        const navList = document.querySelector('.nav-list');
        
        if (navToggle && navList) {
            navToggle.addEventListener('click', () => {
                const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
                navToggle.setAttribute('aria-expanded', !isExpanded);
                navList.classList.toggle('active');
            });
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').slice(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Window resize handler for responsive adjustments
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 150);
        });

        // Online/offline status
        window.addEventListener('online', () => {
            NotificationManager.show({
                type: 'success',
                title: 'Connection Restored',
                message: 'You are back online.'
            });
        });

        window.addEventListener('offline', () => {
            NotificationManager.show({
                type: 'warning',
                title: 'Connection Lost',
                message: 'You are currently offline. Some features may be limited.'
            });
        });

        console.log('🎧 Event listeners configured');
    }

    /**
     * Render the tools grid
     */
    renderToolsGrid() {
        const toolsGrid = document.querySelector('.tools-grid');
        if (!toolsGrid) {
            throw new Error('Tools grid container not found');
        }

        // Clear existing content
        toolsGrid.innerHTML = '';

        // Create tool cards
        this.tools.forEach((tool, toolId) => {
            const toolCard = this.createToolCard(tool);
            toolsGrid.appendChild(toolCard);
        });

        console.log('🎨 Tools grid rendered');
    }

    /**
     * Create a tool card element
     * @param {Object} tool - Tool configuration
     * @returns {HTMLElement} Tool card element
     */
    createToolCard(tool) {
        const card = document.createElement('div');
        card.className = 'tool-card';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Open ${tool.title} tool`);
        card.dataset.toolId = tool.id;

        card.innerHTML = `
            <span class="tool-icon" aria-hidden="true">${tool.icon}</span>
            <h3 class="tool-title">${tool.title}</h3>
            <p class="tool-description">${tool.description}</p>
            <div class="tool-tags">
                ${tool.tags.map(tag => `<span class="tool-tag">${tag}</span>`).join('')}
            </div>
        `;

        // Add click and keyboard event listeners
        card.addEventListener('click', this.handleToolClick);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.handleToolClick(e);
            }
        });

        return card;
    }

    /**
     * Handle tool card click
     * @param {Event} event - Click event
     */
    async handleToolClick(event) {
        const toolCard = event.currentTarget;
        const toolId = toolCard.dataset.toolId;
        const tool = this.tools.get(toolId);

        if (!tool) {
            console.error(`Tool not found: ${toolId}`);
            return;
        }

        try {
            // Add loading state
            toolCard.style.opacity = '0.7';
            toolCard.style.pointerEvents = 'none';

            await this.openTool(tool);

        } catch (error) {
            console.error(`Error opening tool ${toolId}:`, error);
            NotificationManager.show({
                type: 'error',
                title: 'Tool Error',
                message: `Failed to open ${tool.title}. Please try again.`
            });
        } finally {
            // Remove loading state
            toolCard.style.opacity = '';
            toolCard.style.pointerEvents = '';
        }
    }

    /**
     * Open a tool in the modal
     * @param {Object} tool - Tool configuration
     */
    async openTool(tool) {
        try {
            // Check if tool class exists
            const ToolClass = window[tool.className];
            if (!ToolClass) {
                throw new Error(`Tool class ${tool.className} not found`);
            }

            // Create tool instance
            const toolInstance = new ToolClass();
            this.currentTool = toolInstance;

            // Get tool content
            const content = await toolInstance.render();

            // Open modal with tool content
            ModalManager.open({
                title: tool.title,
                content: content,
                onOpen: async () => {
                    // Initialize tool after modal is open
                    if (typeof toolInstance.init === 'function') {
                        try {
                            await toolInstance.init();
                        } catch (error) {
                            console.error(`Error initializing ${tool.title}:`, error);
                            NotificationManager.error(
                                'Initialization Error',
                                `Failed to initialize ${tool.title}: ${error.message}`
                            );
                        }
                    }
                },
                onClose: () => {
                    // Cleanup tool when modal closes
                    if (typeof toolInstance.cleanup === 'function') {
                        toolInstance.cleanup();
                    }
                    this.currentTool = null;
                }
            });

            // Track tool usage for analytics
            this.trackToolUsage(tool.id);

        } catch (error) {
            throw new Error(`Failed to open tool: ${error.message}`);
        }
    }

    /**
     * Handle modal close events
     * @param {Event} event - Click event
     */
    handleModalClose(event) {
        if (event.target.classList.contains('modal-backdrop') || 
            event.target.classList.contains('modal-close')) {
            ModalManager.close();
        }
    }

    /**
     * Handle keyboard navigation
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyboardNavigation(event) {
        // Close modal with Escape key
        if (event.key === 'Escape') {
            ModalManager.close();
            return;
        }

        // Tool cards navigation with arrow keys
        if (event.target.classList.contains('tool-card')) {
            const cards = Array.from(document.querySelectorAll('.tool-card'));
            const currentIndex = cards.indexOf(event.target);

            let nextIndex = -1;

            switch (event.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    nextIndex = (currentIndex + 1) % cards.length;
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    nextIndex = currentIndex === 0 ? cards.length - 1 : currentIndex - 1;
                    break;
                default:
                    return;
            }

            if (nextIndex !== -1) {
                event.preventDefault();
                cards[nextIndex].focus();
            }
        }
    }

    /**
     * Setup accessibility features
     */
    setupAccessibility() {
        // Add ARIA landmarks if missing
        const main = document.querySelector('main');
        if (main && !main.getAttribute('role')) {
            main.setAttribute('role', 'main');
        }

        // Setup skip navigation
        const skipNav = document.querySelector('.skip-nav');
        if (skipNav) {
            skipNav.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(skipNav.getAttribute('href'));
                if (target) {
                    target.focus();
                    target.scrollIntoView();
                }
            });
        }

        // Announce page changes to screen readers
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.id = 'announcer';
        document.body.appendChild(announcer);

        console.log('♿ Accessibility features configured');
    }

    /**
     * Setup navigation functionality
     */
    setupNavigation() {
        // Highlight current section in navigation
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-list a[href^="#"]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '-100px 0px -100px 0px'
        });

        sections.forEach(section => observer.observe(section));

        console.log('🧭 Navigation configured');
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Close mobile navigation on resize to desktop
        if (window.innerWidth > 768) {
            const navList = document.querySelector('.nav-list');
            const navToggle = document.querySelector('.nav-toggle');
            
            if (navList && navList.classList.contains('active')) {
                navList.classList.remove('active');
                navToggle?.setAttribute('aria-expanded', 'false');
            }
        }

        // Trigger tool resize if current tool supports it
        if (this.currentTool && typeof this.currentTool.handleResize === 'function') {
            this.currentTool.handleResize();
        }
    }

    /**
     * Track tool usage for analytics
     * @param {string} toolId - Tool identifier
     */
    trackToolUsage(toolId) {
        try {
            // Store usage data in localStorage
            const usageKey = 'toolkit-usage';
            const usage = JSON.parse(localStorage.getItem(usageKey) || '{}');
            
            usage[toolId] = (usage[toolId] || 0) + 1;
            usage.lastUsed = new Date().toISOString();
            
            localStorage.setItem(usageKey, JSON.stringify(usage));
            
            // If analytics service is available, send data
            if (typeof gtag !== 'undefined') {
                gtag('event', 'tool_usage', {
                    'tool_id': toolId,
                    'tool_name': this.tools.get(toolId)?.title
                });
            }
            
        } catch (error) {
            console.warn('Failed to track tool usage:', error);
        }
    }

    /**
     * Get usage statistics
     * @returns {Object} Usage statistics
     */
    getUsageStats() {
        try {
            const usageKey = 'toolkit-usage';
            const usage = JSON.parse(localStorage.getItem(usageKey) || '{}');
            
            const stats = {
                totalUsage: 0,
                toolStats: [],
                lastUsed: usage.lastUsed
            };

            // Calculate statistics
            Object.keys(usage).forEach(toolId => {
                if (toolId !== 'lastUsed') {
                    const count = usage[toolId];
                    stats.totalUsage += count;
                    stats.toolStats.push({
                        toolId,
                        count,
                        tool: this.tools.get(toolId)
                    });
                }
            });

            // Sort by usage count
            stats.toolStats.sort((a, b) => b.count - a.count);

            return stats;
            
        } catch (error) {
            console.warn('Failed to get usage stats:', error);
            return { totalUsage: 0, toolStats: [], lastUsed: null };
        }
    }

    /**
     * Export user data
     * @returns {Object} Exportable user data
     */
    exportUserData() {
        try {
            return {
                version: '1.0.0',
                timestamp: new Date().toISOString(),
                theme: ThemeManager.getCurrentTheme(),
                usage: this.getUsageStats(),
                preferences: StorageManager.getItem('user-preferences') || {}
            };
        } catch (error) {
            console.error('Failed to export user data:', error);
            return null;
        }
    }

    /**
     * Import user data
     * @param {Object} data - User data to import
     */
    importUserData(data) {
        try {
            if (!data || !data.version) {
                throw new Error('Invalid data format');
            }

            // Import theme preference
            if (data.theme) {
                ThemeManager.setTheme(data.theme);
            }

            // Import user preferences
            if (data.preferences) {
                StorageManager.setItem('user-preferences', data.preferences);
            }

            // Note: Usage stats are not imported to prevent manipulation

            NotificationManager.show({
                type: 'success',
                title: 'Data Imported',
                message: 'Your settings have been restored successfully.'
            });

        } catch (error) {
            console.error('Failed to import user data:', error);
            NotificationManager.show({
                type: 'error',
                title: 'Import Failed',
                message: 'Failed to import data. Please check the file format.'
            });
        }
    }
}

// Initialize the application
const app = new ToolKitApp();

// Export app instance for debugging and testing
window.ToolKitApp = app;

// Service Worker registration for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
