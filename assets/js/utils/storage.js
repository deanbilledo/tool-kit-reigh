/**
 * Storage Manager - Handle localStorage operations with error handling
 * Provides a safe wrapper around localStorage with fallback support
 */

class StorageManager {
    static isSupported = (() => {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    })();

    /**
     * Get item from localStorage
     * @param {string} key - Storage key
     * @param {any} defaultValue - Default value if key doesn't exist
     * @returns {any} Stored value or default
     */
    static getItem(key, defaultValue = null) {
        if (!this.isSupported) {
            console.warn('localStorage not supported, using default value');
            return defaultValue;
        }

        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`Error getting item from storage (${key}):`, error);
            return defaultValue;
        }
    }

    /**
     * Set item in localStorage
     * @param {string} key - Storage key
     * @param {any} value - Value to store
     * @returns {boolean} Success status
     */
    static setItem(key, value) {
        if (!this.isSupported) {
            console.warn('localStorage not supported, cannot save data');
            return false;
        }

        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error setting item in storage (${key}):`, error);
            return false;
        }
    }

    /**
     * Remove item from localStorage
     * @param {string} key - Storage key
     * @returns {boolean} Success status
     */
    static removeItem(key) {
        if (!this.isSupported) {
            console.warn('localStorage not supported');
            return false;
        }

        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing item from storage (${key}):`, error);
            return false;
        }
    }

    /**
     * Clear all localStorage
     * @returns {boolean} Success status
     */
    static clear() {
        if (!this.isSupported) {
            console.warn('localStorage not supported');
            return false;
        }

        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    }

    /**
     * Get all keys from localStorage
     * @returns {string[]} Array of storage keys
     */
    static getKeys() {
        if (!this.isSupported) {
            return [];
        }

        try {
            return Object.keys(localStorage);
        } catch (error) {
            console.error('Error getting storage keys:', error);
            return [];
        }
    }

    /**
     * Get storage usage information
     * @returns {Object} Storage usage stats
     */
    static getUsageInfo() {
        if (!this.isSupported) {
            return { used: 0, available: 0, percentage: 0 };
        }

        try {
            let used = 0;
            const keys = Object.keys(localStorage);
            
            keys.forEach(key => {
                used += localStorage.getItem(key).length + key.length;
            });

            // Estimate available space (most browsers allow ~5-10MB)
            const estimated = 5 * 1024 * 1024; // 5MB estimate
            const percentage = (used / estimated) * 100;

            return {
                used: used,
                available: estimated - used,
                percentage: Math.min(percentage, 100),
                keysCount: keys.length
            };
        } catch (error) {
            console.error('Error getting storage usage info:', error);
            return { used: 0, available: 0, percentage: 0, keysCount: 0 };
        }
    }

    /**
     * Export all storage data
     * @returns {Object} All storage data
     */
    static exportAll() {
        if (!this.isSupported) {
            return {};
        }

        try {
            const data = {};
            const keys = Object.keys(localStorage);
            
            keys.forEach(key => {
                data[key] = this.getItem(key);
            });

            return data;
        } catch (error) {
            console.error('Error exporting storage data:', error);
            return {};
        }
    }

    /**
     * Import storage data
     * @param {Object} data - Data to import
     * @param {boolean} merge - Whether to merge with existing data
     * @returns {boolean} Success status
     */
    static importAll(data, merge = true) {
        if (!this.isSupported) {
            return false;
        }

        try {
            if (!merge) {
                this.clear();
            }

            Object.keys(data).forEach(key => {
                this.setItem(key, data[key]);
            });

            return true;
        } catch (error) {
            console.error('Error importing storage data:', error);
            return false;
        }
    }

    /**
     * Create a namespaced storage manager
     * @param {string} namespace - Namespace prefix
     * @returns {Object} Namespaced storage methods
     */
    static createNamespace(namespace) {
        const prefix = `${namespace}_`;

        return {
            getItem: (key, defaultValue) => this.getItem(prefix + key, defaultValue),
            setItem: (key, value) => this.setItem(prefix + key, value),
            removeItem: (key) => this.removeItem(prefix + key),
            getKeys: () => this.getKeys().filter(key => key.startsWith(prefix)).map(key => key.slice(prefix.length)),
            clear: () => {
                const keys = this.getKeys().filter(key => key.startsWith(prefix));
                keys.forEach(key => this.removeItem(key));
            }
        };
    }
}

// Export for use in other modules
window.StorageManager = StorageManager;
