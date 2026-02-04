// tailwind.config.cjs
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Main palette - pepper themed
        'periwinkle': '#E8EAF6',     // Light background
        'pepper': '#D63B2E',         // Main pepper red
        'pepper-red': '#D63B2E',     // Alias for consistency
        'pepper-green': '#4CAF50',   // Green pepper accent
        'garden': '#22C55E',         // Success green
        'sunny': '#FFD93D',          // Yellow accent
        'wildcard': '#FF6B35',       // Orange pepper wildcard
        
        // Tomato compatibility (for shared components)
        'tomato': '#D63B2E',
        'tomato-soft': '#FFE8E6',
        
        // Panel backgrounds
        'pepper-soft': '#FFE8E6',
        
        // Heat level colors
        'heat-none': '#8BC34A',      // Green - no heat
        'heat-mild': '#CDDC39',      // Light green
        'heat-medium': '#FFC107',    // Yellow
        'heat-hot': '#FF9800',       // Orange
        'heat-very-hot': '#FF5722',  // Deep orange
        'heat-extreme': '#D32F2F',   // Red
        
        // Neutrals
        'ink': '#2A2A2A',
      },
    },
  },
  plugins: [],
}
