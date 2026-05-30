'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { useTheme } from '@/providers/ThemeProvider'
import { useSettings } from '@/providers/SettingsProvider'
import type { Employee, CalculatedPayroll } from '@/types'
import SlipContent from './SlipContent'

type Props = {
    employee: Employee
    payroll: CalculatedPayroll
    month?: string
    onClose: () => void
}

export default function SalarySlipCard({
    employee,
    payroll,
    month,
    onClose,
}: Props) {

    const [loading, setLoading] = useState(false)
    const [sending, setSending] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const { theme } = useTheme()
    const { settings, updateSettings } = useSettings()

    // Local state for the inline settings form
    const [footerText, setFooterText] = useState(settings.slipFooterText)
    const [watermarkEnabled, setWatermarkEnabled] = useState(settings.showWatermark)
    const [confidentialEnabled, setConfidentialEnabled] = useState(settings.showConfidential)
    const [overtimeDetailsEnabled, setOvertimeDetailsEnabled] = useState(settings.showOvertimeDetails ?? true)

    useEffect(() => {
        if (showSettings) {
            setFooterText(settings.slipFooterText)
            setWatermarkEnabled(settings.showWatermark)
            setConfidentialEnabled(settings.showConfidential)
            setOvertimeDetailsEnabled(settings.showOvertimeDetails ?? true)
        }
    }, [showSettings, settings])

    const getMonthLabel = () => month || payroll.payroll_month || 'Bulan-Ini'


    function saveFooterSettings() {
        updateSettings({
            slipFooterText: footerText,
            showWatermark: watermarkEnabled,
            showConfidential: confidentialEnabled,
            showOvertimeDetails: overtimeDetailsEnabled
        })

        setShowSettings(false)
        toast.success('Slip settings updated')
    }

    async function downloadWithPuppeteer(format: 'png' | 'pdf') {
        if (loading) return
        setLoading(true)

        try {
            const dataPayload = {
                employee,
                payroll,
                settings,
            }

            const secret = process.env.NEXT_PUBLIC_PUPPETEER_SECRET
            if (!secret) {
                toast.error("Client secret for Puppeteer is not configured.")
                console.error("Error: NEXT_PUBLIC_PUPPETEER_SECRET environment variable is not set.")
                return
            }

            // Use fetch with POST to send data in the body, avoiding URL length limits
            const response = await fetch('/api/generate-slip', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data: dataPayload,
                    theme,
                    format,
                    secret,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Server responded with status ${response.status}`);
            }

            // Handle the file download from the response blob
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `salary-slip-${employee.name.replace(/\s+/g, '-')}.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();

        } catch (error) {
            console.error("Error generating slip:", error);
            toast.error((error as Error).message || "Failed to generate slip.");
        } finally {
            setLoading(false)
        }
    }

    async function sendEmail() {
        if (sending) return
        if (!employee.email) {
            toast.error('Employee email not found')
            return
        }
        setSending(true)

        try {
            // TODO: The API route needs to be adjusted to return a base64 string
            // instead of a file download when a specific query parameter is provided.
            toast.error("Send Email function is not yet implemented for the new flow.")
        } catch (error: any) {
            console.error("Error sending email:", error)
            toast.error(error.message || 'An error occurred while sending the email.')
        } finally {
            setSending(false)
        }
    }

    const dailyDed = Number(employee.daily_deduction || 0)
    const absenceDed = Number(payroll.absenceDeduction || 0)
    const extraAdj = Number(payroll.extraAdjustment || 0)
    const absentDays = dailyDed > 0 ? Math.floor(absenceDed / dailyDed) : 0

    return (
        <div
            className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-6 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
            style={{ backgroundColor: `${theme.primary}CC` }}
        >
            <div className="w-full max-w-md my-auto flex flex-col gap-4 sm:gap-6 pt-4 sm:pt-10 pb-10">

                {/* TOOLBAR — TIDAK IKUT CAPTURE PNG/PDF */}
                <div className="flex justify-end mb-2">
                    <button
                        onClick={() => setShowSettings(true)}
                        className="border-4 rounded-2xl px-4 py-2 font-black uppercase tracking-widest text-[11px] transition-all active:translate-y-[2px]"
                        style={{
                            backgroundColor: theme.primary,
                            color: theme.surface,
                            borderColor: theme.primary,
                            boxShadow: `4px 4px 0px ${theme.primary}`,
                        }}
                    >
                        ⚙ Slip Settings
                    </button>
                </div>

                {/* AREA CAPTURE HTML2CANVAS (Harus pakai Inline Style CSS murni) */}
                <div
                >
                    <SlipContent
                        employee={employee}
                        payroll={payroll}
                        settings={settings}
                        theme={theme}
                    />
                </div>
                {/* AKHIR AREA CAPTURE */}

                {/* Tombol Aksi - Pakai Tailwind Pop-Art */}
                <div className="grid grid-cols-2 gap-4 mt-2">
                    <button
                        onClick={() => downloadWithPuppeteer('png')}
                        disabled={loading || sending}
                        className="bg-[var(--theme-primary)] hover:opacity-80 text-[var(--theme-surface)] border-4 border-[var(--theme-primary)] rounded-2xl py-3.5 font-black text-sm uppercase tracking-widest transition-all duration-300 shadow-[4px_4px_0px_var(--theme-primary)] active:translate-y-[2px] active:shadow-[2px_2px_0px_var(--theme-primary)] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Save PNG
                    </button>

                    <button
                        onClick={() => downloadWithPuppeteer('pdf')}
                        disabled={loading || sending}
                        className="bg-[var(--theme-primary)] hover:opacity-80 text-[var(--theme-surface)] border-4 border-[var(--theme-primary)] rounded-2xl py-3.5 font-black text-sm uppercase tracking-widest transition-all duration-300 shadow-[4px_4px_0px_var(--theme-primary)] active:translate-y-[2px] active:shadow-[2px_2px_0px_var(--theme-primary)] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                        {loading ? 'Generating...' : 'Save PDF'}
                    </button>
                </div>

                <button
                    onClick={sendEmail}
                    disabled={sending || loading}
                    className="w-full bg-[var(--theme-accent)] hover:opacity-90 text-[var(--theme-surface)] border-4 border-[var(--theme-primary)] rounded-2xl py-4 font-black text-sm uppercase tracking-widest transition-all duration-300 shadow-[6px_6px_0px_var(--theme-primary)] active:translate-y-[4px] active:shadow-[2px_2px_0px_var(--theme-primary)] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    {sending ? 'Sending...' : 'Send via Email'}
                </button>

                {/* SETTINGS MODAL */}
                {showSettings && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="w-full max-w-sm bg-[var(--theme-surface)] border-4 border-[var(--theme-primary)] rounded-3xl p-6 shadow-[8px_8px_0px_var(--theme-primary)] transition-colors duration-300">

                            <div className="text-2xl font-black uppercase tracking-tight text-[var(--theme-primary)] mb-5 transition-colors duration-300">
                                Slip Settings
                            </div>

                            <div className="text-[11px] font-black uppercase tracking-widest text-[var(--theme-primary)] mb-2 transition-colors duration-300">
                                Footer Text
                            </div>

                            <textarea
                                value={footerText}
                                onChange={(e) => setFooterText(e.target.value)}
                                rows={3}
                                placeholder="Generated by Perisseia"
                                className="w-full bg-white border-4 border-[var(--theme-primary)] text-[var(--theme-primary)] rounded-2xl p-4 font-semibold outline-none resize-none transition-colors duration-300"
                            />

                            <div className="flex flex-col gap-3 mt-5">
                                <label className="flex items-center justify-between bg-[var(--theme-surface)] border-4 border-[var(--theme-primary)] text-[var(--theme-primary)] rounded-2xl px-4 py-3 font-black uppercase text-xs tracking-widest transition-colors duration-300">
                                    <span>Watermark</span>

                                    <input
                                        type="checkbox"
                                        checked={watermarkEnabled}
                                        onChange={(e) =>
                                            setWatermarkEnabled(e.target.checked)
                                        }
                                        className="w-5 h-5"
                                    />
                                </label>

                                <label className="flex items-center justify-between bg-[var(--theme-surface)] border-4 border-[var(--theme-primary)] text-[var(--theme-primary)] rounded-2xl px-4 py-3 font-black uppercase text-xs tracking-widest transition-colors duration-300">
                                    <span>Confidential Badge</span>

                                    <input
                                        type="checkbox"
                                        checked={confidentialEnabled}
                                        onChange={(e) =>
                                            setConfidentialEnabled(e.target.checked)
                                        }
                                        className="w-5 h-5"
                                    />
                                </label>

                                <label className="flex items-center justify-between bg-[var(--theme-surface)] border-4 border-[var(--theme-primary)] text-[var(--theme-primary)] rounded-2xl px-4 py-3 font-black uppercase text-xs tracking-widest transition-colors duration-300">
                                    <span>Detail Lembur</span>

                                    <input
                                        type="checkbox"
                                        checked={overtimeDetailsEnabled}
                                        onChange={(e) =>
                                            setOvertimeDetailsEnabled(e.target.checked)
                                        }
                                        className="w-5 h-5"
                                    />
                                </label>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mt-6">
                                <button
                                    onClick={() => setShowSettings(false)}
                                    className="bg-white text-[var(--theme-primary)] border-4 border-[var(--theme-primary)] rounded-2xl py-3 font-black uppercase tracking-widest text-sm transition-colors duration-300"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={saveFooterSettings}
                                    className="bg-[var(--theme-accent)] text-[var(--theme-surface)] border-4 border-[var(--theme-primary)] rounded-2xl py-3 font-black uppercase tracking-widest text-sm shadow-[4px_4px_0px_var(--theme-primary)] active:translate-y-[2px] active:shadow-[2px_2px_0px_var(--theme-primary)] transition-all duration-300"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    onClick={onClose}
                    disabled={loading || sending}
                    className="w-full text-[var(--theme-surface)] hover:text-[var(--theme-accent)] py-3 font-black uppercase tracking-widest text-sm transition-colors mt-2"
                >
                    Close & Return
                </button>

            </div>
        </div>
    )
}