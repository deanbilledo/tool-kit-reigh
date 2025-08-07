/**
 * QR Code Generator Tool
 * Generate QR codes from text or URLs with customizable options
 */

class QRGenerator {
    constructor() {
        this.qrCode = null;
        this.currentQRData = null;
    }

    /**
     * Render the QR Generator interface
     * @returns {string} HTML content for the tool
     */
    async render() {
        return `
            <div class="qr-generator-tool">
                <div class="tool-section">
                    <div class="form-group">
                        <label for="qr-input" class="form-label">
                            Enter Text or URL
                        </label>
                        <textarea 
                            id="qr-input" 
                            class="form-textarea" 
                            placeholder="Enter the text or URL you want to convert to QR code..."
                            rows="4"
                            aria-describedby="qr-input-help"
                        ></textarea>
                        <small id="qr-input-help" class="form-help">
                            You can enter any text, URL, email, phone number, or other data
                        </small>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="qr-size" class="form-label">Size</label>
                            <select id="qr-size" class="form-select">
                                <option value="256">256x256 (Small)</option>
                                <option value="512" selected>512x512 (Medium)</option>
                                <option value="1024">1024x1024 (Large)</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="qr-error-level" class="form-label">Error Correction</label>
                            <select id="qr-error-level" class="form-select">
                                <option value="L">Low (~7%)</option>
                                <option value="M" selected>Medium (~15%)</option>
                                <option value="Q">Quartile (~25%)</option>
                                <option value="H">High (~30%)</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="qr-foreground" class="form-label">Foreground Color</label>
                            <input 
                                type="color" 
                                id="qr-foreground" 
                                class="form-input color-input" 
                                value="#000000"
                            >
                        </div>

                        <div class="form-group">
                            <label for="qr-background" class="form-label">Background Color</label>
                            <input 
                                type="color" 
                                id="qr-background" 
                                class="form-input color-input" 
                                value="#ffffff"
                            >
                        </div>
                    </div>

                    <div class="form-actions">
                        <button 
                            id="generate-qr" 
                            class="btn btn-primary"
                            aria-describedby="generate-help"
                        >
                            Generate QR Code
                        </button>
                        <small id="generate-help" class="form-help">
                            Click to generate QR code with current settings
                        </small>
                    </div>
                </div>

                <div class="tool-section">
                    <div id="qr-preview" class="qr-preview-area">
                        <div class="qr-placeholder">
                            <div class="qr-placeholder-icon">📱</div>
                            <p>Your QR code will appear here</p>
                            <small>Enter text above and click "Generate QR Code"</small>
                        </div>
                    </div>
                </div>

                <div class="tool-section" id="qr-actions" style="display: none;">
                    <div class="qr-info">
                        <h4>QR Code Generated Successfully!</h4>
                        <div class="qr-stats">
                            <span class="stat-item">
                                <strong>Size:</strong> <span id="qr-stat-size">-</span>
                            </span>
                            <span class="stat-item">
                                <strong>Characters:</strong> <span id="qr-stat-chars">-</span>
                            </span>
                            <span class="stat-item">
                                <strong>Error Level:</strong> <span id="qr-stat-error">-</span>
                            </span>
                        </div>
                    </div>

                    <div class="download-actions">
                        <button id="download-png" class="btn btn-primary">
                            📥 Download PNG
                        </button>
                        <button id="download-svg" class="btn btn-secondary">
                            📄 Download SVG
                        </button>
                        <button id="copy-qr" class="btn btn-outline">
                            📋 Copy to Clipboard
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Initialize the QR Generator tool
     */
    async init() {
        // Use our self-contained QR implementation
        console.log('📱 QR Generator tool initialized with built-in QR implementation');
        this.setupEventListeners();
        this.setupPresetOptions();
    }

    /**
     * Ensure QRCode library is available
     */
    async ensureQRCodeLibrary() {
        // Check if QRCode is already available
        if (typeof QRCode !== 'undefined') {
            console.log('QRCode library is available');
            return true;
        }

        // Wait up to 3 seconds for the library to load
        console.log('Waiting for QRCode library to load...');
        for (let i = 0; i < 30; i++) {
            if (typeof QRCode !== 'undefined') {
                console.log('QRCode library loaded successfully');
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // If still not available, try alternative CDN
        console.log('Trying alternative QRCode library source...');
        try {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/qrcode@1.5.3/build/qrcode.min.js';
            script.crossOrigin = 'anonymous';
            
            const loadPromise = new Promise((resolve, reject) => {
                script.onload = () => {
                    console.log('Alternative QRCode library loaded');
                    resolve();
                };
                script.onerror = () => {
                    console.error('Failed to load alternative QRCode library');
                    reject(new Error('Failed to load QRCode library from alternative source'));
                };
            });
            
            document.head.appendChild(script);
            await loadPromise;

            // Wait a bit more for it to initialize
            for (let i = 0; i < 20; i++) {
                if (typeof QRCode !== 'undefined') {
                    return true;
                }
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        } catch (error) {
            console.error('Error loading alternative QRCode library:', error);
        }

        // If we get here, use the fallback implementation
        console.log('Using fallback QRCode implementation');
        if (typeof SimpleQRCode !== 'undefined') {
            window.QRCode = SimpleQRCode;
            console.log('Fallback QRCode implementation activated');
            return true;
        }

        throw new Error('QRCode library could not be loaded. Please check your internet connection and try refreshing the page.');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Generate button
        const generateBtn = document.getElementById('generate-qr');
        generateBtn?.addEventListener('click', () => this.generateQR());

        // Input change handlers for real-time updates
        const input = document.getElementById('qr-input');
        input?.addEventListener('input', () => this.handleInputChange());

        // Settings change handlers
        const size = document.getElementById('qr-size');
        const errorLevel = document.getElementById('qr-error-level');
        const foreground = document.getElementById('qr-foreground');
        const background = document.getElementById('qr-background');

        [size, errorLevel, foreground, background].forEach(element => {
            element?.addEventListener('change', () => this.handleSettingsChange());
        });

        // Download actions
        const downloadPng = document.getElementById('download-png');
        const downloadSvg = document.getElementById('download-svg');
        const copyBtn = document.getElementById('copy-qr');

        downloadPng?.addEventListener('click', () => this.downloadQR('png'));
        downloadSvg?.addEventListener('click', () => this.downloadQR('svg'));
        copyBtn?.addEventListener('click', () => this.copyQRToClipboard());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case 'enter':
                        if (document.getElementById('qr-input') === document.activeElement) {
                            e.preventDefault();
                            this.generateQR();
                        }
                        break;
                    case 's':
                        if (this.currentQRData) {
                            e.preventDefault();
                            this.downloadQR('png');
                        }
                        break;
                }
            }
        });
    }

    /**
     * Setup preset quick options
     */
    setupPresetOptions() {
        // Add preset buttons for common use cases
        const presetContainer = document.createElement('div');
        presetContainer.className = 'qr-presets';
        presetContainer.innerHTML = `
            <h4>Quick Presets</h4>
            <div class="preset-buttons">
                <button class="preset-btn" data-preset="url">🌐 Website URL</button>
                <button class="preset-btn" data-preset="email">📧 Email</button>
                <button class="preset-btn" data-preset="phone">📞 Phone</button>
                <button class="preset-btn" data-preset="wifi">📶 WiFi</button>
                <button class="preset-btn" data-preset="sms">💬 SMS</button>
            </div>
        `;

        const firstSection = document.querySelector('.qr-generator-tool .tool-section');
        firstSection?.insertBefore(presetContainer, firstSection.firstChild);

        // Handle preset clicks
        presetContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('preset-btn')) {
                this.applyPreset(e.target.dataset.preset);
            }
        });
    }

    /**
     * Apply preset template
     * @param {string} type - Preset type
     */
    applyPreset(type) {
        const input = document.getElementById('qr-input');
        if (!input) return;

        const presets = {
            url: 'https://example.com',
            email: 'mailto:example@email.com?subject=Hello&body=Message',
            phone: 'tel:+1234567890',
            wifi: 'WIFI:T:WPA;S:NetworkName;P:Password;H:false;;',
            sms: 'sms:+1234567890?body=Hello'
        };

        const template = presets[type];
        if (template) {
            input.value = template;
            input.focus();
            input.select();
            
            NotificationManager.info(
                'Preset Applied',
                `${type.toUpperCase()} template has been inserted. Modify as needed.`
            );
        }
    }

    /**
     * Handle input change
     */
    handleInputChange() {
        const input = document.getElementById('qr-input');
        const generateBtn = document.getElementById('generate-qr');

        if (input && generateBtn) {
            const hasContent = input.value.trim().length > 0;
            generateBtn.disabled = !hasContent;
            
            // Update character count
            this.updateCharacterCount(input.value.length);
        }
    }

    /**
     * Handle settings change
     */
    handleSettingsChange() {
        // If QR code exists, regenerate with new settings
        if (this.currentQRData) {
            this.generateQR();
        }
    }

    /**
     * Update character count display
     * @param {number} count - Character count
     */
    updateCharacterCount(count) {
        const help = document.getElementById('qr-input-help');
        if (help) {
            const maxChars = 4296; // QR code max capacity for alphanumeric
            const percentage = (count / maxChars) * 100;
            
            help.innerHTML = `
                Characters: ${count}/${maxChars} 
                <span style="color: ${percentage > 80 ? 'var(--error-color)' : 'var(--success-color)'}">
                    (${percentage.toFixed(1)}%)
                </span>
            `;
        }
    }

    /**
     * Generate QR code
     */
    async generateQR() {
        const input = document.getElementById('qr-input');
        const text = input?.value.trim();

        if (!text) {
            NotificationManager.warning('Input Required', 'Please enter text or URL to generate QR code');
            input?.focus();
            return;
        }

        try {
            // Show loading state
            this.showLoadingState();

            // Get settings
            const settings = this.getSettings();
            
            // Generate QR code
            await this.createQRCode(text, settings);
            
            // Update UI
            this.showQRSuccess(text, settings);
            
        } catch (error) {
            console.error('QR generation error:', error);
            this.showQRError(error.message);
        }
    }

    /**
     * Get current settings
     * @returns {Object} QR settings
     */
    getSettings() {
        return {
            size: parseInt(document.getElementById('qr-size')?.value) || 512,
            errorCorrectionLevel: document.getElementById('qr-error-level')?.value || 'M',
            foreground: document.getElementById('qr-foreground')?.value || '#000000',
            background: document.getElementById('qr-background')?.value || '#ffffff'
        };
    }

    /**
     * Create QR code using QRCode.js library
     * @param {string} text - Text to encode
     * @param {Object} settings - QR settings
     */
    async createQRCode(text, settings) {
        return new Promise((resolve, reject) => {
            if (typeof QRCode === 'undefined') {
                reject(new Error('QRCode library not loaded. Please refresh the page and try again.'));
                return;
            }

            // Clear previous QR code
            const preview = document.getElementById('qr-preview');
            if (!preview) {
                reject(new Error('Preview container not found'));
                return;
            }

            preview.innerHTML = '<canvas id="qr-canvas"></canvas>';
            
            const canvas = document.getElementById('qr-canvas');
            if (!canvas) {
                reject(new Error('Canvas element not created'));
                return;
            }

            // Generate QR code with error handling
            try {
                QRCode.toCanvas(canvas, text, {
                    width: settings.size,
                    height: settings.size,
                    errorCorrectionLevel: settings.errorCorrectionLevel,
                    color: {
                        dark: settings.foreground,
                        light: settings.background
                    },
                    margin: 2
                }, (error) => {
                    if (error) {
                        console.error('QRCode generation error:', error);
                        reject(new Error(`Failed to generate QR code: ${error.message}`));
                    } else {
                        this.currentQRData = { text, settings, canvas };
                        resolve();
                    }
                });
            } catch (error) {
                console.error('QRCode library error:', error);
                reject(new Error(`QR code generation failed: ${error.message}`));
            }
        });
    }

    /**
     * Show loading state
     */
    showLoadingState() {
        const preview = document.getElementById('qr-preview');
        if (preview) {
            preview.innerHTML = `
                <div class="qr-loading">
                    <div class="spinner"></div>
                    <p>Generating QR code...</p>
                </div>
            `;
        }

        const actions = document.getElementById('qr-actions');
        if (actions) {
            actions.style.display = 'none';
        }
    }

    /**
     * Show QR generation success
     * @param {string} text - Original text
     * @param {Object} settings - QR settings
     */
    showQRSuccess(text, settings) {
        // Update stats
        document.getElementById('qr-stat-size').textContent = `${settings.size}x${settings.size}`;
        document.getElementById('qr-stat-chars').textContent = text.length;
        document.getElementById('qr-stat-error').textContent = settings.errorCorrectionLevel;

        // Show actions
        const actions = document.getElementById('qr-actions');
        if (actions) {
            actions.style.display = 'block';
        }

        // Show success notification
        NotificationManager.success(
            'QR Code Generated!',
            'Your QR code is ready for download or sharing.'
        );
    }

    /**
     * Show QR generation error
     * @param {string} message - Error message
     */
    showQRError(message) {
        const preview = document.getElementById('qr-preview');
        if (preview) {
            preview.innerHTML = `
                <div class="qr-error">
                    <div class="error-icon">⚠️</div>
                    <p>Failed to generate QR code</p>
                    <small>${message}</small>
                </div>
            `;
        }

        NotificationManager.error(
            'Generation Failed',
            message || 'An error occurred while generating the QR code'
        );
    }

    /**
     * Download QR code in specified format
     * @param {string} format - Download format ('png' or 'svg')
     */
    downloadQR(format) {
        if (!this.currentQRData) {
            NotificationManager.warning('No QR Code', 'Please generate a QR code first');
            return;
        }

        try {
            const { text, settings, canvas } = this.currentQRData;
            
            if (format === 'png') {
                this.downloadPNG(canvas, text);
            } else if (format === 'svg') {
                this.downloadSVG(text, settings);
            }
            
        } catch (error) {
            console.error('Download error:', error);
            NotificationManager.error('Download Failed', error.message);
        }
    }

    /**
     * Download PNG format
     * @param {HTMLCanvasElement} canvas - QR canvas
     * @param {string} text - Original text
     */
    downloadPNG(canvas, text) {
        const link = document.createElement('a');
        link.download = `qr-code-${this.generateFilename(text)}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        NotificationManager.success('Downloaded!', 'QR code saved as PNG file');
    }

