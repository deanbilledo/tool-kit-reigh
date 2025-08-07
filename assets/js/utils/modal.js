/**
 * Modal Manager - Handle modal dialogs with accessibility support
 * Provides flexible modal system with keyboard navigation and focus management
 */

class ModalManager {
    static currentModal = null;
    static isOpen = false;
    static focusableSelectors = [
        'button',
        '[href]',
        'input',
        'select',
        'textarea',
        '[tabindex]:not([tabindex="-1"])'
    ].join(',');

    /**
     * Open modal with content
     * @param {Object} options - Modal options
     * @param {string} options.title - Modal title
     * @param {string|HTMLElement} options.content - Modal content
     * @param {string} options.size - Modal size ('small', 'medium', 'large')
     * @param {boolean} options.closable - Whether modal can be closed
     * @param {Function} options.onOpen - Callback when modal opens
     * @param {Function} options.onClose - Callback when modal closes
     * @param {Function} options.onBeforeClose - Callback before modal closes (can prevent close)
     */
    static open(options = {}) {
        const {
            title = '',
            content = '',
            size = 'medium',
            closable = true,
            onOpen = null,
            onClose = null,
            onBeforeClose = null
        } = options;

        // Close existing modal if open
        if (this.isOpen) {
            this.close();
        }

        // Get modal element
        const modal = document.getElementById('tool-modal');
        if (!modal) {
            console.error('Modal element not found');
            return;
        }

        // Store current modal state
        this.currentModal = {
            element: modal,
            options: { title, content, size, closable, onOpen, onClose, onBeforeClose },
            previousFocus: document.activeElement
        };

        // Set modal content
        this.setTitle(title);
        this.setContent(content);
        this.setSize(size);

        // Configure close button
        const closeButton = modal.querySelector('.modal-close');
        if (closeButton) {
            closeButton.style.display = closable ? 'block' : 'none';
        }

        // Show modal
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        this.isOpen = true;

        // Manage focus and accessibility
        this.setupAccessibility();
        this.setupKeyboardNavigation();
        this.trapFocus();

        // Prevent body scrolling
        document.body.style.overflow = 'hidden';

        // Call onOpen callback
        if (onOpen && typeof onOpen === 'function') {
            try {
                onOpen();
            } catch (error) {
                console.error('Error in modal onOpen callback:', error);
            }
        }

        console.log('📱 Modal opened:', title);
    }

    /**
     * Close current modal
     * @param {boolean} force - Force close even if onBeforeClose prevents it
     */
    static close(force = false) {
        if (!this.isOpen || !this.currentModal) return;

        // Check if close is allowed
        if (!force && this.currentModal.options.onBeforeClose) {
            try {
                const allowClose = this.currentModal.options.onBeforeClose();
                if (allowClose === false) {
                    return;
                }
            } catch (error) {
                console.error('Error in modal onBeforeClose callback:', error);
            }
        }

        const modal = this.currentModal.element;

        // Hide modal
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');

        // Restore body scrolling
        document.body.style.overflow = '';

        // Restore focus to previous element
        if (this.currentModal.previousFocus && typeof this.currentModal.previousFocus.focus === 'function') {
            try {
                this.currentModal.previousFocus.focus();
            } catch (error) {
                // Element might not be focusable anymore
                document.body.focus();
            }
        }

        // Call onClose callback
        if (this.currentModal.options.onClose && typeof this.currentModal.options.onClose === 'function') {
            try {
                this.currentModal.options.onClose();
            } catch (error) {
                console.error('Error in modal onClose callback:', error);
            }
        }

        // Clear modal state
        const title = this.currentModal.options.title;
        this.currentModal = null;
        this.isOpen = false;

        console.log('📱 Modal closed:', title);
    }

    /**
     * Set modal title
     * @param {string} title - Modal title
     */
    static setTitle(title) {
        if (!this.currentModal) return;

        const titleElement = this.currentModal.element.querySelector('.modal-title');
        if (titleElement) {
            titleElement.textContent = title;
        }

        // Update aria-labelledby
        this.currentModal.element.setAttribute('aria-labelledby', 'modal-title');
    }

    /**
     * Set modal content
     * @param {string|HTMLElement} content - Modal content
     */
    static setContent(content) {
        if (!this.currentModal) return;

        const contentElement = this.currentModal.element.querySelector('#tool-content');
        if (!contentElement) return;

        // Clear existing content
        contentElement.innerHTML = '';

        // Set new content
        if (typeof content === 'string') {
            contentElement.innerHTML = content;
        } else if (content instanceof HTMLElement) {
            contentElement.appendChild(content);
        } else if (content && content.nodeType) {
            contentElement.appendChild(content);
        }
    }

    /**
     * Set modal size
     * @param {string} size - Modal size ('small', 'medium', 'large')
     */
    static setSize(size) {
        if (!this.currentModal) return;

        const container = this.currentModal.element.querySelector('.modal-container');
        if (!container) return;

        // Remove existing size classes
        container.classList.remove('modal-small', 'modal-medium', 'modal-large');

        // Add new size class
        const validSizes = ['small', 'medium', 'large'];
        const modalSize = validSizes.includes(size) ? size : 'medium';
        container.classList.add(`modal-${modalSize}`);
    }

    /**
     * Setup accessibility features
     */
    static setupAccessibility() {
        if (!this.currentModal) return;

        const modal = this.currentModal.element;

        // Set ARIA attributes
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');

        // Hide other content from screen readers
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.setAttribute('aria-hidden', 'true');
        }

