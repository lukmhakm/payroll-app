export function getTheme() {

    if (typeof window === 'undefined') {
        return {
            primary: '#111111',
            surface: '#F3EBD9',
            accent: '#E43427',
            highlight: '#15438D',
        }
    }

    return {
        primary:
            localStorage.getItem('theme_primary') || '#111111',

        surface:
            localStorage.getItem('theme_surface') || '#F3EBD9',

        accent:
            localStorage.getItem('theme_accent') || '#E43427',

        highlight:
            localStorage.getItem('theme_highlight') || '#15438D',
    }
}