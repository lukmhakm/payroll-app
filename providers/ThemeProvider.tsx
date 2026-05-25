'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react'

export type ThemePalette = {
  primary: string
  surface: string
  accent: string
  highlight: string
}

type ThemeContextType = {
  theme: ThemePalette
  updateTheme: (payload: Partial<ThemePalette>) => void
  resetTheme: () => void
}

const DEFAULT_THEME: ThemePalette = {
  primary: '#2b2b2b',
  surface: '#F3EBD9',
  accent: '#E43427',
  highlight: '#15438D',
}

const normalizeColor = (color: string | null, fallback: string) => {
  if (!color) return fallback
  const trimmed = color.trim()
  // Tambahkan # secara otomatis jika user menginput hex tanpa #
  if (/^([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(trimmed)) {
    return `#${trimmed}`
  }
  return trimmed
}

const ThemeContext = createContext<ThemeContextType | null>(null)

const STORAGE_KEYS = {
  primary: 'theme_primary',
  surface: 'theme_surface',
  accent: 'theme_accent',
  highlight: 'theme_highlight',
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemePalette>(DEFAULT_THEME)

  useEffect(() => {
    const storedTheme: ThemePalette = {
      primary: normalizeColor(localStorage.getItem(STORAGE_KEYS.primary), DEFAULT_THEME.primary),
      surface: normalizeColor(localStorage.getItem(STORAGE_KEYS.surface), DEFAULT_THEME.surface),
      accent: normalizeColor(localStorage.getItem(STORAGE_KEYS.accent), DEFAULT_THEME.accent),
      highlight: normalizeColor(localStorage.getItem(STORAGE_KEYS.highlight), DEFAULT_THEME.highlight),
    }

    setTheme(storedTheme)
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--theme-primary',
      theme.primary
    )

    document.documentElement.style.setProperty(
      '--theme-surface',
      theme.surface
    )

    document.documentElement.style.setProperty(
      '--theme-accent',
      theme.accent
    )

    document.documentElement.style.setProperty(
      '--theme-highlight',
      theme.highlight
    )
  }, [theme])

  const updateTheme = (payload: Partial<ThemePalette>) => {
    const updated = {
      primary: payload.primary !== undefined ? normalizeColor(payload.primary, theme.primary) : theme.primary,
      surface: payload.surface !== undefined ? normalizeColor(payload.surface, theme.surface) : theme.surface,
      accent: payload.accent !== undefined ? normalizeColor(payload.accent, theme.accent) : theme.accent,
      highlight: payload.highlight !== undefined ? normalizeColor(payload.highlight, theme.highlight) : theme.highlight,
    }

    setTheme(updated)

    localStorage.setItem(STORAGE_KEYS.primary, updated.primary)
    localStorage.setItem(STORAGE_KEYS.surface, updated.surface)
    localStorage.setItem(STORAGE_KEYS.accent, updated.accent)
    localStorage.setItem(STORAGE_KEYS.highlight, updated.highlight)
  }

  const resetTheme = () => {
    setTheme(DEFAULT_THEME)

    localStorage.setItem(STORAGE_KEYS.primary, DEFAULT_THEME.primary)
    localStorage.setItem(STORAGE_KEYS.surface, DEFAULT_THEME.surface)
    localStorage.setItem(STORAGE_KEYS.accent, DEFAULT_THEME.accent)
    localStorage.setItem(STORAGE_KEYS.highlight, DEFAULT_THEME.highlight)
  }

  const value = useMemo(
    () => ({
      theme,
      updateTheme,
      resetTheme,
    }),
    [theme]
  )

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider')
  }

  return context
}