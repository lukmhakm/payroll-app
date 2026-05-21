'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

type Props = {
    employee: any
    deleteEmployee: (id: string) => void
    refreshEmployees: () => void
}

export default function EmployeeCard({
    employee,
    deleteEmployee,
    refreshEmployees,
}: Props) {

    const [isEditing, setIsEditing] =
        useState(false)

    const [loading, setLoading] =
        useState(false)

    const [salary, setSalary] =
        useState(employee.base_salary)

    const [overtimeRate, setOvertimeRate] =
        useState(employee.overtime_rate)

    const [bankName, setBankName] =
        useState(employee.bank_name || '')

    const [
        bankAccountNumber,
        setBankAccountNumber,
    ] = useState(
        employee.bank_account_number || ''
    )

    const [
        bankAccountName,
        setBankAccountName,
    ] = useState(
        employee.bank_account_name || ''
    )

    const [
        payrollStartDay,
        setPayrollStartDay,
    ] = useState(
        employee.payroll_start_day || 1
    )

    const [employeeName, setEmployeeName] =
        useState(employee.name)

    const [position, setPosition] =
        useState(employee.position)

    const [email, setEmail] =
        useState(employee.email || '')

    const [
        employmentType,
        setEmploymentType,
    ] = useState(
        employee.employment_type || 'fulltime'
    )

    async function saveEmployee() {

        if (loading) return

        setLoading(true)

        const { error } = await supabase
            .from('employees')
            .update({
                name: employeeName,
                position: position,
                email,
                employment_type: employmentType,
                base_salary: Number(salary),
                overtime_rate: Number(overtimeRate),

                bank_name: bankName,
                bank_account_number:
                    bankAccountNumber,
                bank_account_name:
                    bankAccountName,

                payroll_start_day:
                    Number(payrollStartDay),
            })
            .eq('id', employee.id)

        if (error) {

            console.error(error)

            setLoading(false)

            return
        }

        setIsEditing(false)

        refreshEmployees()
        setLoading(false)
    }

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">

                <div>

                    {
                        isEditing ? (
                            <input
                                value={employeeName}
                                onChange={(e) =>
                                    setEmployeeName(
                                        e.target.value
                                    )
                                }
                                className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2"
                            />
                        ) : (
                            <div className="text-2xl font-bold">
                                {employee.name}
                            </div>
                        )
                    }

                    <div className="text-zinc-400 mt-1">
                        {
                            isEditing ? (
                                <input
                                    value={position}
                                    onChange={(e) =>
                                        setPosition(
                                            e.target.value
                                        )
                                    }
                                    className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 mt-2"
                                />
                            ) : (
                                employee.position
                            )
                        }
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-6 text-sm">

                        <div>

                            <div className="mb-1">
                                Gaji Pokok
                            </div>

                            {
                                isEditing ? (
                                    <input
                                        type="number"
                                        value={salary}
                                        onChange={(e) =>
                                            setSalary(e.target.value)
                                        }
                                        className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 mt-2"
                                    />
                                ) : (
                                    <div className="font-semibold mt-2">
                                        Rp {
                                            Number(
                                                employee.base_salary
                                            ).toLocaleString()
                                        }
                                    </div>
                                )
                            }

                        </div>

                        <div>

                            <div className="mb-1">
                                Lembur per Jam
                            </div>

                            {
                                isEditing ? (
                                    <input
                                        type="number"
                                        value={overtimeRate}
                                        onChange={(e) =>
                                            setOvertimeRate(e.target.value)
                                        }
                                        className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 mt-2"
                                    />
                                ) : (
                                    <div className="font-semibold mt-2">
                                        Rp {
                                            Number(
                                                employee.overtime_rate
                                            ).toLocaleString()
                                        }
                                    </div>
                                )
                            }

                        </div>

                        <div>


                            <div className="mb-1">
                                Bank
                            </div>

                            {
                                isEditing ? (
                                    <input
                                        value={bankName}
                                        onChange={(e) =>
                                            setBankName(e.target.value)
                                        }
                                        className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 mt-2 w-full"
                                    />
                                ) : (
                                    <div className="font-semibold mt-2">
                                        {employee.bank_name || '-'}
                                    </div>
                                )
                            }

                        </div>

                        <div>

                            <div className="mb-1">
                                No Rekening
                            </div>

                            {
                                isEditing ? (
                                    <input
                                        value={bankAccountNumber}
                                        onChange={(e) =>
                                            setBankAccountNumber(
                                                e.target.value
                                            )
                                        }
                                        className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 mt-2 w-full"
                                    />
                                ) : (
                                    <div className="font-semibold mt-2">
                                        {employee.bank_account_number || '-'}
                                    </div>
                                )
                            }

                        </div>

                        <div>

                            <div className="mb-1">
                                Atas Nama
                            </div>

                            {
                                isEditing ? (
                                    <input
                                        value={bankAccountName}
                                        onChange={(e) =>
                                            setBankAccountName(
                                                e.target.value
                                            )
                                        }
                                        className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 mt-2 w-full"
                                    />
                                ) : (
                                    <div className="font-semibold mt-2">
                                        {employee.bank_account_name || '-'}
                                    </div>
                                )
                            }

                        </div>

                        <div>

                            <div className="mb-1">
                                Email
                            </div>

                            {
                                isEditing ? (
                                    <input
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(
                                                e.target.value
                                            )
                                        }
                                        className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 mt-2 w-full"
                                    />
                                ) : (
                                    <div className="font-semibold mt-2">
                                        {employee.email || '-'}
                                    </div>
                                )
                            }

                        </div>

                        <div>

                            <div className="mb-1">
                                Tipe Karyawan
                            </div>

                            {
                                isEditing ? (
                                    <select
                                        value={employmentType}
                                        onChange={(e) =>
                                            setEmploymentType(
                                                e.target.value
                                            )
                                        }
                                        className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 mt-2 w-full"
                                    >

                                        <option value="fulltime">
                                            Full Time
                                        </option>

                                        <option value="freelance">
                                            Freelance
                                        </option>

                                        <option value="parttime">
                                            Part Time
                                        </option>

                                    </select>
                                ) : (
                                    <div className="font-semibold mt-2 capitalize">
                                        {employee.employment_type}
                                    </div>
                                )
                            }

                        </div>

                        <div>

                            <div className="mb-1">
                                Payroll Mulai Tanggal
                            </div>

                            {
                                isEditing ? (
                                    <input
                                        type="number"
                                        min="1"
                                        max="31"
                                        value={payrollStartDay}
                                        onChange={(e) =>
                                            setPayrollStartDay(
                                                e.target.value
                                            )
                                        }
                                        className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 mt-2 w-full"
                                    />
                                ) : (
                                    <div className="font-semibold mt-2">
                                        {employee.payroll_start_day || 1}
                                    </div>
                                )
                            }

                        </div>

                    </div>

                </div>

                <div className="flex flex-col gap-3 w-full lg:w-auto">

                    {
                        isEditing ? (
                            <button
                                onClick={saveEmployee}
                                disabled={loading}
                                className="
                                w-full lg:w-auto
                                px-4 py-2 rounded-xl
                                bg-green-500 text-white
                                disabled:opacity-50
                            "
                            >
                                {
                                    loading
                                        ? 'Saving...'
                                        : 'Save'
                                }
                            </button>
                        ) : (
                            <button
                                onClick={() =>
                                    setIsEditing(true)
                                }
                                className="
                                w-full lg:w-auto
                                px-4 py-2 rounded-xl 
                                bg-white text-black"
                            >
                                Edit
                            </button>
                        )
                    }

                    <button
                        onClick={() =>
                            deleteEmployee(employee.id)
                        }
                        disabled={loading}
                        className="
                        w-full lg:w-auto
        px-4 py-2 rounded-xl
        bg-red-500 text-white
        disabled:opacity-50
    "
                    >
                        Hapus
                    </button>

                </div>

            </div>

        </div>
    )
}