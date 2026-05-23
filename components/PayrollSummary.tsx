'use client'

import { supabase } from '@/lib/supabase'
import { useState } from 'react'

type Props = {
    employees: any[]
    attendances: any[]
    selectedMonth: string
    onGenerateSlip: any
}

export default function PayrollSummary({
    employees,
    attendances,
    selectedMonth,
    onGenerateSlip,
}: Props) {

    const [adjustments, setAdjustments] = useState<any>({})

    function getPayrollPeriod(selectedMonth: string, payrollStartDay: number | string) {
        const [year, month] = selectedMonth.split('-').map(Number)
        payrollStartDay = Number(payrollStartDay || 1)

        if (payrollStartDay === 1) {
            const startDate = new Date(year, month - 1, 1)
            const endDate = new Date(year, month, 0)

            return { startDate, endDate }
        }

        const startDate = new Date(year, month - 2, payrollStartDay)
        const endDate = new Date(year, month - 1, payrollStartDay - 1)

        return { startDate, endDate }
    }

    function getPayrollAttendances(employee: any) {
        if (employee.employment_type === 'freelance') {
            return attendances.filter((attendance) => {
                if (String(attendance.employee_id) !== String(employee.id)) return false

                const workDate = String(attendance.work_date).slice(0, 7)

                return workDate === selectedMonth
            })
        }

        const { startDate, endDate } = getPayrollPeriod(
            selectedMonth,
            employee.payroll_start_day || 1
        )

        const start = startDate.toISOString().slice(0, 10)
        const end = endDate.toISOString().slice(0, 10)

        return attendances.filter((attendance) => {
            if (String(attendance.employee_id) !== String(employee.id)) return false

            const workDate = String(attendance.work_date).slice(0, 10)

            return workDate >= start && workDate <= end
        })
    }

    function calculatePayroll(employee: any) {
        const employeeAttendances = getPayrollAttendances(employee)
        const totalOvertimeHours = employeeAttendances.reduce((total, attendance) => total + Number(attendance.overtime_hours || 0), 0)
        const totalOvertimePay = totalOvertimeHours * employee.overtime_rate
        const izinCount = employeeAttendances.filter((attendance) => attendance.status === 'izin').length
        const alphaCount = employeeAttendances.filter((attendance) => attendance.status === 'alpha').length
        const absentDays = izinCount + alphaCount

        const dailyDeduction = Number(employee.daily_deduction || 0)

        let totalDeduction = absentDays * dailyDeduction
        let finalSalary = employee.base_salary + totalOvertimePay - totalDeduction

        const hadirAttendances = employeeAttendances.filter(
            (attendance) =>
                attendance.status !== 'izin' &&
                attendance.status !== 'alpha'
        )

        const hadirCount = hadirAttendances.length
        console.log('FREELANCE ATTENDANCES:', employee.name, hadirAttendances)
        console.log('FREELANCE HADIR COUNT:', employee.name, hadirCount)

        if (employee.employment_type === 'freelance') {
            const dailyRate = Number(employee.base_salary || 0)

            finalSalary = (hadirCount * dailyRate) + totalOvertimePay
            totalDeduction = 0
        }

        return {
            totalOvertimeHours,
            totalOvertimePay,
            absentDays,
            totalDeduction,
            finalSalary,
            izinCount,
            alphaCount,
            dailyDeduction,
            hadirCount,
        }
    }

    async function closePayroll() {
        const confirmed = confirm(`Close payroll ${selectedMonth}?`)
        if (!confirmed) return

        const { data: existingPayroll } = await supabase
            .from('payroll_history')
            .select('id')
            .eq('payroll_month', selectedMonth)
            .eq('status', 'finalized')
            .limit(1)

        if (existingPayroll && existingPayroll.length > 0) {
            alert('Payroll bulan ini sudah difinalize')
            return
        }

        for (const employee of employees) {
            const payroll = calculatePayroll(employee)
            const employeeAdjustment = adjustments[employee.id] || { bonus: 0, deduction: 0 }
            const { startDate, endDate } = getPayrollPeriod(selectedMonth, employee.payroll_start_day || 1)

            await supabase.from('payroll_history').insert({
                employee_id: employee.id,
                employee_name: employee.name,
                employee_position: employee.position,
                bank_name: employee.bank_name,
                bank_account_number: employee.bank_account_number,
                bank_account_name: employee.bank_account_name,
                payroll_period_start: startDate.toISOString().slice(0, 10),
                payroll_period_end: endDate.toISOString().slice(0, 10),
                payroll_month: selectedMonth,
                base_salary: employee.base_salary,
                overtime_pay: payroll.totalOvertimePay,
                bonus: Number(employeeAdjustment.bonus || 0),
                deduction: (payroll.totalDeduction || 0) + Number(employeeAdjustment.deduction || 0),
                final_salary: payroll.finalSalary + Number(employeeAdjustment.bonus || 0) - Number(employeeAdjustment.deduction || 0),
                status: 'finalized',
            })
        }

        alert('Payroll berhasil di-close')
    }

        return (
        <div className="mt-4 space-y-6">
            {/* Teks di luar card: Retro Red */}
            <h2 className="text-3xl md:text-[42px] font-black uppercase tracking-[-0.04em] leading-none text-[#E43427] mb-4 px-1">
                Payroll Summary
            </h2>

            <div className="space-y-6 md:space-y-8">
                {employees.map((employee) => {
                    const payroll = calculatePayroll(employee)
                    const employeeAdjustment = adjustments[employee.id] || {
                        bonus: 0,
                        deduction: 0,
                        note: '',
                    }
                    const finalSalary = payroll.finalSalary + Number(employeeAdjustment.bonus || 0) - Number(employeeAdjustment.deduction || 0)

                    const initials = employee.name.substring(0, 1).toUpperCase();

                    return (
                        // Card BG: Retro Red dengan border Ink Black & solid shadow ala pop-art
                        <div key={employee.id} className="bg-[#E43427] rounded-3xl border-4 border-[#111111] overflow-hidden shadow-[8px_8px_0px_#111111] relative group transition-all">
                            
                            {/* Header Card */}
                            <div className="p-6 md:p-8 flex items-center justify-between border-b-4 border-[#111111] bg-[#E43427]">
                                <div className="flex items-center gap-4 relative z-10 min-w-0 flex-1 pr-4">
                                    {/* Avatar: Cobalt Blue */}
                                    <div className="w-12 h-12 rounded-full bg-[#15438D] text-[#F3EBD9] flex items-center justify-center text-xl font-black border-2 border-[#111111] shadow-[2px_2px_0px_#111111]">
                                        {initials}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        {/* Text dalam card: Warm Cream */}
                                        <h3 className="text-xl md:text-2xl font-black text-[#F3EBD9] uppercase tracking-tight">{employee.name}</h3>
                                        <div className="inline-flex flex-col items-start max-w-full mt-1 px-3 py-2 bg-[#111111] text-[#F3EBD9] rounded-md border-2 border-[#111111] overflow-hidden leading-none">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.12em] truncate max-w-full">
                                                {employee.position}
                                            </span>

                                            <span className="text-[9px] font-black uppercase tracking-[0.16em] opacity-70 mt-1 truncate max-w-full">
                                                {employee.employment_type?.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right relative z-10 flex flex-col justify-between h-full">
                                    <div className="text-xs font-black text-[#111111] uppercase tracking-widest">Final Salary</div>

                                    {/* Text Gaji: Warm Cream */}
                                    <div className="text-2xl md:text-3xl font-black text-[#F3EBD9] tracking-tighter tabular-nums leading-none flex items-end justify-end gap-1 mt-4">
                                        <span className="text-sm md:text-base leading-none opacity-80 pb-[2px]">Rp</span>
                                        <span className="leading-none">{Math.round(finalSalary).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payroll Details Body */}
                            <div className="p-6 md:p-8 space-y-8 relative z-10">
                                
                                {/* Inner Box: Ink Black agar kontras dengan merah */}
                                <div className="bg-[#111111] rounded-2xl p-5 md:p-6 border-4 border-[#111111] shadow-[6px_6px_0px_#15438D]">
                                    <h4 className="text-sm font-black text-[#F3EBD9] mb-5 uppercase tracking-widest px-1">Payroll Details</h4>
                                    
                                    <div className="space-y-4 text-[#F3EBD9]">
                                        {/* Row Bank */}
                                        <div className="flex items-center justify-between border-b-2 border-[#F3EBD9]/10 pb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-md bg-[#15438D] text-[#F3EBD9] flex items-center justify-center border-2 border-[#111111]">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                                </div>
                                                <span className="text-sm font-bold uppercase tracking-wider">Bank</span>
                                            </div>
                                            <span className="text-sm font-black">{employee.bank_name || '-'}</span>
                                        </div>

                                        {/* Row No Rekening */}
                                        <div className="flex items-center justify-between border-b-2 border-[#F3EBD9]/10 pb-3">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-bold uppercase tracking-wider pl-11">No Rekening</span>
                                            </div>
                                            <span className="text-sm font-black">{employee.bank_account_number || '-'}</span>
                                        </div>

                                        {/* Row Atas Nama */}
                                        <div className="flex items-center justify-between border-b-2 border-[#F3EBD9]/10 pb-3">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-bold uppercase tracking-wider pl-11">Atas Nama</span>
                                            </div>
                                            <span className="text-sm font-black">{employee.bank_account_name || '-'}</span>
                                        </div>

                                        {/* Divider Periode */}
                                        <div className="flex items-center justify-between mt-6 pt-4 border-t-4 border-[#F3EBD9]/10">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-bold uppercase tracking-wider">Periode</span>
                                            </div>
                                            <span className="text-sm font-black tabular-nums">{selectedMonth}</span>
                                        </div>
                                        
                                        {/* Row Daily Salary / Overtime */}
                                        <div className="flex items-center justify-between border-b-2 border-[#F3EBD9]/10 pb-3 mt-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-md bg-[#F3EBD9] text-[#E43427] flex items-center justify-center border-2 border-[#111111]">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                                                </div>

                                                <span className="text-sm font-bold uppercase tracking-wider">
                                                    {employee.employment_type === 'freelance'
                                                        ? 'Daily Salary'
                                                        : 'Total Lembur'}
                                                </span>
                                            </div>

                                            <span className="text-sm font-black tabular-nums">
                                                {employee.employment_type === 'freelance'
                                                    ? `Rp ${Math.round(Number(employee.base_salary || 0)).toLocaleString()} × ${payroll.hadirCount} hari`
                                                    : `Rp ${Math.round(payroll.totalOvertimePay).toLocaleString()}`}
                                            </span>
                                        </div>

                                        {employee.employment_type === 'freelance' && (
                                            <div className="flex items-center justify-between border-b-2 border-[#F3EBD9]/10 pb-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-bold uppercase tracking-wider pl-11">
                                                        Total Lembur
                                                    </span>
                                                </div>

                                                <span className="text-sm font-black tabular-nums">
                                                    Rp {Math.round(payroll.totalOvertimePay).toLocaleString()}
                                                </span>
                                            </div>
                                        )}

                                        {/* Row Izin/Alpha */}
                                        {employee.employment_type !== 'freelance' && (
                                            <div className="flex items-center justify-between border-b-2 border-[#F3EBD9]/10 pb-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-bold uppercase tracking-wider pl-11">Izin + Alpha</span>
                                                </div>
                                                <span className="text-sm font-black tabular-nums">{payroll.absentDays} hari</span>
                                            </div>
                                        )}

                                        {/* Row Potongan */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-md bg-[#E43427] text-[#F3EBD9] flex items-center justify-center border-2 border-[#111111]">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" /></svg>
                                                </div>
                                                <span className="text-sm font-bold uppercase tracking-wider">
                                                    {employee.employment_type === 'freelance'
                                                        ? 'Hari Kerja'
                                                        : 'Total Potongan'}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-black tabular-nums block">
                                                    {employee.employment_type === 'freelance'
                                                        ? `${payroll.hadirCount} hari`
                                                        : `- Rp ${Math.round(payroll.totalDeduction).toLocaleString()}`}
                                                </span>

                                                {employee.employment_type === 'freelance' && (
                                                    <span className="text-[10px] uppercase tracking-wider opacity-70 block mt-1">
                                                        Attendance: {getPayrollAttendances(employee).length}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Others (Inputs) - Warm Cream box inside the Red Card */}
                                <div className="bg-[#F3EBD9] rounded-2xl p-5 md:p-6 border-4 border-[#111111] shadow-[6px_6px_0px_#111111] relative">
                                    <h4 className="text-sm font-black text-[#E43427] mb-5 uppercase tracking-widest px-1">Others</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[11px] font-black text-[#111111] mb-2 px-1 uppercase tracking-wider">Bonus</label>
                                            <input
                                                type="number"
                                                value={employeeAdjustment.bonus || ''}
                                                placeholder="0"
                                                onChange={(e) => setAdjustments({
                                                    ...adjustments,
                                                    [employee.id]: { ...employeeAdjustment, bonus: e.target.value }
                                                })}
                                                className="w-full bg-transparent border-b-4 border-[#111111] px-0 py-2 text-[#15438D] text-lg font-black focus:outline-none focus:border-[#E43427] transition-colors placeholder:text-[#111111]/30 tabular-nums"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-black text-[#111111] mb-2 px-1 uppercase tracking-wider">Potongan Ekstra</label>
                                            <input
                                                type="number"
                                                value={employeeAdjustment.deduction || ''}
                                                placeholder="0"
                                                onChange={(e) => setAdjustments({
                                                    ...adjustments,
                                                    [employee.id]: { ...employeeAdjustment, deduction: e.target.value }
                                                })}
                                                className="w-full bg-transparent border-b-4 border-[#111111] px-0 py-2 text-[#E43427] text-lg font-black focus:outline-none focus:border-[#15438D] transition-colors placeholder:text-[#111111]/30 tabular-nums"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Action Button: Cobalt Blue */}
                                <button
                                    onClick={() => {
                                        const confirmed = confirm(`Generate slip gaji untuk ${employee.name}?`)
                                        if (!confirmed) return
                                        onGenerateSlip({
                                            employee,
                                            payroll: {
                                                baseSalary: employee.base_salary,
                                                totalOvertimePay: payroll.totalOvertimePay,
                                                bonus: Number(employeeAdjustment.bonus) || 0,
                                                deduction: (payroll.totalDeduction || 0) + (Number(employeeAdjustment.deduction) || 0),
                                                finalSalary: finalSalary,
                                                hadirCount: payroll.hadirCount,
                                            },
                                        })
                                    }}
                                    className="w-full bg-[#15438D] hover:bg-[#111111] text-[#F3EBD9] px-5 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 border-4 border-[#111111] shadow-[6px_6px_0px_#111111] active:translate-y-[4px] active:shadow-[2px_2px_0px_#111111] transition-all"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    Generate Slip
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Finalize Button */}
            {employees.length > 0 && (
                <div className="pt-8 mt-8 border-t-4 border-[#111111]">
                    <button
                        onClick={closePayroll}
                        className="w-full bg-[#111111] hover:bg-[#E43427] text-[#F3EBD9] py-5 rounded-2xl font-black text-sm uppercase tracking-widest border-4 border-[#111111] shadow-[6px_6px_0px_#111111] active:translate-y-[4px] active:shadow-[2px_2px_0px_#111111] transition-all"
                    >
                        Finalize All Payroll
                    </button>
                </div>
            )}
        </div>
    )
}