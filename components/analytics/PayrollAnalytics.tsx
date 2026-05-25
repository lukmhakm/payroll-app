'use client'

import type { Employee, Attendance, PayrollHistory, PayrollAdjustment } from '@/types'
import { calculatePayrollReport } from '@/lib/payrollEngine'

type Props = {
    employees: Employee[]
    attendances: Attendance[]
    selectedMonth: string
    adjustments?: Record<string, PayrollAdjustment>
    payrollHistories?: PayrollHistory[]
}

export default function PayrollAnalytics({
    employees,
    attendances,
    selectedMonth,
    adjustments = {},
    payrollHistories = [],
}: Props) {

    const report = calculatePayrollReport(
        employees,
        attendances,
        selectedMonth,
        adjustments,
        payrollHistories
    )

    return (
        <section className="-mt-2 space-y-6">
            <h2 className="text-3xl md:text-[42px] font-black uppercase tracking-[-0.04em] leading-none text-[var(--theme-accent)] mb-4 px-1 transition-colors duration-300">
                Payroll Analytics
            </h2>

            <div className="bg-[var(--theme-highlight)] rounded-3xl border-4 border-[var(--theme-primary)] shadow-[8px_8px_0px_var(--theme-primary)] p-8 transition-colors duration-300">
                <div className="text-[var(--theme-surface)] text-sm font-black uppercase tracking-widest mb-2">Total Payroll</div>
                <div className="text-4xl md:text-5xl font-black text-[var(--theme-surface)] tracking-tighter tabular-nums mb-6">
                    Rp {Math.round(report.totalPayroll).toLocaleString()}
                </div>

                <details className="group border-t-4 border-[var(--theme-primary)] pt-4 transition-colors duration-300">
                    <summary className="cursor-pointer list-none flex items-center justify-between text-[var(--theme-surface)] font-black uppercase tracking-widest">
                        Detail Payroll
                        <span className="w-8 h-8 rounded-full bg-[var(--theme-surface)] text-[var(--theme-primary)] flex items-center justify-center font-bold">▼</span>
                    </summary>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4 mt-6 mb-4">
                        <div className="bg-[var(--theme-primary)] rounded-[24px] p-4 text-[var(--theme-surface)] shadow-[4px_4px_0px_var(--theme-primary)] transition-colors duration-300">
                            <div className="text-[11px] font-black uppercase tracking-[0.08em] opacity-70 mb-2">Employee</div>
                            <div className="text-3xl font-black leading-none tracking-tight">{employees.length}</div>
                        </div>
                        <div className="bg-[var(--theme-surface)] rounded-[24px] p-4 text-[var(--theme-highlight)] shadow-[4px_4px_0px_var(--theme-primary)] transition-colors duration-300">
                            <div className="text-[11px] font-black uppercase tracking-[0.08em] opacity-70 mb-2">Attendance</div>
                            <div className="text-3xl font-black leading-none tracking-tight">{report.totalAttendanceCount}</div>
                        </div>
                    <div className="bg-[var(--theme-surface)] rounded-[24px] p-4 text-[var(--theme-primary)] shadow-[4px_4px_0px_var(--theme-primary)] transition-colors duration-300">
                        <div className="text-[11px] font-black uppercase tracking-[0.08em] opacity-70 mb-2">Kali Lembur</div>
                        <div className="text-3xl font-black leading-none tracking-tight">{report.totalOvertimeDays}x</div>
                    </div>
                        <div className="bg-[var(--theme-surface)] rounded-[24px] p-4 shadow-[4px_4px_0px_var(--theme-primary)] transition-colors duration-300">
                            <div className="text-[11px] font-black uppercase tracking-[0.08em] text-[var(--theme-accent)] mb-2">Lembur ({report.totalOvertimeHours} Jam)</div>
                            <div className="text-2xl font-black text-[var(--theme-highlight)] leading-none tracking-tight">Rp {Math.round(report.totalOvertime).toLocaleString()}</div>
                        </div>
                        <div className="bg-[var(--theme-surface)] rounded-[24px] p-4 shadow-[4px_4px_0px_var(--theme-primary)] text-[var(--theme-primary)] transition-colors duration-300">
                            <div className="text-[11px] font-black uppercase tracking-[0.08em] opacity-80 mb-2">Total Bonus</div>
                            <div className="text-2xl font-black text-[var(--theme-highlight)] leading-none tracking-tight">Rp {Math.round(report.totalBonus).toLocaleString()}</div>
                        </div>
                        <div className="bg-[var(--theme-accent)] rounded-[24px] p-4 shadow-[4px_4px_0px_var(--theme-primary)] text-[var(--theme-surface)] transition-colors duration-300">
                            <div className="text-[11px] font-black uppercase tracking-[0.08em] opacity-80 mb-2">Potongan</div>
                            <div className="text-2xl font-black leading-none tracking-tight">Rp {Math.round(report.totalDeduction).toLocaleString()}</div>
                        </div>
                    </div>
                </details>
            </div>
        </section>
    )
}