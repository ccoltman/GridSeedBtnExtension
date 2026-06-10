(function() {
    console.log("🎲 [GridSeedBtn] Error patch logic initialized successfully.");

    function generateRandomSeed() {
        return Math.floor(1000000000 + Math.random() * 9000000000);
    }

    // Fully patched handler safely resolves text extraction regardless of target wrapper elements
    function handleSeedClick(targetElement) {
        if (!targetElement) return;

        // RESOLUTION DRILL: If the targeted element isn't a direct input box, pierce down inside it
        let realInputField = targetElement;
        if (targetElement.tagName !== 'INPUT' && targetElement.tagName !== 'TEXTAREA') {
            realInputField = targetElement.querySelector('input, textarea') || targetElement;
        }

        const newSeed = generateRandomSeed();
        
        // Safe extraction fallback paths read either standard inputs or inner string blocks smoothly
        let currentVal = "";
        if (typeof realInputField.value !== 'undefined') {
            currentVal = realInputField.value.trim();
        } else if (realInputField.textContent) {
            currentVal = realInputField.textContent.trim();
        }
        
        let updatedString = "";
        if (currentVal === '') {
            updatedString = String(newSeed);
        } else {
            // Continuously appends brand new values respecting SwarmUI's comma separated list rules
            updatedString = currentVal.endsWith(',') ? `${currentVal} ${newSeed}` : `${currentVal}, ${newSeed}`;
        }

        // Safely map the calculated payload back onto whichever storage state is active
        if (typeof realInputField.value !== 'undefined') {
            realInputField.value = updatedString;
        } else {
            realInputField.textContent = updatedString;
        }
        
        // Dispatch UI update trackers so SwarmUI's core framework captures the data modification instantly
        realInputField.dispatchEvent(new Event('input', { bubbles: true }));
        realInputField.dispatchEvent(new Event('change', { bubbles: true }));
        
        console.log(`🎲 [GridSeedBtn] Seed successfully appended: ${newSeed}`);
    }

    function processRowDropdownState(row) {
        const selectDropdown = row.querySelector('select');
        if (!selectDropdown) return;

        const existingBtn = row.querySelector('.swarm-random-seed-grid-btn');

        // Check all potential variations for target value casing assignments
        const isSeedSelected = selectDropdown.value === 'seed' || 
                             selectDropdown.value === 'Seed' || 
                             selectDropdown.value?.toLowerCase() === 'seed';

        if (isSeedSelected) {
            if (existingBtn) return; 

            // Extract the core input element wrapper block
            const targetElement = row.querySelector('.grid-gen-axis-input') || 
                                  row.querySelector('input[type="text"]') || 
                                  row.querySelector('textarea') ||
                                  row.querySelector('.grid-gen-axis-value-container');
            if (!targetElement) return;

            // Replicate standard button styling rules
            const randBtn = document.createElement('button');
            randBtn.textContent = 'Random';
            randBtn.title = 'Append a random 10-digit seed to this parameter row';
            randBtn.className = 'grid-gen-axis-examples basic-button nav-btn tool-btn swarm-random-seed-grid-btn';
            randBtn.type = 'button';
            randBtn.style.marginLeft = '5px';

            randBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSeedClick(targetElement);
            });

            // Mirror native Examples button alignment positions precisely
            const nativeExamplesBtn = row.querySelector('.grid-gen-axis-examples') || 
                                      row.querySelector('.grid-axis-examples-btn');
            if (nativeExamplesBtn) {
                nativeExamplesBtn.after(randBtn);
            } else {
                const fallbackAnchor = row.querySelector('button, .button') || targetElement.parentElement;
                if (fallbackAnchor) {
                    fallbackAnchor.after(randBtn);
                }
            }
        } else {
            if (existingBtn) {
                existingBtn.remove();
            }
        }
    }

    function scanSwarmGridContainer() {
        const targetContainers = [
            document.getElementById('grid_generator_axis_list'),
            document.getElementById('grid-generator-axis-list'),
            document.body
        ];

        targetContainers.forEach(container => {
            if (!container) return;
            
            const axisRows = container.querySelectorAll('.grid-gen-selector-block, .grid-gen-axis-wrapper, .grid-axis-container');
            axisRows.forEach(row => {
                processRowDropdownState(row);

                const dropdown = row.querySelector('select');
                if (dropdown && !dropdown.dataset.hasSeedBtnWatcher) {
                    dropdown.dataset.hasSeedBtnWatcher = 'true';
                    dropdown.addEventListener('change', () => processRowDropdownState(row));
                }
            });
        });
    }

    setInterval(scanSwarmGridContainer, 500);
})();
