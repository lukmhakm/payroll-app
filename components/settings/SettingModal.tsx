

'use client'

import { useEffect, useState } from 'react'
import { useTheme } from '@/providers/ThemeProvider'
import { useSettings } from '@/providers/SettingsProvider'
import { THEME_PRESETS, generateBrutalistPalette } from '@/lib/theme'

interface SettingsModalProps {
    open: boolean
    onClose: () => void
}

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
    const { theme, updateTheme } = useTheme()
    const { settings, updateSettings } = useSettings()

    const [companyName, setCompanyName] = useState(settings.companyName)
    const [footerText, setFooterText] = useState(settings.slipFooterText)
    const [emailSignature, setEmailSignature] = useState(settings.emailSignature)
    const [themePrimary, setThemePrimary] = useState(theme.primary)
    const [themeSurface, setThemeSurface] = useState(theme.surface)
    const [themeAccent, setThemeAccent] = useState(theme.accent)
    const [themeHighlight, setThemeHighlight] = useState(theme.highlight)
    const [defaultPayrollStart, setDefaultPayrollStart] = useState(settings.defaultPayrollStart)
    const [showConfidential, setShowConfidential] = useState(settings.showConfidential)
    const [showWatermark, setShowWatermark] = useState(settings.showWatermark)

    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        if (!open) return

        setCompanyName(settings.companyName)
        setFooterText(settings.slipFooterText)
        setEmailSignature(settings.emailSignature)
        setThemePrimary(theme.primary)
        setThemeSurface(theme.surface)
        setThemeAccent(theme.accent)
        setThemeHighlight(theme.highlight)
        setDefaultPayrollStart(settings.defaultPayrollStart)
        setShowConfidential(settings.showConfidential)
        setShowWatermark(settings.showWatermark)

    }, [open, settings, theme])
    /* eslint-enable react-hooks/set-state-in-effect */

    function saveSettings() {
        updateSettings({
            companyName,
            slipFooterText: footerText,
            emailSignature,
            defaultPayrollStart,
            showConfidential,
            showWatermark
        })
        
        updateTheme({
            primary: themePrimary,
            surface: themeSurface,
            accent: themeAccent,
            highlight: themeHighlight
        })

        onClose()
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

            <div className="w-full max-w-2xl bg-[var(--theme-surface)] border-[6px] border-[var(--theme-primary)] rounded-[40px] shadow-[12px_12px_0px_var(--theme-primary)] overflow-hidden max-h-[90vh] overflow-y-auto transition-colors duration-300">

                {/* HEADER */}
                <div className="sticky top-0 bg-[var(--theme-accent)] border-b-[6px] border-[var(--theme-primary)] px-8 py-6 flex items-center justify-between z-10 transition-colors duration-300">

                    <div>
                        <div className="text-[11px] uppercase tracking-[0.18em] font-black text-[var(--theme-surface)] opacity-80 mb-2 transition-colors duration-300">
                            Global App Configuration
                        </div>

                        <h2 className="text-4xl font-black uppercase tracking-tight text-[var(--theme-surface)] leading-none transition-colors duration-300">
                            Settings
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-12 h-12 bg-[var(--theme-primary)] hover:brightness-125 text-[var(--theme-surface)] rounded-2xl border-4 border-[var(--theme-primary)] text-2xl font-black shadow-[4px_4px_0px_var(--theme-primary)] active:translate-y-[2px] active:shadow-[2px_2px_0px_var(--theme-primary)] transition-all duration-300"
                    >
                        ×
                    </button>
                </div>

                {/* CONTENT */}
                <div className="p-8 flex flex-col gap-8">

                    {/* COMPANY */}
                    <section className="bg-[var(--theme-surface)] brightness-110 border-4 border-[var(--theme-primary)] rounded-[32px] p-6 shadow-[6px_6px_0px_var(--theme-primary)] transition-colors duration-300">

                        <div className="text-[11px] uppercase tracking-[0.18em] font-black text-[var(--theme-highlight)] mb-3 transition-colors duration-300">
                            Company Identity
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">

                            <div>
                                <div className="text-xs font-black uppercase tracking-[0.12em] text-[var(--theme-primary)] mb-2 transition-colors duration-300">
                                    Company Name
                                </div>

                                <input
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    className="w-full bg-[var(--theme-surface)] border-4 border-[var(--theme-primary)] text-[var(--theme-primary)] rounded-2xl px-5 py-4 font-black outline-none transition-colors duration-300"
                                    placeholder="Perisseia"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <div className="text-xs font-black uppercase tracking-[0.12em] text-[var(--theme-primary)] mb-4 transition-colors duration-300">
                                    Brand Palette
                                </div>

                                {/* THEME PRESETS */}
                                <div className="mb-6">
                                    <div className="text-[11px] font-black uppercase tracking-[0.12em] text-[var(--theme-primary)] mb-3 opacity-80">
                                        Quick Select Preset Themes
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {THEME_PRESETS.map((preset) => {
                                            const isSelected = 
                                                themePrimary === preset.palette.primary &&
                                                themeSurface === preset.palette.surface &&
                                                themeAccent === preset.palette.accent &&
                                                themeHighlight === preset.palette.highlight;
                                            
                                            return (
                                                <button
                                                    key={preset.name}
                                                    onClick={() => {
                                                        setThemePrimary(preset.palette.primary)
                                                        setThemeSurface(preset.palette.surface)
                                                        setThemeAccent(preset.palette.accent)
                                                        setThemeHighlight(preset.palette.highlight)
                                                    }}
                                                    type="button"
                                                    className="flex flex-col items-start p-3 border-4 rounded-2xl bg-white hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_var(--theme-primary)] active:translate-y-0 active:shadow-[1px_1px_0px_var(--theme-primary)] transition-all cursor-pointer text-left w-full group"
                                                    style={{
                                                        boxShadow: isSelected
                                                            ? '2px 2px 0px var(--theme-primary)'
                                                            : '4px 4px 0px var(--theme-primary)',
                                                        borderColor: isSelected
                                                            ? 'var(--theme-accent)'
                                                            : 'var(--theme-primary)',
                                                        transform: isSelected
                                                            ? 'translateY(2px) translateX(2px)'
                                                            : 'none'
                                                    }}
                                                >
                                                    <span className="text-[11px] font-black uppercase tracking-wider text-[var(--theme-primary)] mb-2 block truncate w-full">
                                                        {preset.name}
                                                    </span>
                                                    <div className="flex gap-1.5 w-full">
                                                        <span className="w-5 h-5 rounded-lg border-2 border-[var(--theme-primary)]" style={{ backgroundColor: preset.palette.surface }} title="Surface" />
                                                        <span className="w-5 h-5 rounded-lg border-2 border-[var(--theme-primary)]" style={{ backgroundColor: preset.palette.accent }} title="Accent" />
                                                        <span className="w-5 h-5 rounded-lg border-2 border-[var(--theme-primary)]" style={{ backgroundColor: preset.palette.highlight }} title="Highlight" />
                                                        <span className="w-5 h-5 rounded-lg border-2 border-[var(--theme-primary)]" style={{ backgroundColor: preset.palette.primary }} title="Primary" />
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* DYNAMIC THEME GENERATOR */}
                                <div className="mb-8 border-4 border-dashed border-[var(--theme-primary)] rounded-3xl p-5 bg-white/40">
                                    <div className="text-[11px] font-black uppercase tracking-[0.12em] text-[var(--theme-primary)] mb-1.5">
                                        Dynamic Theme Generator
                                    </div>
                                    <p className="text-[10px] font-bold text-[var(--theme-primary)] opacity-70 mb-4 uppercase leading-snug">
                                        Pick your base color, and we will auto-generate a cohesive Neo-Brutalist palette for you.
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="color"
                                            className="w-14 h-14 border-4 border-[var(--theme-primary)] rounded-2xl cursor-pointer bg-white transition-transform duration-300 hover:scale-105 active:scale-95"
                                            onChange={(e) => {
                                                const generated = generateBrutalistPalette(e.target.value)
                                                setThemePrimary(generated.primary)
                                                setThemeSurface(generated.surface)
                                                setThemeAccent(generated.accent)
                                                setThemeHighlight(generated.highlight)
                                            }}
                                        />
                                        <div className="text-xs font-black uppercase tracking-wider text-[var(--theme-primary)] animate-pulse">
                                            ← Choose a color to auto-generate
                                        </div>
                                    </div>
                                </div>

                                <div className="text-[11px] font-black uppercase tracking-[0.12em] text-[var(--theme-primary)] mb-3 opacity-80">
                                    Adjust Individual Colors
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <div
                                        className="border-4 border-[var(--theme-primary)] rounded-3xl p-4 transition-all duration-300"
                                        style={{ backgroundColor: `${themePrimary}22` }}
                                    >
                                        <div className="text-[11px] text-[var(--theme-primary)] font-black uppercase tracking-widest mb-3 transition-colors duration-300">
                                            Primary
                                        </div>

                                        <div className="flex gap-3">
                                            <input
                                                type="color"
                                                value={themePrimary}
                                                onChange={(e) => setThemePrimary(e.target.value)}
                                                className="w-12 sm:w-16 h-12 sm:h-16 shrink-0 border-4 border-[var(--theme-primary)] rounded-2xl cursor-pointer overflow-hidden bg-white transition-colors duration-300"
                                                style={{ backgroundColor: themePrimary }}
                                            />

                                            <input
                                                value={themePrimary}
                                                onChange={(e) => setThemePrimary(e.target.value)}
                                                className="flex-1 min-w-0 w-full bg-white border-4 border-[var(--theme-primary)] text-[var(--theme-primary)] rounded-2xl px-3 sm:px-4 py-2 sm:py-3 font-black uppercase outline-none transition-colors duration-300"
                                            />
                                        </div>
                                    </div>

                                    <div
                                        className="border-4 border-[var(--theme-primary)] rounded-3xl p-4 transition-all duration-300"
                                        style={{ backgroundColor: `${themeSurface}44` }}
                                    >
                                        <div className="text-[11px] text-[var(--theme-primary)] font-black uppercase tracking-widest mb-3 transition-colors duration-300">
                                            Surface
                                        </div>

                                        <div className="flex gap-3">
                                            <input
                                                type="color"
                                                value={themeSurface}
                                                onChange={(e) => setThemeSurface(e.target.value)}
                                                className="w-12 sm:w-16 h-12 sm:h-16 shrink-0 border-4 border-[var(--theme-primary)] rounded-2xl cursor-pointer overflow-hidden bg-white transition-colors duration-300"
                                                style={{ backgroundColor: themeSurface }}
                                            />

                                            <input
                                                value={themeSurface}
                                                onChange={(e) => setThemeSurface(e.target.value)}
                                                className="flex-1 min-w-0 w-full bg-white border-4 border-[var(--theme-primary)] text-[var(--theme-primary)] rounded-2xl px-3 sm:px-4 py-2 sm:py-3 font-black uppercase outline-none transition-colors duration-300"
                                            />
                                        </div>
                                    </div>

                                    <div
                                        className="border-4 border-[var(--theme-primary)] rounded-3xl p-4 transition-all duration-300"
                                        style={{ backgroundColor: `${themeAccent}22` }}
                                    >
                                        <div className="text-[11px] text-[var(--theme-primary)] font-black uppercase tracking-widest mb-3 transition-colors duration-300">
                                            Accent
                                        </div>

                                        <div className="flex gap-3">
                                            <input
                                                type="color"
                                                value={themeAccent}
                                                onChange={(e) => setThemeAccent(e.target.value)}
                                                className="w-12 sm:w-16 h-12 sm:h-16 shrink-0 border-4 border-[var(--theme-primary)] rounded-2xl cursor-pointer overflow-hidden bg-white transition-colors duration-300"
                                                style={{ backgroundColor: themeAccent }}
                                            />

                                            <input
                                                value={themeAccent}
                                                onChange={(e) => setThemeAccent(e.target.value)}
                                                className="flex-1 min-w-0 w-full bg-white border-4 border-[var(--theme-primary)] text-[var(--theme-primary)] rounded-2xl px-3 sm:px-4 py-2 sm:py-3 font-black uppercase outline-none transition-colors duration-300"
                                            />
                                        </div>
                                    </div>

                                    <div
                                        className="border-4 border-[var(--theme-primary)] rounded-3xl p-4 transition-all duration-300"
                                        style={{ backgroundColor: `${themeHighlight}22` }}
                                    >
                                        <div className="text-[11px] text-[var(--theme-primary)] font-black uppercase tracking-widest mb-3 transition-colors duration-300">
                                            Highlight
                                        </div>

                                        <div className="flex gap-3">
                                            <input
                                                type="color"
                                                value={themeHighlight}
                                                onChange={(e) => setThemeHighlight(e.target.value)}
                                                className="w-12 sm:w-16 h-12 sm:h-16 shrink-0 border-4 border-[var(--theme-primary)] rounded-2xl cursor-pointer overflow-hidden bg-white transition-colors duration-300"
                                                style={{ backgroundColor: themeHighlight }}
                                            />

                                            <input
                                                value={themeHighlight}
                                                onChange={(e) => setThemeHighlight(e.target.value)}
                                                className="flex-1 min-w-0 w-full bg-white border-4 border-[var(--theme-primary)] text-[var(--theme-primary)] rounded-2xl px-3 sm:px-4 py-2 sm:py-3 font-black uppercase outline-none transition-colors duration-300"
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </section>

                    {/* PAYROLL */}
                    <section className="bg-[var(--theme-highlight)] border-4 border-[var(--theme-primary)] rounded-[32px] p-6 shadow-[6px_6px_0px_var(--theme-primary)] text-[var(--theme-surface)] transition-colors duration-300">

                        <div className="text-[11px] uppercase tracking-[0.18em] font-black opacity-70 mb-3 transition-colors duration-300">
                            Payroll Configuration
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">

                            <div>
                                <div className="text-xs font-black uppercase tracking-[0.12em] mb-2 transition-colors duration-300">
                                    Default Payroll Start
                                </div>

                                <input
                                    type="number"
                                    value={defaultPayrollStart}
                                    onChange={(e) => setDefaultPayrollStart(e.target.value)}
                                    className="w-full bg-[var(--theme-surface)] text-[var(--theme-primary)] border-4 border-[var(--theme-primary)] rounded-2xl px-5 py-4 font-black outline-none transition-colors duration-300"
                                />
                            </div>

                            <div>
                                <div className="text-xs font-black uppercase tracking-[0.12em] mb-2 transition-colors duration-300">
                                    Email Signature
                                </div>

                                <input
                                    value={emailSignature}
                                    onChange={(e) => setEmailSignature(e.target.value)}
                                    className="w-full bg-[var(--theme-surface)] text-[var(--theme-primary)] border-4 border-[var(--theme-primary)] rounded-2xl px-5 py-4 font-black outline-none transition-colors duration-300"
                                />
                            </div>
                        </div>
                    </section>

                    {/* SLIP */}
                    <section className="bg-[var(--theme-surface)] brightness-110 border-4 border-[var(--theme-primary)] rounded-[32px] p-6 shadow-[6px_6px_0px_var(--theme-primary)] transition-colors duration-300">

                        <div className="text-[11px] uppercase tracking-[0.18em] font-black text-[var(--theme-accent)] mb-3 transition-colors duration-300">
                            Salary Slip
                        </div>

                        <div>
                            <div className="text-xs font-black uppercase tracking-[0.12em] text-[var(--theme-primary)] mb-2 transition-colors duration-300">
                                Footer Text
                            </div>

                            <textarea
                                value={footerText}
                                onChange={(e) => setFooterText(e.target.value)}
                                rows={3}
                                className="w-full bg-[var(--theme-surface)] text-[var(--theme-primary)] border-4 border-[var(--theme-primary)] rounded-2xl px-5 py-4 font-black outline-none resize-none transition-colors duration-300"
                                placeholder="Generated by Perisseia"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mt-6">

                            <button
                                onClick={() => setShowConfidential(!showConfidential)}
                                className={`border-4 border-[var(--theme-primary)] rounded-2xl px-5 py-4 font-black uppercase tracking-widest transition-all duration-300 ${showConfidential
                                        ? 'bg-[var(--theme-primary)] text-[var(--theme-surface)]'
                                        : 'bg-white text-[var(--theme-primary)]'
                                    }`}
                            >
                                {showConfidential ? '✓' : '○'} Confidential
                            </button>

                            <button
                                onClick={() => setShowWatermark(!showWatermark)}
                                className={`border-4 border-[var(--theme-primary)] rounded-2xl px-5 py-4 font-black uppercase tracking-widest transition-all duration-300 ${showWatermark
                                        ? 'bg-[var(--theme-highlight)] text-[var(--theme-surface)]'
                                        : 'bg-white text-[var(--theme-primary)]'
                                    }`}
                            >
                                {showWatermark ? '✓' : '○'} Watermark
                            </button>
                        </div>
                    </section>

                </div>

                {/* FOOTER */}
                <div className="sticky bottom-0 bg-[var(--theme-surface)] border-t-[6px] border-[var(--theme-primary)] px-8 py-6 flex gap-4 transition-colors duration-300">

                    <button
                        onClick={onClose}
                        className="flex-1 bg-[var(--theme-surface)] brightness-110 border-4 border-[var(--theme-primary)] rounded-2xl py-4 font-black uppercase tracking-widest text-[var(--theme-primary)] transition-colors duration-300"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={saveSettings}
                        className="flex-1 bg-[var(--theme-accent)] hover:brightness-90 text-[var(--theme-surface)] border-4 border-[var(--theme-primary)] rounded-2xl py-4 font-black uppercase tracking-widest shadow-[6px_6px_0px_var(--theme-primary)] active:translate-y-[2px] active:shadow-[3px_3px_0px_var(--theme-primary)] transition-all duration-300"
                    >
                        Save Settings
                    </button>
                </div>

            </div>

        </div>
    )
}