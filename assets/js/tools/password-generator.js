/**
 * Password Generator Tool
 * Generate cryptographically secure passwords using Web Crypto API
 */

class PasswordGenerator {
    constructor() {
        this.generatedPasswords = [];
        this.maxHistory = 10;
    }

    /**
     * Render the Password Generator interface
     * @returns {string} HTML content for the tool
     */
    async render() {
        return `
            <div class="password-generator-tool">
                <div class="tool-section">
                    <h4>Password Settings</h4>
                    
                    <div class="form-group">
                        <label for="password-length" class="form-label">
                            Password Length: <span id="length-value">16</span>
                        </label>
                        <input 
                            type="range" 
                            id="password-length" 
                            class="form-range" 
                            min="4" 
                            max="128" 
                            value="16"
                            aria-describedby="length-help"
                        >
                        <small id="length-help" class="form-help">
                            Longer passwords are more secure (recommended: 16+ characters)
                        </small>
                    </div>

                    <div class="checkbox-group">
                        <h5>Character Types</h5>
                        <label class="checkbox-label">
                            <input type="checkbox" id="include-uppercase" checked>
                            <span class="checkmark"></span>
                            Uppercase Letters (A-Z)
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" id="include-lowercase" checked>
                            <span class="checkmark"></span>
                            Lowercase Letters (a-z)
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" id="include-numbers" checked>
                            <span class="checkmark"></span>
                            Numbers (0-9)
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" id="include-symbols" checked>
                            <span class="checkmark"></span>
                            Symbols (!@#$%^&*)
                        </label>
                    </div>

                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="exclude-ambiguous">
                            <span class="checkmark"></span>
                            Exclude ambiguous characters (0, O, l, I)
                        </label>
                    </div>

                    <div class="form-group">
                        <label for="exclude-chars" class="form-label">Exclude Characters</label>
                        <input 
                            type="text" 
                            id="exclude-chars" 
                            class="form-input" 
                            placeholder="Characters to exclude..."
                            aria-describedby="exclude-help"
                        >
                        <small id="exclude-help" class="form-help">
                            Enter any characters you want to exclude from the password
                        </small>
                    </div>

                    <div class="form-actions">
                        <button id="generate-password" class="btn btn-primary">
                            🔐 Generate Password
                        </button>
                        <button id="generate-multiple" class="btn btn-secondary">
                            📋 Generate 5 Passwords
                        </button>
                    </div>
                </div>

                <div class="tool-section">
                    <div id="password-output" class="password-output-area">
                        <div class="password-placeholder">
                            <div class="password-placeholder-icon">🔐</div>
                            <p>Your secure password will appear here</p>
                            <small>Click "Generate Password" to create a new password</small>
                        </div>
                    </div>
                </div>

                <div class="tool-section" id="password-strength-section" style="display: none;">
                    <h4>Password Strength</h4>
                    <div class="strength-meter">
                        <div class="strength-bar">
                            <div id="strength-fill" class="strength-fill"></div>
                        </div>
                        <div class="strength-info">
                            <span id="strength-score">-</span>
                            <span id="strength-text">-</span>
                        </div>
                    </div>
                    <div id="strength-details" class="strength-details"></div>
                </div>

                <div class="tool-section" id="password-history-section" style="display: none;">
                    <h4>Password History</h4>
                    <div id="password-history" class="password-history"></div>
                    <button id="clear-history" class="btn btn-outline btn-small">
                        🗑️ Clear History
                    </button>
                </div>

                <div class="tool-section">
                    <h4>Security Tips</h4>
                    <div class="security-tips">
                        <div class="tip">
                            <strong>💡 Use a Password Manager:</strong> 
                            Store generated passwords securely in a password manager.
                        </div>
                        <div class="tip">
                            <strong>🔄 Regular Updates:</strong> 
                            Change passwords regularly, especially for sensitive accounts.
                        </div>
                        <div class="tip">
                            <strong>🔐 Two-Factor Auth:</strong> 
                            Enable 2FA wherever possible for additional security.
                        </div>
                        <div class="tip">
                            <strong>🚫 Never Reuse:</strong> 
                            Use unique passwords for each account.
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Initialize the Password Generator tool
     */
    init() {
        this.setupEventListeners();
        this.updateLengthDisplay();
        this.loadHistory();
        console.log('🔐 Password Generator tool initialized');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Length slider
        const lengthSlider = document.getElementById('password-length');
        lengthSlider?.addEventListener('input', () => this.updateLengthDisplay());

        // Generate buttons
        const generateBtn = document.getElementById('generate-password');
        const generateMultipleBtn = document.getElementById('generate-multiple');
        
        generateBtn?.addEventListener('click', () => this.generateSinglePassword());
        generateMultipleBtn?.addEventListener('click', () => this.generateMultiplePasswords());

        // Clear history
        const clearHistoryBtn = document.getElementById('clear-history');
        clearHistoryBtn?.addEventListener('click', () => this.clearHistory());

        // Settings change handlers
        const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.validateSettings());
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case 'g':
                        e.preventDefault();
                        this.generateSinglePassword();
                        break;
                }
            }
        });

        // Initial validation
        this.validateSettings();
    }

    /**
     * Update length display
     */
    updateLengthDisplay() {
        const lengthSlider = document.getElementById('password-length');
        const lengthValue = document.getElementById('length-value');
        
        if (lengthSlider && lengthValue) {
            lengthValue.textContent = lengthSlider.value;
            
            // Update color based on strength
            const length = parseInt(lengthSlider.value);
            let color = '#ef4444'; // red
            if (length >= 12) color = '#f59e0b'; // yellow
            if (length >= 16) color = '#10b981'; // green
            
            lengthValue.style.color = color;
        }
    }

    /**
     * Validate settings
     */
    validateSettings() {
        const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked');
        const generateBtn = document.getElementById('generate-password');
        const generateMultipleBtn = document.getElementById('generate-multiple');
        
        const isValid = checkboxes.length > 0;
        
        if (generateBtn) generateBtn.disabled = !isValid;
        if (generateMultipleBtn) generateMultipleBtn.disabled = !isValid;
        
        if (!isValid) {
            NotificationManager.warning('Invalid Settings', 'Please select at least one character type');
        }
    }

    /**
     * Generate single password
     */
    async generateSinglePassword() {
        try {
            const password = await this.generatePassword();
            this.displayPassword(password);
            this.addToHistory(password);
            this.analyzeStrength(password);
        } catch (error) {
            console.error('Password generation error:', error);
            NotificationManager.error('Generation Failed', error.message);
        }
    }

    /**
     * Generate multiple passwords
     */
    async generateMultiplePasswords() {
        try {
            const passwords = [];
            for (let i = 0; i < 5; i++) {
                passwords.push(await this.generatePassword());
            }
            
            this.displayMultiplePasswords(passwords);
            passwords.forEach(password => this.addToHistory(password));
            
        } catch (error) {
            console.error('Multiple password generation error:', error);
            NotificationManager.error('Generation Failed', error.message);
        }
    }

    /**
     * Generate password using Web Crypto API
     * @returns {Promise<string>} Generated password
     */
    async generatePassword() {
        const settings = this.getSettings();
        const charset = this.buildCharset(settings);
        
        if (charset.length === 0) {
            throw new Error('No valid characters available for password generation');
        }

        // Use Web Crypto API for cryptographically secure random values
        const array = new Uint32Array(settings.length);
        crypto.getRandomValues(array);

        let password = '';
        for (let i = 0; i < settings.length; i++) {
            password += charset[array[i] % charset.length];
        }

        return password;
    }

    /**
     * Get current settings
     * @returns {Object} Password settings
     */
    getSettings() {
        return {
            length: parseInt(document.getElementById('password-length')?.value) || 16,
            includeUppercase: document.getElementById('include-uppercase')?.checked || false,
            includeLowercase: document.getElementById('include-lowercase')?.checked || false,
            includeNumbers: document.getElementById('include-numbers')?.checked || false,
            includeSymbols: document.getElementById('include-symbols')?.checked || false,
            excludeAmbiguous: document.getElementById('exclude-ambiguous')?.checked || false,
            excludeChars: document.getElementById('exclude-chars')?.value || ''
        };
    }

    /**
     * Build character set based on settings
     * @param {Object} settings - Password settings
     * @returns {string} Character set
     */
    buildCharset(settings) {
        let charset = '';

        if (settings.includeUppercase) {
            charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        }

        if (settings.includeLowercase) {
            charset += 'abcdefghijklmnopqrstuvwxyz';
        }

        if (settings.includeNumbers) {
            charset += '0123456789';
        }

        if (settings.includeSymbols) {
            charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
        }

        // Remove ambiguous characters if requested
        if (settings.excludeAmbiguous) {
            charset = charset.replace(/[0Ol1]/g, '');
        }

        // Remove custom excluded characters
        if (settings.excludeChars) {
            const excludeRegex = new RegExp(`[${this.escapeRegExp(settings.excludeChars)}]`, 'g');
            charset = charset.replace(excludeRegex, '');
        }

        return charset;
    }

    /**
     * Escape string for regex
     * @param {string} string - String to escape
     * @returns {string} Escaped string
     */
    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Display generated password
     * @param {string} password - Generated password
     */
    displayPassword(password) {
        const output = document.getElementById('password-output');
        if (!output) return;

        output.innerHTML = `
            <div class="generated-password">
                <div class="password-container">
                    <input 
                        type="text" 
                        id="password-display" 
                        class="password-display" 
                        value="${password}" 
                        readonly
                    >
                    <button id="copy-password" class="btn btn-outline copy-btn" title="Copy password">
                        📋
                    </button>
                    <button id="toggle-visibility" class="btn btn-outline visibility-btn" title="Toggle visibility">
                        👁️
                    </button>
                </div>
                <div class="password-actions">
                    <button id="regenerate" class="btn btn-secondary">🔄 Generate New</button>
                    <button id="save-password" class="btn btn-outline">💾 Save to History</button>
                </div>
            </div>
        `;

        // Setup password actions
        this.setupPasswordActions(password);
    }

    /**
     * Display multiple passwords
     * @param {string[]} passwords - Generated passwords
     */
    displayMultiplePasswords(passwords) {
        const output = document.getElementById('password-output');
        if (!output) return;

        const passwordsHtml = passwords.map((password, index) => `
            <div class="password-item">
                <span class="password-number">${index + 1}.</span>
                <input 
                    type="text" 
                    class="password-display small" 
                    value="${password}" 
                    readonly
                >
                <button class="btn btn-outline btn-small copy-btn" data-password="${password}" title="Copy">
                    📋
                </button>
            </div>
        `).join('');

        output.innerHTML = `
            <div class="multiple-passwords">
                <h4>Generated Passwords</h4>
                <div class="passwords-list">
                    ${passwordsHtml}
                </div>
                <div class="bulk-actions">
                    <button id="copy-all" class="btn btn-secondary">📋 Copy All</button>
                    <button id="regenerate-all" class="btn btn-outline">🔄 Generate New Set</button>
                </div>
            </div>
        `;

        // Setup multiple password actions
        this.setupMultiplePasswordActions(passwords);
    }

    /**
     * Setup password action buttons
     * @param {string} password - Current password
     */
    setupPasswordActions(password) {
        // Copy button
        const copyBtn = document.getElementById('copy-password');
        copyBtn?.addEventListener('click', () => this.copyPassword(password));

        // Visibility toggle
        const toggleBtn = document.getElementById('toggle-visibility');
        const passwordInput = document.getElementById('password-display');
        
        toggleBtn?.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            toggleBtn.textContent = isPassword ? '🙈' : '👁️';
            toggleBtn.title = isPassword ? 'Hide password' : 'Show password';
        });

        // Regenerate button
        const regenerateBtn = document.getElementById('regenerate');
        regenerateBtn?.addEventListener('click', () => this.generateSinglePassword());

        // Save button
        const saveBtn = document.getElementById('save-password');
        saveBtn?.addEventListener('click', () => {
            this.addToHistory(password);
            NotificationManager.success('Saved!', 'Password added to history');
        });
    }

    /**
     * Setup multiple password actions
     * @param {string[]} passwords - Generated passwords
     */
    setupMultiplePasswordActions(passwords) {
        // Individual copy buttons
        const copyBtns = document.querySelectorAll('.copy-btn[data-password]');
        copyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.copyPassword(btn.dataset.password);
            });
        });

        // Copy all button
        const copyAllBtn = document.getElementById('copy-all');
        copyAllBtn?.addEventListener('click', () => {
            const allPasswords = passwords.join('\n');
            this.copyPassword(allPasswords);
        });

        // Regenerate all button
        const regenerateAllBtn = document.getElementById('regenerate-all');
        regenerateAllBtn?.addEventListener('click', () => this.generateMultiplePasswords());
    }

    /**
     * Copy password to clipboard
     * @param {string} password - Password to copy
     */
    async copyPassword(password) {
        try {
            await navigator.clipboard.writeText(password);
            NotificationManager.success('Copied!', 'Password copied to clipboard');
        } catch (error) {
            console.error('Copy error:', error);
            NotificationManager.error('Copy Failed', 'Unable to copy password to clipboard');
        }
    }

    /**
     * Analyze password strength
     * @param {string} password - Password to analyze
     */
    analyzeStrength(password) {
        const analysis = this.calculateStrength(password);
        
        // Show strength section
        const strengthSection = document.getElementById('password-strength-section');
        if (strengthSection) {
            strengthSection.style.display = 'block';
        }

        // Update strength meter
        const strengthFill = document.getElementById('strength-fill');
        const strengthScore = document.getElementById('strength-score');
        const strengthText = document.getElementById('strength-text');
        const strengthDetails = document.getElementById('strength-details');

        if (strengthFill && strengthScore && strengthText && strengthDetails) {
            strengthFill.style.width = `${analysis.percentage}%`;
            strengthFill.className = `strength-fill strength-${analysis.level}`;
            
            strengthScore.textContent = `${analysis.score}/100`;
            strengthText.textContent = analysis.text;
            
            strengthDetails.innerHTML = `
                <div class="strength-criteria">
                    ${analysis.criteria.map(criterion => `
                        <div class="criterion ${criterion.met ? 'met' : 'unmet'}">
                            <span class="criterion-icon">${criterion.met ? '✅' : '❌'}</span>
                            <span class="criterion-text">${criterion.text}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="strength-time">
                    <strong>Estimated crack time:</strong> ${analysis.crackTime}
                </div>
            `;
        }
    }

    /**
     * Calculate password strength
     * @param {string} password - Password to analyze
     * @returns {Object} Strength analysis
     */
    calculateStrength(password) {
        let score = 0;
        const criteria = [];

        // Length check
        const lengthCriterion = { text: 'At least 12 characters', met: password.length >= 12 };
        criteria.push(lengthCriterion);
        if (lengthCriterion.met) score += 25;

        // Character variety checks
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSymbols = /[^A-Za-z0-9]/.test(password);

        criteria.push({ text: 'Contains uppercase letters', met: hasUpper });
        criteria.push({ text: 'Contains lowercase letters', met: hasLower });
        criteria.push({ text: 'Contains numbers', met: hasNumbers });
        criteria.push({ text: 'Contains symbols', met: hasSymbols });

        const varietyScore = [hasUpper, hasLower, hasNumbers, hasSymbols].filter(Boolean).length;
        score += varietyScore * 15;

        // No repeated characters
        const hasNoRepeats = !/(.)\1{2,}/.test(password);
        criteria.push({ text: 'No repeated characters', met: hasNoRepeats });
        if (hasNoRepeats) score += 10;

        // No common patterns
        const hasNoPatterns = !/123|abc|qwe|password|admin/i.test(password);
        criteria.push({ text: 'No common patterns', met: hasNoPatterns });
        if (hasNoPatterns) score += 10;

        // Determine strength level and text
        let level, text, crackTime;
        if (score >= 90) {
            level = 'excellent';
            text = 'Excellent';
            crackTime = 'Centuries';
        } else if (score >= 70) {
            level = 'strong';
            text = 'Strong';
            crackTime = 'Years';
        } else if (score >= 50) {
            level = 'medium';
            text = 'Medium';
            crackTime = 'Months';
        } else if (score >= 30) {
            level = 'weak';
            text = 'Weak';
            crackTime = 'Days';
        } else {
            level = 'very-weak';
            text = 'Very Weak';
            crackTime = 'Minutes';
        }

        return {
            score: Math.min(score, 100),
            percentage: Math.min(score, 100),
            level,
            text,
            crackTime,
            criteria
        };
    }

    /**
     * Add password to history
     * @param {string} password - Password to add
     */
    addToHistory(password) {
        // Add to memory
        this.generatedPasswords.unshift({
            password,
            timestamp: new Date().toISOString(),
            strength: this.calculateStrength(password)
        });

        // Limit history size
        if (this.generatedPasswords.length > this.maxHistory) {
            this.generatedPasswords = this.generatedPasswords.slice(0, this.maxHistory);
        }

        // Save to storage
        this.saveHistory();

        // Update display
        this.updateHistoryDisplay();
    }

    /**
     * Update history display
     */
    updateHistoryDisplay() {
        const historySection = document.getElementById('password-history-section');
        const historyContainer = document.getElementById('password-history');

        if (!historyContainer) return;

        if (this.generatedPasswords.length === 0) {
            historySection.style.display = 'none';
            return;
        }

        historySection.style.display = 'block';

        const historyHtml = this.generatedPasswords.map((item, index) => `
            <div class="history-item">
                <div class="history-password">
                    <input 
                        type="password" 
                        class="password-display small" 
                        value="${item.password}" 
                        readonly
                        id="history-${index}"
                    >
                    <button class="btn btn-outline btn-small copy-btn" data-password="${item.password}">
                        📋
                    </button>
                    <button class="btn btn-outline btn-small toggle-btn" data-target="history-${index}">
                        👁️
                    </button>
                </div>
                <div class="history-meta">
                    <span class="history-strength strength-${item.strength.level}">
                        ${item.strength.text}
                    </span>
                    <span class="history-time">
                        ${this.formatTime(item.timestamp)}
                    </span>
                </div>
            </div>
        `).join('');

        historyContainer.innerHTML = historyHtml;

        // Setup history action buttons
        this.setupHistoryActions();
    }

    /**
     * Setup history action buttons
     */
    setupHistoryActions() {
        // Copy buttons
        const copyBtns = document.querySelectorAll('.history-item .copy-btn');
        copyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.copyPassword(btn.dataset.password);
            });
        });

        // Toggle visibility buttons
        const toggleBtns = document.querySelectorAll('.history-item .toggle-btn');
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.dataset.target;
                const passwordInput = document.getElementById(targetId);
                
                if (passwordInput) {
                    const isPassword = passwordInput.type === 'password';
                    passwordInput.type = isPassword ? 'text' : 'password';
                    btn.textContent = isPassword ? '🙈' : '👁️';
                }
            });
        });
    }

    /**
     * Format timestamp for display
     * @param {string} timestamp - ISO timestamp
     * @returns {string} Formatted time
     */
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return date.toLocaleDateString();
    }

    /**
     * Save history to localStorage
     */
    saveHistory() {
        try {
            StorageManager.setItem('password-history', this.generatedPasswords);
        } catch (error) {
            console.warn('Failed to save password history:', error);
        }
    }

    /**
     * Load history from localStorage
     */
    loadHistory() {
        try {
            const history = StorageManager.getItem('password-history', []);
            if (Array.isArray(history)) {
                this.generatedPasswords = history.slice(0, this.maxHistory);
                this.updateHistoryDisplay();
            }
        } catch (error) {
            console.warn('Failed to load password history:', error);
        }
    }

    /**
     * Clear password history
     */
    clearHistory() {
        this.generatedPasswords = [];
        this.saveHistory();
        this.updateHistoryDisplay();
        
        NotificationManager.success('Cleared!', 'Password history has been cleared');
    }

    /**
     * Cleanup tool resources
     */
    cleanup() {
        // Clear sensitive data from memory
        this.generatedPasswords = [];
        
        console.log('🔐 Password Generator tool cleaned up');
    }
}

// Export for use in the application
window.PasswordGenerator = PasswordGenerator;
