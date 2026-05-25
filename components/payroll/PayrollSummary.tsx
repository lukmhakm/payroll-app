'use client'

import { supabase } from '@/lib/supabase'
import PayrollCard from './PayrollCard'

type Props = {
    employees: any[]
    attendances: any[]
    selectedMonth: string
    onGenerateSlip: any
    refreshPayrollHistories: () => void
    adjustments: any
    onUpdateAdjustment: (employeeId: string, field: 'bonus' | 'deduction', value: number) => void
    onClearAdjustments: () => void
    payrollHistories: any[]
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

    function getPeriodDates(selectedMonth: string, startDay: number) {
        const year = parseInt(selectedMonth.split('-')[0])
        const month = parseInt(selectedMonth.split('-')[1])
        const day = Number(startDay) || 1

        if (day === 1) {
            const lastDay = new Date(year, month, 0).getDate()
            return {
                start: `${selectedMonth}-01`,
                end: `${selectedMonth}-${String(lastDay).padStart(2, '0')}`
            }
        } else {
            // FORWARD CUT-OFF: Start date is in the selected month, on start day
            const startDateObj = new Date(year, month - 1, day)
            const start = `${startDateObj.getFullYear()}-${String(startDateObj.getMonth() + 1).padStart(2, '0')}-${String(startDateObj.getDate()).padStart(2, '0')}`
            
            // End date is in the NEXT month, on (day - 1)
            const endDateObj = new Date(year, month, day - 1)
            const end = `${endDateObj.getFullYear()}-${String(endDateObj.getMonth() + 1).padStart(2, '0')}-${String(endDateObj.getDate()).padStart(2, '0')}`
            return { start, end }
        }
    }

    function getPayrollAttendances(employee: any) {
        const { start, end } = getPeriodDates(selectedMonth, Number(employee.payroll_start_day) || 1)

        const filtered = attendances.filter((attendance) => {
            if (String(attendance.employee_id) !== String(employee.id)) return false
            const workDate = String(attendance.work_date).slice(0, 10)
            return workDate >= start && workDate <= end
        })

        // Konversi jam lembur ke dalam bentuk Rupiah (overtime) sebelum masuk ke Payroll Engine
        return filtered.map(attendance => ({
            ...attendance,
            overtime: Number(attendance.overtime_hours || 0) * Number(employee.overtime_rate || 0)
        }))
    }


    function generateSlip(employee: any, payroll: any, employeeAdjustment: any, finalSalary: number) {
        const confirmed = confirm(
            `Generate slip gaji untuk ${employee.name}?`
        )

        if (!confirmed) return

        const extraAdjustment = Number(employeeAdjustment.deduction || 0)

        onGenerateSlip({
            employee,
            payroll: {
                periodStart: payroll.periodStart,
                periodEnd: payroll.periodEnd,
                baseSalary: employee.base_salary,
                totalOvertimePay: payroll.totalOvertimePay || payroll.overtime || 0,
                overtimeHours: payroll.overtimeHours || 0,
                overtimeDays: payroll.overtimeDays || 0,
                bonus: Number(employeeAdjustment.bonus) || 0,
                absenceDeduction: payroll.totalDeduction || payroll.deduction || 0,
                extraAdjustment: extraAdjustment,
                finalSalary,
                hadirCount: payroll.attendanceCount || payroll.hadirCount || 0,
                attendanceCount: payroll.attendanceCount || payroll.hadirCount || 0,
            },
        })
    }

    async function finalizeEmployee(employee: any, payroll: any, employeeAdjustment: any, finalSalary: number) {
        const confirmed = confirm(`Finalize payroll untuk ${employee.name} bulan ${selectedMonth}?`)
        if (!confirmed) return

        const absenceDeduction = employee.employment_type === 'freelance' 
            ? 0 
            : getPayrollAttendances(employee).filter((a: any) => a.status === 'izin' || a.status === 'alpha').length * Number(employee.daily_deduction || 0)

        const extraAdjustment = Number(employeeAdjustment.deduction || 0)
        const { start, end } = getPeriodDates(selectedMonth, Number(employee.payroll_start_day) || 1)

        const { error } = await supabase.from('payroll_history').insert({
            employee_id: employee.id,
            employee_name: employee.name || 'Unknown',
            employee_position: employee.position || null,
            bank_name: employee.bank_name || null,
            bank_account_number: employee.bank_account_number || null,
            bank_account_name: employee.bank_account_name || null,
            payroll_period_start: start,
            payroll_period_end: end,
            payroll_month: selectedMonth,
            base_salary: Number(employee.base_salary || 0),
            overtime_pay: Number(payroll.totalOvertimePay || payroll.overtime || 0),
            bonus: Number(employeeAdjustment.bonus || 0) + (extraAdjustment > 0 ? extraAdjustment : 0),
            deduction: absenceDeduction + (extraAdjustment < 0 ? Math.abs(extraAdjustment) : 0),
            final_salary: finalSalary,
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
            <h2 className="text-3xl md:text-[42px] font-black uppercase tracking-[-0.04em] leading-none text-[#E43427] mb-4 px-1">
                Payroll Summary
            </h2>

            <div className="space-y-6 md:space-y-8">
                {employees.map((employee) => {
                    const { start, end } = getPeriodDates(selectedMonth, Number(employee.payroll_start_day) || 1)
                    const empAttendances = getPayrollAttendances(employee)
                    const hadirCount = empAttendances.filter((a: any) => a.status === 'hadir').length
                    const overtimeHours = empAttendances.reduce((acc: number, a: any) => acc + Number(a.overtime_hours || 0), 0)
                    const overtimeDays = empAttendances.filter((a: any) => Number(a.overtime_hours || 0) > 0).length
                    const overtimePay = overtimeHours * Number(employee.overtime_rate || 0)

                    const absenceDeduction = employee.employment_type === 'freelance' 
                        ? 0 
                        : empAttendances.filter((a: any) => a.status === 'izin' || a.status === 'alpha').length * Number(employee.daily_deduction || 0)

                    const baseSalary = employee.employment_type === 'freelance'
                        ? hadirCount * Number(employee.base_salary || 0)
                        : Number(employee.base_salary || 0)

                    const employeeAdjustment = adjustments[employee.id] || {
                        bonus: 0,
                        deduction: 0,
                        note: '',
                    }
                    const extraAdjustment = Number(employeeAdjustment.deduction || 0)
                    const finalSalary =
                        baseSalary +
                        overtimePay +
                        Number(employeeAdjustment.bonus || 0) +
                        extraAdjustment -
                        absenceDeduction

                    const payrollWithExtras = {
                        periodStart: start,
                        periodEnd: end,
                        baseSalary,
                        overtime: overtimePay,
                        totalOvertimePay: overtimePay,
                        overtimeHours,
                        overtimeDays,
                        deduction: absenceDeduction,
                        totalDeduction: absenceDeduction,
                        absenceDeduction,
                        extraAdjustment,
                        bonus: Number(employeeAdjustment.bonus || 0),
                        finalSalary,
                        hadirCount,
                        attendanceCount: hadirCount,
                    }

                    const isFinalized = payrollHistories.some(h => String(h.employee_id) === String(employee.id) && h.payroll_month === selectedMonth)

                    return (
                        <PayrollCard
                            key={employee.id}
                            employee={employee}
                            payroll={payrollWithExtras}
                            adjustment={employeeAdjustment}
                            isFinalized={isFinalized}
                            onUpdateAdjustment={(field, value) => onUpdateAdjustment(employee.id, field as 'bonus' | 'deduction', value)}
                            onGenerateSlip={() =>
                                generateSlip(
                                    employee,
                                    payrollWithExtras,
                                    employeeAdjustment,
                                    finalSalary
                                )
                            }
                            onFinalize={() =>
                                finalizeEmployee(
                                    employee,
                                    payrollWithExtras,
                                    employeeAdjustment,
                                    finalSalary
                                )
                            }
                        />
                    )
                })}
            </div>
        </div>
    )
}