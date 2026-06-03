'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Employee, Attendance } from '@/types'

type Props = {
    employees: Employee[]
    attendances: Attendance[]
    refreshAttendances: () => void
}

function getTargetPayrollInfo(dateStr: string, startDay: number) {
    const parts = dateStr.split('-')
    if (parts.length < 3) return null
    const y = parseInt(parts[0], 10)
    const m = parseInt(parts[1], 10)
    const d = parseInt(parts[2], 10)
    const day = Number(startDay) || 1

    let targetYear = y
    let targetMonth = m
    let startY = y
    let startM = m
    let endY = y
    let endM = m

    if (day === 1) {
        const lastDay = new Date(y, m, 0).getDate()
        return {
            month: `${y}-${String(m).padStart(2, '0')}`,
            start: `${y}-${String(m).padStart(2, '0')}-01`,
            end: `${y}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
        }
    } else {
        if (d >= day) {
            targetMonth = m + 1
            if (targetMonth > 12) {
                targetMonth = 1
                targetYear = y + 1
            }
            startM = m
            startY = y
            
            endM = m + 1
            if (endM > 12) {
                endM = 1
                endY = y + 1
            }
        } else {
            targetMonth = m
            targetYear = y
            
            startM = m - 1
            if (startM < 1) {
                startM = 12
                startY = y - 1
            }
            
            endM = m
            endY = y
        }
        
        return {
            month: `${targetYear}-${String(targetMonth).padStart(2, '0')}`,
            start: `${startY}-${String(startM).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
            end: `${endY}-${String(endM).padStart(2, '0')}-${String(day - 1).padStart(2, '0')}`
        }
    }
}

export default function AttendanceForm({ employees, attendances, refreshAttendances }: Props) {
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [checkIn, setCheckIn] = useState('08:00')
    const [checkOut, setCheckOut] = useState('')
    const [status, setStatus] = useState('hadir')
    const [isNationalHoliday, setIsNationalHoliday] = useState(false)
    const [loading, setLoading] = useState(false)
    const [showAdvanced, setShowAdvanced] = useState(false)

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
        
        let overtimeStartHour = 14
        if (isNationalHoliday) {
            overtimeStartHour = 8
        } else {
            const dayOfWeek = new Date(date).getDay() // 0 = Sunday, 6 = Saturday
            if (dayOfWeek === 6) {
                overtimeStartHour = 15
            }
        }

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

        if (alreadyInputtedSelectedEmployees.length > 0) {
            alert(`Gagal: Terdapat ${alreadyInputtedSelectedEmployees.length} karyawan terpilih yang sudah diabsen pada tanggal ini. Silakan hapus centangnya terlebih dahulu.`)
            setLoading(false)
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
        } else {
            alert(`Gagal menyimpan attendance: ${error.message}`)
        }
        setLoading(false)
    }

    return (
        <div className="bg-[var(--theme-highlight)] border-4 border-[var(--theme-primary)] rounded-[2rem] p-8 shadow-[8px_8px_0px_var(--theme-primary)] text-[var(--theme-surface)] transition-colors duration-300">
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
                        <div className="absolute left-0 right-0 top-full mt-2 bg-[var(--theme-surface)] text-[var(--theme-primary)] brightness-110 border-2 border-[var(--theme-primary)] rounded-2xl shadow-[4px_4px_0px_var(--theme-primary)] overflow-hidden">
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
                        className="w-full block min-w-0 appearance-none bg-[var(--theme-surface)] border-2 border-[var(--theme-primary)] rounded-2xl px-5 py-4 text-[var(--theme-primary)] [color-scheme:light] font-black shadow-[4px_4px_0px_var(--theme-primary)] outline-none transition-all duration-300" 
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
                    {selectedEmployeesData.length > 0 && (
                        <div className="px-4 py-3 bg-[var(--theme-surface)] brightness-105 border-2 border-[var(--theme-primary)] rounded-xl text-xs font-black text-[var(--theme-primary)] shadow-[2px_2px_0px_var(--theme-primary)] space-y-1.5 mt-2">
                            <div className="text-[10px] uppercase tracking-widest text-[var(--theme-highlight)]">Target Alokasi Payroll:</div>
                            <div className="divide-y divide-[var(--theme-primary)] divide-opacity-10 max-h-[120px] overflow-y-auto pr-1">
                                {selectedEmployeesData.map((emp) => {
                                    const info = getTargetPayrollInfo(date, emp.payroll_start_day || 1)
                                    if (!info) return null
                                    
                                    const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"]
                                    const [yStr, mStr] = info.month.split('-')
                                    const displayMonth = `${monthNames[parseInt(mStr, 10) - 1]} ${yStr}`
                                    
                                    const formatDateShort = (dStr: string) => {
                                        const p = dStr.split('-')
                                        if (p.length < 3) return dStr
                                        const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                                        return `${parseInt(p[2], 10)} ${shortMonths[parseInt(p[1], 10) - 1]}`
                                    }
                                    
                                    return (
                                        <div key={emp.id} className="py-1 flex items-center justify-between gap-4 text-[11px]">
                                            <span className="uppercase truncate font-black">{emp.name}</span>
                                            <span className="shrink-0 text-right font-mono font-bold text-[var(--theme-primary)]">
                                                Payroll {displayMonth} <span className="opacity-60">({formatDateShort(info.start)} - {formatDateShort(info.end)})</span>
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Jam Keluar (Muncul kalau Hadir) */}
                {status === 'hadir' && (
                    <div className="flex gap-3 items-center bg-[var(--theme-surface)] rounded-2xl px-5 py-4 shadow-[4px_4px_0px_var(--theme-primary)] transition-colors duration-300">
                        <span className="font-black text-[11px] uppercase tracking-[0.08em] text-[var(--theme-highlight)]">Keluar:</span>
                        <input type="time" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="flex-1 w-full min-w-0 appearance-none bg-transparent text-[var(--theme-primary)] [color-scheme:light] text-lg font-black outline-none" />
                    </div>
                )}

                {/* Tombol Toggle Opsi Lanjutan */}
                <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="w-full text-left outline-none cursor-pointer p-4 bg-[var(--theme-surface)] brightness-110 border-4 border-[var(--theme-primary)] rounded-[20px] flex items-center justify-between font-black uppercase tracking-widest text-[10px] text-[var(--theme-primary)] transition-all duration-300 shadow-[4px_4px_0px_var(--theme-primary)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                >
                    <span>{showAdvanced ? 'Sembunyikan Opsi Lanjutan' : 'Tampilkan Lebih Banyak Opsi'}</span>
                    <span className={`w-6 h-6 rounded-full bg-[var(--theme-primary)] text-[var(--theme-surface)] flex items-center justify-center font-bold text-[10px] transform transition-transform duration-300 ${showAdvanced ? 'rotate-180' : 'rotate-0'}`}>▼</span>
                </button>

                {/* Opsi Lanjutan (Jam Masuk, Status, Checklist Libur, Total Lembur, Rule) */}
                <div className={`grid transition-all duration-300 ease-in-out ${showAdvanced ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'}`}>
                    <div className="overflow-hidden space-y-4">
                        <div className="pt-2 space-y-4">
                            {/* Jam Masuk */}
                            <div className="flex gap-3 items-center bg-[var(--theme-surface)] rounded-2xl px-5 py-4 shadow-[4px_4px_0px_var(--theme-primary)] transition-colors duration-300">
                                <span className="font-black text-[11px] uppercase tracking-[0.08em] text-[var(--theme-highlight)]">Masuk:</span>
                                <input type="time" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="flex-1 w-full min-w-0 appearance-none bg-transparent text-[var(--theme-primary)] [color-scheme:light] text-lg font-black outline-none" />
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
                                    <div className="absolute left-0 right-0 top-full mt-2 bg-[var(--theme-surface)] text-[var(--theme-primary)] brightness-110 border-2 border-[var(--theme-primary)] rounded-2xl shadow-[4px_4px_0px_var(--theme-primary)] overflow-hidden">
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

                            {/* Checklist Libur */}
                            {status === 'hadir' && (
                                <label className="flex items-center gap-3 font-black uppercase text-sm cursor-pointer bg-[var(--theme-primary)] p-4 rounded-2xl text-[var(--theme-surface)] transition-colors duration-300">
                                    <input type="checkbox" checked={isNationalHoliday} onChange={(e) => setIsNationalHoliday(e.target.checked)} className="w-6 h-6 border-2 border-[var(--theme-surface)]" />
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
                        </div>
                    </div>
                </div>

                <button onClick={saveAttendance} disabled={loading} className="w-full mt-7 bg-[var(--theme-accent)] hover:brightness-90 text-[var(--theme-surface)] py-4 rounded-2xl font-black uppercase tracking-widest shadow-[4px_4px_0px_var(--theme-primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-300">
                    {loading ? 'Menyimpan...' : 'Simpan Attendance'}
                </button>
            </div>
        </div>
    )
}