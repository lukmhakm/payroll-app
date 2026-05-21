'use client'

import { supabase } from '@/lib/supabase'
import { useState } from 'react'

type Props = {
    employees: any[]
    attendances: any[]
    selectedMonth: string
    onGenerateSlip: any
}

export default function PayrollSummary({
    employees,
    attendances,
    selectedMonth,
    onGenerateSlip,
}: Props) {

    const [adjustments, setAdjustments] =
        useState<any>({})

    function getPayrollPeriod(
        selectedMonth: string,
        payrollStartDay: number
    ) {

        const [year, month] =
            selectedMonth
                .split('-')
                .map(Number)

        const startDate =
            new Date(
                year,
                month - 2,
                payrollStartDay
            )

        const endDate =
            new Date(
                year,
                month - 1,
                payrollStartDay - 1
            )

        return {
            startDate,
            endDate,
        }
    }

    function getPayrollAttendances(
        employee: any
    ) {

        const {
            startDate,
            endDate,
        } = getPayrollPeriod(
            selectedMonth,
            employee.payroll_start_day || 1
        )

        return attendances.filter(
            (attendance) => {

                if (
                    attendance.employee_id !==
                    employee.id
                ) {
                    return false
                }

                const workDate =
                    new Date(
                        attendance.work_date
                    )

                return (
                    workDate >= startDate &&
                    workDate <= endDate
                )
            }
        )
    }

    function calculatePayroll(employee: any) {

        const employeeAttendances =
            getPayrollAttendances(employee)

        const totalOvertimeHours =
            employeeAttendances.reduce(
                (total, attendance) =>
                    total +
                    Number(
                        attendance.overtime_hours || 0
                    ),
                0
            )

        const totalOvertimePay =
            totalOvertimeHours *
            employee.overtime_rate

        const izinCount =
            employeeAttendances.filter(
                (attendance) =>
                    attendance.status === 'izin'
            ).length

        const alphaCount =
            employeeAttendances.filter(
                (attendance) =>
                    attendance.status === 'alpha'
            ).length

        const absentDays =
            izinCount + alphaCount

        const dailySalary =
            employee.base_salary / 30

        const totalDeduction =
            absentDays * dailySalary

        const finalSalary =
            employee.base_salary +
            totalOvertimePay -
            totalDeduction

        return {
            totalOvertimeHours,
            totalOvertimePay,
            absentDays,
            totalDeduction,
            finalSalary,
            izinCount,
            alphaCount,
        }
    }

    async function closePayroll() {

        const confirmed =
            confirm(
                `Close payroll ${selectedMonth}?`
            )

        if (!confirmed) return

        const { data: existingPayroll } =
            await supabase
                .from('payroll_history')
                .select('id')
                .eq(
                    'payroll_month',
                    selectedMonth
                )
                .eq(
                    'status',
                    'finalized'
                )
                .limit(1)

        if (
            existingPayroll &&
            existingPayroll.length > 0
        ) {

            alert(
                'Payroll bulan ini sudah difinalize'
            )

            return
        }

        for (const employee of employees) {

            const payroll =
                calculatePayroll(employee)

            const employeeAdjustment =
                adjustments[employee.id] || {
                    bonus: 0,
                    deduction: 0,
                }

            const {
                startDate,
                endDate,
            } = getPayrollPeriod(
                selectedMonth,
                employee.payroll_start_day || 1
            )

            await supabase
                .from('payroll_history')
                .insert({

                    employee_id:
                        employee.id,

                    employee_name:
                        employee.name,

                    employee_position:
                        employee.position,

                    bank_name:
                        employee.bank_name,

                    bank_account_number:
                        employee.bank_account_number,

                    bank_account_name:
                        employee.bank_account_name,

                    payroll_period_start:
                        startDate
                            .toISOString()
                            .slice(0, 10),

                    payroll_period_end:
                        endDate
                            .toISOString()
                            .slice(0, 10),

                    payroll_month:
                        selectedMonth,

                    base_salary:
                        employee.base_salary,

                    overtime_pay:
                        payroll.totalOvertimePay,

                    bonus:
                        Number(
                            employeeAdjustment.bonus || 0
                        ),

                    deduction:
                        (
                            payroll.totalDeduction || 0
                        ) +
                        Number(
                            employeeAdjustment.deduction || 0
                        ),

                    final_salary:
                        payroll.finalSalary +
                        Number(
                            employeeAdjustment.bonus || 0
                        ) -
                        Number(
                            employeeAdjustment.deduction || 0
                        ),

                    status:
                        'finalized',
                })
        }

        alert('Payroll berhasil di-close')
    }

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mt-10">

            <h2 className="text-2xl font-semibold mb-6">
                Payroll Summary
            </h2>

            <div className="space-y-4">

                {employees.map((employee) => {

                    const payroll =
                        calculatePayroll(employee)

                    const employeeAdjustment =
                        adjustments[employee.id] || {
                            bonus: 0,
                            deduction: 0,
                            note: '',
                        }

                    const finalSalary =
                        payroll.finalSalary +
                        Number(
                            employeeAdjustment.bonus || 0
                        ) -
                        Number(
                            employeeAdjustment.deduction || 0
                        )

                    return (
                        <div
                            key={employee.id}
                            className="bg-zinc-950 border border-zinc-800 rounded-xl p-5"
                        >

                            <div className="flex items-center justify-between">

                                <div>

                                    <div className="text-2xl font-bold">
                                        {employee.name}
                                    </div>

                                    <div className="text-zinc-400 mt-1">
                                        {employee.position}
                                    </div>

                                </div>

                                <div className="text-right">

                                    <div className="text-sm text-zinc-400">
                                        Final Salary
                                    </div>

                                    <div className="text-3xl font-bold text-green-400">
                                        Rp {
                                            Math.round(
                                                finalSalary
                                            ).toLocaleString()
                                        }
                                    </div>

                                </div>

                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

                                <div>
                                    <div className="text-zinc-500 text-sm">
                                        Bank
                                    </div>

                                    <div className="font-semibold mt-1">
                                        {employee.bank_name || '-'}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-zinc-500 text-sm">
                                        No Rekening
                                    </div>

                                    <div className="font-semibold mt-1">
                                        {employee.bank_account_number || '-'}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-zinc-500 text-sm">
                                        Atas Nama
                                    </div>

                                    <div className="font-semibold mt-1">
                                        {employee.bank_account_name || '-'}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-zinc-500 text-sm">
                                        Periode
                                    </div>

                                    <div className="font-semibold mt-1">
                                        {selectedMonth}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-zinc-500 text-sm">
                                        Uang Lembur
                                    </div>

                                    <div className="font-semibold mt-1">
                                        Rp {
                                            Math.round(
                                                payroll.totalOvertimePay
                                            ).toLocaleString()
                                        }
                                    </div>
                                </div>

                                <div>
                                    <div className="text-zinc-500 text-sm">
                                        Izin + Alpha
                                    </div>

                                    <div className="font-semibold mt-1">
                                        {payroll.absentDays} hari
                                    </div>
                                </div>

                                <div>
                                    <div className="text-zinc-500 text-sm">
                                        Potongan Absen
                                    </div>

                                    <div className="font-semibold mt-1 text-red-400">
                                        Rp {
                                            Math.round(
                                                payroll.totalDeduction
                                            ).toLocaleString()
                                        }
                                    </div>
                                </div>

                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-6">

                                <div>

                                    <div className="text-zinc-500 text-sm mb-2">
                                        Bonus
                                    </div>

                                    <input
                                        type="number"
                                        value={
                                            employeeAdjustment.bonus
                                        }
                                        onChange={(e) =>
                                            setAdjustments({
                                                ...adjustments,

                                                [employee.id]: {
                                                    ...employeeAdjustment,

                                                    bonus:
                                                        e.target.value,
                                                },
                                            })
                                        }
                                        className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 w-full"
                                    />

                                </div>

                                <div>

                                    <div className="text-zinc-500 text-sm mb-2">
                                        Potongan Tambahan
                                    </div>

                                    <input
                                        type="number"
                                        value={
                                            employeeAdjustment.deduction
                                        }
                                        onChange={(e) =>
                                            setAdjustments({
                                                ...adjustments,

                                                [employee.id]: {
                                                    ...employeeAdjustment,

                                                    deduction:
                                                        e.target.value,
                                                },
                                            })
                                        }
                                        className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 w-full"
                                    />

                                </div>

                            </div>

                            <button
                                onClick={() => {

                                    const confirmed =
                                        confirm(
                                            `Generate slip gaji untuk ${employee.name}?`
                                        )

                                    if (!confirmed) return

                                    onGenerateSlip({

                                        employee,

                                        payroll: {
                                            baseSalary:
                                                employee.base_salary,

                                            totalOvertimePay:
                                                payroll.totalOvertimePay,

                                            bonus:
                                                Number(
                                                    employeeAdjustment.bonus
                                                ) || 0,

                                            deduction:
                                                (
                                                    payroll.totalDeduction || 0
                                                ) +
                                                (
                                                    Number(
                                                        employeeAdjustment.deduction
                                                    ) || 0
                                                ),

                                            finalSalary:
                                                payroll.finalSalary +
                                                (
                                                    Number(
                                                        employeeAdjustment.bonus
                                                    ) || 0
                                                ) -
                                                (
                                                    Number(
                                                        employeeAdjustment.deduction
                                                    ) || 0
                                                ),
                                        },
                                    })
                                }}
                                className="mt-6 w-full lg:w-auto bg-white text-black px-5 py-3 rounded-xl font-semibold"
                            >
                                Generate Slip
                            </button>

                        </div>
                    )
                })}

            </div>

            <button
                onClick={closePayroll}
                className="
                    mt-8
                    w-full
                    bg-green-500
                    hover:bg-green-400
                    text-black
                    py-4
                    rounded-2xl
                    font-bold
                "
            >
                Finalize Payroll
            </button>

        </div>
    )
}