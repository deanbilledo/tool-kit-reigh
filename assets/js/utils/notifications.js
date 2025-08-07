/**
 * Notification Manager - Handle toast notifications with multiple types
 * Provides accessible notifications with auto-dismiss and manual controls
 */

class NotificationManager {
    static notifications = new Map();
    static container = null;
    static autoCloseDelay = 5000; // 5 seconds default
    static maxNotifications = 5;

    /**
     * Initialize the notification system
     */
    static init() {
        this.container = document.getElementById('toast-container');
        if (!this.container) {
            console.warn('Toast container not found, creating one');
            this.createContainer();
        }
        console.log('📢 Notification system initialized');
    }

    /**
     * Create toast container if it doesn't exist
     */
    static createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        this.container.className = 'toast-container';
        this.container.setAttribute('aria-live', 'polite');
        this.container.setAttribute('aria-atomic', 'true');
        document.body.appendChild(this.container);
    }

    /**
     * Show a notification
     * @param {Object} options - Notification options
     * @param {string} options.type - Type ('success', 'error', 'warning', 'info')
     * @param {string} options.title - Notification title
     * @param {string} options.message - Notification message
     * @param {number} options.duration - Auto-close duration (0 for no auto-close)
     * @param {boolean} options.closable - Whether notification can be manually closed
     * @param {Function} options.onClick - Click callback
     * @param {Function} options.onClose - Close callback
     * @returns {string} Notification ID
     */
    static show(options = {}) {
        // Ensure container exists
        if (!this.container) {
            this.init();
        }

        // Validate options
        const {
            type = 'info',
            title = '',
            message = '',
            duration = this.autoCloseDelay,
            closable = true,
            onClick = null,
            onClose = null
        } = options;

        // Validate type
        const validTypes = ['success', 'error', 'warning', 'info'];
        const notificationType = validTypes.includes(type) ? type : 'info';

        // Generate unique ID
        const id = this.generateId();

        // Create notification element
        const notification = this.createNotification({
            id,
            type: notificationType,
            title,
            message,
            closable,
            onClick,
            onClose
        });

        // Limit number of notifications
        this.enforceMaxNotifications();

        // Add to container and tracking
        this.container.appendChild(notification);
        this.notifications.set(id, {
            element: notification,
            options: { type: notificationType, title, message, duration, closable, onClick, onClose }
        });

        // Trigger entrance animation
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Setup auto-close if duration is set
        if (duration > 0) {
            setTimeout(() => {
                this.close(id);
            }, duration);
        }

        // Announce to screen readers
        this.announceToScreenReader(title, message, notificationType);

        console.log(`📢 Showed ${notificationType} notification: ${title}`);
        return id;
    }

    /**
     * Create notification element
     * @param {Object} config - Notification configuration
     * @returns {HTMLElement} Notification element
     */
    static createNotification(config) {
        const { id, type, title, message, closable, onClick, onClose } = config;

        const notification = document.createElement('div');
        notification.className = `toast toast-${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'assertive');
        notification.setAttribute('data-notification-id', id);

        // Create notification content
        const header = document.createElement('div');
        header.className = 'toast-header';

        const titleElement = document.createElement('div');
        titleElement.className = 'toast-title';
        titleElement.textContent = title;

        header.appendChild(titleElement);

        // Add close button if closable
        if (closable) {
            const closeButton = document.createElement('button');
            closeButton.className = 'toast-close';
            closeButton.setAttribute('aria-label', 'Close notification');
            closeButton.innerHTML = '×';
            closeButton.addEventListener('click', () => {
                this.close(id);
                if (onClose) onClose();
            });
            header.appendChild(closeButton);
        }

        notification.appendChild(header);

        // Add message if provided
        if (message) {
            const messageElement = document.createElement('div');
            messageElement.className = 'toast-message';
            messageElement.textContent = message;
            notification.appendChild(messageElement);
        }

        // Add click handler if provided
        if (onClick) {
            notification.style.cursor = 'pointer';
            notification.addEventListener('click', (e) => {
                // Don't trigger on close button click
                if (!e.target.classList.contains('toast-close')) {
                    onClick(e, id);
                }
            });
        }

        // Add keyboard support
        if (closable) {
            notification.setAttribute('tabindex', '0');
            notification.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.close(id);
                    if (onClose) onClose();
                }
            });
        }

        return notification;
    }

    /**
     * Close notification by ID
     * @param {string} id - Notification ID
     */
    static close(id) {
        const notification = this.notifications.get(id);
        if (!notification) return;

        const element = notification.element;

        // Trigger exit animation
        element.classList.remove('show');

        // Remove after animation
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
            this.notifications.delete(id);
        }, 300);

        console.log(`📢 Closed notification: ${id}`);
    }

    /**
     * Close all notifications
     */
    static closeAll() {
        const notificationIds = Array.from(this.notifications.keys());
        notificationIds.forEach(id => this.close(id));
    }

    /**
     * Close notifications by type
     * @param {string} type - Notification type to close
     */
    static closeByType(type) {
        this.notifications.forEach((notification, id) => {
            if (notification.options.type === type) {
                this.close(id);
            }
        });
    }

    /**
     * Generate unique notification ID
     * @returns {string} Unique ID
     */
    static generateId() {
        return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Enforce maximum number of notifications
     */
    static enforceMaxNotifications() {
        if (this.notifications.size >= this.maxNotifications) {
            // Close oldest notification
            const oldestId = this.notifications.keys().next().value;
            this.close(oldestId);
        }
    }

    /**
     * Announce notification to screen readers
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     * @param {string} type - Notification type
     */
    static announceToScreenReader(title, message, type) {
        const announcer = document.getElementById('announcer');
        if (!announcer) return;

        const announcement = `${type} notification: ${title}${message ? '. ' + message : ''}`;
        announcer.textContent = announcement;

        // Clear announcement after a short delay
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    }

    /**
     * Show success notification
     * @param {string} title - Title
     * @param {string} message - Message
     * @param {Object} options - Additional options
     * @returns {string} Notification ID
     */
    static success(title, message = '', options = {}) {
        return this.show({
            ...options,
            type: 'success',
            title,
            message
        });
    }

    /**
     * Show error notification
     * @param {string} title - Title
     * @param {string} message - Message
     * @param {Object} options - Additional options
     * @returns {string} Notification ID
     */
    static error(title, message = '', options = {}) {
        return this.show({
            ...options,
            type: 'error',
            title,
            message,
            duration: 0 // Errors don't auto-close by default
        });
    }

    /**
     * Show warning notification
     * @param {string} title - Title
     * @param {string} message - Message
     * @param {Object} options - Additional options
     * @returns {string} Notification ID
     */
    static warning(title, message = '', options = {}) {
        return this.show({
            ...options,
            type: 'warning',
            title,
            message
        });
    }

    /**
     * Show info notification
     * @param {string} title - Title
     * @param {string} message - Message
     * @param {Object} options - Additional options
     * @returns {string} Notification ID
     */
    static info(title, message = '', options = {}) {
        return this.show({
            ...options,
            type: 'info',
            title,
            message
        });
    }

    /**
     * Update notification
     * @param {string} id - Notification ID
     * @param {Object} updates - Properties to update
     */
    static update(id, updates) {
        const notification = this.notifications.get(id);
        if (!notification) return;

        const element = notification.element;

        // Update title
        if (updates.title !== undefined) {
            const titleElement = element.querySelector('.toast-title');
            if (titleElement) {
                titleElement.textContent = updates.title;
            }
        }

        // Update message
        if (updates.message !== undefined) {
            const messageElement = element.querySelector('.toast-message');
            if (messageElement) {
                messageElement.textContent = updates.message;
            } else if (updates.message) {
                // Create message element if it doesn't exist
                const newMessageElement = document.createElement('div');
                newMessageElement.className = 'toast-message';
                newMessageElement.textContent = updates.message;
                element.appendChild(newMessageElement);
            }
        }

        // Update type
        if (updates.type !== undefined) {
            const oldType = notification.options.type;
            element.classList.remove(`toast-${oldType}`);
            element.classList.add(`toast-${updates.type}`);
            notification.options.type = updates.type;
        }

        // Update stored options
        Object.assign(notification.options, updates);
    }

    /**
     * Get notification by ID
     * @param {string} id - Notification ID
     * @returns {Object|null} Notification object or null
     */
    static get(id) {
        return this.notifications.get(id) || null;
    }

    /**
     * Get all active notifications
     * @returns {Map} Map of all notifications
     */
    static getAll() {
        return new Map(this.notifications);
    }

    /**
     * Check if notification exists
     * @param {string} id - Notification ID
     * @returns {boolean} True if notification exists
     */
    static exists(id) {
        return this.notifications.has(id);
    }

    /**
     * Set global auto-close delay
     * @param {number} delay - Delay in milliseconds
     */
    static setAutoCloseDelay(delay) {
        this.autoCloseDelay = Math.max(0, delay);
    }

    /**
     * Set maximum number of notifications
     * @param {number} max - Maximum number
     */
    static setMaxNotifications(max) {
        this.maxNotifications = Math.max(1, max);
    }

    /**
     * Get notification statistics
     * @returns {Object} Statistics object
     */
    static getStats() {
        const stats = {
            total: this.notifications.size,
            byType: {
                success: 0,
                error: 0,
                warning: 0,
                info: 0
            }
        };

        this.notifications.forEach(notification => {
            const type = notification.options.type;
            if (stats.byType.hasOwnProperty(type)) {
                stats.byType[type]++;
            }
        });

        return stats;
    }
}

// Auto-initialize when loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => NotificationManager.init());
} else {
    NotificationManager.init();
}

// Export for use in other modules
window.NotificationManager = NotificationManager;
