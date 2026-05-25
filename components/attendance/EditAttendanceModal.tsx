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
            <div className="w-full max-w-lg bg-[#15438D] border-4 border-[#111111] rounded-[36px] p-6 shadow-[8px_8px_0px_#111111] text-[#F3EBD9] relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-3xl md:text-[40px] leading-none font-black uppercase tracking-[-0.04em] text-[#F3EBD9] mb-6 pr-12">Edit Attendance</h2>
            <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#E43427] text-[#F3EBD9] font-black shadow-[3px_3px_0px_#111111] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
                ×
            </button>
            <div className="space-y-5">
                {/* Karyawan */}
                <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} className="w-full bg-[#F3EBD9] rounded-2xl px-5 py-4 text-[#111111] font-black shadow-[4px_4px_0px_#111111] outline-none">
                    <option value="">Pilih Karyawan</option>
                    {employees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                            {employee.name} • {employee.employment_type?.replace('_', ' ')}
                        </option>
                    ))}
                </select>

                {/* Tanggal */}
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-[#F3EBD9] rounded-2xl px-5 py-4 text-[#111111] font-black shadow-[4px_4px_0px_#111111] outline-none" />

                {/* Jam Masuk */}
                <div className="flex gap-3 items-center bg-[#F3EBD9] rounded-2xl px-5 py-4 shadow-[4px_4px_0px_#111111]">
                    <span className="font-black text-[#15438D] text-[11px] uppercase tracking-[0.08em]">Masuk:</span>
                    <input type="time" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="flex-1 bg-transparent text-[#111111] text-lg font-black outline-none" />
                </div>

                {/* Status Kehadiran */}
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-[#F3EBD9] rounded-2xl px-5 py-4 text-[#111111] font-black shadow-[4px_4px_0px_#111111] outline-none">
                    <option value="hadir">Hadir</option>
                    <option value="sakit">Sakit</option>
                    <option value="izin">Izin</option>
                    <option value="alpha">Alpha</option>
                    <option value="libur">Libur</option>
                </select>

                {/* Jam Keluar (Muncul hanya jika hadir) */}
                {status === 'hadir' && (
                    <div className="flex gap-3 items-center bg-[#F3EBD9] rounded-2xl px-5 py-4 shadow-[4px_4px_0px_#111111]">
                        <span className="font-black text-[#15438D] text-[11px] uppercase tracking-[0.08em]">Keluar:</span>
                        <input type="time" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="flex-1 bg-transparent text-[#111111] text-lg font-black outline-none" />
                    </div>
                )}

                {/* Checklist Libur */}
                {status === 'hadir' && (
                    <label className="flex items-center gap-3 font-black uppercase text-sm cursor-pointer bg-[#111111] p-4 rounded-2xl text-[#F3EBD9]">
                        <input type="checkbox" checked={isNationalHoliday} onChange={(e) => setIsNationalHoliday(e.target.checked)} className="w-6 h-6 border-2 border-[#F3EBD9]" />
                        Hari Libur Nasional
                    </label>
                )}

                {/* Total Lembur */}
                <div className="text-sm font-black uppercase bg-[#111111] p-4 rounded-2xl text-[#F3EBD9]">
                    Total Lembur: <span className="text-[#E43427]">{calculateOvertime()} Jam</span>
                </div>

                {selectedEmployeeData && (
                    <div className="bg-[#111111] rounded-[28px] p-5 text-[#F3EBD9] shadow-[5px_5px_0px_#000000] mt-5">
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

            <button onClick={saveAttendance} disabled={loading} className="w-full mt-7 bg-[#E43427] text-[#F3EBD9] py-4 rounded-2xl font-black uppercase tracking-widest shadow-[4px_4px_0px_#111111] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
                {loading ? 'Menyimpan...' : 'Simpan Attendance'}
            </button>
            </div>
        </div>
    )
}