'use client'

import { useState } from 'react'
import { EmployeeFormData } from '@/hooks/useEmployees'

type Props = {
    addEmployee: (data: EmployeeFormData) => Promise<void>;
}

export default function EmployeeForm(props: Props) {
    const [activeSection, setActiveSection] = useState<string | null>('personal')
    const [freelanceDays, setFreelanceDays] = useState('') // Local state untuk menampung field visual

    const [name, setName] = useState('')
    const [position, setPosition] = useState('')
    const [employmentType, setEmploymentType] = useState('fulltime')
    const [salary, setSalary] = useState('')
    const [overtimeRate, setOvertimeRate] = useState('')
    const [deduction, setDeduction] = useState('')
    const [bankName, setBankName] = useState('')
    const [bankAccountNumber, setBankAccountNumber] = useState('')
    const [bankAccountName, setBankAccountName] = useState('')
    const [email, setEmail] = useState('')
    const [payrollStartDay, setPayrollStartDay] = useState('1')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        setLoading(true)
        await props.addEmployee({
            name, position, employmentType, salary, overtimeRate, deduction, bankName, bankAccountNumber, bankAccountName, email, payrollStartDay
        })
        setName('')
        setPosition('')
        setSalary('')
        setOvertimeRate('')
        setDeduction('')
        setBankName('')
        setBankAccountNumber('')
        setBankAccountName('')
        setEmail('')
        setPayrollStartDay('1')
        setEmploymentType('fulltime')
        setLoading(false)
    }

    const toggleSection = (section: string) => {
        setActiveSection(prev => (prev === section ? null : section))
    }

    const renderInput = (val: string, set: (val: string) => void, ph: string, type = 'text') => (
        <input
            value={val}
            onChange={(e) => set(e.target.value)}
            placeholder={ph}
            type={type}
            className="w-full bg-[var(--theme-surface)] brightness-110 border-2 border-[var(--theme-primary)] rounded-xl px-4 py-3.5 text-[var(--theme-primary)] font-black placeholder:text-[var(--theme-primary)] placeholder:opacity-40 focus:border-[var(--theme-accent)] focus:outline-none shadow-[4px_4px_0px_var(--theme-primary)] transition-all duration-300"
        />
    )

    return (
        <div className="bg-[var(--theme-highlight)] border-4 border-[var(--theme-primary)] rounded-3xl p-6 md:p-8 shadow-[8px_8px_0px_var(--theme-primary)] transition-colors duration-300">
            <h2 className="text-2xl font-black text-[var(--theme-surface)] uppercase tracking-widest mb-6 transition-colors duration-300">
                Add Employee
            </h2>

            <div className="flex flex-col gap-4">
                {/* Group 1: Informasi Pribadi */}
                <div className="flex flex-col">
                    <button
                        onClick={() => toggleSection('personal')}
                        className="w-full text-left flex items-center justify-between bg-[var(--theme-surface)] text-[var(--theme-primary)] border-2 border-[var(--theme-primary)] rounded-2xl px-5 py-4 font-black uppercase tracking-widest shadow-[4px_4px_0px_var(--theme-primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-300"
                    >
                        <span>Personal Information</span>
                        <span className={`transform transition-transform duration-200 ${activeSection === 'personal' ? 'rotate-180' : ''}`}>▼</span>
                    </button>
                    <div className={`grid transition-all duration-300 ease-in-out ${activeSection === 'personal' ? 'grid-rows-[1fr] opacity-100 mt-3 mb-2' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-1 pb-2">
                            {renderInput(name, setName, 'Name')}
                            {renderInput(position, setPosition, 'Position')}
                                <div className="md:col-span-2">
                                {renderInput(email, setEmail, 'Email', 'email')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Group 2: Detail Penggajian */}
                <div className="flex flex-col">
                    <button
                        onClick={() => toggleSection('payroll')}
                        className="w-full text-left flex items-center justify-between bg-[var(--theme-surface)] text-[var(--theme-primary)] border-2 border-[var(--theme-primary)] rounded-2xl px-5 py-4 font-black uppercase tracking-widest shadow-[4px_4px_0px_var(--theme-primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-300"
                    >
                        <span>Payroll Details</span>
                        <span className={`transform transition-transform duration-200 ${activeSection === 'payroll' ? 'rotate-180' : ''}`}>▼</span>
                    </button>
                    <div className={`grid transition-all duration-300 ease-in-out ${activeSection === 'payroll' ? 'grid-rows-[1fr] opacity-100 mt-3 mb-2' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-1 pb-2">
                                <div className="md:col-span-2">
                                    <select
                                    value={employmentType}
                                    onChange={(e) => setEmploymentType(e.target.value)}
                                        className="w-full bg-[var(--theme-surface)] brightness-110 border-2 border-[var(--theme-primary)] rounded-xl px-4 py-3.5 text-[var(--theme-primary)] font-black focus:border-[var(--theme-accent)] focus:outline-none shadow-[4px_4px_0px_var(--theme-primary)] transition-all duration-300"
                                    >
                                        <option value="fulltime">FULLTIME</option>
                                        <option value="contract">CONTRACT</option>
                                        <option value="freelance">FREELANCE</option>
                                    </select>
                                </div>

                            {employmentType === 'freelance' ? (
                                    <>
                                    {renderInput(salary, setSalary, 'Daily Salary Rate', 'number')}
                                        {renderInput(freelanceDays, setFreelanceDays, 'Working Days', 'number')}
                                    </>
                                ) : (
                                renderInput(salary, setSalary, 'Monthly Base Salary', 'number')
                                )}

                            {renderInput(overtimeRate, setOvertimeRate, 'Overtime Rate', 'number')}
                            {renderInput(deduction, setDeduction, 'Daily Deduction', 'number')}
                            {renderInput(payrollStartDay, setPayrollStartDay, 'Payroll Start Date', 'number')}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Group 3: Informasi Bank */}
                <div className="flex flex-col">
                    <button
                        onClick={() => toggleSection('bank')}
                        className="w-full text-left flex items-center justify-between bg-[var(--theme-surface)] text-[var(--theme-primary)] border-2 border-[var(--theme-primary)] rounded-2xl px-5 py-4 font-black uppercase tracking-widest shadow-[4px_4px_0px_var(--theme-primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-300"
                    >
                        <span>Bank Information</span>
                        <span className={`transform transition-transform duration-200 ${activeSection === 'bank' ? 'rotate-180' : ''}`}>▼</span>
                    </button>
                    <div className={`grid transition-all duration-300 ease-in-out ${activeSection === 'bank' ? 'grid-rows-[1fr] opacity-100 mt-3 mb-2' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                            <div className="grid grid-cols-1 gap-4 px-1 pb-2">
                            {renderInput(bankName, setBankName, 'Bank Name')}
                            {renderInput(bankAccountNumber, setBankAccountNumber, 'Account Number')}
                            {renderInput(bankAccountName, setBankAccountName, 'Account Name')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="mt-8 w-full bg-[var(--theme-accent)] hover:brightness-90 disabled:opacity-70 border-4 border-[var(--theme-primary)] text-[var(--theme-surface)] py-4 rounded-2xl font-black uppercase tracking-widest shadow-[6px_6px_0px_var(--theme-primary)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all duration-300"
            >
                {loading ? 'Saving...' : 'Save Employee'}
            </button>
        </div>
    )
}