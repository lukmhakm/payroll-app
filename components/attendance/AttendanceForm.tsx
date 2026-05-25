'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Employee, Attendance } from '@/types'

type Props = {
    employees: Employee[]
    attendances: Attendance[]
    refreshAttendances: () => void
}

export default function AttendanceForm({ employees, attendances, refreshAttendances }: Props) {
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [checkIn, setCheckIn] = useState('08:00')
    const [checkOut, setCheckOut] = useState('')
    const [status, setStatus] = useState('hadir')
    const [isNationalHoliday, setIsNationalHoliday] = useState(false)
    const [loading, setLoading] = useState(false)

    const selectedEmployeesData = employees.filter(
        (employee) => selectedEmployees.includes(employee.id)
    )

    const uniqueDates = Array.from(new Set(attendances.map(a => a.work_date))).filter(Boolean) as string[]
    const attendancesOnSelectedDate = attendances.filter(a => a.work_date === date)
    const alreadyInputtedSelectedEmployees = selectedEmployees.filter(id => 
        attendancesOnSelectedDate.some(a => a.employee_id === id)
    )

    const recentDates = [...uniqueDates].sort((a, b) => b.localeCompare(a)).slice(0, 4)

    const hasFreelance = selectedEmployeesData.some((employee) => employee.employment_type === 'freelance')

    function calculateOvertime() {
        if (!checkOut || status !== 'hadir') return 0
        const [outHour, outMinute] = checkOut.split(':').map(Number)
        let overtimeStartHour = isNationalHoliday ? 8 : 14
        const overtimeMinutes = (outHour * 60 + outMinute) - (overtimeStartHour * 60)
        return overtimeMinutes <= 0 ? 0 : Number((overtimeMinutes / 60).toFixed(2))
    }

    const toggleEmployee = (id: string) => {
        setSelectedEmployees(prev =>
            prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
        )
    }

    const toggleAllEmployees = () => {
        if (selectedEmployees.length === employees.length) {
            setSelectedEmployees([])
        } else {
            setSelectedEmployees(employees.map(e => e.id))
        }
    }

    async function saveAttendance() {
        if (loading) return
        
        if (selectedEmployees.length === 0) {
            alert('Pilih minimal 1 karyawan')
            return
        }

        setLoading(true)

        const { error } = await supabase.from('attendance').insert(
            selectedEmployees.map((id) => ({
                employee_id: id, work_date: date, 
                check_in: status === 'hadir' ? checkIn : null,
                check_out: status === 'hadir' ? checkOut || null : null,
                status, is_national_holiday: isNationalHoliday,
                overtime_hours: calculateOvertime(),
            }))
        )

        if (!error) {
            alert('Attendance berhasil disimpan 🔥')
            setCheckOut(''); setStatus('hadir'); setIsNationalHoliday(false); setSelectedEmployees([]);
            refreshAttendances()
        }
        setLoading(false)
    }

    return (
        <div className="bg-[var(--theme-highlight)] border-4 border-[var(--theme-primary)] rounded-[2rem] p-8 shadow-[8px_8px_0px_var(--theme-primary)] text-[var(--theme-surface)] mt-8 transition-colors duration-300">
            <h2 className="text-2xl font-black uppercase tracking-widest mb-6">Input Attendance</h2>

            <div className="space-y-4">
                {/* Karyawan */}
                <div className="relative z-50">
                    <details className="w-full bg-[var(--theme-surface)] rounded-2xl text-[var(--theme-primary)] shadow-[4px_4px_0px_var(--theme-primary)] outline-none group border-2 border-[var(--theme-primary)] transition-all duration-300">
                        <summary className="px-5 py-4 cursor-pointer list-none flex justify-between items-center font-black">
                            <span>
                                {selectedEmployees.length === 0 
                                    ? 'Pilih Karyawan' 
                                    : `${selectedEmployees.length} Karyawan Terpilih`}
                            </span>
                            <span className="transform transition-transform group-open:rotate-180">
                                ▼
                            </span>
                        </summary>
                        <div className="absolute left-0 right-0 top-full mt-2 bg-[var(--theme-surface)] brightness-110 border-2 border-[var(--theme-primary)] rounded-2xl shadow-[4px_4px_0px_var(--theme-primary)] overflow-hidden">
                            <div className="max-h-[240px] overflow-y-auto p-2 space-y-1">
                                <label className="flex items-center gap-3 p-3 hover:brightness-95 rounded-xl cursor-pointer transition-colors border-b-2 border-dashed border-[var(--theme-primary)] border-opacity-20">
                                    <input 
                                        type="checkbox" 
                                        checked={employees.length > 0 && selectedEmployees.length === employees.length} 
                                        onChange={toggleAllEmployees} 
                                        className="w-5 h-5 accent-[var(--theme-accent)] cursor-pointer" 
                                    />
                                    <span className="font-black uppercase tracking-wider text-sm">Pilih Semua</span>
                                </label>
                                {employees.map((employee) => (
                                    <label key={employee.id} className="flex items-center gap-3 p-3 hover:brightness-95 rounded-xl cursor-pointer transition-colors">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedEmployees.includes(employee.id)} 
                                            onChange={() => toggleEmployee(employee.id)} 
                                            className="w-5 h-5 accent-[var(--theme-accent)] cursor-pointer" 
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-black uppercase tracking-wider text-sm leading-none mb-1">{employee.name}</span>
                                            <span className="text-[10px] uppercase tracking-widest text-[var(--theme-highlight)] font-black">{employee.employment_type?.replace('_', ' ')}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </details>
                </div>

                {/* Tanggal */}
                <div className="flex flex-col gap-2">
                    <input 
                        type="date" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                        className="w-full bg-[var(--theme-surface)] border-2 border-[var(--theme-primary)] rounded-2xl px-5 py-4 text-[var(--theme-primary)] font-black shadow-[4px_4px_0px_var(--theme-primary)] outline-none transition-all duration-300" 
                    />
                    {recentDates.length > 0 && (
                        <div className="flex flex-col gap-2 mt-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--theme-surface)] opacity-70">Riwayat Terakhir:</span>
                            <div className="grid grid-cols-2 gap-2">
                                {recentDates.map(d => (
                                    <button
                                        key={d}
                                        type="button"
                                        onClick={() => setDate(d)}
                                        className={`px-3 py-2 text-[11px] font-black rounded-xl border-2 border-[var(--theme-primary)] uppercase tracking-wider transition-all duration-300 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${date === d ? 'bg-[var(--theme-primary)] text-[var(--theme-surface)] shadow-none translate-x-[2px] translate-y-[2px]' : 'bg-[var(--theme-surface)] text-[var(--theme-primary)] shadow-[2px_2px_0px_var(--theme-primary)]'}`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {attendancesOnSelectedDate.length > 0 && (
                        <div className="px-4 py-3 bg-[var(--theme-surface)] brightness-110 border-2 border-[var(--theme-primary)] rounded-xl text-xs font-black text-[var(--theme-primary)] shadow-[2px_2px_0px_var(--theme-primary)]">
                            <span className="text-[var(--theme-highlight)]">💡 Info:</span> Sudah ada {attendancesOnSelectedDate.length} data absensi pada tanggal ini.
                            {alreadyInputtedSelectedEmployees.length > 0 && (
                                <div className="text-[var(--theme-accent)] mt-1">⚠️ Peringatan: {alreadyInputtedSelectedEmployees.length} karyawan yang dipilih sudah diabsen!</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Jam Masuk */}
                <div className="flex gap-3 items-center bg-[var(--theme-surface)] rounded-2xl px-5 py-4 shadow-[4px_4px_0px_var(--theme-primary)] transition-colors duration-300">
                    <span className="font-black text-[11px] uppercase tracking-[0.08em] text-[var(--theme-highlight)]">Masuk:</span>
                    <input type="time" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="flex-1 bg-transparent text-[var(--theme-primary)] text-lg font-black outline-none" />
                </div>

                {/* Status */}
                <div className="relative z-40">
                    <details className="w-full bg-[var(--theme-surface)] rounded-2xl text-[var(--theme-primary)] shadow-[4px_4px_0px_var(--theme-primary)] outline-none group border-2 border-[var(--theme-primary)] transition-all duration-300">
                        <summary className="px-5 py-4 cursor-pointer list-none flex justify-between items-center font-black">
                            <span className="uppercase">
                                {status}
                            </span>
                            <span className="transform transition-transform group-open:rotate-180">
                                ▼
                            </span>
                        </summary>
                        <div className="absolute left-0 right-0 top-full mt-2 bg-[var(--theme-surface)] brightness-110 border-2 border-[var(--theme-primary)] rounded-2xl shadow-[4px_4px_0px_var(--theme-primary)] overflow-hidden">
                            <div className="max-h-[240px] overflow-y-auto p-2 space-y-1">
                                {['hadir', 'sakit', 'izin', 'alpha', 'libur'].map((s) => (
                                    <div 
                                        key={s} 
                                        onClick={(e) => {
                                            setStatus(s);
                                            e.currentTarget.closest('details')?.removeAttribute('open');
                                        }} 
                                        className="flex items-center gap-3 p-3 hover:brightness-95 rounded-xl cursor-pointer transition-colors"
                                    >
                                        <span className="font-black uppercase tracking-wider text-sm">{s}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </details>
                </div>

                {/* Jam Keluar (Muncul kalau Hadir) */}
                {status === 'hadir' && (
                    <div className="flex gap-3 items-center bg-[var(--theme-surface)] rounded-2xl px-5 py-4 shadow-[4px_4px_0px_var(--theme-primary)] transition-colors duration-300">
                        <span className="font-black text-[11px] uppercase tracking-[0.08em] text-[var(--theme-highlight)]">Keluar:</span>
                        <input type="time" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="flex-1 bg-transparent text-[var(--theme-primary)] text-lg font-black outline-none" />
                    </div>
                )}

                {/* Checklist Libur */}
                {status === 'hadir' && (
                    <label className="flex items-center gap-3 font-black uppercase text-sm cursor-pointer bg-[var(--theme-primary)] p-4 rounded-2xl text-[var(--theme-surface)] transition-colors duration-300">
                        <input type="checkbox" checked={isNationalHoliday} onChange={(e) => setIsNationalHoliday(e.target.checked)} className="w-6 h-6 border-2 border-[var(--theme-primary)]" />
                        Hari Libur Nasional
                    </label>
                )}

                {/* Total Lembur */}
                <div className="text-sm font-black uppercase bg-[var(--theme-primary)] p-4 rounded-2xl text-[var(--theme-surface)] transition-colors duration-300">
                    Total Lembur: <span className="text-[var(--theme-accent)]">{calculateOvertime()} Jam</span>
                </div>

                {selectedEmployeesData.length > 0 && (
                    <div className="bg-[var(--theme-primary)] rounded-[28px] p-5 text-[var(--theme-surface)] shadow-[5px_5px_0px_var(--theme-primary)] transition-colors duration-300">
                        <div className="text-[11px] uppercase tracking-[0.12em] font-black opacity-70 mb-3">
                            Payroll Rule
                        </div>

                        <div className="text-sm font-black leading-relaxed uppercase">
                            {hasFreelance
                                ? 'Freelance dihitung berdasarkan jumlah hari hadir.'
                                : 'Jika tidak ada attendance maka dianggap hadir tanpa lembur.'}
                        </div>
                    </div>
                )}

                <button onClick={saveAttendance} disabled={loading} className="w-full mt-7 bg-[var(--theme-accent)] hover:brightness-90 text-[var(--theme-surface)] py-4 rounded-2xl font-black uppercase tracking-widest shadow-[4px_4px_0px_var(--theme-primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-300">
                    {loading ? 'Menyimpan...' : 'Simpan Attendance'}
                </button>
            </div>
        </div>
    )
}