'use client'

import { useState } from 'react'

type Props = {
    name: string; setName: any;
    position: string; setPosition: any;
    salary: string; setSalary: any;
    overtimeRate: string; setOvertimeRate: any;
    deduction: string; setDeduction: any;
    bankName: string; setBankName: any;
    bankAccountNumber: string; setBankAccountNumber: any;
    bankAccountName: string; setBankAccountName: any;
    email: string; setEmail: any;
    payrollStartDay: string; setPayrollStartDay: any;
    employmentType: string; setEmploymentType: any;
    addEmployee: () => void;
}

export default function EmployeeForm(props: Props) {
    const [activeSection, setActiveSection] = useState<string | null>('personal')
    const [freelanceDays, setFreelanceDays] = useState('') // Local state untuk menampung field visual

    const toggleSection = (section: string) => {
        setActiveSection(prev => (prev === section ? null : section))
    }

    const renderInput = (val: string, set: any, ph: string, type = 'text') => (
        <input
            value={val}
            onChange={(e) => set(e.target.value)}
            placeholder={ph}
            type={type}
            className="w-full bg-white border-2 border-black rounded-xl px-4 py-3.5 text-[#111111] font-black placeholder:text-[#111111]/40 focus:border-[#E43427] focus:outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
        />
    )

    return (
        <div className="bg-[#15438D] border-4 border-[#111111] rounded-3xl p-6 md:p-8 shadow-[8px_8px_0px_#111111]">
            <h2 className="text-2xl font-black text-[#F3EBD9] uppercase tracking-widest mb-6">
                Tambah Karyawan
            </h2>

            <div className="flex flex-col gap-4">
                {/* Group 1: Informasi Pribadi */}
                <div className="flex flex-col">
                    <button
                        onClick={() => toggleSection('personal')}
                        className="w-full flex items-center justify-between bg-[#F3EBD9] text-[#111111] border-2 border-black rounded-2xl px-5 py-4 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                    >
                        <span>Informasi Pribadi</span>
                        <span className={`transform transition-transform duration-200 ${activeSection === 'personal' ? 'rotate-180' : ''}`}>▼</span>
                    </button>
                    <div className={`grid transition-all duration-300 ease-in-out ${activeSection === 'personal' ? 'grid-rows-[1fr] opacity-100 mt-3 mb-2' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-1 pb-2">
                                {renderInput(props.name, props.setName, 'Nama')}
                                {renderInput(props.position, props.setPosition, 'Jabatan')}
                                <div className="md:col-span-2">
                                    {renderInput(props.email, props.setEmail, 'Email', 'email')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Group 2: Detail Penggajian */}
                <div className="flex flex-col">
                    <button
                        onClick={() => toggleSection('payroll')}
                        className="w-full flex items-center justify-between bg-[#F3EBD9] text-[#111111] border-2 border-black rounded-2xl px-5 py-4 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                    >
                        <span>Detail Penggajian</span>
                        <span className={`transform transition-transform duration-200 ${activeSection === 'payroll' ? 'rotate-180' : ''}`}>▼</span>
                    </button>
                    <div className={`grid transition-all duration-300 ease-in-out ${activeSection === 'payroll' ? 'grid-rows-[1fr] opacity-100 mt-3 mb-2' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-1 pb-2">
                                <div className="md:col-span-2">
                                    <select
                                        value={props.employmentType}
                                        onChange={(e) => props.setEmploymentType(e.target.value)}
                                        className="w-full bg-white border-2 border-black rounded-xl px-4 py-3.5 text-[#111111] font-black focus:border-[#E43427] focus:outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                                    >
                                        <option value="tetap">KARYAWAN TETAP</option>
                                        <option value="tidak_tetap">KARYAWAN TIDAK TETAP</option>
                                        <option value="freelance">FREELANCE</option>
                                    </select>
                                </div>

                                {props.employmentType === 'freelance' ? (
                                    <>
                                        {renderInput(props.salary, props.setSalary, 'Tarif Gaji per Hari', 'number')}
                                        {renderInput(freelanceDays, setFreelanceDays, 'Jumlah Hari Kerja', 'number')}
                                    </>
                                ) : (
                                    renderInput(props.salary, props.setSalary, 'Gaji Pokok Bulanan', 'number')
                                )}

                                {renderInput(props.overtimeRate, props.setOvertimeRate, 'Tarif Lembur', 'number')}
                                {renderInput(props.deduction, props.setDeduction, 'Potongan Per Hari', 'number')}
                                {renderInput(props.payrollStartDay, props.setPayrollStartDay, 'Tgl Mulai Payroll', 'number')}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Group 3: Informasi Bank */}
                <div className="flex flex-col">
                    <button
                        onClick={() => toggleSection('bank')}
                        className="w-full flex items-center justify-between bg-[#F3EBD9] text-[#111111] border-2 border-black rounded-2xl px-5 py-4 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                    >
                        <span>Informasi Bank</span>
                        <span className={`transform transition-transform duration-200 ${activeSection === 'bank' ? 'rotate-180' : ''}`}>▼</span>
                    </button>
                    <div className={`grid transition-all duration-300 ease-in-out ${activeSection === 'bank' ? 'grid-rows-[1fr] opacity-100 mt-3 mb-2' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                            <div className="grid grid-cols-1 gap-4 px-1 pb-2">
                                {renderInput(props.bankName, props.setBankName, 'Nama Bank')}
                                {renderInput(props.bankAccountNumber, props.setBankAccountNumber, 'Nomor Rekening')}
                                {renderInput(props.bankAccountName, props.setBankAccountName, 'Atas Nama Rekening')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={props.addEmployee}
                className="mt-8 w-full bg-[#E43427] hover:bg-[#D32F2F] border-4 border-[#111111] text-[#F3EBD9] py-4 rounded-2xl font-black uppercase tracking-widest shadow-[6px_6px_0px_0px_#111111] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all"
            >
                Simpan Karyawan
            </button>
        </div>
    )
}