/**
 * Text Difference Checker Tool
 * Compare two texts side-by-side with highlighted differences
 */

class TextDiffChecker {
    constructor() {
        this.originalText = '';
        this.modifiedText = '';
        this.diffResult = null;
    }

    async render() {
        return `
            <div class="text-diff-tool">
                <div class="tool-section">
                    <h4>Text Comparison</h4>
                    <div class="text-inputs">
                        <div class="text-input-group">
                            <label for="original-text" class="form-label">Original Text</label>
                            <textarea 
                                id="original-text" 
                                class="form-textarea" 
                                placeholder="Paste your original text here..."
                                rows="10"
                            ></textarea>
                        </div>
                        <div class="text-input-group">
                            <label for="modified-text" class="form-label">Modified Text</label>
                            <textarea 
                                id="modified-text" 
                                class="form-textarea" 
                                placeholder="Paste your modified text here..."
                                rows="10"
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div class="tool-section">
                    <h4>Comparison Options</h4>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="ignore-whitespace" checked>
                                <span class="checkmark"></span>
                                Ignore whitespace differences
                            </label>
                        </div>
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="ignore-case">
                                <span class="checkmark"></span>
                                Ignore case differences
                            </label>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button id="compare-texts" class="btn btn-primary">Compare Texts</button>
                        <button id="clear-texts" class="btn btn-secondary">Clear All</button>
                    </div>
                </div>

                <div class="tool-section" id="diff-result" style="display: none;">
                    <h4>Comparison Result</h4>
                    <div class="diff-stats">
                        <span class="stat-item added">
                            <strong>Added:</strong> <span id="added-count">0</span> lines
                        </span>
                        <span class="stat-item removed">
                            <strong>Removed:</strong> <span id="removed-count">0</span> lines
                        </span>
                        <span class="stat-item modified">
                            <strong>Modified:</strong> <span id="modified-count">0</span> lines
                        </span>
                    </div>
                    <div class="diff-view">
                        <div class="diff-panel">
                            <h5>Original</h5>
                            <div id="original-diff" class="diff-content"></div>
                        </div>
                        <div class="diff-panel">
                            <h5>Modified</h5>
                            <div id="modified-diff" class="diff-content"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    init() {
        this.setupEventListeners();
        console.log('🔍 Text Diff Checker tool initialized');
    }

    setupEventListeners() {
        // Implementation placeholder
        const compareBtn = document.getElementById('compare-texts');
        compareBtn?.addEventListener('click', () => this.compareTexts());

        const clearBtn = document.getElementById('clear-texts');
        clearBtn?.addEventListener('click', () => this.clearTexts());
    }

    compareTexts() {
        // Implementation placeholder
        NotificationManager.info('Feature Coming Soon', 'Text comparison functionality is being implemented');
    }

    clearTexts() {
        document.getElementById('original-text').value = '';
        document.getElementById('modified-text').value = '';
        document.getElementById('diff-result').style.display = 'none';
    }

    cleanup() {
        console.log('🔍 Text Diff Checker tool cleaned up');
    }
}

window.TextDiffChecker = TextDiffChecker;
