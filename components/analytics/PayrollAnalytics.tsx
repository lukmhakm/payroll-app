'use client'

type Props = {
    employees: any[]
    attendances: any[]
    selectedMonth: string
    adjustments?: any
    payrollHistories?: any[]
}

export default function PayrollAnalytics({
    employees,
    attendances,
    selectedMonth,
    adjustments = {},
    payrollHistories = [],
}: Props) {

    // === BUSINESS LOGIC ===
    let totalPayroll = 0
    let totalOvertime = 0
    let totalOvertimeHours = 0
    let totalOvertimeDays = 0
    let totalBonus = 0
    let totalDeduction = 0
    let totalAttendanceCount = 0

    const finalizedHistories = payrollHistories.filter(h => h.payroll_month === selectedMonth)

    const uniqueOvertimeDates = new Set<string>()

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
            const startDateObj = new Date(year, month - 1, day)
            const start = `${startDateObj.getFullYear()}-${String(startDateObj.getMonth() + 1).padStart(2, '0')}-${String(startDateObj.getDate()).padStart(2, '0')}`
            
            const endDateObj = new Date(year, month, day - 1)
            const end = `${endDateObj.getFullYear()}-${String(endDateObj.getMonth() + 1).padStart(2, '0')}-${String(endDateObj.getDate()).padStart(2, '0')}`
            return { start, end }
        }
    }

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

        if (finalized) {
            totalPayroll += Number(finalized.final_salary || 0)
            totalOvertime += Number(finalized.overtime_pay || 0)
            totalBonus += Number(finalized.bonus || 0)
            totalDeduction += Number(finalized.deduction || 0)
            const overtimeHours = employeeAttendances.reduce((total, attendance) => total + Number(attendance.overtime_hours || 0), 0)
            totalOvertimeHours += overtimeHours
        } else {
            const overtimeHours = employeeAttendances.reduce((total, attendance) => total + Number(attendance.overtime_hours || 0), 0)
            totalOvertimeHours += overtimeHours

            const overtimePay = overtimeHours * Number(employee.overtime_rate || 0)

            const absentDays = employeeAttendances.filter(
                (attendance) => attendance.status === 'izin' || attendance.status === 'alpha'
            ).length

            const deduction = employee.employment_type === 'freelance' ? 0 : absentDays * Number(employee.daily_deduction || 0)
            
            const basePay = employee.employment_type === 'freelance'
                ? hadirCount * Number(employee.base_salary || 0)
                : Number(employee.base_salary || 0)

            const employeeAdjustment = adjustments[employee.id] || { bonus: 0, deduction: 0 }
            const extraAdjustment = Number(employeeAdjustment.deduction || 0)
            
            const bonus = Number(employeeAdjustment.bonus || 0) + (extraAdjustment > 0 ? extraAdjustment : 0)
            const totalEmployeeDeduction = deduction + (extraAdjustment < 0 ? Math.abs(extraAdjustment) : 0)

            const finalSalary = basePay + overtimePay + bonus - totalEmployeeDeduction

            totalPayroll += finalSalary
            totalOvertime += overtimePay
            totalBonus += bonus
            totalDeduction += totalEmployeeDeduction
        }
    })
    // ======================

    totalOvertimeDays = uniqueOvertimeDates.size

    return (
        <section className="-mt-2 space-y-6">
            <h2 className="text-3xl md:text-[42px] font-black uppercase tracking-[-0.04em] leading-none text-[#E43427] mb-4 px-1">
                Payroll Analytics
            </h2>

            <div className="bg-[#15438D] rounded-3xl border-4 border-[#111111] shadow-[8px_8px_0px_#111111] p-8">
                <div className="text-[#F3EBD9] text-sm font-black uppercase tracking-widest mb-2">Total Payroll</div>
                <div className="text-4xl md:text-5xl font-black text-[#F3EBD9] tracking-tighter tabular-nums mb-6">
                    Rp {Math.round(totalPayroll).toLocaleString()}
                </div>

                <details className="group border-t-4 border-[#111111] pt-4">
                    <summary className="cursor-pointer list-none flex items-center justify-between text-[#F3EBD9] font-black uppercase tracking-widest">
                        Detail Payroll
                        <span className="w-8 h-8 rounded-full bg-[#F3EBD9] text-[#111111] flex items-center justify-center font-bold">▼</span>
                    </summary>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4 mt-6 mb-4">
                        <div className="bg-[#111111] rounded-[24px] p-4 text-[#F3EBD9] shadow-[4px_4px_0px_#0B0B0B]">
                            <div className="text-[11px] font-black uppercase tracking-[0.08em] opacity-70 mb-2">Employee</div>
                            <div className="text-3xl font-black leading-none tracking-tight">{employees.length}</div>
                        </div>
                        <div className="bg-[#F3EBD9] rounded-[24px] p-4 text-[#15438D] shadow-[4px_4px_0px_#111111]">
                            <div className="text-[11px] font-black uppercase tracking-[0.08em] opacity-70 mb-2">Attendance</div>
                            <div className="text-3xl font-black leading-none tracking-tight">{totalAttendanceCount}</div>
                        </div>
                    <div className="bg-[#F3EBD9] rounded-[24px] p-4 text-[#111111] shadow-[4px_4px_0px_#111111]">
                        <div className="text-[11px] font-black uppercase tracking-[0.08em] opacity-70 mb-2">Kali Lembur</div>
                        <div className="text-3xl font-black leading-none tracking-tight">{totalOvertimeDays}x</div>
                    </div>
                        <div className="bg-[#F3EBD9] rounded-[24px] p-4 shadow-[4px_4px_0px_#111111]">
                            <div className="text-[11px] font-black uppercase tracking-[0.08em] text-[#E43427] mb-2">Lembur ({totalOvertimeHours} Jam)</div>
                            <div className="text-2xl font-black text-[#15438D] leading-none tracking-tight">Rp {Math.round(totalOvertime).toLocaleString()}</div>
                        </div>
                        <div className="bg-[#F3EBD9] rounded-[24px] p-4 shadow-[4px_4px_0px_#111111] text-[#111111]">
                            <div className="text-[11px] font-black uppercase tracking-[0.08em] opacity-80 mb-2">Total Bonus</div>
                            <div className="text-2xl font-black text-[#15438D] leading-none tracking-tight">Rp {Math.round(totalBonus).toLocaleString()}</div>
                        </div>
                        <div className="bg-[#E43427] rounded-[24px] p-4 shadow-[4px_4px_0px_#111111] text-[#F3EBD9]">
                            <div className="text-[11px] font-black uppercase tracking-[0.08em] opacity-80 mb-2">Potongan</div>
                            <div className="text-2xl font-black leading-none tracking-tight">Rp {Math.round(totalDeduction).toLocaleString()}</div>
                        </div>
                    </div>
                </details>
            </div>
        </section>
    )
}