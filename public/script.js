document.querySelectorAll('.color-bar').forEach((bar) => {
    bar.style.backgroundColor = "transparent"; // Default color bars to transparent
});

document.querySelectorAll('.color-input').forEach((input) => {
    input.addEventListener('input', function () {
        const selectedColor = input.value;
        const index = input.getAttribute('data-index');

        const colorBarIds = ['colorBar60', 'colorBar30', 'colorBar10'];
        
        document.getElementById(colorBarIds[index]).style.backgroundColor = selectedColor;

        const updatedColors = colorBarIds.map(id => document.getElementById(id).style.backgroundColor);
        
        updateBarsAndSquares(updatedColors);
        updateWebMockup(updatedColors);
        updatePalettes(updatedColors);
    });
});

function clearPaletteBars() {
    const defaultColor = "transparent";
    const colorBarIds = ['colorBar60', 'colorBar30', 'colorBar10'];

    // Reset each color bar to the default color without affecting other elements
    colorBarIds.forEach(id => {
        const colorBar = document.getElementById(id);
        if (colorBar) {
            colorBar.style.backgroundColor = defaultColor;
        }
    });
    updatePalettes([defaultColor, defaultColor, defaultColor]);
    updateWebMockup([defaultColor, defaultColor, defaultColor]);
}

function updateBarsAndSquares(colors) {
    document.getElementById('colorBar60').style.backgroundColor = colors[0];
    document.getElementById('colorBar30').style.backgroundColor = colors[1];
    document.getElementById('colorBar10').style.backgroundColor = colors[2];
}

function updateWebMockup(colors) {
    const iframe = document.querySelector('iframe');

    if (iframe) {
        iframe.contentWindow.postMessage({ colors }, '*');
    }
}

window.addEventListener('message', (event) => {
    const { colors } = event.data;

    if (colors && colors.length === 3) {
        document.querySelectorAll('.webMockupColor-60').forEach(element => {
            element.style.backgroundColor = colors[0];
        });

        document.querySelectorAll('.webMockupColor-30').forEach(element => {
            element.style.backgroundColor = colors[1];
        });

        document.querySelectorAll('.webMockupButtonColor-30').forEach(button => {
            button.style.color = colors[1];
            button.style.borderColor = colors[1];
            
            button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = colors[1]; 
            button.style.color = colors[0];
        });
            button.addEventListener('mouseleave', () => {
            button.style.color = colors[1];
            button.style.backgroundColor = '';
        });
        });

        document.querySelectorAll('.webMockupColor-10').forEach(element => {
            element.style.color = colors[2];
            element.style.borderColor = colors [2];
        });

        document.querySelectorAll('.webMockupButtonColor-10').forEach(button => {
            button.style.color = colors[2];
            button.style.borderColor = colors[2];
            
            button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = colors[2]; 
            button.style.color = colors[0];
        });
            button.addEventListener('mouseleave', () => {
            button.style.color = colors[2];
            button.style.backgroundColor = '';
        });
        });
    }
});

function updatePalettes() {
    const baseColors = getBaseColorValues(); // ✅ Get colors for default 3-color mode
    const splitColors = getColorValues(); // ✅ Get colors including split colors

    const palette1 = document.querySelector('[data-palette="palette1"]');
    const palette2 = document.querySelector('[data-palette="palette2"]');
    const palette3 = document.querySelector('[data-palette="palette3"]');

    if (splitColors.length > 3) {
        // ✅ If the user has split colors, apply the new split-color logic
        const paletteMappings = [
            [0, 3, 1, 4, 2],  // Palette 1: 0 → 3 → 1 → 4 → 2
            [3, 2, 0, 1, 4],  // Palette 2: 3 → 2 → 0 → 1 → 4
            [4, 1, 3, 2, 0]   // Palette 3: 4 → 1 → 3 → 2 → 0
        ];

        [palette1, palette2, palette3].forEach((palette, index) => {
            paletteMappings[index].forEach((colorIndex, i) => {
                if (palette.children[i]) {
                    palette.children[i].style.backgroundColor = splitColors[colorIndex];
                }
            });
        });
    } else {
        // ✅ If user has NOT split colors, use the default 3-color logic
        palette1.children[0].style.backgroundColor = baseColors[0];
        palette1.children[1].style.backgroundColor = baseColors[1];
        palette1.children[2].style.backgroundColor = baseColors[2];

        palette2.children[0].style.backgroundColor = baseColors[2];
        palette2.children[1].style.backgroundColor = baseColors[1];
        palette2.children[2].style.backgroundColor = baseColors[0];

        palette3.children[0].style.backgroundColor = baseColors[1];
        palette3.children[1].style.backgroundColor = baseColors[0];
        palette3.children[2].style.backgroundColor = baseColors[2];
    }
}

