'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import EditAttendanceModal from './EditAttendanceModal'

type Props = {
    attendances: any[]
    employees: any[]
    selectedMonth: string
    refreshAttendances: () => void
}

export default function AttendanceList({
    attendances,
    employees,
    selectedMonth,
    refreshAttendances,
}: Props) {
    const [editingAttendance, setEditingAttendance] = useState<any>(null)

    async function deleteAttendance(id: string) {
        if (!confirm('Hapus attendance ini?')) return
        await supabase.from('attendance').delete().eq('id', id)
        refreshAttendances()
    }

    const filteredAttendances = attendances.filter((a) => a.work_date?.startsWith(selectedMonth))
    const groupedData: any = {}
    filteredAttendances.forEach((a) => {
        const date = new Date(a.work_date)
        const year = date.getFullYear()
        const month = date.toLocaleString('id-ID', { month: 'long' })
        const day = a.work_date
        if (!groupedData[year]) groupedData[year] = {}
        if (!groupedData[year][month]) groupedData[year][month] = {}
        if (!groupedData[year][month][day]) groupedData[year][month][day] = []
        groupedData[year][month][day].push(a)
    })

    return (
        <div className="mt-12">
            <h3 className="text-3xl md:text-[42px] font-black uppercase tracking-[-0.04em] leading-none text-[#E43427] mb-6 px-1">Riwayat Absensi</h3>
            <div className="space-y-6">
                {Object.entries(groupedData).map(([year, months]: any) => (
                    <details
                        key={year}
                        open
                        className="bg-[#111111] rounded-[36px] border-4 border-[#111111] shadow-[8px_8px_0px_#15438D] overflow-hidden"
                    >
                        <summary className="list-none cursor-pointer px-6 py-5 flex items-center justify-between bg-[#111111]">
                            <div className="inline-flex items-center px-4 py-2 bg-[#F3EBD9] border-2 border-[#111111] rounded-full">
                                <span className="text-[#111111] text-2xl font-black tracking-tight">
                                    {year}
                                </span>
                            </div>

                            <span className="w-8 h-8 rounded-full bg-[#F3EBD9] text-[#111111] flex items-center justify-center font-bold text-sm shrink-0">
                                ▼
                            </span>
                        </summary>

                        <div className="p-5 space-y-5 bg-[#111111]">
                            {Object.entries(months).map(([month, dates]: any) => (
                                <details
                                    key={month}
                                    className="bg-[#F3EBD9] rounded-[32px] border-4 border-[#111111] overflow-hidden"
                                >
                                    <summary className="list-none cursor-pointer px-6 py-5 bg-[#15438D] flex items-center justify-between">
                                        <div>
                                            <h5 className="text-[#F3EBD9] text-3xl font-black uppercase tracking-tight leading-none">
                                                {month}
                                            </h5>
                                            <p className="text-[#F3EBD9]/80 text-sm font-bold uppercase mt-2 tracking-wide">
                                                {Object.keys(dates).length} Hari Attendance
                                            </p>
                                        </div>

                                        <span className="w-8 h-8 rounded-full bg-[#F3EBD9] text-[#111111] flex items-center justify-center font-bold text-sm shrink-0">
                                            ▼
                                        </span>
                                    </summary>

                                    <div className="p-5 space-y-4">
                                        {Object.entries(dates).map(([date, items]: any) => (
                                            <details
                                                key={date}
                                                className="bg-[#E43427] border-4 border-[#111111] rounded-[28px] overflow-hidden"
                                            >
                                                <summary className="list-none cursor-pointer px-5 py-4 flex items-center justify-between">
                                                    <div>
                                                        <div className="text-[#F3EBD9] text-2xl font-black tracking-tight leading-none">
                                                            {date}
                                                        </div>
                                                        <div className="text-[#F3EBD9]/80 text-xs uppercase font-bold tracking-wider mt-2">
                                                            {items.length} Record
                                                        </div>
                                                    </div>

                                                    <span className="w-8 h-8 rounded-full bg-[#F3EBD9] text-[#111111] flex items-center justify-center font-bold text-sm shrink-0">
                                                        ▼
                                                    </span>
                                                </summary>

                                                <div className="px-4 pb-4 space-y-3">
                                                    {items.sort((a: any, b: any) => {
                                                        const indexA = employees.findIndex(e => String(e.id) === String(a.employee_id))
                                                        const indexB = employees.findIndex(e => String(e.id) === String(b.employee_id))
                                                        return (indexA !== -1 ? indexA : 999) - (indexB !== -1 ? indexB : 999)
                                                    }).map((item: any) => (
                                                        <div
                                                            key={item.id}
                                                            className="bg-[#F3EBD9] border-4 border-[#111111] rounded-[24px] p-4"
                                                        >
                                                            <div className="flex items-start justify-between gap-4">
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="text-[#111111] text-2xl font-black uppercase leading-none tracking-tight">
                                                                        {item.employees?.name || 'Employee'}
                                                                    </div>

                                                                    <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
                                                                        <div>
                                                                            <div className="text-[11px] font-black uppercase tracking-[0.08em] text-[#15438D] mb-1">
                                                                                Masuk
                                                                            </div>
                                                                            <div className="text-[#111111] text-xl font-black tracking-tight leading-none">
                                                                                {item.check_in || '--:--'}
                                                                            </div>
                                                                        </div>

                                                                        <div>
                                                                            <div className="text-[11px] font-black uppercase tracking-[0.08em] text-[#111111]/60 mb-1">
                                                                                Keluar
                                                                            </div>
                                                                            <div className="text-[#111111] text-xl font-black tracking-tight leading-none">
                                                                                {item.check_out || '--:--'}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="mt-4 inline-flex px-3 py-1 bg-[#E43427] text-[#F3EBD9] rounded-full border-2 border-[#111111] text-xs font-black uppercase tracking-wide leading-none">
                                                                        {item.status || 'Hadir'}
                                                                    </div>
                                                                </div>

                                                                <div className="flex flex-col gap-2 shrink-0">
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.preventDefault()
                                                                            e.stopPropagation()
                                                                            setEditingAttendance(item)
                                                                        }}
                                                                        className="bg-[#15438D] text-[#F3EBD9] px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-wide shadow-[3px_3px_0px_#111111] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                                                                    >
                                                                        Edit
                                                                    </button>

                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.preventDefault()
                                                                            e.stopPropagation()
                                                                            deleteAttendance(item.id)
                                                                        }}
                                                                        className="bg-[#111111] text-[#F3EBD9] px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-wide shadow-[3px_3px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                                                                    >
                                                                        Hapus
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </details>
                                        ))}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </details>
                ))}
            </div>
            {editingAttendance && (
                <EditAttendanceModal
                    attendance={editingAttendance}
                    employees={employees}
                    onClose={() => setEditingAttendance(null)}
                    refreshAttendances={refreshAttendances}
                />
            )}
        </div>
    )
}