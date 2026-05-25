'use client'

import { supabase } from '@/lib/supabase'
import PayrollCard from './PayrollCard'
import type { Employee, Attendance, PayrollHistory, PayrollAdjustment } from '@/types'
import { calculatePayrollReport } from '@/lib/payrollEngine'
import type { PayrollResult } from '@/lib/payrollEngine'

type Props = {
    employees: Employee[]
    attendances: Attendance[]
    selectedMonth: string
    onGenerateSlip: any
    refreshPayrollHistories: () => void
    adjustments: Record<string, PayrollAdjustment>
    onUpdateAdjustment: (employeeId: string, field: 'bonus' | 'deduction', value: number) => void
    onClearAdjustments: () => void
    payrollHistories: PayrollHistory[]
}

export default function PayrollSummary({
    employees,
    attendances,
    selectedMonth,
    onGenerateSlip,
    refreshPayrollHistories,
    adjustments,
    onUpdateAdjustment,
    onClearAdjustments,
    payrollHistories
}: Props) {

    const report = calculatePayrollReport(
        employees,
        attendances,
        selectedMonth,
        adjustments,
        payrollHistories
    )

    function generateSlip(employee: Employee, empReport: PayrollResult, employeeAdjustment: PayrollAdjustment) {
        const confirmed = confirm(
            `Generate slip gaji untuk ${employee.name}?`
        )

        if (!confirmed) return

        onGenerateSlip({
            employee,
            payroll: {
                periodStart: empReport.periodStart,
                periodEnd: empReport.periodEnd,
                baseSalary: employee.base_salary,
                totalOvertimePay: empReport.overtimePay,
                overtimeHours: empReport.overtimeHours,
                overtimeDays: empReport.overtimeDays,
                bonus: Number(employeeAdjustment.bonus) || 0,
                absenceDeduction: empReport.absenceDeduction,
                extraAdjustment: empReport.extraAdjustment,
                deduction: empReport.deduction,
                totalDeduction: empReport.deduction,
                finalSalary: empReport.finalSalary,
                hadirCount: empReport.attendanceCount,
                attendanceCount: empReport.attendanceCount,
            },
        })
    }

    async function finalizeEmployee(employee: Employee, empReport: PayrollResult) {
        const confirmed = confirm(`Finalize payroll untuk ${employee.name} bulan ${selectedMonth}?`)
        if (!confirmed) return

        const { error } = await supabase.from('payroll_history').insert({
            employee_id: employee.id,
            employee_name: employee.name || 'Unknown',
            employee_position: employee.position || null,
            bank_name: employee.bank_name || null,
            bank_account_number: employee.bank_account_number || null,
            bank_account_name: employee.bank_account_name || null,
            payroll_period_start: empReport.periodStart,
            payroll_period_end: empReport.periodEnd,
            payroll_month: selectedMonth,
            base_salary: Number(employee.base_salary || 0),
            overtime_pay: empReport.overtimePay,
            bonus: empReport.bonus,
            deduction: empReport.deduction,
            final_salary: empReport.finalSalary,
            status: 'generated',
        })
        
        if (error) {
            alert(`⚠ GAGAL MENYIMPAN PAYROLL\n\nSistem menolak data dengan alasan:\n"${error.message}"`)
        } else {
            alert(`Payroll ${employee.name} berhasil difinalisasi 🔥`)
            refreshPayrollHistories()
        }
    }

    return (
        <div className="mt-4 space-y-6">
            {/* Teks di luar card: Retro Red */}
                <h2 className="text-3xl md:text-[42px] font-black uppercase tracking-[-0.04em] leading-none text-[var(--theme-accent)] mb-4 px-1 transition-colors duration-300">
                Payroll Summary
            </h2>

            <div className="space-y-6 md:space-y-8">
                {employees.map((employee) => {
                    const empReport = report.details.find(d => d.employeeId === employee.id)
                    if (!empReport) return null
                    const employeeAdjustment = adjustments[employee.id] || {
                        bonus: 0,
                        deduction: 0,
                    }

                    const payrollWithExtras = {
                        periodStart: empReport.periodStart,
                        periodEnd: empReport.periodEnd,
                        baseSalary: empReport.basePay,
                        overtime: empReport.overtimePay,
                        totalOvertimePay: empReport.overtimePay,
                        overtimeHours: empReport.overtimeHours,
                        overtimeDays: empReport.overtimeDays,
                        deduction: empReport.deduction,
                        totalDeduction: empReport.deduction,
                        absenceDeduction: empReport.absenceDeduction,
                        extraAdjustment: empReport.extraAdjustment,
                        bonus: Number(employeeAdjustment.bonus || 0),
                        finalSalary: empReport.finalSalary,
                        hadirCount: empReport.attendanceCount,
                        attendanceCount: empReport.attendanceCount,
                    }

                    return (
                        <PayrollCard
                            key={employee.id}
                            employee={employee}
                            payroll={payrollWithExtras}
                            adjustment={employeeAdjustment}
                            isFinalized={empReport.isFinalized}
                            onUpdateAdjustment={(field, value) => onUpdateAdjustment(employee.id, field as 'bonus' | 'deduction', value)}
                            onGenerateSlip={() =>
                                generateSlip(
                                    employee,
                                    empReport,
                                    employeeAdjustment
                                )
                            }
                            onFinalize={() =>
                                finalizeEmployee(
                                    employee,
                                    empReport
                                )
                            }
                        />
                    )
                })}
            </div>
        </div>
    )
}