'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import EditAttendanceModal from './EditAttendanceModal'
import type { Employee } from '@/types'
import type { AttendanceWithEmployee } from '@/hooks/useAttendances'

type Props = {
    attendances: AttendanceWithEmployee[]
    employees: Employee[]
    selectedMonth: string
    refreshAttendances: () => void
}

export default function AttendanceList({
    attendances,
    employees,
    selectedMonth,
    refreshAttendances,
}: Props) {
    const [editingAttendance, setEditingAttendance] = useState<AttendanceWithEmployee | null>(null)

    async function deleteAttendance(id: string) {
        if (!confirm('Hapus attendance ini?')) return
        await supabase.from('attendance').delete().eq('id', id)
        refreshAttendances()
    }

    const getPrevMonth = (monthStr: string) => {
        if (!monthStr) return ''
        const [year, month] = monthStr.split('-').map(Number)
        const prevMonthDate = new Date(year, month - 2, 1)
        return `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}`
    }
    const prevMonth = getPrevMonth(selectedMonth)
    const filteredAttendances = attendances.filter((a) => 
        a.work_date?.startsWith(selectedMonth) || (prevMonth && a.work_date?.startsWith(prevMonth))
    )
    
    // Sort attendances from latest to oldest before grouping to preserve reverse chronological order
    const sortedFilteredAttendances = [...filteredAttendances].sort((a, b) => {
        return (b.work_date || '').localeCompare(a.work_date || '')
    })

    const groupedData: Record<string, Record<string, AttendanceWithEmployee[]>> = {}
    sortedFilteredAttendances.forEach((a) => {
        if (!a.work_date) return
        const date = new Date(a.work_date)
        const monthYear = date.toLocaleString('id-ID', { month: 'long', year: 'numeric' })
        const day = a.work_date
        if (!groupedData[monthYear]) groupedData[monthYear] = {}
        if (!groupedData[monthYear][day]) groupedData[monthYear][day] = []
        groupedData[monthYear][day].push(a)
    })

    return (
        <div className="w-full">
            <h3 className="text-3xl md:text-[42px] font-black uppercase tracking-[-0.04em] leading-none text-[var(--theme-accent)] mb-6 px-1 transition-colors duration-300">Attendance History</h3>
            <div className="space-y-6">
                {Object.entries(groupedData).map(([monthYear, dates]) => (
                    <details
                        key={monthYear}
                        open
                        className="bg-[var(--theme-primary)] rounded-[36px] border-4 border-[var(--theme-primary)] shadow-[8px_8px_0px_var(--theme-highlight)] overflow-hidden transition-all duration-300"
                    >
                        <summary className="list-none cursor-pointer px-6 py-5 flex items-center justify-between bg-[var(--theme-primary)]">
                            <div>
                                <h5 className="text-[var(--theme-surface)] text-3xl font-black uppercase tracking-tight leading-none">
                                    {monthYear}
                                </h5>
                                <p className="text-[var(--theme-surface)] opacity-80 text-sm font-bold uppercase mt-2 tracking-wide">
                                    {Object.keys(dates).length} Hari Attendance
                                </p>
                            </div>

                            <span className="w-8 h-8 rounded-full bg-[var(--theme-surface)] text-[var(--theme-primary)] flex items-center justify-center font-bold text-sm shrink-0">
                                ▼
                            </span>
                        </summary>

                        <div className="p-5 space-y-4 bg-[var(--theme-primary)]">
                            {Object.entries(dates).map(([date, items]) => (
                                <details
                                    key={date}
                                    className="bg-[var(--theme-accent)] border-4 border-[var(--theme-primary)] rounded-[28px] overflow-hidden"
                                >
                                    <summary className="list-none cursor-pointer px-5 py-4 flex items-center justify-between">
                                        <div>
                                            <div className="text-[var(--theme-surface)] text-2xl font-black tracking-tight leading-none">
                                                {date}
                                            </div>
                                            <div className="text-[var(--theme-surface)] opacity-80 text-xs uppercase font-bold tracking-wider mt-2">
                                                {items.length} Record
                                            </div>
                                        </div>

                                        <span className="w-8 h-8 rounded-full bg-[var(--theme-surface)] text-[var(--theme-primary)] flex items-center justify-center font-bold text-sm shrink-0">
                                            ▼
                                        </span>
                                    </summary>

                                    <div className="px-4 pb-4 space-y-3">
                                        {[...items].sort((a, b) => {
                                            const indexA = employees.findIndex(e => String(e.id) === String(a.employee_id))
                                            const indexB = employees.findIndex(e => String(e.id) === String(b.employee_id))
                                            return (indexA !== -1 ? indexA : 999) - (indexB !== -1 ? indexB : 999)
                                        }).map((item) => (
                                            <div
                                                key={item.id}
                                                className="bg-[var(--theme-surface)] border-4 border-[var(--theme-primary)] rounded-[24px] p-4"
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-[var(--theme-primary)] text-2xl font-black uppercase leading-none tracking-tight">
                                                            {item.employees?.name || 'Employee'}
                                                        </div>

                                                        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
                                                            <div>
                                                                <div className="text-[11px] font-black uppercase tracking-[0.08em] text-[var(--theme-highlight)] mb-1">
                                                                    Masuk
                                                                </div>
                                                                <div className="text-[var(--theme-primary)] text-xl font-black tracking-tight leading-none">
                                                                    {item.check_in || '--:--'}
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <div className="text-[11px] font-black uppercase tracking-[0.08em] text-[var(--theme-primary)] opacity-60 mb-1">
                                                                    Keluar
                                                                </div>
                                                                <div className="text-[var(--theme-primary)] text-xl font-black tracking-tight leading-none">
                                                                    {item.check_out || '--:--'}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="mt-4 inline-flex px-3 py-1 bg-[var(--theme-accent)] text-[var(--theme-surface)] rounded-full border-2 border-[var(--theme-primary)] text-xs font-black uppercase tracking-wide leading-none transition-colors duration-300">
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
                                                            className="bg-[var(--theme-highlight)] text-[var(--theme-surface)] px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-wide shadow-[3px_3px_0px_var(--theme-primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
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
                                                            className="bg-[var(--theme-primary)] hover:brightness-125 text-[var(--theme-surface)] px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-wide shadow-[3px_3px_0px_var(--theme-primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
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