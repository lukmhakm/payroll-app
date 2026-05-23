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
  primary: '#111111',
  surface: '#F3EBD9',
  accent: '#E43427',
  highlight: '#15438D',
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
      primary:
        localStorage.getItem(STORAGE_KEYS.primary) ||
        DEFAULT_THEME.primary,

      surface:
        localStorage.getItem(STORAGE_KEYS.surface) ||
        DEFAULT_THEME.surface,

      accent:
        localStorage.getItem(STORAGE_KEYS.accent) ||
        DEFAULT_THEME.accent,

      highlight:
        localStorage.getItem(STORAGE_KEYS.highlight) ||
        DEFAULT_THEME.highlight,
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
      ...theme,
      ...payload,
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