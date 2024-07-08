import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const colors = {
  black: '#000',
  white: '#fff',
  transparent: 'transparent',
  current: 'currentColor',
  neutral: {
    '0': '#FFFFFF',
    '100': '#F6F8FA',
    '200': '#E2E4E9',
    '300': '#CDD0D5',
    '400': '#868C98',
    '500': '#525866',
    '600': '#31353F',
    '700': '#20232D',
    '800': '#161922',
    '900': '#0A0D14',
  },
  blue: {
    // biome-ignore lint/style/useNamingConvention: Tailwind Specific
    DEFAULT: '#375DFB',
    foreground: '#FFFFFF',

    lighter: {
      // biome-ignore lint/style/useNamingConvention: Tailwind Specific
      DEFAULT: '#EBF1FF',
      foreground: '#162664',
    },
    light: {
      // biome-ignore lint/style/useNamingConvention: Tailwind Specific
      DEFAULT: '#C2D6FF',
      foreground: '#162664',
    },
    dark: {
      // biome-ignore lint/style/useNamingConvention: Tailwind Specific
      DEFAULT: '#253EA7',
      foreground: '#FFFFFF',
    },
    darker: {
      // biome-ignore lint/style/useNamingConvention: Tailwind Specific
      DEFAULT: '#162664',
      foreground: '#FFFFFF',
    },
  },
  orange: {
    // biome-ignore lint/style/useNamingConvention: Tailwind Specific
    DEFAULT: '#F17B2C',
    foreground: '#FFFFFF',

    lighter: {
      // biome-ignore lint/style/useNamingConvention: Tailwind Specific
      DEFAULT: '#FEF3EB',
      foreground: '#6E330C',
    },
    light: {
      // biome-ignore lint/style/useNamingConvention: Tailwind Specific
      DEFAULT: '#FFDAC2',
      foreground: '#6E330C',
    },
    dark: {
      // biome-ignore lint/style/useNamingConvention: Tailwind Specific
      DEFAULT: '#C2540A',
      foreground: '#FFFFFF',
    },
    darker: {
      // biome-ignore lint/style/useNamingConvention: Tailwind Specific
      DEFAULT: '#6E330C',
      foreground: '#FFFFFF',
    },
  },
  yellow: {
    // biome-ignore lint/style/useNamingConvention: Tailwind Specific
    DEFAULT: '#F2AE40',
    foreground: '#FFFFFF',

    lighter: {
      // biome-ignore lint/style/useNamingConvention: Tailwind Specific
      DEFAULT: '#FEF7EC',
      foreground: '#693D11',
    },
    light: {
      // biome-ignore lint/style/useNamingConvention: Tailwind Specific
      DEFAULT: '#FBDFB1',
      foreground: '#693D11',
    },
    dark: {
      // biome-ignore lint/style/useNamingConvention: Tailwind Specific
      DEFAULT: '#B47818',
      foreground: '#FFFFFF',
    },
    darker: {
      // biome-ignore lint/style/useNamingConvention: Tailwind Specific
      DEFAULT: '#693D11',
      foreground: '#FFFFFF',
    },
  },
  red: {
    // biome-ignore lint/style/useNamingConvention: Tailwind Specific
    DEFAULT: '#DF1C41',
    foreground: '#FFFFFF',

    lighter: {
      // biome-ignore lint/style/useNamingConvention: Tailwind Specific
      DEFAULT: '#FDEDF0',
      foreground: '#710E21',
    },
    light: {
      // biome-ignore lint/style/useNamingConvention: Tailwind Specific
      DEFAULT: '#F8C9D2',
      foreground: '#710E21',
    },
    dark: {
      // biome-ignore lint/style/useNamingConvention: Tailwind Specific
      DEFAULT: '#AF1D38',
      foreground: '#FFFFFF',
    },
    darker: {
      // biome-ignore lint/style/useNamingConvention: Tailwind Specific
      DEFAULT: '#710E21',
      foreground: '#FFFFFF',
    },
  },
  green: {
    // biome-ignore lint/style/useNamingConvention: Tailwind Specific
    DEFAULT: '#38C793',
    foreground: '#FFFFFF',

    lighter: {
      // biome-ignore lint/style/useNamingConvention: Tailwind Specific
      DEFAULT: '#EFFAF6',
      foreground: '#176448',
    },
    light: {
      // biome-ignore lint/style/useNamingConvention: Tailwind Specific
      DEFAULT: '#CBF5E5',
      foreground: '#176448',
    },
    dark: {
      // biome-ignore lint/style/useNamingConvention: Tailwind Specific
      DEFAULT: '#2D9F75',
      foreground: '#FFFFFF',
    },
    darker: {
      // biome-ignore lint/style/useNamingConvention: Tailwind Specific
      DEFAULT: '#176448',
      foreground: '#FFFFFF',
    },
  },
  purple: {
    // biome-ignore lint/style/useNamingConvention: Tailwind Specific
    DEFAULT: '#6E3FF3',
    foreground: '#FFFFFF',

    lighter: {
      // biome-ignore lint/style/useNamingConvention: Tailwind Specific
      DEFAULT: '#EEEBFF',
      foreground: '#2B1664',
    },
    light: {
      // biome-ignore lint/style/useNamingConvention: Tailwind Specific
      DEFAULT: '#CAC2FF',
      foreground: '#2B1664',
    },
    dark: {
      // biome-ignore lint/style/useNamingConvention: Tailwind Specific
      DEFAULT: '#5A36BF',
      foreground: '#FFFFFF',
    },
    darker: {
      // biome-ignore lint/style/useNamingConvention: Tailwind Specific
      DEFAULT: '#2B1664',
      foreground: '#FFFFFF',
    },
  },
  pink: {
    // biome-ignore lint/style/useNamingConvention: Tailwind Specific
    DEFAULT: '#E255F2',
    foreground: '#FFFFFF',

    lighter: {
      // biome-ignore lint/style/useNamingConvention: Tailwind Specific
      DEFAULT: '#FDEBFF',
      foreground: '#620F6C',
    },
    light: {
      // biome-ignore lint/style/useNamingConvention: Tailwind Specific
      DEFAULT: '#F9C2FF',
      foreground: '#620F6C',
    },
    dark: {
      // biome-ignore lint/style/useNamingConvention: Tailwind Specific
      DEFAULT: '#9C23A9',
      foreground: '#FFFFFF',
    },
    darker: {
      // biome-ignore lint/style/useNamingConvention: Tailwind Specific
      DEFAULT: '#620F6C',
      foreground: '#FFFFFF',
    },
  },
  teal: {
    // biome-ignore lint/style/useNamingConvention: Tailwind Specific
    DEFAULT: '#35B9E9',
    foreground: '#FFFFFF',

    lighter: {
      // biome-ignore lint/style/useNamingConvention: Tailwind Specific
      DEFAULT: '#EBFAFF',
      foreground: '#164564',
    },
    light: {
      // biome-ignore lint/style/useNamingConvention: Tailwind Specific
      DEFAULT: '#C2EFFF',
      foreground: '#164564',
    },
    dark: {
      // biome-ignore lint/style/useNamingConvention: Tailwind Specific
      DEFAULT: '#1F87AD',
      foreground: '#FFFFFF',
    },
    darker: {
      // biome-ignore lint/style/useNamingConvention: Tailwind Specific
      DEFAULT: '#164564',
      foreground: '#FFFFFF',
    },
  },
}


const config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "../../packages/react-ui/src/**/*.{ts,tsx}",
  ],
  darkMode: ["class"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    colors,
    extend: {
      colors: {
        primary: colors.purple,
        warn: colors.yellow,
        error: colors.red,
        success: colors.green,
        info: colors.blue,
      },
      screens: {
        '2xl': '1550px',
      },
      borderRadius: {
        '4xl': '1.5rem',
        '3xl': 'calc(1rem + 2px)',
        '2xl': '1rem',
        xl: 'calc(0.5rem + 4px)',
        lg: 'calc(0.5rem + 2px)',
        md: '0.5rem', // 8

        // biome-ignore lint/style/useNamingConvention: Tailwind Specific
        DEFAULT: '0.5rem',
        sm: 'calc(0.5rem - 2px)',
        xs: 'calc(0.5rem - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;

 
export default config;
