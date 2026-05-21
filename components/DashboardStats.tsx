type Props = {
    employees: any[]
    attendances: any[]
}

export default function DashboardStats({
    employees,
    attendances,
}: Props) {

    const totalEmployees =
        employees.length

    const totalOvertimeHours =
        attendances.reduce(
            (total, attendance) =>
                total +
                Number(
                    attendance.overtime_hours || 0
                ),
            0
        )

    const totalAbsent =
        attendances.filter(
            (attendance) =>
                !attendance.status
        ).length

    const totalAbsentDeduction =
        attendances.reduce(
            (total, attendance) => {

                if (
                    attendance.status
                ) {
                    return total
                }

                const employee =
                    employees.find(
                        (emp) =>
                            emp.id ===
                            attendance.employee_id
                    )

                return (
                    total +
                    Number(
                        employee?.absent_deduction || 0
                    )
                )
            },
            0
        )

    const totalPayroll =
        employees.reduce(
            (total, employee) => {

                const employeeAttendances =
                    attendances.filter(
                        (attendance) =>
                            attendance.employee_id ===
                            employee.id
                    )

                const overtimePay =
                    employeeAttendances.reduce(
                        (sum, attendance) =>
                            sum +
                            (
                                Number(
                                    attendance.overtime_hours || 0
                                ) *
                                Number(
                                    employee.overtime_rate || 0
                                )
                            ),
                        0
                    )

                return (
                    total +
                    Number(employee.base_salary) +
                    overtimePay
                )
            },
            0
        )

    const stats = [
        {
            title: 'Total Payroll',
            value:
                `Rp ${Math.round(totalPayroll).toLocaleString()}`,
        },

        {
            title: 'Total Lembur',
            value:
                `${totalOvertimeHours} Jam`,
        },

        {
            title: 'Total Karyawan',
            value:
                totalEmployees,
        },

        {
            title: 'Tidak Masuk',
            value:
                `${totalAbsent} Hari`,
        },

        {
            title: 'Potongan Absen',
            value:
                `Rp ${totalAbsentDeduction.toLocaleString()}`,
        },
    ]

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">

            {
                stats.map((stat) => (
                    <div
                        key={stat.title}
                        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
                    >

                        <div className="text-zinc-400 text-sm">
                            {stat.title}
                        </div>

                        <div className="text-2xl font-bold mt-3">
                            {stat.value}
                        </div>

                    </div>
                ))
            }

        </div>
    )
}