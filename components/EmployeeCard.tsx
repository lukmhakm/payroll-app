'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function EmployeeCard({ employee, deleteEmployee, refreshEmployees }: any) {
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    
    const [formData, setFormData] = useState({
        name: employee.name, position: employee.position, salary: employee.base_salary,
        overtimeRate: employee.overtime_rate, bankName: employee.bank_name || '',
        bankAccountNumber: employee.bank_account_number || '', bankAccountName: employee.bank_account_name || '',
        email: employee.email || '', employmentType: employee.employment_type || 'tetap',
        payrollStartDay: employee.payroll_start_day || 1,
        dailyDeduction: employee.daily_deduction || 0
    })

    const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value })

    useEffect(() => {
        setFormData({
            name: employee.name,
            position: employee.position,
            salary: employee.base_salary,
            overtimeRate: employee.overtime_rate,
            bankName: employee.bank_name || '',
            bankAccountNumber: employee.bank_account_number || '',
            bankAccountName: employee.bank_account_name || '',
            email: employee.email || '',
            employmentType: employee.employment_type || 'tetap',
            payrollStartDay: employee.payroll_start_day || 1,
            dailyDeduction: employee.daily_deduction || 0,
        })
    }, [employee])

    async function saveEmployee() {
        setLoading(true)
        await supabase.from('employees').update({
            name: formData.name, position: formData.position, email: formData.email,
            employment_type: formData.employmentType, base_salary: Number(formData.salary),
            overtime_rate: Number(formData.overtimeRate), bank_name: formData.bankName,
            bank_account_number: formData.bankAccountNumber, bank_account_name: formData.bankAccountName,
            payroll_start_day: Number(formData.payrollStartDay),
            daily_deduction: Number(formData.dailyDeduction),
        }).eq('id', employee.id)
        setIsEditing(false); setLoading(false); refreshEmployees();
    }

    return (
        <div className="bg-[#F3EBD9] border-4 border-[#111111] rounded-[32px] p-7 mb-6 shadow-[8px_8px_0px_#111111]">
            {isEditing ? (
                <div className="flex flex-col gap-3">
                    <input name="name" value={formData.name} onChange={handleChange} className="bg-white border-4 border-[#111111] px-4 py-4 rounded-2xl text-[#111111] text-sm font-black outline-none shadow-[4px_4px_0px_#111111]" />
                    <input name="position" value={formData.position} onChange={handleChange} className="bg-white border-4 border-[#111111] px-4 py-4 rounded-2xl text-[#111111] text-sm font-black outline-none shadow-[4px_4px_0px_#111111]" />
                    <div className="flex flex-col gap-3 text-xs">
                        <input name="salary" type="number" value={formData.salary} onChange={handleChange} className="bg-white border-4 border-[#111111] px-4 py-4 rounded-2xl text-[#111111] text-sm font-black outline-none shadow-[4px_4px_0px_#111111]" placeholder="Gaji Pokok" />
                        <input name="overtimeRate" type="number" value={formData.overtimeRate} onChange={handleChange} className="bg-white border-4 border-[#111111] px-4 py-4 rounded-2xl text-[#111111] text-sm font-black outline-none shadow-[4px_4px_0px_#111111]" placeholder="Lembur Per Jam" />
                        <input name="bankName" value={formData.bankName} onChange={handleChange} className="bg-white border-4 border-[#111111] px-4 py-4 rounded-2xl text-[#111111] text-sm font-black outline-none shadow-[4px_4px_0px_#111111]" placeholder="Bank" />
                        <input name="bankAccountNumber" value={formData.bankAccountNumber} onChange={handleChange} className="bg-white border-4 border-[#111111] px-4 py-4 rounded-2xl text-[#111111] text-sm font-black outline-none shadow-[4px_4px_0px_#111111]" placeholder="No Rek" />
                        <input name="bankAccountName" value={formData.bankAccountName} onChange={handleChange} className="bg-white border-4 border-[#111111] px-4 py-4 rounded-2xl text-[#111111] text-sm font-black outline-none shadow-[4px_4px_0px_#111111]" placeholder="Atas Nama" />
                        <input name="email" value={formData.email} onChange={handleChange} className="bg-white border-4 border-[#111111] px-4 py-4 rounded-2xl text-[#111111] text-sm font-black outline-none shadow-[4px_4px_0px_#111111]" placeholder="Email" />
                        <select
                            name="employmentType"
                            value={formData.employmentType}
                            onChange={handleChange}
                            className="bg-white border-4 border-[#111111] px-4 py-4 rounded-2xl text-[#111111] text-sm font-black outline-none shadow-[4px_4px_0px_#111111]"
                        >
                            <option value="tetap">KARYAWAN TETAP</option>
                            <option value="tidak_tetap">KARYAWAN TIDAK TETAP</option>
                            <option value="freelance">FREELANCE</option>
                        </select>
                        <input
                            name="payrollStartDay"
                            type="number"
                            value={formData.payrollStartDay}
                            onChange={handleChange}
                            className="bg-white border-4 border-[#111111] px-4 py-4 rounded-2xl text-[#111111] text-sm font-black outline-none shadow-[4px_4px_0px_#111111]"
                            placeholder="Payroll Mulai Tanggal"
                        />
                        <input
                            name="dailyDeduction"
                            type="number"
                            value={formData.dailyDeduction}
                            onChange={handleChange}
                            className="bg-white border-4 border-[#111111] px-4 py-4 rounded-2xl text-[#111111] text-sm font-black outline-none shadow-[4px_4px_0px_#111111]"
                            placeholder="Potongan Per Hari"
                        />
                    </div>
                    <div className="flex gap-3 mt-2">

                        <button
                            onClick={() => {
                                setFormData({
                                    name: employee.name,
                                    position: employee.position,
                                    salary: employee.base_salary,
                                    overtimeRate: employee.overtime_rate,
                                    bankName: employee.bank_name || '',
                                    bankAccountNumber: employee.bank_account_number || '',
                                    bankAccountName: employee.bank_account_name || '',
                                    email: employee.email || '',
                                    employmentType: employee.employment_type || 'tetap',
                                    payrollStartDay: employee.payroll_start_day || 1,
                                    dailyDeduction: employee.daily_deduction || 0,
                                })

                                setIsEditing(false)
                            }}
                            className="flex-1 bg-[#111111] text-[#F3EBD9] py-4 font-black uppercase rounded-2xl text-base shadow-[4px_4px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                        >
                            Batal
                        </button>

                        <button
                            onClick={saveEmployee}
                            className="flex-1 bg-[#15438D] text-[#F3EBD9] py-4 font-black uppercase rounded-2xl text-base border-4 border-[#111111] shadow-[4px_4px_0px_#111111] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                        >
                            {loading ? '...' : 'Simpan Semua'}
                        </button>

                    </div>
                </div>
            ) : (
                <div>

                    <div className="flex items-start justify-between gap-4 mb-7">

                        <div className="min-w-0 flex-1">
                            <h4 className="text-4xl font-black uppercase tracking-tight text-[#111111] leading-none break-words">
                                {formData.name}
                            </h4>

                            <p className="text-[#E43427] text-base mt-3 font-black uppercase tracking-[0.08em] leading-none">
                                {formData.position}
                            </p>
                        </div>

                        <div className="bg-[#111111] text-[#F3EBD9] px-4 py-3 rounded-[22px] shadow-[4px_4px_0px_#15438D] shrink-0">
                            <div className="text-[10px] uppercase tracking-[0.12em] font-black opacity-70 mb-1">
                                Type
                            </div>

                            <div className="text-sm font-black uppercase leading-none">
                                {formData.employmentType}
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#15438D] text-[#F3EBD9] border-4 border-[#111111] rounded-[28px] p-6 shadow-[6px_6px_0px_#111111] mb-6">
                        <div className="text-xs mb-3 font-black uppercase tracking-[0.12em] opacity-80">
                            {formData.employmentType === 'freelance'
                                ? 'Daily Salary'
                                : 'Monthly Salary'}
                        </div>

                        <div className="text-5xl font-black leading-none break-words tracking-tight">
                            Rp {Number(formData.salary).toLocaleString()}
                        </div>

                        <div className="text-xs font-black uppercase tracking-[0.12em] opacity-70 mt-3">
                            {formData.employmentType === 'freelance'
                                ? 'Dibayar per hari hadir'
                                : 'Gaji bulanan'}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-5 gap-y-5">

                        <div className="border-b-4 border-[#111111] pb-4">
                            <div className="text-[#15438D] text-[11px] mb-2 font-black uppercase tracking-[0.08em]">
                                Lembur / Jam
                            </div>

                            <div className="text-[#111111] text-xl font-black leading-tight break-words">
                                Rp {Number(formData.overtimeRate).toLocaleString()}
                            </div>
                        </div>

                        <div className="border-b-4 border-[#111111] pb-4">
                            <div className="text-[#15438D] text-[11px] mb-2 font-black uppercase tracking-[0.08em]">
                                {formData.employmentType === 'freelance'
                                    ? 'Payroll Type'
                                    : 'Potongan / Hari'}
                            </div>

                            <div className="text-[#111111] text-xl font-black leading-tight break-words">
                                {formData.employmentType === 'freelance'
                                    ? 'PER HARI HADIR'
                                    : `Rp ${Number(formData.dailyDeduction).toLocaleString()}`}
                            </div>
                        </div>

                        <div className="col-span-2 bg-[#111111] rounded-[28px] p-5 text-[#F3EBD9] shadow-[5px_5px_0px_#15438D]">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <div className="text-[11px] uppercase tracking-[0.12em] font-black opacity-70 mb-2">
                                        Contact
                                    </div>

                                    <div className="text-lg font-black break-all leading-tight">
                                        {formData.email || '-'}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-[#F3EBD9]/20">

                                <div>
                                    <div className="text-[10px] uppercase tracking-[0.12em] font-black opacity-60 mb-2">
                                        Bank
                                    </div>

                                    <div className="text-base font-black break-all leading-tight">
                                        {formData.bankName || '-'}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-[10px] uppercase tracking-[0.12em] font-black opacity-60 mb-2">
                                        No Rekening
                                    </div>

                                    <div className="text-base font-black break-all leading-tight">
                                        {formData.bankAccountNumber || '-'}
                                    </div>
                                </div>

                                <div className="col-span-2">
                                    <div className="text-[10px] uppercase tracking-[0.12em] font-black opacity-60 mb-2">
                                        Atas Nama
                                    </div>

                                    <div className="text-base font-black break-all leading-tight">
                                        {formData.bankAccountName || '-'}
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>

                    <div className="flex gap-3 mt-6">

                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex-1 bg-[#15438D] text-[#F3EBD9] py-4 rounded-2xl text-lg font-black uppercase shadow-[4px_4px_0px_#111111] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                        >
                            Edit
                        </button>

                        <button
                            onClick={() => deleteEmployee(employee.id)}
                            className="flex-1 bg-[#E43427] text-[#F3EBD9] py-4 rounded-2xl text-lg font-black uppercase shadow-[4px_4px_0px_#111111] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                        >
                            Hapus
                        </button>

                    </div>

                </div>
            )}
        </div>
    )
}