// ==UserScript==
// @name         Stylish Font for miniblox.io with UI (Draggable and Animated UI)
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Stylish font with a draggable and animated UI for customization
// @author       ee6-lang
// @match        https://miniblox.io/*
// @grant        none
// @license      Redistribution prohibited
// @downloadURL https://update.greasyfork.org/scripts/510220/Stylish%20Font%20for%20minibloxio.user.js
// @updateURL https://update.greasyfork.org/scripts/510220/Stylish%20Font%20for%20minibloxio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default font settings
    const defaultFontFamily = 'Monospace';
    const defaultFontSize = '16px';
    const defaultColor = '#333333';

    // Function to apply custom styles
    const applyFontStyle = (fontFamily, fontSize, color) => {
        const fontStyle = `
            * {
                font-family: '${fontFamily}' !important;
                font-size: ${fontSize} !important;
                color: ${color} !important;
            }
        `;

        const style = document.createElement('style');
        style.innerHTML = fontStyle;
        document.head.appendChild(style);
    };

    // Function to handle user preferences for customization
    const loadUserPreferences = () => {
        const fontFamily = localStorage.getItem('customFontFamily') || defaultFontFamily;
        const fontSize = localStorage.getItem('customFontSize') || defaultFontSize;
        const color = localStorage.getItem('customColor') || defaultColor;
        return { fontFamily, fontSize, color };
    };

    // Function to create the settings UI
    const createSettingsUI = () => {
        const settingsPanel = document.createElement('div');
        settingsPanel.id = 'settings-panel'; // Add an ID for easy targeting
        settingsPanel.style.position = 'absolute';
        settingsPanel.style.top = '20px';
        settingsPanel.style.right = '20px';
        settingsPanel.style.padding = '10px';
        settingsPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        settingsPanel.style.color = 'white';
        settingsPanel.style.borderRadius = '8px';
        settingsPanel.style.zIndex = '9999';
        settingsPanel.style.transition = 'transform 0.3s ease, opacity 0.3s ease'; // Add animation for transform and opacity
        settingsPanel.style.transform = 'translateY(-20px)'; // Initially slightly off-screen
        settingsPanel.style.opacity = '0'; // Initially hidden
        settingsPanel.innerHTML = `
            <h3>Font Customization</h3>
            <label for="font-family">Font Family:</label>
            <select id="font-family">
                <option value="Monospace">Monospace</option>
                <option value="Courier New">Courier New</option>
                <option value="Arial">Arial</option>
                <option value="Verdana">Verdana</option>
                <option value="Georgia">Georgia</option>
            </select><br><br>

            <label for="font-size">Font Size:</label>
            <input type="number" id="font-size" value="16" min="10" max="50" step="1" /><br><br>

            <label for="font-color">Font Color:</label>
            <input type="color" id="font-color" value="#333333" /><br><br>

            <button id="apply-settings">Apply</button>
        `;

        document.body.appendChild(settingsPanel);

        // Set event listener for the Apply button
        document.getElementById('apply-settings').addEventListener('click', () => {
            const fontFamily = document.getElementById('font-family').value;
            const fontSize = document.getElementById('font-size').value + 'px';
            const color = document.getElementById('font-color').value;

            // Save preferences to localStorage
            localStorage.setItem('customFontFamily', fontFamily);
            localStorage.setItem('customFontSize', fontSize);
            localStorage.setItem('customColor', color);

            // Apply the changes immediately
            applyFontStyle(fontFamily, fontSize, color);
        });

        // Make the settings panel draggable
        let isDragging = false;
        let offsetX, offsetY;

        settingsPanel.addEventListener('mousedown', (e) => {
            // Start dragging
            isDragging = true;
            offsetX = e.clientX - settingsPanel.getBoundingClientRect().left;
            offsetY = e.clientY - settingsPanel.getBoundingClientRect().top;

            // Prevent text selection during drag
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const x = e.clientX - offsetX;
                const y = e.clientY - offsetY;

                // Update the position of the settings panel while dragging
                settingsPanel.style.left = `${x}px`;
                settingsPanel.style.top = `${y}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            // Stop dragging when mouse is released
            isDragging = false;
        });
    };

    // Function to create the toggle button
    const createToggleButton = () => {
        const toggleButton = document.createElement('button');
        toggleButton.textContent = 'Settings'; // Button text
        toggleButton.style.position = 'fixed';
        toggleButton.style.top = '20px';
        toggleButton.style.right = '120px'; // Position to the right of the settings panel
        toggleButton.style.padding = '10px';
        toggleButton.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        toggleButton.style.color = 'white';
        toggleButton.style.border = 'none';
        toggleButton.style.borderRadius = '8px';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.zIndex = '10000';
        toggleButton.style.fontSize = '14px';

        // Toggle the settings panel visibility when clicked
        toggleButton.addEventListener('click', () => {
            const settingsPanel = document.getElementById('settings-panel');
            if (settingsPanel.style.opacity === '0') {
                settingsPanel.style.opacity = '1'; // Make it visible
                settingsPanel.style.transform = 'translateY(0)'; // Slide it into view
            } else {
                settingsPanel.style.opacity = '0'; // Fade it out
                settingsPanel.style.transform = 'translateY(-20px)'; // Slide it out of view
            }
        });

        document.body.appendChild(toggleButton);
    };

    // Apply user preferences on page load
    const { fontFamily, fontSize, color } = loadUserPreferences();
    applyFontStyle(fontFamily, fontSize, color);

    // Create and display the settings UI
    createSettingsUI();

    // Create and display the toggle button
    createToggleButton();
})();
