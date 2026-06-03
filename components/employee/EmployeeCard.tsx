'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Employee } from '@/types'

interface Props {
    employee: Employee
    deleteEmployee: (id: string) => void
    refreshEmployees: () => void
}

export default function EmployeeCard({ employee, deleteEmployee, refreshEmployees }: Props) {
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isContactExpanded, setIsContactExpanded] = useState(false)
    
    const [formData, setFormData] = useState({
        name: employee.name, position: employee.position, salary: employee.base_salary,
        overtimeRate: employee.overtime_rate, bankName: employee.bank_name || '',
        bankAccountNumber: employee.bank_account_number || '', bankAccountName: employee.bank_account_name || '',
        email: employee.email || '', employmentType: employee.employment_type || 'fulltime',
        payrollStartDay: employee.payroll_start_day || 1,
        dailyDeduction: employee.daily_deduction || 0
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setFormData({ ...formData, [e.target.name]: e.target.value })

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
            employmentType: employee.employment_type || 'fulltime',
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
        <div className="bg-[var(--theme-surface)] border-4 border-[var(--theme-primary)] rounded-[32px] p-7 mb-6 shadow-[8px_8px_0px_var(--theme-primary)] transition-colors duration-300">
            {isEditing ? (
                <div className="flex flex-col gap-3">
                    <input name="name" value={formData.name} onChange={handleChange} className="bg-[var(--theme-surface)] brightness-110 border-4 border-[var(--theme-primary)] px-4 py-4 rounded-2xl text-[var(--theme-primary)] text-sm font-black outline-none shadow-[4px_4px_0px_var(--theme-primary)] transition-colors duration-300" />
                    <input name="position" value={formData.position} onChange={handleChange} className="bg-[var(--theme-surface)] brightness-110 border-4 border-[var(--theme-primary)] px-4 py-4 rounded-2xl text-[var(--theme-primary)] text-sm font-black outline-none shadow-[4px_4px_0px_var(--theme-primary)] transition-colors duration-300" />
                    <div className="flex flex-col gap-3 text-xs">
                        <input name="salary" type="number" value={formData.salary} onChange={handleChange} className="bg-[var(--theme-surface)] brightness-110 border-4 border-[var(--theme-primary)] px-4 py-4 rounded-2xl text-[var(--theme-primary)] text-sm font-black outline-none shadow-[4px_4px_0px_var(--theme-primary)] transition-colors duration-300" placeholder="Gaji Pokok" />
                        <input name="overtimeRate" type="number" value={formData.overtimeRate} onChange={handleChange} className="bg-[var(--theme-surface)] brightness-110 border-4 border-[var(--theme-primary)] px-4 py-4 rounded-2xl text-[var(--theme-primary)] text-sm font-black outline-none shadow-[4px_4px_0px_var(--theme-primary)] transition-colors duration-300" placeholder="Lembur Per Jam" />
                        <input name="bankName" value={formData.bankName} onChange={handleChange} className="bg-[var(--theme-surface)] brightness-110 border-4 border-[var(--theme-primary)] px-4 py-4 rounded-2xl text-[var(--theme-primary)] text-sm font-black outline-none shadow-[4px_4px_0px_var(--theme-primary)] transition-colors duration-300" placeholder="Bank" />
                        <input name="bankAccountNumber" value={formData.bankAccountNumber} onChange={handleChange} className="bg-[var(--theme-surface)] brightness-110 border-4 border-[var(--theme-primary)] px-4 py-4 rounded-2xl text-[var(--theme-primary)] text-sm font-black outline-none shadow-[4px_4px_0px_var(--theme-primary)] transition-colors duration-300" placeholder="No Rek" />
                        <input name="bankAccountName" value={formData.bankAccountName} onChange={handleChange} className="bg-[var(--theme-surface)] brightness-110 border-4 border-[var(--theme-primary)] px-4 py-4 rounded-2xl text-[var(--theme-primary)] text-sm font-black outline-none shadow-[4px_4px_0px_var(--theme-primary)] transition-colors duration-300" placeholder="Atas Nama" />
                        <input name="email" value={formData.email} onChange={handleChange} className="bg-[var(--theme-surface)] brightness-110 border-4 border-[var(--theme-primary)] px-4 py-4 rounded-2xl text-[var(--theme-primary)] text-sm font-black outline-none shadow-[4px_4px_0px_var(--theme-primary)] transition-colors duration-300" placeholder="Email" />
                        <select
                            name="employmentType"
                            value={formData.employmentType}
                            onChange={handleChange}
                            className="bg-[var(--theme-surface)] brightness-110 border-4 border-[var(--theme-primary)] px-4 py-4 rounded-2xl text-[var(--theme-primary)] text-sm font-black outline-none shadow-[4px_4px_0px_var(--theme-primary)] transition-colors duration-300"
                        >
                            <option value="fulltime">FULLTIME</option>
                            <option value="contract">CONTRACT</option>
                            <option value="freelance">FREELANCE</option>
                        </select>
                        <input
                            name="payrollStartDay"
                            type="number"
                            value={formData.payrollStartDay}
                            onChange={handleChange}
                            className="bg-[var(--theme-surface)] brightness-110 border-4 border-[var(--theme-primary)] px-4 py-4 rounded-2xl text-[var(--theme-primary)] text-sm font-black outline-none shadow-[4px_4px_0px_var(--theme-primary)] transition-colors duration-300"
                            placeholder="Payroll Mulai Tanggal"
                        />
                        <input
                            name="dailyDeduction"
                            type="number"
                            value={formData.dailyDeduction}
                            onChange={handleChange}
                            className="bg-[var(--theme-surface)] brightness-110 border-4 border-[var(--theme-primary)] px-4 py-4 rounded-2xl text-[var(--theme-primary)] text-sm font-black outline-none shadow-[4px_4px_0px_var(--theme-primary)] transition-colors duration-300"
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
                                    employmentType: employee.employment_type || 'fulltime',
                                    payrollStartDay: employee.payroll_start_day || 1,
                                    dailyDeduction: employee.daily_deduction || 0,
                                })

                                setIsEditing(false)
                            }}
                            className="flex-1 bg-[var(--theme-primary)] text-[var(--theme-surface)] py-4 font-black uppercase rounded-2xl text-base shadow-[4px_4px_0px_var(--theme-primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-300"
                        >
                            Batal
                        </button>

                        <button
                            onClick={saveEmployee}
                            className="flex-1 bg-[var(--theme-highlight)] text-[var(--theme-surface)] py-4 font-black uppercase rounded-2xl text-base border-4 border-[var(--theme-primary)] shadow-[4px_4px_0px_var(--theme-primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-300"
                        >
                            {loading ? '...' : 'Simpan Semua'}
                        </button>

                    </div>
                </div>
            ) : (
                <div>

                    <div className="flex items-start justify-between gap-4 mb-7">

                        <div className="min-w-0 flex-1">
                            <h4 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-[var(--theme-primary)] leading-none break-words transition-colors duration-300">
                                {formData.name}
                            </h4>

                            <p className="text-[var(--theme-accent)] text-base mt-3 font-black uppercase tracking-[0.08em] leading-none transition-colors duration-300">
                                {formData.position}
                            </p>
                        </div>

                        <div className="bg-[var(--theme-primary)] text-[var(--theme-surface)] px-4 py-3 rounded-[22px] shadow-[4px_4px_0px_var(--theme-highlight)] shrink-0 transition-colors duration-300">
                            <div className="text-[10px] uppercase tracking-[0.12em] font-black opacity-70 mb-1">
                                Type
                            </div>

                            <div className="text-sm font-black uppercase leading-none">
                                {formData.employmentType}
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--theme-highlight)] text-[var(--theme-surface)] border-4 border-[var(--theme-primary)] rounded-[28px] p-6 shadow-[6px_6px_0px_var(--theme-primary)] mb-6 transition-colors duration-300">
                        <div className="text-xs mb-3 font-black uppercase tracking-[0.12em] opacity-80">
                            {formData.employmentType === 'freelance'
                                ? 'Daily Salary'
                                : 'Monthly Salary'}
                        </div>

                        <div className="text-3xl sm:text-4xl lg:text-5xl font-black leading-none truncate tracking-tight" title={`Rp ${Number(formData.salary).toLocaleString()}`}>
                            Rp {Number(formData.salary).toLocaleString()}
                        </div>

                        <div className="text-xs font-black uppercase tracking-[0.12em] opacity-70 mt-3">
                            {formData.employmentType === 'freelance'
                                ? 'Dibayar per hari hadir'
                                : 'Gaji bulanan'}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-5 gap-y-5">

                        <div className="border-b-4 border-[var(--theme-primary)] pb-4 transition-colors duration-300">
                            <div className="text-[var(--theme-highlight)] text-[11px] mb-2 font-black uppercase tracking-[0.08em] transition-colors duration-300">
                                Lembur / Jam
                            </div>

                            <div className="text-[var(--theme-primary)] text-xl font-black leading-tight break-words transition-colors duration-300">
                                Rp {Number(formData.overtimeRate).toLocaleString()}
                            </div>
                        </div>

                        <div className="border-b-4 border-[var(--theme-primary)] pb-4 transition-colors duration-300">
                            <div className="text-[var(--theme-highlight)] text-[11px] mb-2 font-black uppercase tracking-[0.08em] transition-colors duration-300">
                                {formData.employmentType === 'freelance'
                                    ? 'Payroll Type'
                                    : 'Potongan / Hari'}
                            </div>

                            <div className="text-[var(--theme-primary)] text-xl font-black leading-tight break-words transition-colors duration-300">
                                {formData.employmentType === 'freelance'
                                    ? 'PER HARI HADIR'
                                    : `Rp ${Number(formData.dailyDeduction).toLocaleString()}`}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsContactExpanded(!isContactExpanded)}
                            className="col-span-2 text-left outline-none cursor-pointer p-4 bg-[var(--theme-surface)] brightness-110 border-4 border-[var(--theme-primary)] rounded-[20px] flex items-center justify-between font-black uppercase tracking-widest text-[10px] text-[var(--theme-primary)] transition-all duration-300 shadow-[4px_4px_0px_var(--theme-primary)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                        >
                            <span>Contact & Bank Details</span>
                            <span className={`w-6 h-6 rounded-full bg-[var(--theme-primary)] text-[var(--theme-surface)] flex items-center justify-center font-bold text-[10px] transform transition-transform duration-300 ${isContactExpanded ? 'rotate-180' : 'rotate-0'}`}>▼</span>
                        </button>

                        <div className={`col-span-2 grid transition-all duration-300 ease-in-out ${isContactExpanded ? 'grid-rows-[1fr] opacity-100 -mt-2' : 'grid-rows-[0fr] opacity-0'}`}>
                            <div className="overflow-hidden">
                                <div className="bg-[var(--theme-primary)] rounded-[28px] p-5 text-[var(--theme-surface)] shadow-[5px_5px_0px_var(--theme-highlight)] transition-colors duration-300 mt-2">
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

                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-[var(--theme-surface)] opacity-90">

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
                        </div>

                    </div>

                    <div className="flex gap-3 mt-6">

                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex-1 bg-[var(--theme-highlight)] text-[var(--theme-surface)] py-4 rounded-2xl text-lg font-black uppercase shadow-[4px_4px_0px_var(--theme-primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-300"
                        >
                            Edit
                        </button>

                        <button
                            onClick={() => {
                                if (confirm(`Yakin ingin menghapus data karyawan ${formData.name}?`)) {
                                    deleteEmployee(employee.id)
                                }
                            }}
                            className="flex-1 bg-[var(--theme-accent)] hover:brightness-90 text-[var(--theme-surface)] py-4 rounded-2xl text-lg font-black uppercase shadow-[4px_4px_0px_var(--theme-primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-300"
                        >
                            Hapus
                        </button>

                    </div>

                </div>
            )}
        </div>
    )
}