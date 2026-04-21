/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './work.html',
    './proof.html',
    './dashboard.html',
    './ops.html',
  ],
  safelist: [
    'bg-brand-bg',
    'bg-brand-card',
    'bg-brand-gold',
    'bg-brand-goldHover',
    'text-brand-textBase',
    'text-brand-textMuted',
    'text-brand-gold',
    'border-brand-gold',
    'glass-panel',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          bg:         '#071520',
          card:       '#0D1F3C',
          gold:       '#C9A84C',
          goldHover:  '#e0c26c',
          textBase:   '#EDEAE5',
          textMuted:  '#94a3b8',
        },
      },
      fontFamily: {
        sans:    ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
        mono:    ['Space Mono', 'monospace'],
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(to right, #ffffff05 1px, transparent 1px), linear-gradient(to bottom, #ffffff05 1px, transparent 1px)',
        'glow-radial':  'radial-gradient(circle at 50% 0%, rgba(13, 31, 60, 0.8) 0%, rgba(7, 21, 32, 0) 50%)',
      },
    },
  },
  plugins: [],
};
