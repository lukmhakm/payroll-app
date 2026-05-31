import type { ThemePalette } from '@/types'

export interface ThemePreset {
  name: string
  description: string
  palette: ThemePalette
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    name: 'Original Brutalist',
    description: 'The classic Perisseia Neo-Brutalist look.',
    palette: {
      primary: '#2b2b2b',
      surface: '#F3EBD9',
      accent: '#E43427',
      highlight: '#15438D',
    }
  },
  {
    name: 'Cyberpunk Neon',
    description: 'Vibrant neon contrast in a deep cyberpunk aesthetic.',
    palette: {
      primary: '#0B0B0F',
      surface: '#151522',
      accent: '#FF007F',
      highlight: '#00F0FF',
    }
  },
  {
    name: 'Forest Mint',
    description: 'Calming and organic green-based theme.',
    palette: {
      primary: '#1A2E22',
      surface: '#EBF4EF',
      accent: '#2A7A4C',
      highlight: '#0F6056',
    }
  },
  {
    name: 'Warm Terracotta',
    description: 'Earthy clays and bright golden highlights.',
    palette: {
      primary: '#321D15',
      surface: '#FAF0EB',
      accent: '#D84E25',
      highlight: '#D97706',
    }
  },
  {
    name: 'Midnight Slate',
    description: 'Sophisticated professional slate with electric highlights.',
    palette: {
      primary: '#0F172A',
      surface: '#F8FAFC',
      accent: '#1E293B',
      highlight: '#3B82F6',
    }
  },
  {
    name: 'Lavender Mist',
    description: 'Regal violet tones with playful pink contrasts.',
    palette: {
      primary: '#2A1845',
      surface: '#F6F3FA',
      accent: '#7C3AED',
      highlight: '#EC4899',
    }
  }
]

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let cleanHex = hex.replace(/^#/, '')
  
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(char => char + char).join('')
  }
  
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  
  let h = 0
  let s = 0
  const l = (max + min) / 2
  
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break;
      case g:
        h = (b - r) / d + 2
        break;
      case b:
        h = (r - g) / d + 4
        break;
    }
    
    h /= 6
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

export function hslToHex(h: number, s: number, l: number): string {
  s /= 100
  l /= 100
  
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
    
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`
}

export function generateBrutalistPalette(baseHex: string): ThemePalette {
  const { h, s, l } = hexToHsl(baseHex)
  
  const accent = baseHex
  const surface = hslToHex(h, 12, 95)
  const primary = hslToHex(h, 15, 12)
  
  let highlightHue = (h + 180) % 360
  if (h >= 180 && h <= 260) {
    highlightHue = (h + 120) % 360
  } else if (h >= 0 && h < 40) {
    highlightHue = (h + 200) % 360
  }
  
  const highlightSat = Math.max(s, 75)
  const highlightLight = l > 60 ? 35 : 45
  
  const highlight = hslToHex(highlightHue, highlightSat, highlightLight)
  
  return {
    primary,
    surface,
    accent,
    highlight
  }
}

export function getTheme() {
    if (typeof window === 'undefined') {
        return {
            primary: '#2b2b2b',
            surface: '#F3EBD9',
            accent: '#E43427',
            highlight: '#15438D',
        }
    }

    return {
        primary:
            localStorage.getItem('theme_primary') || '#2b2b2b',

        surface:
            localStorage.getItem('theme_surface') || '#F3EBD9',

        accent:
            localStorage.getItem('theme_accent') || '#E43427',

        highlight:
            localStorage.getItem('theme_highlight') || '#15438D',
    }
}