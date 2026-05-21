'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import EditAttendanceModal from '@/components/EditAttendanceModal'

type Props = {
    attendances: any[]
    selectedMonth: string
}

export default function AttendanceList({
    attendances,
    selectedMonth,
}: Props) {

    const [openYears, setOpenYears] =
        useState<any>({})

    const [openMonths, setOpenMonths] =
        useState<any>({})

    const [openDates, setOpenDates] =
        useState<any>({})

    const [
        editingAttendance,
        setEditingAttendance,
    ] = useState<any>(null)

    async function deleteAttendance(id: string) {

        const confirmed =
            confirm('Hapus attendance ini?')

        if (!confirmed) return

        await supabase
            .from('attendance')
            .delete()
            .eq('id', id)

        location.reload()
    }

    function getStatusColor(
        status: string
    ) {

        switch (status) {

            case 'hadir':
                return 'bg-green-500/20 text-green-400'

            case 'izin':
                return 'bg-yellow-500/20 text-yellow-400'

            case 'sakit':
                return 'bg-blue-500/20 text-blue-400'

            case 'alpha':
                return 'bg-red-500/20 text-red-400'

            case 'libur':
                return 'bg-zinc-500/20 text-zinc-300'

            default:
                return 'bg-zinc-500/20 text-zinc-300'
        }
    }

    const filteredAttendances =
        attendances.filter(
            (attendance) =>
                attendance.work_date?.startsWith(
                    selectedMonth
                )
        )

    const groupedData: any = {}

    filteredAttendances.forEach((attendance) => {

        const date =
            new Date(attendance.work_date)

        const year =
            date.getFullYear()

        const month =
            date.toLocaleString(
                'id-ID',
                { month: 'long' }
            )

        const day =
            attendance.work_date

        if (!groupedData[year]) {
            groupedData[year] = {}
        }

        if (!groupedData[year][month]) {
            groupedData[year][month] = {}
        }

        if (!groupedData[year][month][day]) {
            groupedData[year][month][day] = []
        }

        groupedData[year][month][day]
            .push(attendance)
    })

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

            <h2 className="text-2xl font-semibold mb-6">
                Attendance History
            </h2>

            <div className="space-y-4">

                {
                    Object.entries(groupedData)
                        .map(([year, months]: any) => {

                            const yearOpen =
                                openYears[year]

                            return (
                                <div
                                    key={year}
                                    className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden"
                                >

                                    <button
                                        onClick={() =>
                                            setOpenYears({
                                                ...openYears,
                                                [year]: !yearOpen,
                                            })
                                        }
                                        className="w-full p-5 flex items-center justify-between"
                                    >

                                        <div className="text-2xl font-bold">
                                            {year}
                                        </div>

                                        <div className="text-2xl">
                                            {yearOpen ? '−' : '+'}
                                        </div>

                                    </button>

                                    {
                                        yearOpen && (
                                            <div className="border-t border-zinc-800 p-4 space-y-4">

                                                {
                                                    Object.entries(months)
                                                        .map(([month, dates]: any) => {

                                                            const monthKey =
                                                                `${year}-${month}`

                                                            const monthOpen =
                                                                openMonths[monthKey]

                                                            return (
                                                                <div
                                                                    key={month}
                                                                    className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
                                                                >

                                                                    <button
                                                                        onClick={() =>
                                                                            setOpenMonths({
                                                                                ...openMonths,
                                                                                [monthKey]: !monthOpen,
                                                                            })
                                                                        }
                                                                        className="w-full p-4 flex items-center justify-between"
                                                                    >

                                                                        <div className="text-xl font-semibold">
                                                                            {month}
                                                                        </div>

                                                                        <div className="text-xl">
                                                                            {monthOpen ? '−' : '+'}
                                                                        </div>

                                                                    </button>

                                                                    {
                                                                        monthOpen && (
                                                                            <div className="border-t border-zinc-800 p-4 space-y-4">

                                                                                {
                                                                                    Object.entries(dates)
                                                                                        .map(([date, items]: any) => {

                                                                                            const dateOpen =
                                                                                                openDates[date]

                                                                                            const totalOvertime =
                                                                                                items.reduce(
                                                                                                    (
                                                                                                        total: number,
                                                                                                        item: any
                                                                                                    ) =>
                                                                                                        total +
                                                                                                        Number(
                                                                                                            item.overtime_hours || 0
                                                                                                        ),
                                                                                                    0
                                                                                                )

                                                                                            return (
                                                                                                <div
                                                                                                    key={date}
                                                                                                    className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden"
                                                                                                >

                                                                                                    <button
                                                                                                        onClick={() =>
                                                                                                            setOpenDates({
                                                                                                                ...openDates,
                                                                                                                [date]: !dateOpen,
                                                                                                            })
                                                                                                        }
                                                                                                        className="w-full p-4 flex items-center justify-between"
                                                                                                    >

                                                                                                        <div className="text-left">

                                                                                                            <div className="font-bold">
                                                                                                                {date}
                                                                                                            </div>

                                                                                                            <div className="text-zinc-400 text-sm mt-1">
                                                                                                                {items.length} attendance
                                                                                                                • {totalOvertime} jam lembur
                                                                                                            </div>

                                                                                                        </div>

                                                                                                        <div>
                                                                                                            {dateOpen ? '−' : '+'}
                                                                                                        </div>

                                                                                                    </button>

                                                                                                    {
                                                                                                        dateOpen && (
                                                                                                            <div className="border-t border-zinc-800">

                                                                                                                {
                                                                                                                    items.map((attendance: any) => (

                                                                                                                        <div
                                                                                                                            key={attendance.id}
                                                                                                                            className="p-5 border-b border-zinc-800 last:border-none"
                                                                                                                        >

                                                                                                                            <div className="flex items-start justify-between">

                                                                                                                                <div>

                                                                                                                                    <div className="text-lg font-semibold">
                                                                                                                                        {attendance.employees?.name}
                                                                                                                                    </div>

                                                                                                                                    <div className="text-zinc-400 mt-1">
                                                                                                                                        {attendance.check_in}
                                                                                                                                        {' - '}
                                                                                                                                        {attendance.check_out}
                                                                                                                                    </div>

                                                                                                                                    <div
                                                                                                                                        className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold w-fit capitalize ${getStatusColor(attendance.status)}`}
                                                                                                                                    >
                                                                                                                                        {attendance.status}
                                                                                                                                    </div>

                                                                                                                                </div>

                                                                                                                                <div className="text-right">

                                                                                                                                    <div className="text-green-400 font-bold">
                                                                                                                                        {attendance.overtime_hours || 0} jam
                                                                                                                                    </div>

                                                                                                                                    <div className="flex gap-2 mt-3">

                                                                                                                                        <button
                                                                                                                                            onClick={() =>
                                                                                                                                                setEditingAttendance(
                                                                                                                                                    attendance
                                                                                                                                                )
                                                                                                                                            }
                                                                                                                                            className="px-3 py-1 rounded-lg bg-white text-black text-sm"
                                                                                                                                        >
                                                                                                                                            Edit
                                                                                                                                        </button>

                                                                                                                                        <button
                                                                                                                                            onClick={() =>
                                                                                                                                                deleteAttendance(
                                                                                                                                                    attendance.id
                                                                                                                                                )
                                                                                                                                            }
                                                                                                                                            className="px-3 py-1 rounded-lg bg-red-500 text-white text-sm"
                                                                                                                                        >
                                                                                                                                            Hapus
                                                                                                                                        </button>

                                                                                                                                    </div>

                                                                                                                                </div>

                                                                                                                            </div>

                                                                                                                        </div>

                                                                                                                    ))
                                                                                                                }

                                                                                                            </div>
                                                                                                        )
                                                                                                    }

                                                                                                </div>
                                                                                            )
                                                                                        })
                                                                                }

                                                                            </div>
                                                                        )
                                                                    }

                                                                </div>
                                                            )
                                                        })
                                                }

                                            </div>
                                        )
                                    }

                                </div>
                            )
                        })
                }

            </div>
            {
                editingAttendance && (
                    <EditAttendanceModal
                        attendance={
                            editingAttendance
                        }
                        onClose={() =>
                            setEditingAttendance(
                                null
                            )
                        }
                    />
                )
            }

        </div>
    )
}