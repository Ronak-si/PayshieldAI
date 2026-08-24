/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        space: {
          950: '#050816',
          900: '#080B1A',
          850: '#0B1026',
          800: '#11162E',
          700: '#161D3F',
          600: '#1E2750',
        },
        brand: {
          50: '#E8F6FF',
          100: '#C9E8FF',
          200: '#9BD0FF',
          300: '#6BB8FF',
          400: '#3D9DFF',
          500: '#1A82F5',
          600: '#0A66D4',
          700: '#0A4FA8',
          800: '#0B3D82',
          900: '#0C2E61',
        },
        cyan: {
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
        },
        risk: {
          safe: '#10B981',
          safeGlow: 'rgba(16,185,129,0.25)',
          medium: '#F59E0B',
          mediumGlow: 'rgba(245,158,11,0.25)',
          high: '#F97316',
          highGlow: 'rgba(249,115,22,0.25)',
          critical: '#EF4444',
          criticalGlow: 'rgba(239,68,68,0.3)',
        },
        ink: {
          50: '#F2F5FB',
          100: '#E2E8F0',
          200: '#CBD5E1',
          300: '#94A3B8',
          400: '#64748B',
          500: '#475569',
          600: '#334155',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        'glow-brand': '0 0 0 1px rgba(26,130,245,0.25), 0 8px 30px -8px rgba(26,130,245,0.35)',
        'glow-safe': '0 0 24px -4px rgba(16,185,129,0.35)',
        'glow-medium': '0 0 24px -4px rgba(245,158,11,0.35)',
        'glow-high': '0 0 24px -4px rgba(249,115,22,0.4)',
        'glow-critical': '0 0 30px -4px rgba(239,68,68,0.45)',
        card: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 10px 30px -12px rgba(0,0,0,0.7)',
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-fast': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulse: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.45' },
        },
        twinkle: {
          '0%,100%': { opacity: '0.15' },
          '50%': { opacity: '0.8' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'scan': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(2000%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out both',
        'fade-in-fast': 'fade-in-fast 0.25s ease-out both',
        'scale-in': 'scale-in 0.3s ease-out both',
        pulse: 'pulse 2.4s ease-in-out infinite',
        twinkle: 'twinkle 4s ease-in-out infinite',
        'spin-slow': 'spin-slow 14s linear infinite',
      },
    },
  },
  plugins: [],
};
