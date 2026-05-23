'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

type Props = {
    employees: any[]
    refreshAttendances: () => void
}

export default function AttendanceForm({ employees, refreshAttendances }: Props) {
    const [selectedEmployee, setSelectedEmployee] = useState('')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [checkIn, setCheckIn] = useState('08:00')
    const [checkOut, setCheckOut] = useState('')
    const [status, setStatus] = useState('hadir')
    const [isNationalHoliday, setIsNationalHoliday] = useState(false)
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

        const employeeIds = [selectedEmployee]
        const { error } = await supabase.from('attendance').insert(
            employeeIds.map((id) => ({
                employee_id: id, work_date: date, check_in: checkIn,
                check_out: status === 'hadir' ? checkOut || null : null,
                status, is_national_holiday: isNationalHoliday,
                overtime_hours: calculateOvertime(),
            }))
        )

        if (!error) {
            alert('Attendance berhasil disimpan 🔥')
            setCheckOut(''); setStatus('hadir'); setIsNationalHoliday(false);
            refreshAttendances()
        }
        setLoading(false)
    }

    return (
        <div className="bg-[#15438D] border-4 border-[#111111] rounded-[2rem] p-8 shadow-[8px_8px_0px_#111111] text-[#F3EBD9] mt-8">
            <h2 className="text-2xl font-black uppercase tracking-widest mb-6">Input Attendance</h2>

            <div className="space-y-4">
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
                    <span className="font-black text-[11px] uppercase tracking-[0.08em] text-[#15438D]">Masuk:</span>
                    <input type="time" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="flex-1 bg-transparent text-[#111111] text-lg font-black outline-none" />
                </div>

                {/* Status */}
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-[#F3EBD9] rounded-2xl px-5 py-4 text-[#111111] font-black shadow-[4px_4px_0px_#111111] outline-none">
                    <option value="hadir">Hadir</option>
                    <option value="sakit">Sakit</option>
                    <option value="izin">Izin</option>
                    <option value="alpha">Alpha</option>
                    <option value="libur">Libur</option>
                </select>

                {/* Jam Keluar (Muncul kalau Hadir) */}
                {status === 'hadir' && (
                    <div className="flex gap-3 items-center bg-[#F3EBD9] rounded-2xl px-5 py-4 shadow-[4px_4px_0px_#111111]">
                        <span className="font-black text-[11px] uppercase tracking-[0.08em] text-[#15438D]">Keluar:</span>
                        <input type="time" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="flex-1 bg-transparent text-[#111111] text-lg font-black outline-none" />
                    </div>
                )}

                {/* Checklist Libur */}
                {status === 'hadir' && (
                    <label className="flex items-center gap-3 font-black uppercase text-sm cursor-pointer bg-[#111111] p-4 rounded-2xl text-[#F3EBD9]">
                        <input type="checkbox" checked={isNationalHoliday} onChange={(e) => setIsNationalHoliday(e.target.checked)} className="w-6 h-6 border-2 border-[#111111]" />
                        Hari Libur Nasional
                    </label>
                )}

                {/* Total Lembur */}
                <div className="text-sm font-black uppercase bg-[#111111] p-4 rounded-2xl text-[#F3EBD9]">
                    Total Lembur: <span className="text-[#E43427]">{calculateOvertime()} Jam</span>
                </div>

                {selectedEmployeeData && (
                    <div className="bg-[#111111] rounded-[28px] p-5 text-[#F3EBD9] shadow-[5px_5px_0px_#000000]">
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

                <button onClick={saveAttendance} disabled={loading} className="w-full mt-7 bg-[#E43427] text-[#F3EBD9] py-4 rounded-2xl font-black uppercase tracking-widest shadow-[4px_4px_0px_#111111] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
                    {loading ? 'Menyimpan...' : 'Simpan Attendance'}
                </button>
            </div>
        </div>
    )
}