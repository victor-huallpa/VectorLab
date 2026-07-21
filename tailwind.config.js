/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Paleta "laboratorio nocturno": azul-carbón profundo, no negro puro,
        // para que los paneles y el lienzo del campo vectorial respiren.
        void: '#0B0E14',
        surface: {
          DEFAULT: '#12161F',
          raised: '#1A2029',
          sunken: '#0E1119',
        },
        border: {
          DEFAULT: '#232A38',
          subtle: '#1A1F2B',
        },
        accent: {
          DEFAULT: '#4EE1D0', // teal eléctrico — dirección del vector
          hover: '#6FEADC',
          muted: '#2A6E68',
        },
        ember: {
          DEFAULT: '#F2A65A', // ámbar — partículas y magnitud alta
          hover: '#F5B87A',
        },
        danger: {
          DEFAULT: '#F2607A',
          muted: '#5A2A36',
        },
        ink: {
          DEFAULT: '#E7EAF0',
          muted: '#8A93A6',
          faint: '#4B5468',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'grid-fine':
          'linear-gradient(to right, rgba(138,147,166,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(138,147,166,0.06) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '24px 24px',
      },
      boxShadow: {
        panel: '0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 24px -12px rgba(0,0,0,0.6)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0, transform: 'translateY(4px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.35s ease-out',
      },
    },
  },
  plugins: [],
};
