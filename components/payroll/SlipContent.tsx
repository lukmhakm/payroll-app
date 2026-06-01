import type { Employee, CalculatedPayroll, AppSettings, ThemePalette } from '@/types'

interface Props {
    employee: Employee;
    payroll: CalculatedPayroll;
    settings: AppSettings;
    theme: ThemePalette;
}

export default function SlipContent({ employee, payroll, settings, theme }: Props) {
    const dailyDed = Number(employee.daily_deduction || 0)
    // Note: This logic is now simplified as CalculatedPayroll provides these values directly.
    const absenceDed = Number(payroll.absenceDeduction || 0)
    const extraAdj = Number(payroll.extraAdjustment || 0)
    const absentDays = dailyDed > 0 ? Math.floor(absenceDed / dailyDed) : 0

    const getMonthLabel = () => payroll.payroll_month || 'Bulan-Ini'

    return (
        <div
            id="salary-slip"
            style={{
                backgroundColor: theme.surface,
                border: `4px solid ${theme.primary}`,
                borderRadius: '16px',
                padding: '20px',
                color: theme.primary,
                fontFamily: 'system-ui, -apple-system, sans-serif',
                width: '100%', // Use 100% width to be flexible
                boxSizing: 'border-box',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: `8px 8px 0px ${theme.primary}`
            }}
        >
            {/* Header Slip */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', position: 'relative', zIndex: 2 }}>
                <div>
                    <div style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-1px', color: theme.accent, textTransform: 'uppercase', lineHeight: '1' }}>
                        SALARY SLIP
                    </div>
                    <div style={{ color: theme.primary, fontSize: '12px', marginTop: '6px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        PERIODE: {getMonthLabel()}
                    </div>
                    {payroll.periodStart && payroll.periodEnd && (
                        <div style={{ color: theme.primary, fontSize: '10px', marginTop: '4px', fontWeight: '700', opacity: 0.8 }}>
                            ({payroll.periodStart} s/d {payroll.periodEnd})
                        </div>
                    )}
                </div>
                {settings.showConfidential && (
                    <div style={{
                        display: 'inline-block',
                        backgroundColor: theme.primary,
                        border: `2px solid ${theme.primary}`,
                        borderRadius: '8px',
                        padding: '8px 12px',
                        color: theme.surface,
                        fontSize: '12px',
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        lineHeight: '1',
                        boxShadow: `3px 3px 0px ${theme.accent}`
                    }}>
                        CONFIDENTIAL
                    </div>
                )}
            </div>

            {/* Employee Identity Card */}
            <div style={{
                position: 'relative',
                zIndex: 2,
                backgroundColor: theme.highlight,
                border: `3px solid ${theme.primary}`,
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px',
                boxShadow: `3px 3px 0px ${theme.primary}`,
                color: theme.surface
            }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div style={{ fontSize: '20px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '-0.5px', lineHeight: '1.2' }}>
                            {employee.name}
                        </div>
                        <div style={{
                            display: 'inline-block',
                            backgroundColor: theme.primary,
                            border: `2px solid ${theme.primary}`,
                            borderRadius: '4px',
                            padding: '5px 8px',
                            color: theme.surface,
                            fontSize: '11px',
                            fontWeight: '800',
                            textTransform: 'uppercase',
                            lineHeight: '1'
                        }}>
                            {employee.position}
                        </div>
                    </div>
                    <div style={{ textAlign: 'left', borderTop: `2px dashed ${theme.surface}66`, paddingTop: '12px' }}>
                        <div style={{ color: theme.surface, fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px', opacity: 0.9 }}>Bank Account</div>
                        <div style={{ fontWeight: '900', fontSize: '14px', textTransform: 'uppercase' }}>{employee.bank_name || '-'}</div>
                        <div style={{ fontWeight: '700', fontSize: '13px', marginTop: '2px', letterSpacing: '1px' }}>{employee.bank_account_number || '-'}</div>
                    </div>
                </div>
            </div>

            {/* Area Bawah Blok Biru */}
            <div style={{ position: 'relative', zIndex: 1 }}>
                {settings.showWatermark && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', opacity: 0.06, fontSize: '44px', fontWeight: '900', transform: 'rotate(-35deg)', color: theme.primary, letterSpacing: '16px', textTransform: 'uppercase', whiteSpace: 'nowrap', zIndex: 10 }}>
                        CONFIDENTIAL
                    </div>
                )}

                {/* Payroll Details */}
                <div style={{ marginBottom: '24px', position: 'relative', zIndex: 2 }}>
                    <div style={{ fontSize: '12px', fontWeight: '900', color: theme.primary, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', borderBottom: `3px solid ${theme.primary}`, paddingBottom: '8px' }}>
                        Rincian Pendapatan & Potongan
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700' }}>
                            <div>{employee.employment_type === 'freelance' ? `Daily Salary • ${payroll.attendanceCount || payroll.hadirCount || 0} Hari Kerja` : 'Gaji Pokok'}</div>
                            <div style={{ fontWeight: '900' }}>{employee.employment_type === 'freelance' ? `Rp ${Math.round((payroll.attendanceCount || payroll.hadirCount || 0) * Number(employee.base_salary || 0)).toLocaleString()}` : `Rp ${Math.round(payroll.baseSalary || 0).toLocaleString()}`}</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div>Total Lembur</div>
                                {(settings.showOvertimeDetails ?? true) && Number(payroll.overtimeHours || 0) > 0 && (<div style={{ fontSize: '11px', opacity: 0.7, marginTop: '2px' }}>({payroll.overtimeDays} Kali • {Number(Number(payroll.overtimeHours || 0).toFixed(2))} Jam)</div>)}
                            </div>
                            <div style={{ fontWeight: '900', color: theme.highlight }}>+ Rp {Math.round(payroll.totalOvertimePay || payroll.overtime || 0).toLocaleString()}</div>
                        </div>
                        {Number(payroll.bonus || 0) > 0 && (<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700' }}><div>Bonus Tambahan</div><div style={{ fontWeight: '900', color: theme.highlight }}>+ Rp {Math.round(payroll.bonus || 0).toLocaleString()}</div></div>)}
                        {absenceDed > 0 && (<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700' }}><div style={{ display: 'flex', flexDirection: 'column' }}><div>Potongan Absen</div>{absentDays > 0 && (<div style={{ fontSize: '11px', opacity: 0.7, marginTop: '2px' }}>({absentDays} Hari)</div>)}</div><div style={{ fontWeight: '900', color: theme.accent }}>- Rp {Math.round(absenceDed).toLocaleString()}</div></div>)}
                        {extraAdj > 0 && (<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700' }}><div style={{ display: 'flex', flexDirection: 'column' }}><div>Extra</div><div style={{ fontSize: '11px', opacity: 0.7, marginTop: '2px' }}>(THR/Bonus)</div></div><div style={{ fontWeight: '900', color: theme.highlight }}>+ Rp {Math.round(extraAdj).toLocaleString()}</div></div>)}
                        {extraAdj < 0 && (<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700' }}><div style={{ display: 'flex', flexDirection: 'column' }}><div>Extra</div><div style={{ fontSize: '11px', opacity: 0.7, marginTop: '2px' }}>(Kasbon/Lainnya)</div></div><div style={{ fontWeight: '900', color: theme.accent }}>- Rp {Math.round(Math.abs(extraAdj)).toLocaleString()}</div></div>)}
                    </div>
                </div>

                <div style={{ height: '4px', backgroundColor: theme.primary, marginBottom: '24px', width: '100%' }}></div>

                {/* Final Take Home Pay */}
                <div style={{ marginBottom: '24px', position: 'relative', zIndex: 2 }}>
                    <div style={{ color: theme.primary, fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Take Home Pay</div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '36px', fontWeight: '900', color: theme.accent, lineHeight: '1', whiteSpace: 'nowrap', letterSpacing: '-1.5px', textShadow: `2px 2px 0px ${theme.primary}` }}>
                            Rp {Math.round(payroll.finalSalary || 0).toLocaleString()}
                        </div>
                    </div>
                </div>

                <div style={{ textAlign: 'center', fontSize: '12px', color: theme.primary, fontWeight: '800', marginTop: '10px', textTransform: 'uppercase', whiteSpace: 'pre-wrap' }}>
                    {settings.slipFooterText} • {new Date().toLocaleDateString('id-ID')}
                </div>
            </div>
        </div>
    )
}