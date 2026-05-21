'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

type Props = {
    employees: any[]
    refreshAttendances: () => void
}

export default function AttendanceForm({
    employees,
    refreshAttendances,
}: Props) {

    const [selectedEmployee, setSelectedEmployee] =
        useState('all')

    const [date, setDate] = useState(
        new Date().toISOString().split('T')[0]
    )

    const [checkIn, setCheckIn] =
        useState('08:00')

    const [checkOut, setCheckOut] =
        useState('')

    const [status, setStatus] =
        useState('hadir')

    const [isNationalHoliday, setIsNationalHoliday] =
        useState(false)

    const [loading, setLoading] =
        useState(false)

    function calculateOvertime() {

        if (!checkOut) return 0

        if (status !== 'hadir') {
            return 0
        }

        const [outHour, outMinute] =
            checkOut.split(':').map(Number)

        let overtimeStartHour = 14

        if (isNationalHoliday) {
            overtimeStartHour = 8
        }

        const overtimeMinutes =
            (outHour * 60 + outMinute) -
            (overtimeStartHour * 60)

        if (overtimeMinutes <= 0) return 0

        return Number(
            (overtimeMinutes / 60).toFixed(2)
        )
    }



    async function saveAttendance() {

        if (loading) return

        setLoading(true)

        if (!selectedEmployee) {

            setLoading(false)

            return
        }

        const overtimeHours =
            calculateOvertime()

        const employeeIds =
            selectedEmployee === 'all'
                ? employees.map(
                    (employee) => employee.id
                )
                : [selectedEmployee]

        const { error } = await supabase
            .from('attendance')
            .insert(
                employeeIds.map(
                    (employeeId) => ({
                        employee_id:
                            employeeId,

                        work_date: date,

                        check_in: checkIn,

                        check_out:
                            checkOut || null,

                        status: status,

                        is_national_holiday:
                            isNationalHoliday,

                        overtime_hours:
                            overtimeHours,
                    })
                )
            )

        if (error) {

            console.error(error)

            setLoading(false)

            return
        }

        alert(
            'Attendance berhasil disimpan 🔥'
        )

        setCheckOut('')
        setStatus('hadir')
        setIsNationalHoliday(false)

        refreshAttendances()
        setLoading(false)
    }

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8">

            <h2 className="text-2xl font-semibold mb-6">
                Attendance
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <select
                    value={selectedEmployee}
                    onChange={(e) =>
                        setSelectedEmployee(
                            e.target.value
                        )
                    }
                    className="bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3"
                >

                    <option value="all">
                        Semua Karyawan
                    </option>

                    {
                        employees.map(
                            (employee) => (
                                <option
                                    key={employee.id}
                                    value={employee.id}
                                >
                                    {employee.name}
                                </option>
                            )
                        )
                    }

                </select>

                <input
                    type="date"
                    value={date}
                    onChange={(e) =>
                        setDate(
                            e.target.value
                        )
                    }
                    className="bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3"
                />

                <input
                    type="time"
                    value={checkIn}
                    onChange={(e) =>
                        setCheckIn(
                            e.target.value
                        )
                    }
                    className="bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3"
                />

                {
                    status === 'hadir' && (
                        <input
                            type="time"
                            value={checkOut}
                            onChange={(e) =>
                                setCheckOut(
                                    e.target.value
                                )
                            }
                            className="bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3"
                        />
                    )
                }
                <select
                    value={status}
                    onChange={(e) => {

                        setStatus(
                            e.target.value
                        )

                        if (
                            e.target.value !== 'hadir'
                        ) {
                            setCheckOut('')
                        }
                    }}
                    className="bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3"
                >

                    <option value="hadir">
                        Hadir
                    </option>

                    <option value="sakit">
                        Sakit
                    </option>

                    <option value="izin">
                        Izin
                    </option>

                    <option value="alpha">
                        Alpha
                    </option>

                    <option value="libur">
                        Libur
                    </option>

                </select>

            </div>

            {
                status === 'hadir' && (
                    <div className="flex flex-col gap-3 mt-6">

                        <label className="flex items-center gap-3">

                            <input
                                type="checkbox"
                                checked={isNationalHoliday}
                                onChange={(e) =>
                                    setIsNationalHoliday(
                                        e.target.checked
                                    )
                                }
                            />

                            Hari Libur Nasional

                        </label>

                    </div>
                )
            }


            <div className="mt-6 text-lg">

                Total Lembur:

                <span className="font-bold ml-2 text-green-400">

                    {
                        checkOut
                            ? calculateOvertime()
                            : 0
                    } jam

                </span>

            </div>

            <button
                onClick={saveAttendance}
                disabled={loading}
                className="
                w-full lg:w-auto
        mt-6
        px-5
        py-3
        rounded-xl
        bg-white
        text-black
        font-semibold
        disabled:opacity-50
    "
            >
                {
                    loading
                        ? 'Saving...'
                        : 'Simpan Attendance'
                }
            </button>

        </div>
    )
}