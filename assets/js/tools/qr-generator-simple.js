/**
 * QR Code Generator Tool
 * Generate QR codes from text or URLs with customizable options
 */

class QRGenerator {
    constructor() {
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
                    <div class="qr-presets">
                        <h4>Quick Presets</h4>
                        <div class="preset-buttons">
                            <button class="preset-btn" data-preset="url">🌐 Website URL</button>
                            <button class="preset-btn" data-preset="email">📧 Email</button>
                            <button class="preset-btn" data-preset="phone">📞 Phone</button>
                            <button class="preset-btn" data-preset="wifi">📶 WiFi</button>
                            <button class="preset-btn" data-preset="sms">💬 SMS</button>
                        </div>
                    </div>

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
                            Characters: 0/4296 (0.0%)
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
    init() {
        this.setupEventListeners();
        this.setupPresets();
        console.log('📱 QR Generator tool initialized with built-in implementation');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Generate button
        const generateBtn = document.getElementById('generate-qr');
        generateBtn?.addEventListener('click', () => this.generateQR());

        // Input change handlers
        const input = document.getElementById('qr-input');
        input?.addEventListener('input', () => this.handleInputChange());

        // Settings change handlers
        ['qr-size', 'qr-error-level', 'qr-foreground', 'qr-background'].forEach(id => {
            const element = document.getElementById(id);
            element?.addEventListener('change', () => this.handleSettingsChange());
        });

        // Download actions
        document.getElementById('download-png')?.addEventListener('click', () => this.downloadQR('png'));
        document.getElementById('download-svg')?.addEventListener('click', () => this.downloadQR('svg'));
        document.getElementById('copy-qr')?.addEventListener('click', () => this.copyQRToClipboard());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'Enter' && document.getElementById('qr-input') === document.activeElement) {
                    e.preventDefault();
                    this.generateQR();
                } else if (e.key === 's' && this.currentQRData) {
                    e.preventDefault();
                    this.downloadQR('png');
                }
            }
        });
    }

    /**
     * Setup preset options
     */
    setupPresets() {
        document.querySelector('.qr-presets')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('preset-btn')) {
                this.applyPreset(e.target.dataset.preset);
            }
        });
    }

    /**
     * Apply preset template
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

        input.value = presets[type] || '';
        input.focus();
        this.handleInputChange();
        
        NotificationManager.info('Preset Applied', `${type.toUpperCase()} template inserted`);
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
            this.updateCharacterCount(input.value.length);
        }
    }

    /**
     * Handle settings change
     */
    handleSettingsChange() {
        if (this.currentQRData) {
            this.generateQR();
        }
    }

    /**
     * Update character count display
     */
    updateCharacterCount(count) {
        const help = document.getElementById('qr-input-help');
        if (help) {
            const maxChars = 4296;
            const percentage = (count / maxChars) * 100;
            const color = percentage > 80 ? 'var(--error-color)' : 'var(--success-color)';
            
            help.innerHTML = `Characters: ${count}/${maxChars} <span style="color: ${color}">(${percentage.toFixed(1)}%)</span>`;
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
            this.showLoadingState();
            const settings = this.getSettings();
            await this.createQRCode(text, settings);
            this.showQRSuccess(text, settings);
        } catch (error) {
            console.error('QR generation error:', error);
            this.showQRError(error.message);
        }
    }

    /**
     * Get current settings
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
     * Create QR code
     */
    async createQRCode(text, settings) {
        return new Promise((resolve, reject) => {
            if (typeof QRCode === 'undefined') {
                reject(new Error('QR Code generator not available'));
                return;
            }

            const preview = document.getElementById('qr-preview');
            if (!preview) {
                reject(new Error('Preview container not found'));
                return;
            }

            preview.innerHTML = '<canvas id="qr-canvas"></canvas>';
            const canvas = document.getElementById('qr-canvas');

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
                    reject(error);
                } else {
                    this.currentQRData = { text, settings, canvas };
                    resolve();
                }
            });
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
        document.getElementById('qr-actions').style.display = 'none';
    }

    /**
     * Show success state
     */
    showQRSuccess(text, settings) {
        document.getElementById('qr-stat-size').textContent = `${settings.size}x${settings.size}`;
        document.getElementById('qr-stat-chars').textContent = text.length;
        document.getElementById('qr-stat-error').textContent = settings.errorCorrectionLevel;
        document.getElementById('qr-actions').style.display = 'block';
        
        NotificationManager.success('QR Code Generated!', 'Your QR code is ready for download');
    }

    /**
     * Show error state
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
        NotificationManager.error('Generation Failed', message);
    }

    /**
     * Download QR code
     */
    downloadQR(format) {
        if (!this.currentQRData) {
            NotificationManager.warning('No QR Code', 'Please generate a QR code first');
            return;
        }

        try {
            const { text, settings, canvas } = this.currentQRData;
            
            if (format === 'png') {
                const link = document.createElement('a');
                link.download = `qr-code-${this.generateFilename(text)}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
                NotificationManager.success('Downloaded!', 'QR code saved as PNG file');
            } else if (format === 'svg') {
                QRCode.toString(text, {
                    type: 'svg',
                    width: settings.size,
                    errorCorrectionLevel: settings.errorCorrectionLevel,
                    color: { dark: settings.foreground, light: settings.background }
                }, (error, svg) => {
                    if (!error) {
                        const blob = new Blob([svg], { type: 'image/svg+xml' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.download = `qr-code-${this.generateFilename(text)}.svg`;
                        link.href = url;
                        link.click();
                        URL.revokeObjectURL(url);
                        NotificationManager.success('Downloaded!', 'QR code saved as SVG file');
                    }
                });
            }
        } catch (error) {
            NotificationManager.error('Download Failed', error.message);
        }
    }

    /**
     * Copy QR to clipboard
     */
    async copyQRToClipboard() {
        if (!this.currentQRData) {
            NotificationManager.warning('No QR Code', 'Please generate a QR code first');
            return;
        }

        try {
            const { canvas } = this.currentQRData;
            canvas.toBlob(async (blob) => {
                try {
                    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
                    NotificationManager.success('Copied!', 'QR code copied to clipboard');
                } catch {
                    await navigator.clipboard.writeText(canvas.toDataURL());
                    NotificationManager.success('Copied!', 'QR code data URL copied to clipboard');
                }
            });
        } catch (error) {
            NotificationManager.error('Copy Failed', 'Unable to copy QR code to clipboard');
        }
    }

    /**
     * Generate safe filename
     */
    generateFilename(text) {
        return text
            .slice(0, 50)
            .replace(/[^a-z0-9]/gi, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .toLowerCase() || 'qr-code';
    }

    /**
     * Cleanup
     */
    cleanup() {
        this.currentQRData = null;
        console.log('📱 QR Generator tool cleaned up');
    }
}

// Export for use
window.QRGenerator = QRGenerator;
