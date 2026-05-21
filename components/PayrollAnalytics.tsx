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

    const filteredAttendances =
        attendances.filter(
            (attendance) =>
                attendance.work_date?.startsWith(
                    selectedMonth
                )
        )

    let totalPayroll = 0
    let totalOvertime = 0
    let totalDeduction = 0

    employees.forEach((employee) => {

        const employeeAttendances =
            filteredAttendances.filter(
                (attendance) =>
                    attendance.employee_id ===
                    employee.id
            )

        const overtimePay =
            employeeAttendances.reduce(
                (total, attendance) =>
                    total +
                    (
                        Number(
                            attendance.overtime_hours || 0
                        ) *
                        employee.overtime_rate
                    ),
                0
            )

        const absentDays =
            employeeAttendances.filter(
                (attendance) =>
                    attendance.status === 'izin' ||
                    attendance.status === 'alpha'
            ).length

        const deduction =
            absentDays *
            (employee.base_salary / 30)

        const finalSalary =
            employee.base_salary +
            overtimePay -
            deduction

        totalPayroll += finalSalary
        totalOvertime += overtimePay
        totalDeduction += deduction
    })

    return (
        <div className="mb-8 mt-6">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-5 gap-4">

                <div>

                    <div className="text-3xl md:text-4xl font-black leading-none">
                        Payroll Analytics
                    </div>

                    <div className="text-zinc-500 mt-2 text-sm">
                        Track pengeluaran payroll bulanan
                    </div>

                </div>

            </div>

            <div className="space-y-4">

                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 lg:p-7">

                    <div className="text-zinc-500 text-sm">
                        Total Payroll
                    </div>

                    <div className="text-3xl lg:text-5xl font-black mt-5 leading-none">
                        Rp {
                            Math.round(
                                totalPayroll
                            ).toLocaleString()
                        }
                    </div>

                </div>

                <details className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 lg:p-7">

                    <summary
                        className="
                            cursor-pointer
                            font-semibold
                            text-zinc-400
                            hover:text-white
                            transition
                            list-none
                            flex
                            items-center
                            gap-2
                        "
                    >
                        <span className="text-sm">
                            Detail Payroll
                        </span>
                    </summary>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">

                        <div className="bg-zinc-800 rounded-2xl p-5">

                            <div className="text-zinc-500 text-sm">
                                Total Lembur
                            </div>

                            <div className="text-2xl font-black mt-3 text-green-400">
                                Rp {
                                    Math.round(
                                        totalOvertime
                                    ).toLocaleString()
                                }
                            </div>

                        </div>

                        <div className="bg-zinc-800 rounded-2xl p-5">

                            <div className="text-zinc-500 text-sm">
                                Total Potongan
                            </div>

                            <div className="text-2xl font-black mt-3 text-red-400">
                                Rp {
                                    Math.round(
                                        totalDeduction
                                    ).toLocaleString()
                                }
                            </div>

                        </div>

                    </div>

                </details>

            </div>

        </div>
    )
}