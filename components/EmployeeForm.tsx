'use client'

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
    return (
        <div className="bg-[#15438D] border-4 border-[#111111] rounded-3xl p-8 shadow-[8px_8px_0px_#111111]">
            <h2 className="text-2xl font-black text-[#F3EBD9] uppercase tracking-widest mb-8">
                Tambah Karyawan
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    { val: props.name, set: props.setName, ph: 'Nama', type: 'text' },
                    { val: props.position, set: props.setPosition, ph: 'Jabatan', type: 'text' },
                    { val: props.email, set: props.setEmail, ph: 'Email', type: 'email' },
                    { val: props.payrollStartDay, set: props.setPayrollStartDay, ph: 'Tgl Mulai Payroll', type: 'number' },
                    { val: props.salary, set: props.setSalary, ph: 'Gaji Pokok', type: 'number' },
                    { val: props.overtimeRate, set: props.setOvertimeRate, ph: 'Tarif Lembur', type: 'number' },
                    { val: props.deduction, set: props.setDeduction, ph: 'Potongan Per Hari', type: 'number' },
                    { val: props.bankName, set: props.setBankName, ph: 'Nama Bank', type: 'text' },
                    { val: props.bankAccountNumber, set: props.setBankAccountNumber, ph: 'Nomor Rekening', type: 'text' },
                    { val: props.bankAccountName, set: props.setBankAccountName, ph: 'Atas Nama Rekening', type: 'text' },
                ].map((input, i) => (
                    <input
                        key={i}
                        value={input.val}
                        onChange={(e) => input.set(e.target.value)}
                        placeholder={input.ph}
                        type={input.type}
                        className="w-full bg-[#F3EBD9] border-2 border-[#111111] rounded-xl px-4 py-4 text-[#111111] font-black placeholder:text-[#111111]/40 focus:border-[#E43427] focus:outline-none"
                    />
                ))}
            </div>

            <select
                value={props.employmentType}
                onChange={(e) => props.setEmploymentType(e.target.value)}
                className="mt-4 w-full bg-[#F3EBD9] border-2 border-[#111111] rounded-xl px-4 py-4 text-[#111111] font-black focus:border-[#E43427] focus:outline-none"
            >
                <option value="tetap">KARYAWAN TETAP</option>
                <option value="tidak_tetap">KARYAWAN TIDAK TETAP</option>
                <option value="freelance">FREELANCE</option>
            </select>

            <button
                onClick={props.addEmployee}
                className="mt-8 w-full bg-[#E43427] border-4 border-[#111111] text-[#F3EBD9] py-4 rounded-2xl font-black uppercase tracking-widest shadow-[4px_4px_0px_#111111] hover:translate-y-1 transition-all active:shadow-none"
            >
                Simpan Karyawan
            </button>
        </div>
    )
}