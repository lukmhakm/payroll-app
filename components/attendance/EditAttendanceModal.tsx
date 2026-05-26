'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

type Props = {
    attendance: any
    employees: any[]
    onClose: () => void
    refreshAttendances: () => void
}

export default function EditAttendanceModal({ attendance, employees, onClose, refreshAttendances }: Props) {
    const [selectedEmployee, setSelectedEmployee] = useState(attendance.employee_id || '')
    const [date, setDate] = useState(attendance.work_date || new Date().toISOString().split('T')[0])
    const [checkIn, setCheckIn] = useState(attendance.check_in || '08:00')
    const [checkOut, setCheckOut] = useState(attendance.check_out || '')
    const [status, setStatus] = useState(attendance.status || 'hadir')
    const [isNationalHoliday, setIsNationalHoliday] = useState(attendance.is_national_holiday || false)
    const [loading, setLoading] = useState(false)

    const selectedEmployeeData = employees.find(
        (employee) => employee.id === selectedEmployee
    )

    const isFreelance = selectedEmployeeData?.employment_type === 'freelance'

    function calculateOvertime() {
        if (!checkOut || status !== 'hadir') return 0
        const [outHour, outMinute] = checkOut.split(':').map(Number)
        let overtimeStartHour = isNationalHoliday ? 8 : 14
        const overtimeMinutes = (outHour * 60 + outMinute) - (overtimeStartHour * 60)
        return overtimeMinutes <= 0 ? 0 : Number((overtimeMinutes / 60).toFixed(2))
    }

    async function saveAttendance() {
        if (loading) return

        setLoading(true)

        const { error } = await supabase
            .from('attendance')
            .update({
                employee_id: selectedEmployee,
                work_date: date,
                check_in: status === 'hadir' ? checkIn : null,
                check_out: status === 'hadir' ? checkOut || null : null,
                status,
                is_national_holiday: isNationalHoliday,
                overtime_hours: calculateOvertime(),
            })
            .eq('id', attendance.id)

        if (!error) {
            alert('Attendance berhasil diupdate 🔥')
            refreshAttendances()
            onClose()
        }

        setLoading(false)
    }

    return (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-[var(--theme-highlight)] border-4 border-[var(--theme-primary)] rounded-[36px] p-6 shadow-[8px_8px_0px_var(--theme-primary)] text-[var(--theme-surface)] relative max-h-[90vh] overflow-y-auto transition-colors duration-300">
            <h2 className="text-3xl md:text-[40px] leading-none font-black uppercase tracking-[-0.04em] text-[var(--theme-surface)] mb-6 pr-12 transition-colors duration-300">Edit Attendance</h2>
            <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[var(--theme-accent)] hover:brightness-90 text-[var(--theme-surface)] font-black shadow-[3px_3px_0px_var(--theme-primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-300"
            >
                ×
            </button>
            <div className="space-y-5">
                {/* Karyawan */}
                <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} className="w-full bg-[var(--theme-surface)] rounded-2xl px-5 py-4 text-[var(--theme-primary)] [color-scheme:light] font-black shadow-[4px_4px_0px_var(--theme-primary)] outline-none transition-colors duration-300">
                    <option value="">Pilih Karyawan</option>
                    {employees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                            {employee.name} • {employee.employment_type?.replace('_', ' ')}
                        </option>
                    ))}
                </select>

                {/* Tanggal */}
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full block min-w-0 appearance-none bg-[var(--theme-surface)] rounded-2xl px-5 py-4 text-[var(--theme-primary)] [color-scheme:light] font-black shadow-[4px_4px_0px_var(--theme-primary)] outline-none transition-colors duration-300" />

                {/* Jam Masuk */}
                <div className="flex gap-3 items-center bg-[var(--theme-surface)] rounded-2xl px-5 py-4 shadow-[4px_4px_0px_var(--theme-primary)] transition-colors duration-300">
                    <span className="font-black text-[var(--theme-highlight)] text-[11px] uppercase tracking-[0.08em]">Masuk:</span>
                    <input type="time" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="flex-1 w-full min-w-0 appearance-none bg-transparent text-[var(--theme-primary)] [color-scheme:light] text-lg font-black outline-none" />
                </div>

                {/* Status Kehadiran */}
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-[var(--theme-surface)] rounded-2xl px-5 py-4 text-[var(--theme-primary)] [color-scheme:light] font-black shadow-[4px_4px_0px_var(--theme-primary)] outline-none transition-colors duration-300">
                    <option value="hadir">Hadir</option>
                    <option value="sakit">Sakit</option>
                    <option value="izin">Izin</option>
                    <option value="alpha">Alpha</option>
                    <option value="libur">Libur</option>
                </select>

                {/* Jam Keluar (Muncul hanya jika hadir) */}
                {status === 'hadir' && (
                    <div className="flex gap-3 items-center bg-[var(--theme-surface)] rounded-2xl px-5 py-4 shadow-[4px_4px_0px_var(--theme-primary)] transition-colors duration-300">
                        <span className="font-black text-[var(--theme-highlight)] text-[11px] uppercase tracking-[0.08em]">Keluar:</span>
                        <input type="time" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="flex-1 w-full min-w-0 appearance-none bg-transparent text-[var(--theme-primary)] [color-scheme:light] text-lg font-black outline-none" />
                    </div>
                )}

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

                {selectedEmployeeData && (
                    <div className="bg-[var(--theme-primary)] rounded-[28px] p-5 text-[var(--theme-surface)] shadow-[5px_5px_0px_var(--theme-primary)] mt-5 transition-colors duration-300">
                        <div className="text-[11px] uppercase tracking-[0.12em] font-black opacity-70 mb-3">
                            Payroll Rule
                        </div>

                        <div className="text-sm font-black leading-relaxed uppercase">
                            {isFreelance
                                ? 'Freelance dihitung berdasarkan jumlah hari hadir.'
                                : 'Jika tidak ada attendance maka dianggap hadir tanpa lembur.'}
                        </div>
                    </div>
                )}
            </div>

            <button onClick={saveAttendance} disabled={loading} className="w-full mt-7 bg-[var(--theme-accent)] hover:brightness-90 text-[var(--theme-surface)] py-4 rounded-2xl font-black uppercase tracking-widest shadow-[4px_4px_0px_var(--theme-primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-300">
                {loading ? 'Menyimpan...' : 'Simpan Attendance'}
            </button>
            </div>
        </div>
    )
}