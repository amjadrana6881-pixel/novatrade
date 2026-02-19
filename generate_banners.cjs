const fs = require('fs');
const path = require('path');

const bannersDir = path.join(__dirname, 'banners');
if (!fs.existsSync(bannersDir)) fs.mkdirSync(bannersDir);

function createSVG(filename, title, subtitle, gradientStart, gradientEnd, accentColor, patternType) {
    let pattern = '';
    if (patternType === 'circles') {
        pattern = '<circle cx="10%" cy="20%" r="150" fill="white" fill-opacity="0.05"/><circle cx="90%" cy="80%" r="200" fill="white" fill-opacity="0.05"/>';
    } else if (patternType === 'lines') {
        pattern = '<path d="M0 600 L1200 0" stroke="white" stroke-opacity="0.05" stroke-width="200"/><path d="M200 600 L1400 0" stroke="white" stroke-opacity="0.03" stroke-width="100"/>';
    } else {
        pattern = '<rect x="0" y="0" width="1200" height="600" fill="url(#grid)"/>';
    }

    const svgContent =
        `<svg width="1200" height="500" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${gradientStart};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${gradientEnd};stop-opacity:1" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000" flood-opacity="0.3"/>
        </filter>
        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" stroke-opacity="0.05" stroke-width="1"/>
        </pattern>
    </defs>
    
    <!-- Background -->
    <rect width="100%" height="100%" fill="url(#grad)" />
    ${pattern}
    
    <!-- Content Card effect -->
    <rect x="100" y="80" width="1000" height="340" rx="20" fill="white" fill-opacity="0.1" />
    
    <!-- Text Content -->
    <g transform="translate(600, 250)" text-anchor="middle">
        <text y="-20" font-family="'Segoe UI', 'Roboto', sans-serif" font-weight="800" font-size="72" fill="white" filter="url(#shadow)" letter-spacing="2">${title}</text>
        <text y="50" font-family="'Segoe UI', 'Roboto', sans-serif" font-weight="500" font-size="32" fill="${accentColor}" letter-spacing="1" style="text-shadow: 0 2px 4px rgba(0,0,0,0.2)">${subtitle}</text>
        
        <!-- Button Mockup -->
        <rect x="-100" y="90" width="200" height="50" rx="25" fill="white" />
        <text x="0" y="125" font-family="sans-serif" font-weight="bold" font-size="18" fill="${gradientStart}" text-anchor="middle">LEARN MORE</text>
    </g>
    
    <!-- Decorative Elements -->
    <circle cx="100" cy="80" r="10" fill="white" fill-opacity="0.5"/>
    <circle cx="1100" cy="80" r="10" fill="white" fill-opacity="0.5"/>
    <circle cx="100" cy="420" r="10" fill="white" fill-opacity="0.5"/>
    <circle cx="1100" cy="420" r="10" fill="white" fill-opacity="0.5"/>
</svg>`;

    fs.writeFileSync(path.join(bannersDir, filename), svgContent.trim());
    console.log('Created ' + filename);
}

// 1. Welcome / Brand Identity (Blue Gradient)
createSVG('banner_welcome.svg', 'WELCOME TO NOVATRADE', 'Professional Crypto Trading Platform', '#1A3A8A', '#1A6CFF', '#00C087', 'grid');

// 2. Robots / Trading (Green/Blue Teal Gradient)
createSVG('banner_robots.svg', 'AI TRADING ROBOTS', 'Automate Your Profits 24/7', '#00C9A7', '#1A6CFF', '#FFFFFF', 'circles');

// 3. Security / Trust (Deep Blue/Purple Gradient)
createSVG('banner_security.svg', 'BANK-GRADE SECURITY', 'Your Assets Are Safe With Us', '#141E30', '#243B55', '#00C087', 'lines');