function getBaseColorValues() {
    const colorBars = [
        document.getElementById('colorBar60'),
        document.getElementById('colorBar30'),
        document.getElementById('colorBar10')
    ];

    let colors = [];

    colorBars.forEach(bar => {
        if (!bar) return;
        const colorInput = bar.querySelector('.color-input');
        if (colorInput) colors.push(colorInput.value);
    });

    return colors;
}

function getColorValues() {
    const colorBars = [
        document.getElementById('colorBar60'),
        document.getElementById('colorBar30'),
        document.getElementById('colorBar10')
    ];

    let colors = [];

    colorBars.forEach(bar => {
        if (!bar) return;

        // ✅ If bar is split, take both halves
        const splitHalves = bar.querySelectorAll('.split-half .color-input');
        if (splitHalves.length === 2) {
            colors.push(splitHalves[0].value, splitHalves[1].value);
        } else {
            const colorInput = bar.querySelector('.color-input');
            if (colorInput) colors.push(colorInput.value);
        }
    });

    return colors;
}

// Event listeners for selecting a color palette
document.querySelectorAll('.palette').forEach(palette => {
    palette.addEventListener('click', function () {
        // Get colors from the palette and update bars and squares
        const colors = Array.from(palette.children).map(swatch => swatch.style.backgroundColor);
        updateBarsAndSquares(colors);
    });
});

