'use client'

type Props = {
    employees: any[]
    attendances: any[]
    selectedMonth: string
}

export default function PayrollAnalytics({
    employees,
    attendances,
    selectedMonth,
}: Props) {

    // === BUSINESS LOGIC ===
    const filteredAttendances = attendances.filter((attendance) =>
        attendance.work_date?.startsWith(selectedMonth)
    )

    let totalPayroll = 0
    let totalOvertime = 0
    let totalDeduction = 0

    employees.forEach((employee) => {
        const employeeAttendances = filteredAttendances.filter(
            (attendance) => attendance.employee_id === employee.id
        )

        const overtimePay = employeeAttendances.reduce(
            (total, attendance) =>
                total + (Number(attendance.overtime_hours || 0) * employee.overtime_rate),
            0
        )

        const absentDays = employeeAttendances.filter(
            (attendance) => attendance.status === 'izin' || attendance.status === 'alpha'
        ).length

        const deduction = absentDays * (employee.base_salary / 30)
        const finalSalary = employee.base_salary + overtimePay - deduction

        totalPayroll += finalSalary
        totalOvertime += overtimePay
        totalDeduction += deduction
    })
    // ======================

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
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 mb-4">
                        <div className="bg-[#111111] rounded-[24px] p-4 text-[#F3EBD9] shadow-[4px_4px_0px_#0B0B0B]">
                            <div className="text-[11px] font-black uppercase tracking-[0.08em] opacity-70 mb-2">
                                Employee
                            </div>
                            <div className="text-3xl font-black leading-none tracking-tight">
                                {employees.length}
                            </div>
                        </div>
                        <div className="bg-[#F3EBD9] rounded-[24px] p-4 text-[#15438D] shadow-[4px_4px_0px_#111111]">
                            <div className="text-[11px] font-black uppercase tracking-[0.08em] opacity-70 mb-2">
                                Attendance
                            </div>
                            <div className="text-3xl font-black leading-none tracking-tight">
                                {filteredAttendances.length}
                            </div>
                        </div>
                        <div className="bg-[#F3EBD9] rounded-[24px] p-4 shadow-[4px_4px_0px_#111111]">
                            <div className="text-[11px] font-black uppercase tracking-[0.08em] text-[#E43427] mb-2">Lembur</div>
                            <div className="text-2xl font-black text-[#15438D] leading-none tracking-tight">Rp {Math.round(totalOvertime).toLocaleString()}</div>
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