    /**
     * Download SVG format
     * @param {string} text - Text to encode
     * @param {Object} settings - QR settings
     */
    downloadSVG(text, settings) {
        if (typeof QRCode === 'undefined') return;

        QRCode.toString(text, {
            type: 'svg',
            width: settings.size,
            height: settings.size,
            errorCorrectionLevel: settings.errorCorrectionLevel,
            color: {
                dark: settings.foreground,
                light: settings.background
            }
        }, (error, svg) => {
            if (error) {
                throw error;
            }

            const blob = new Blob([svg], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `qr-code-${this.generateFilename(text)}.svg`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);

            NotificationManager.success('Downloaded!', 'QR code saved as SVG file');
        });
    }

    /**
     * Copy QR code to clipboard
     */
    async copyQRToClipboard() {
        if (!this.currentQRData) {
            NotificationManager.warning('No QR Code', 'Please generate a QR code first');
            return;
        }

        try {
            const { canvas } = this.currentQRData;
            
            // Convert canvas to blob
            canvas.toBlob(async (blob) => {
                try {
                    await navigator.clipboard.write([
                        new ClipboardItem({ 'image/png': blob })
                    ]);
                    
                    NotificationManager.success('Copied!', 'QR code copied to clipboard');
                } catch (error) {
                    // Fallback: copy data URL
                    await navigator.clipboard.writeText(canvas.toDataURL());
                    NotificationManager.success('Copied!', 'QR code data URL copied to clipboard');
                }
            });
            
        } catch (error) {
            console.error('Copy error:', error);
            NotificationManager.error('Copy Failed', 'Unable to copy QR code to clipboard');
        }
    }

    /**
     * Generate safe filename from text
     * @param {string} text - Original text
     * @returns {string} Safe filename
     */
    generateFilename(text) {
        return text
            .slice(0, 50) // Limit length
            .replace(/[^a-z0-9]/gi, '-') // Replace special chars
            .replace(/-+/g, '-') // Collapse multiple dashes
            .replace(/^-|-$/g, '') // Remove leading/trailing dashes
            .toLowerCase() || 'qr-code';
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Adjust QR code display if needed
        const preview = document.getElementById('qr-preview');
        if (preview && this.currentQRData) {
            // Ensure QR code scales properly on mobile
            const canvas = preview.querySelector('canvas');
            if (canvas) {
                canvas.style.maxWidth = '100%';
                canvas.style.height = 'auto';
            }
        }
    }

    /**
     * Cleanup tool resources
     */
    cleanup() {
        // Clear any stored QR data
        this.currentQRData = null;
        
        // Remove event listeners
        document.removeEventListener('keydown', this.keydownHandler);
        
        console.log('📱 QR Generator tool cleaned up');
    }
}

// Export for use in the application
window.QRGenerator = QRGenerator;
