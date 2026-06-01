import type { Employee, Attendance, PayrollHistory, PayrollAdjustment } from '@/types'

export interface PayrollResult {
    employeeId: string
    periodStart: string
    periodEnd: string
    basePay: number
    overtimeHours: number
    overtimeDays: number
    overtimePay: number
    bonus: number
    deduction: number
    absenceDeduction: number
    extraAdjustment: number
    finalSalary: number
    attendanceCount: number
    isFinalized: boolean
}

export interface PayrollSummaryReport {
    totalPayroll: number
    totalOvertime: number
    totalOvertimeHours: number
    totalOvertimeDays: number
    totalBonus: number
    totalDeduction: number
    totalAttendanceCount: number
    details: PayrollResult[]
}

export function getPeriodDates(selectedMonth: string, startDay: number) {
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
        // Backward Cut-off: Period ends in the selectedMonth at (day - 1)
        // and starts in the previous month at (day)
        const startDateObj = new Date(year, month - 2, day)
        const start = `${startDateObj.getFullYear()}-${String(startDateObj.getMonth() + 1).padStart(2, '0')}-${String(startDateObj.getDate()).padStart(2, '0')}`
        
        const endDateObj = new Date(year, month - 1, day - 1)
        const end = `${endDateObj.getFullYear()}-${String(endDateObj.getMonth() + 1).padStart(2, '0')}-${String(endDateObj.getDate()).padStart(2, '0')}`
        return { start, end }
    }
}

export function calculatePayrollReport(
    employees: Employee[],
    attendances: Attendance[],
    selectedMonth: string,
    adjustments: Record<string, PayrollAdjustment> = {},
    payrollHistories: PayrollHistory[] = []
): PayrollSummaryReport {
    let totalPayroll = 0
    let totalOvertime = 0
    let totalOvertimeHours = 0
    let totalBonus = 0
    let totalDeduction = 0
    let totalAttendanceCount = 0

    const finalizedHistories = payrollHistories.filter(h => h.payroll_month === selectedMonth)
    const uniqueOvertimeDates = new Set<string>()
    const details: PayrollResult[] = []

    employees.forEach((employee) => {
        const finalized = finalizedHistories.find(h => String(h.employee_id) === String(employee.id))
        const { start, end } = getPeriodDates(selectedMonth, Number(employee.payroll_start_day) || 1)
        
        const employeeAttendances = attendances.filter((attendance) => {
            if (String(attendance.employee_id) !== String(employee.id)) return false
            const workDate = String(attendance.work_date).slice(0, 10)
            return workDate >= start && workDate <= end
        })
        
        const hadirCount = employeeAttendances.filter(a => a.status === 'hadir').length
        totalAttendanceCount += hadirCount

        employeeAttendances.forEach(a => {
            if (Number(a.overtime_hours || 0) > 0) {
                uniqueOvertimeDates.add(String(a.work_date).slice(0, 10))
            }
        })

        let empBasePay = 0
        let empOvertimeHours = 0
        let empOvertimePay = 0
        let empBonus = 0
        let empDeduction = 0
        let empFinalSalary = 0

        const empOvertimeDays = employeeAttendances.filter(a => Number(a.overtime_hours || 0) > 0).length
        const absentDays = employeeAttendances.filter((a) => a.status === 'izin' || a.status === 'alpha').length
        const absenceDeduction = employee.employment_type === 'freelance' ? 0 : absentDays * Number(employee.daily_deduction || 0)
        const employeeAdjustment = adjustments[employee.id] || { bonus: 0, deduction: 0 }
        const extraAdjustment = Number(employeeAdjustment.deduction || 0)

        if (finalized) {
            empFinalSalary = Number(finalized.final_salary || 0)
            empOvertimePay = Number(finalized.overtime_pay || 0)
            empBonus = Number(finalized.bonus || 0)
            empDeduction = Number(finalized.deduction || 0)
            empOvertimeHours = employeeAttendances.reduce((total, attendance) => total + Number(attendance.overtime_hours || 0), 0)
            empBasePay = Number(finalized.base_salary || 0)
        } else {
            empOvertimeHours = employeeAttendances.reduce((total, attendance) => total + Number(attendance.overtime_hours || 0), 0)
            empOvertimePay = empOvertimeHours * Number(employee.overtime_rate || 0)

            empBasePay = employee.employment_type === 'freelance' ? hadirCount * Number(employee.base_salary || 0) : Number(employee.base_salary || 0)

            empBonus = Number(employeeAdjustment.bonus || 0) + (extraAdjustment > 0 ? extraAdjustment : 0)
            empDeduction = absenceDeduction + (extraAdjustment < 0 ? Math.abs(extraAdjustment) : 0)
            empFinalSalary = empBasePay + empOvertimePay + empBonus - empDeduction
        }

        totalPayroll += empFinalSalary
        totalOvertime += empOvertimePay
        totalBonus += empBonus
        totalDeduction += empDeduction
        totalOvertimeHours += empOvertimeHours

        details.push({
            employeeId: employee.id, periodStart: start, periodEnd: end,
            basePay: empBasePay, overtimeHours: empOvertimeHours, overtimeDays: empOvertimeDays,
            overtimePay: empOvertimePay, bonus: empBonus, deduction: empDeduction,
            absenceDeduction, extraAdjustment, finalSalary: empFinalSalary,
            attendanceCount: hadirCount, isFinalized: !!finalized
        })
    })

    return { totalPayroll, totalOvertime, totalOvertimeHours, totalOvertimeDays: uniqueOvertimeDates.size, totalBonus, totalDeduction, totalAttendanceCount, details }
}