        const header = document.querySelector('header');
        if (header) {
            header.setAttribute('aria-hidden', 'true');
        }

        const footer = document.querySelector('footer');
        if (footer) {
            footer.setAttribute('aria-hidden', 'true');
        }
    }

    /**
     * Setup keyboard navigation
     */
    static setupKeyboardNavigation() {
        if (!this.currentModal) return;

        const modal = this.currentModal.element;

        // Handle escape key
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && this.currentModal?.options.closable !== false) {
                e.preventDefault();
                this.close();
            }
        };

        // Add event listener
        document.addEventListener('keydown', handleKeyDown);

        // Store reference for cleanup
        this.currentModal.keydownHandler = handleKeyDown;
    }

    /**
     * Trap focus within modal
     */
    static trapFocus() {
        if (!this.currentModal) return;

        const modal = this.currentModal.element;
        const focusableElements = modal.querySelectorAll(this.focusableSelectors);
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        // Focus first focusable element
        if (firstFocusable) {
            setTimeout(() => firstFocusable.focus(), 100);
        }

        // Handle tab navigation
        const handleTabKey = (e) => {
            if (e.key !== 'Tab' || !this.isOpen) return;

            if (e.shiftKey) {
                // Shift + Tab (backwards)
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable?.focus();
                }
            } else {
                // Tab (forwards)
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable?.focus();
                }
            }
        };

        // Add event listener
        document.addEventListener('keydown', handleTabKey);

        // Store reference for cleanup
        this.currentModal.tabHandler = handleTabKey;
    }

    /**
     * Update modal content
     * @param {string|HTMLElement} content - New content
     */
    static updateContent(content) {
        this.setContent(content);
    }

    /**
     * Update modal title
     * @param {string} title - New title
     */
    static updateTitle(title) {
        this.setTitle(title);
    }

    /**
     * Check if modal is currently open
     * @returns {boolean} True if modal is open
     */
    static isModalOpen() {
        return this.isOpen;
    }

    /**
     * Get current modal information
     * @returns {Object|null} Current modal info or null
     */
    static getCurrentModal() {
        return this.currentModal ? {
            title: this.currentModal.options.title,
            size: this.currentModal.options.size,
            closable: this.currentModal.options.closable
        } : null;
    }

    /**
     * Add content to modal footer
     * @param {string|HTMLElement} content - Footer content
     */
    static setFooterContent(content) {
        if (!this.currentModal) return;

        const footer = this.currentModal.element.querySelector('.modal-footer .tool-actions');
        if (!footer) return;

        // Clear existing content
        footer.innerHTML = '';

        // Set new content
        if (typeof content === 'string') {
            footer.innerHTML = content;
        } else if (content instanceof HTMLElement) {
            footer.appendChild(content);
        }
    }

    /**
     * Show loading state in modal
     * @param {string} message - Loading message
     */
    static showLoading(message = 'Loading...') {
        const loadingContent = `
            <div class="modal-loading">
                <div class="spinner"></div>
                <span class="loading-text">${message}</span>
            </div>
        `;
        this.setContent(loadingContent);
    }

    /**
     * Show error state in modal
     * @param {string} message - Error message
     * @param {Function} onRetry - Retry callback
     */
    static showError(message = 'An error occurred', onRetry = null) {
        const retryButton = onRetry ? `
            <button class="btn btn-primary" onclick="(${onRetry.toString()})()">
                Try Again
            </button>
        ` : '';

        const errorContent = `
            <div class="modal-error">
                <div class="error-icon">⚠️</div>
                <h3>Error</h3>
                <p>${message}</p>
                ${retryButton}
            </div>
        `;
        this.setContent(errorContent);
    }

    /**
     * Cleanup modal resources
     */
    static cleanup() {
        if (!this.currentModal) return;

        // Remove event listeners
        if (this.currentModal.keydownHandler) {
            document.removeEventListener('keydown', this.currentModal.keydownHandler);
        }

        if (this.currentModal.tabHandler) {
            document.removeEventListener('keydown', this.currentModal.tabHandler);
        }

        // Restore ARIA attributes
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.removeAttribute('aria-hidden');
        }

        const header = document.querySelector('header');
        if (header) {
            header.removeAttribute('aria-hidden');
        }

        const footer = document.querySelector('footer');
        if (footer) {
            footer.removeAttribute('aria-hidden');
        }
    }

    /**
     * Resize modal to fit content
     */
    static resize() {
        if (!this.currentModal) return;

        const container = this.currentModal.element.querySelector('.modal-container');
        if (!container) return;

        // Trigger reflow to recalculate dimensions
        container.style.height = 'auto';
        
        // Get viewport dimensions
        const viewportHeight = window.innerHeight;
        const maxHeight = viewportHeight * 0.9; // 90% of viewport

        // Apply max height if needed
        if (container.scrollHeight > maxHeight) {
            container.style.maxHeight = `${maxHeight}px`;
            container.style.overflowY = 'auto';
        }
    }
}

// Setup global modal close handlers
document.addEventListener('DOMContentLoaded', () => {
    // Close modal when clicking backdrop
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-backdrop')) {
            ModalManager.close();
        }
    });

    // Close modal when clicking close button
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-close')) {
            ModalManager.close();
        }
    });
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    ModalManager.cleanup();
});

// Export for use in other modules
window.ModalManager = ModalManager;
