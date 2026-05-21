'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

type Props = {
    attendance: any
    onClose: () => void
}

export default function EditAttendanceModal({
    attendance,
    onClose,
}: Props) {

    const [status, setStatus] =
        useState(attendance.status || 'hadir')

    const [checkIn, setCheckIn] =
        useState(attendance.check_in || '')

    const [checkOut, setCheckOut] =
        useState(attendance.check_out || '')

    const [
        isNationalHoliday,
        setIsNationalHoliday,
    ] = useState(
        attendance.is_national_holiday
    )

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

        if (overtimeMinutes <= 0) {
            return 0
        }

        return Number(
            (
                overtimeMinutes / 60
            ).toFixed(2)
        )
    }

    async function saveAttendance() {

        if (loading) return

        setLoading(true)

        const overtimeHours =
            calculateOvertime()

        const { error } = await supabase
            .from('attendance')
            .update({
                status,
                check_in: checkIn,
                check_out: checkOut || null,
                is_national_holiday:
                    isNationalHoliday,
                overtime_hours:
                    overtimeHours,
            })
            .eq('id', attendance.id)

        if (error) {

            console.error(error)

            setLoading(false)

            return
        }

        window.location.reload()
    }

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-lg">

                <div className="flex items-center justify-between mb-6">

                    <h2 className="text-2xl font-bold">
                        Edit Attendance
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-zinc-400 text-xl"
                    >
                        ✕
                    </button>

                </div>

                <div className="space-y-4">

                    <select
                        value={status}
                        onChange={(e) =>
                            setStatus(
                                e.target.value
                            )
                        }
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3"
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

                    <input
                        type="time"
                        value={checkIn}
                        onChange={(e) =>
                            setCheckIn(
                                e.target.value
                            )
                        }
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3"
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
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3"
                            />
                        )
                    }

                    <label className="flex items-center gap-3">

                        <input
                            type="checkbox"
                            checked={
                                isNationalHoliday
                            }
                            onChange={(e) =>
                                setIsNationalHoliday(
                                    e.target.checked
                                )
                            }
                        />

                        Hari Libur Nasional

                    </label>

                    <div className="text-lg">

                        Total Lembur:

                        <span className="text-green-400 font-bold ml-2">
                            {calculateOvertime()} jam
                        </span>

                    </div>

                    <button

                        onClick={saveAttendance}

                        disabled={loading}

                        className="

        w-full

        bg-white

        text-black

        rounded-xl

        py-3

        font-semibold

        disabled:opacity-50

    "

                    >

                        {

                            loading

                                ? 'Saving...'

                                : 'Simpan Perubahan'

                        }

                    </button>

                </div>

            </div>

        </div>
    )
}