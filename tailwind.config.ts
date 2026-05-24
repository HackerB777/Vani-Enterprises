import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
      },
      fontFamily: {
        sans:    ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft:         '0 4px 24px rgba(28,25,23,0.06)',
        card:         '0 2px 12px rgba(28,25,23,0.08)',
        'card-hover': '0 12px 48px rgba(28,25,23,0.14)',
        brand:        '0 4px 24px rgba(194,65,12,0.25)',
        xl2:          '0 24px 64px rgba(28,25,23,0.12)',
        glow:         '0 0 40px rgba(249,115,22,0.35)',
        'glow-lg':    '0 0 80px rgba(249,115,22,0.25)',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34,1.56,0.64,1)',
        smooth: 'cubic-bezier(0.16,1,0.3,1)',
      },
      animation: {
        /* existing */
        'fade-in':        'fadeIn 0.25s ease-in-out',
        'slide-up':       'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)',
        'slide-in-right': 'slideInRight 0.35s cubic-bezier(0.16,1,0.3,1)',
        'pulse-soft':     'pulseSoft 2s ease-in-out infinite',
        /* new */
        'fade-up':        'fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) both',
        'fade-up-slow':   'fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) both',
        'zoom-in':        'zoomIn 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'bounce-in':      'bounceIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both',
        'slide-in-left':  'slideInLeft 0.35s cubic-bezier(0.16,1,0.3,1)',
        'scale-in':       'scaleIn 0.35s cubic-bezier(0.16,1,0.3,1) both',
        'float':          'float 3.5s ease-in-out infinite',
        'float-delayed':  'float 3.5s ease-in-out 1.5s infinite',
        'shimmer':        'shimmer 1.8s linear infinite',
        'spin-slow':      'spin 8s linear infinite',
        'glow-pulse':     'glowPulse 2.5s ease-in-out infinite',
        'count-up':       'countUp 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'hero-text':      'heroText 0.9s cubic-bezier(0.16,1,0.3,1) both',
        'draw':           'draw 1s ease-in-out forwards',
        'ripple':         'ripple 0.6s linear',
      },
      keyframes: {
        /* existing */
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)' },
          to:   { transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '0.55' },
        },
        /* new */
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        zoomIn: {
          from: { opacity: '0', transform: 'scale(0.93)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        bounceIn: {
          '0%':   { opacity: '0', transform: 'scale(0.75)' },
          '60%':  { opacity: '1', transform: 'scale(1.05)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-32px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.88)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-400% 0' },
          '100%': { backgroundPosition:  '400% 0' },
        },
        glowPulse: {
          '0%,100%': { boxShadow: '0 0 8px rgba(249,115,22,0.3)' },
          '50%':     { boxShadow: '0 0 32px rgba(249,115,22,0.65)' },
        },
        countUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        heroText: {
          from: { opacity: '0', transform: 'translateY(20px) skewY(2deg)' },
          to:   { opacity: '1', transform: 'translateY(0) skewY(0deg)' },
        },
        draw: {
          from: { strokeDashoffset: '1000' },
          to:   { strokeDashoffset: '0' },
        },
        ripple: {
          '0%':   { transform: 'scale(0)', opacity: '0.5' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
