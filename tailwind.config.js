/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy:  { 50:'#EEF2F8', 100:'#C4D0E5', 500:'#2A5080', 600:'#1B3A5C', 700:'#142D47', 800:'#0E2035', 900:'#081525' },
        teal:  { 50:'#E4F3EF', 100:'#B0D9CF', 400:'#2A9A7C', 500:'#1E7D63', 600:'#1A6B55', 700:'#145444', 800:'#0E3D31' },
        gold:  { 50:'#FDF4E0', 100:'#F8E0A0', 400:'#D4A020', 500:'#B88A10', 600:'#9A7008' },
      },
      animation: {
        'fade-up':   'fadeUp 0.4s ease forwards',
        'fade-in':   'fadeIn 0.3s ease forwards',
        'slide-in':  'slideIn 0.3s ease forwards',
        'pulse-dot': 'pulseDot 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:   { from:{ opacity:0, transform:'translateY(8px)' }, to:{ opacity:1, transform:'translateY(0)' } },
        fadeIn:   { from:{ opacity:0 },                              to:{ opacity:1 } },
        slideIn:  { from:{ opacity:0, transform:'translateX(-8px)' },to:{ opacity:1, transform:'translateX(0)' } },
        pulseDot: { '0%,100%':{ opacity:1 }, '50%':{ opacity:0.4 } },
      },
    },
  },
  plugins: [],
}