// Function to add a tooltip to display color information
function addTooltip(element, color, label) {
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.innerHTML = `<strong>${color}</strong> ${label}`;
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = '#000';
    tooltip.style.color = '#fff';
    tooltip.style.padding = '5px';
    tooltip.style.borderRadius = '5px';
    tooltip.style.pointerEvents = 'none';

    document.body.appendChild(tooltip);

    // Position the tooltip above the element
    const rect = element.getBoundingClientRect();
    tooltip.style.left = `${rect.left + window.scrollX}px`;
    tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 5}px`;

    // Update tooltip position when the mouse moves
    element.addEventListener('mousemove', function(event) {
        tooltip.style.left = `${event.pageX + 10}px`;
        tooltip.style.top = `${event.pageY - tooltip.offsetHeight - 10}px`;
    });

    // Remove the tooltip when the mouse leaves the element
    element.addEventListener('mouseleave', function() {
        tooltip.remove();
    });
}

// Add tooltips to color bars and squares
document.querySelectorAll('.color-bar, .square').forEach(el => {
    el.addEventListener('mouseenter', function() {
        const color = this.style.backgroundColor || 'Unknown Color';
        const label = this.innerHTML || '';

        addTooltip(this, color, label);
    });
});

// Canvas Setup
const thirdCanvas = document.getElementById("thirdCanvas");
const thirdCtx = thirdCanvas.getContext("2d");

const fifthCanvas = document.getElementById("fifthCanvas");
const fifthCtx = fifthCanvas.getContext("2d");

const thirdInteriorCanvas = document.getElementById("thirdInteriorCanvas");
const thirdInteriorCtx = thirdInteriorCanvas.getContext("2d");

const fifthInteriorCanvas = document.getElementById("fifthInteriorCanvas");
const fifthInteriorCtx = fifthInteriorCanvas.getContext("2d");

const thirdApplicationCanvas = document.getElementById("thirdApplicationCanvas");
const thirdApplicationCtx = thirdApplicationCanvas.getContext("2d");

const fifthApplicationCanvas = document.getElementById("fifthApplicationCanvas");
const fifthApplicationCtx = fifthApplicationCanvas.getContext("2d");

let originalThirdImageData;
let originalFifthImageData;

// Image path
const thirdImagePaths = [
    "assets/3_color_image/Art-1-3.png",
    "assets/3_color_image/Art-2-3.png",
    "assets/3_color_image/Art-3-3.png",
    "assets/3_color_image/Art-4-3.png",
    "assets/3_color_image/Art-5-3.png",    
];

const fifthImagePaths = [
    "assets/5_color_image/Art-1-5.png",
    "assets/5_color_image/Art-2-5.png",
    "assets/5_color_image/Art-3-5.png",
    "assets/5_color_image/Art-4-5.png",
    "assets/5_color_image/Art-5-5.png",
];

const thirdInteriorPath = [
    "assets/3_color_interior/Interior-1-3.png",
    "assets/3_color_interior/Interior-2-3.png",
    "assets/3_color_interior/Interior-3-3.png",
    "assets/3_color_interior/Interior-4-3.png",
    "assets/3_color_interior/Interior-5-3.png",
];

const fifthInteriorPath = [
    "assets/5_color_interior/Interior-1-5.png",
    "assets/5_color_interior/Interior-2-5.png",
    "assets/5_color_interior/Interior-3-5.png",
    "assets/5_color_interior/Interior-4-5.png",
    "assets/5_color_interior/Interior-5-5.png",
];

const thirdApplicationPath = [
    "assets/3_color_application/App-1-3.png",
    "assets/3_color_application/App-2-3.png",
    "assets/3_color_application/App-3-3.png",
];

const fifthApplicationPath = [
    "assets/5_color_application/App-1-5.png",
    "assets/5_color_application/App-2-5.png",
    "assets/5_color_application/App-3-5.png",
];

// Function load image **NEW
function loadImage(imagePaths, canvas, ctx, changeColorFunction) {
    const randomIndex = Math.floor(Math.random() * imagePaths.length);
    const randomImage = imagePaths[randomIndex];

    const img = new Image();
    img.src = randomImage;

    img.onload = function () {
        const aspectRatio = img.width / img.height;
        const minWidth = 790;

        let scaleFactor = minWidth / img.width;

        canvas.width = img.width * scaleFactor;
        canvas.height = canvas.width / aspectRatio;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        changeColorFunction(); // Apply color change immediately
    };
}

// Function load image
function loadThirdImage() {
    loadImage(thirdImagePaths, thirdCanvas, thirdCtx, changeThirdColor);
}

function loadFifthImage() {
    loadImage(fifthImagePaths, fifthCanvas, fifthCtx, changeFifthColor);
}

function loadThirdInterior() {
    loadImage(thirdInteriorPath, thirdInteriorCanvas, thirdInteriorCtx, changeInteriorThirdColor);
}

function loadFifthInterior() {
    loadImage(fifthInteriorPath, fifthInteriorCanvas, fifthInteriorCtx, changeInteriorFifthColor);
}

function loadThirdApplication() {
    loadImage(thirdApplicationPath, thirdApplicationCanvas, thirdApplicationCtx, changeApplicationThirdColor);
}

function loadFifthApplication() {
    loadImage(fifthApplicationPath, fifthApplicationCanvas, fifthApplicationCtx, changeApplicationFifthColor);
}

// Get selected color from color bars *LAST EDIT*
function getSelectedColors(mode) {
    const colorBars = ['colorBar60', 'colorBar30', 'colorBar10']; // Parent color bars
    let selectedColors = [];

    colorBars.forEach(barId => {
        const colorBar = document.getElementById(barId);

        if (!colorBar) return;

        // If no split has occurred, track the parent color bar's color
        if (!colorBar.querySelector('.split-half')) {
            const color = window.getComputedStyle(colorBar).backgroundColor;

            if (color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') {
                selectedColors.push(rgbStringToObject(color));
            }
        } else {
            // If split occurred, track each split-half
            const halves = colorBar.querySelectorAll('.split-half');
            halves.forEach(half => {
                const color = window.getComputedStyle(half).backgroundColor;
                if (color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') {
                    selectedColors.push(rgbStringToObject(color));
                }
            });
        }
    });

    // Handle 3-color mode
    if (mode === "three" && selectedColors.length !== 3) {
        alert("Please select exactly 3 colors before generating a 3-color image.");
        return null;
    }

    // Handle 5-color mode
    if (mode === "five" && selectedColors.length !== 5) {
        alert("Please select exactly 5 colors before generating a 5-color image.");
        return null;
    }

    return selectedColors;
}

function changeImageColor() { // **NEW
    const selectedColors = getSelectedColors();
    if (!selectedColors) {
        alert("Please select colors before generating an image.");
        return;
    }

    const isThreeColors = selectedColors.length === 3;
    const isFiveColors = selectedColors.length === 5;

    // Dynamically assign paths, canvases, and functions based on the selected filter
    let imagePaths, canvas, ctx, changeColorFunction;

    if (selectedFilter === "funiture-filter") {
        imagePaths = isThreeColors ? thirdInteriorPath : fifthInteriorPath;
        canvas = isThreeColors ? thirdInteriorCanvas : fifthInteriorCanvas;
        ctx = isThreeColors ? thirdInteriorCtx : fifthInteriorCtx;
        changeColorFunction = isThreeColors ? changeThirdInteriorColor : changeFifthInteriorColor;
    } else if (selectedFilter === "application-filter") {
        imagePaths = isThreeColors ? thirdApplicationPath : fifthApplicationPath;
        canvas = isThreeColors ? thirdApplicationCanvas : fifthApplicationCanvas;
        ctx = isThreeColors ? thirdApplicationCtx : fifthApplicationCtx;
        changeColorFunction = isThreeColors ? changeThirdApplicationColor : changeFifthApplicationColor;
    } else {
        // Default to Art Images
        imagePaths = isThreeColors ? thirdImagePaths : fifthImagePaths;
        canvas = isThreeColors ? thirdCanvas : fifthCanvas;
        ctx = isThreeColors ? thirdCtx : fifthCtx;
        changeColorFunction = isThreeColors ? changeThirdColor : changeFifthColor;
    }

    // Load the correct image and apply colors
    loadImage(imagePaths, canvas, ctx, changeColorFunction);
}

function changeApplicationThirdColor() {
    const selectedColors = getSelectedColors("three");
    if (!selectedColors) return;

    const imageData = thirdApplicationCtx.getImageData(0, 0, thirdApplicationCanvas.width, thirdApplicationCanvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];

        if (isFirstThirdColor(red, green, blue)) {
            data[i] = selectedColors[0].r;
            data[i + 1] = selectedColors[0].g;
            data[i + 2] = selectedColors[0].b;
        }
        if (isSecondThirdColor(red, green, blue)) {
            data[i] = selectedColors[1].r;
            data[i + 1] = selectedColors[1].g;
            data[i + 2] = selectedColors[1].b;
        }
        if (isThirdThirdColor(red, green, blue)) {
            data[i] = selectedColors[2].r;
            data[i + 1] = selectedColors[2].g;
            data[i + 2] = selectedColors[2].b;
        }
    }

    thirdApplicationCtx.putImageData(imageData, 0, 0);
}

function changeApplicationFifthColor() {
    const selectedColors = getSelectedColors("five");
    if (!selectedColors) return;

    const imageData = fifthApplicationCtx.getImageData(0, 0, fifthApplicationCanvas.width, fifthApplicationCanvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];

        if (isFirstFifthColor(red, green, blue)) {
            data[i] = selectedColors[0].r;
            data[i + 1] = selectedColors[0].g;
            data[i + 2] = selectedColors[0].b;
        }
        if (isSecondFifthColor(red, green, blue)) {
            data[i] = selectedColors[1].r;
            data[i + 1] = selectedColors[1].g;
            data[i + 2] = selectedColors[1].b;
        }
        if (isThirdFifthColor(red, green, blue)) {
            data[i] = selectedColors[2].r;
            data[i + 1] = selectedColors[2].g;
            data[i + 2] = selectedColors[2].b;
        }
        if (isFourthFifthColor(red, green, blue)) {
            data[i] = selectedColors[3].r;
            data[i + 1] = selectedColors[3].g;
            data[i + 2] = selectedColors[3].b;
        }
        if (isFifthFifthColor(red, green, blue)) {
            data[i] = selectedColors[4].r;
            data[i + 1] = selectedColors[4].g;
            data[i + 2] = selectedColors[4].b;
        }
    }

    fifthApplicationCtx.putImageData(imageData, 0, 0);
}

function changeInteriorThirdColor() {
    const selectedColors = getSelectedColors("three");
    if (!selectedColors) return;

    const imageData = thirdInteriorCtx.getImageData(0, 0, thirdInteriorCanvas.width, thirdInteriorCanvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];

        // Change color based on matching conditions for each color
        if (isFirstThirdColor(red, green, blue)) {
            data[i] = selectedColors[0].r;
            data[i + 1] = selectedColors[0].g;
            data[i + 2] = selectedColors[0].b;
        }
        if (isSecondThirdColor(red, green, blue)) {
            data[i] = selectedColors[1].r;
            data[i + 1] = selectedColors[1].g;
            data[i + 2] = selectedColors[1].b;
        }
        if (isThirdThirdColor(red, green, blue)) {
            data[i] = selectedColors[2].r;
            data[i + 1] = selectedColors[2].g;
            data[i + 2] = selectedColors[2].b;
        }
    }

    thirdInteriorCtx.putImageData(imageData, 0, 0);
}

function changeInteriorFifthColor() {
    const selectedColors = getSelectedColors("five");
    if (!selectedColors) return;

    const imageData = fifthInteriorCtx.getImageData(0, 0, fifthInteriorCanvas.width, fifthInteriorCanvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];

        if (isFirstFifthColor(red, green, blue)) {
            data[i] = selectedColors[0].r;
            data[i + 1] = selectedColors[0].g;
            data[i + 2] = selectedColors[0].b;
        }
        if (isSecondFifthColor(red, green, blue)) {
            data[i] = selectedColors[1].r;
            data[i + 1] = selectedColors[1].g;
            data[i + 2] = selectedColors[1].b;
        }
        if (isThirdFifthColor(red, green, blue)) {
            data[i] = selectedColors[2].r;
            data[i + 1] = selectedColors[2].g;
            data[i + 2] = selectedColors[2].b;
        }
        if (isFourthFifthColor(red, green, blue)) {
            data[i] = selectedColors[3].r;
            data[i + 1] = selectedColors[3].g;
            data[i + 2] = selectedColors[3].b;
        }
        if (isFifthFifthColor(red, green, blue)) {
            data[i] = selectedColors[4].r;
            data[i + 1] = selectedColors[4].g;
            data[i + 2] = selectedColors[4].b;
        }
    }

    fifthInteriorCtx.putImageData(imageData, 0, 0);
}

// Function to change colors on the image canvas
function changeThirdColor() {
    const selectedColors = getSelectedColors("three");
    if (!selectedColors) return;

    const imageData = thirdCtx.getImageData(0, 0, thirdCanvas.width, thirdCanvas.height);
    const data = imageData.data;

    // Loop through all pixels
    for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];

        // Change color based on matching conditions for each color
        if (isFirstThirdColor(red, green, blue)) {
            data[i] = selectedColors[0].r;
            data[i + 1] = selectedColors[0].g;
            data[i + 2] = selectedColors[0].b;
        }
        if (isSecondThirdColor(red, green, blue)) {
            data[i] = selectedColors[1].r;
            data[i + 1] = selectedColors[1].g;
            data[i + 2] = selectedColors[1].b;
        }
        if (isThirdThirdColor(red, green, blue)) {
            data[i] = selectedColors[2].r;
            data[i + 1] = selectedColors[2].g;
            data[i + 2] = selectedColors[2].b;
        }
    }

    // Put the modified image back onto the canvas
    thirdCtx.putImageData(imageData, 0, 0);
}

function changeFifthColor() {
    const selectedColors = getSelectedColors("five");
    if (!selectedColors) return;

    const imageData = fifthCtx.getImageData(0, 0, fifthCanvas.width, fifthCanvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];

        // Change color based on matching conditions for each color
        if (isFirstFifthColor(red, green, blue)) {
            data[i] = selectedColors[0].r;
            data[i + 1] = selectedColors[0].g;
            data[i + 2] = selectedColors[0].b;
        }
        if (isSecondFifthColor(red, green, blue)) {
            data[i] = selectedColors[1].r;
            data[i + 1] = selectedColors[1].g;
            data[i + 2] = selectedColors[1].b;
        }
        if (isThirdFifthColor(red, green, blue)) {
            data[i] = selectedColors[2].r;
            data[i + 1] = selectedColors[2].g;
            data[i + 2] = selectedColors[2].b;
        }
        if (isFourthFifthColor(red, green, blue)) {
            data[i] = selectedColors[3].r;
            data[i + 1] = selectedColors[3].g;
            data[i + 2] = selectedColors[3].b;
        }
        if (isFifthFifthColor(red, green, blue)) {
            data[i] = selectedColors[4].r;
            data[i + 1] = selectedColors[4].g;
            data[i + 2] = selectedColors[4].b;
        }
    }

    // Put the modified image back onto the canvas
    fifthCtx.putImageData(imageData, 0, 0);
}

// 3-Color
function isFirstThirdColor(r, g, b) {
    const targetColor = { r: 31, g: 30, b: 30 }; // #1f1e1e
    return colorMatch(r, g, b, targetColor);
}

function isSecondThirdColor(r, g, b) {
    const targetColor = { r: 99, g: 97, b: 97 }; // #636161
    return colorMatch(r, g, b, targetColor);
}

function isThirdThirdColor(r, g, b) {
    const targetColor = { r: 195, g: 192, b: 192 }; // #c3c0c0F
    return colorMatch(r, g, b, targetColor);
}

// 5-Color
function isFirstFifthColor(r, g, b) {
    const targetColor = { r: 31, g: 30, b: 30 }; // #1f1e1e
    return colorMatch(r, g, b, targetColor);
}

function isSecondFifthColor(r, g, b) {
    
    const targetColor = { r: 46, g: 46, b: 44 }; // #2e2e2c  
    return colorMatch(r, g, b, targetColor);
}

function isThirdFifthColor(r, g, b) {
    
    const targetColor = { r: 99, g: 96, b: 97 }; // #636161
    return colorMatch(r, g, b, targetColor);
}

function isFourthFifthColor(r, g, b) {
    const targetColor = { r: 162, g: 159, b: 159 }; // #a29f9f
    return colorMatch(r, g, b, targetColor);
}

function isFifthFifthColor(r, g, b) {
    const targetColor = { r: 195, g: 192, b: 192 }; // #c3c0c0
    return colorMatch(r, g, b, targetColor);
}

function colorMatch(r, g, b, target) {
    const maxDifference = 12;
    return (
        Math.abs(r - target.r) < maxDifference &&
        Math.abs(g - target.g) < maxDifference &&
        Math.abs(b - target.b) < maxDifference
    );
}

function rgbStringToObject(rgbString) {
    const match = rgbString.match(/(\d+),\s*(\d+),\s*(\d+)/);

    if (!match) return { r: 0, g: 0, b: 0 };

    return { 
        r: parseInt(match[1], 10), 
        g: parseInt(match[2], 10), 
        b: parseInt(match[3], 10) 
    };
}

// Event listeners for filter selection
document.addEventListener('DOMContentLoaded', function() {
    const filters = document.querySelectorAll('.rounded-filter-square');
    
    filters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Remove 'selected' class from all filters and add it to the clicked filter
            filters.forEach(f => f.classList.remove('selected'));
            this.classList.add('selected');

            selectedFilter = this.id;
            console.log("Selected Filter:", selectedFilter);
        });
    });
});

// Event listener for filter selection and starting the process
document.addEventListener('DOMContentLoaded', function() {
    const filters = document.querySelectorAll('.rounded-filter-square');
    const startButton = document.querySelector('.start-button');
    const loading = document.querySelector('.loading');
    let selectedFilter = null;

    // Listen for filter selection
    filters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Update selected filter
            filters.forEach(f => f.classList.remove('selected'));
            this.classList.add('selected');
            selectedFilter = this.id; 
        });
    });

    // Listen for start button click
    startButton.addEventListener('click', function() {
        if (selectedFilter) {
            // Show loading animation and hide filter container
            loading.classList.remove('hidden');
            document.querySelector('.right-column .rounded-square').classList.add('hidden');
            
            setTimeout(() => {
                // Hide loading animation and other sections
                loading.classList.add('hidden');
                document.querySelectorAll('.canvas-container, .color-picker-container, .artCanvas-container, .web-mockup-container, .thirdCanvas-container, .thirdInteriorCanvas-container, .fifthInteriorCanvas-container, .fifthApplicationCanvas-container, .thirdApplicationCanvas-container').forEach(section => {
                    section.classList.add('hidden');
                });
                
                // Show appropriate sections based on selected filter
                if (selectedFilter === 'website-filter') { //website
                    document.querySelectorAll('.left-column, .web-mockup-container').forEach(section => {
                        section.classList.remove('hidden');
                    });

                } else if (selectedFilter === 'third-image-filter') { //art-images

                    const selectedColors = getSelectedColors();
                    
                    if (selectedColors.length === 3) {
                        // Load 3-color image
                        document.querySelectorAll('.left-column, .thirdCanvas-container, .color-picker-container').forEach(section => {
                            section.classList.remove('hidden');
                        });
                        loadThirdImage();
                        
                    } else if (selectedColors.length === 5) {
                        // Load 5-color image instead
                        document.querySelectorAll('.left-column, .fifthCanvas-container, .color-picker-container').forEach(section => {
                            section.classList.remove('hidden');
                        });
                        loadFifthImage();
                    } else {
                        alert("Please select either 3 or 5 colors before generating an image.");
                    }
                } else if (selectedFilter === 'funiture-filter') { //funiture

                    const selectedColors = getSelectedColors();
                    
                    if (selectedColors.length === 3) {
                        // Load 3-color image
                        document.querySelectorAll('.left-column, .thirdInteriorCanvas-container, .color-picker-container').forEach(section => {
                            section.classList.remove('hidden');
                        });
                        loadThirdInterior();
                        
                    } else if (selectedColors.length === 5) {
                        // Load 5-color image instead
                        document.querySelectorAll('.left-column, .fifthInteriorCanvas-container, .color-picker-container').forEach(section => {
                            section.classList.remove('hidden');
                        });
                        loadFifthInterior();
                    } else {
                        alert("Please select either 3 or 5 colors before generating an image.");
                    }
                } else if (selectedFilter === 'application-filter') { //applicaton

                    const selectedColors = getSelectedColors();
                    
                    if (selectedColors.length === 3) {
                        // Load 3-color image
                        document.querySelectorAll('.left-column, .thirdApplicationCanvas-container, .color-picker-container').forEach(section => {
                            section.classList.remove('hidden');
                        });
                        loadThirdApplication();
                        
                    } else if (selectedColors.length === 5) {
                        // Load 5-color image instead
                        document.querySelectorAll('.left-column, .fifthApplicationCanvas-container, .color-picker-container').forEach(section => {
                            section.classList.remove('hidden');
                        });
                        loadFifthApplication();
                    } else {
                        alert("Please select either 3 or 5 colors before generating an image.");
                    }
                }

            }, 1000); // 1 second delay
        } else {
            alert("Please select a filter before starting!");
        }
    });
});

const maxIndex = 4; // Fixed max index values (0, 1, 2, 3, 4)

function splitColorBar(colorBarId) {
    const colorBar = document.getElementById(colorBarId);

    // ❌ Disable split for colorBar10
    if (colorBarId === 'colorBar10') return;

    // Prevent splitting if max index reached
    if (colorBar.querySelectorAll('.split-line').length >= 1) {
        alert("This color bar is already split.");
        return;
    }

    const originalColor = window.getComputedStyle(colorBar).backgroundColor;
    colorBar.setAttribute('data-original-color', originalColor);

    colorBar.style.backgroundColor = "transparent"; // Default to transparent

    // Get the current color of the original bar
    const leftColor = window.getComputedStyle(colorBar).backgroundColor;

    // Create halves & split line
    const firstHalf = document.createElement('div');
    const secondHalf = document.createElement('div');
    const splitLine = document.createElement('div');

    // Add classes
    firstHalf.classList.add('split-half', 'first-half');
    secondHalf.classList.add('split-half', 'second-half');
    splitLine.classList.add('split-line');

    // Assign fixed indices
    let firstHalfIndex, secondHalfIndex;
    
    if (colorBarId === 'colorBar60') {
        firstHalfIndex = '0';
        secondHalfIndex = '3';
    } else if (colorBarId === 'colorBar30') {
        firstHalfIndex = '1';
        secondHalfIndex = '4';
    } else {
        console.error('Invalid colorBarId:', colorBarId);
        return;
    }

    // Apply colors
    firstHalf.style.backgroundColor = originalColor;
    secondHalf.style.backgroundColor = 'rgba(0, 0, 0, 0)'; // Default transparent

    firstHalf.innerHTML = `<input type="color" class="color-input" data-index="${firstHalfIndex}" value="${rgbToHex(leftColor)}">`;
    secondHalf.innerHTML = `<input type="color" class="color-input" data-index="${secondHalfIndex}" value="#00000000">`;

    // Clear existing content and append elements
    colorBar.innerHTML = '';
    colorBar.style.display = 'flex';
    colorBar.style.flexDirection = 'row';
    colorBar.style.alignItems = 'center';
    colorBar.appendChild(firstHalf);
    colorBar.appendChild(splitLine);
    colorBar.appendChild(secondHalf);

    // Add event listeners
    firstHalf.querySelector('.color-input').addEventListener('input', function () {
        firstHalf.style.backgroundColor = this.value;
    });

    secondHalf.querySelector('.color-input').addEventListener('input', function () {
        secondHalf.style.backgroundColor = this.value;
    });
}

// Utility: Convert RGB to HEX
function rgbToHex(rgb) {
    if (rgb === 'rgba(0, 0, 0, 0)' || rgb === 'transparent') return '#00000000';
    const match = rgb.match(/\d+/g);
    if (!match) return "#000000";

    const r = parseInt(match[0], 10).toString(16).padStart(2, '0');
    const g = parseInt(match[1], 10).toString(16).padStart(2, '0');
    const b = parseInt(match[2], 10).toString(16).padStart(2, '0');

    return `#${r}${g}${b}`;
}

function removeColor(colorBarId) {
    const colorBar = document.getElementById(colorBarId);

    if (!colorBar) return; // Ensure the color bar exists

    // ✅ Get the stored original color before it was split
    const originalColor = colorBar.getAttribute('data-original-color') || '#FFFFFF'; // Default to white if missing

    // Reset the color bar
    colorBar.innerHTML = ''; // Remove all children
    colorBar.style.backgroundColor = originalColor; // ✅ Restore stored color
    colorBar.style.display = 'block'; // Ensure it is visible

    // Add back the color input for single color selection
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.classList.add('color-input');
    colorInput.value = rgbToHex(originalColor);
    colorInput.setAttribute('data-index', colorBar.dataset.index);

    // Append the input back to the color bar
    colorBar.appendChild(colorInput);

    // Reset split structure
    colorBar.classList.remove('split-color');

    // ✅ Remove stored original color attribute (not needed anymore)
    colorBar.removeAttribute('data-original-color');
}