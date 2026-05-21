type Props = {
    name: string
    setName: any

    position: string
    setPosition: any

    salary: string
    setSalary: any

    overtimeRate: string
    setOvertimeRate: any

    deduction: string
    setDeduction: any

    permitDeduction: string
    setPermitDeduction: any

    bankName: string
    setBankName: any

    bankAccountNumber: string
    setBankAccountNumber: any

    bankAccountName: string
    setBankAccountName: any

    email: string
    setEmail: any

    payrollStartDay: string
    setPayrollStartDay: any

    addEmployee: () => void
}

export default function EmployeeForm({
    name,
    setName,

    position,
    setPosition,

    email,
    setEmail,

    salary,
    setSalary,

    overtimeRate,
    setOvertimeRate,

    deduction,
    setDeduction,

    permitDeduction,
    setPermitDeduction,

    bankName,
    setBankName,

    bankAccountNumber,
    setBankAccountNumber,

    bankAccountName,
    setBankAccountName,

    payrollStartDay,
    setPayrollStartDay,

    addEmployee,
}: Props) {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-6">
                Tambah Karyawan
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama"
                    className="bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3"
                />

                <input
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="Jabatan"
                    className="bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3"
                />

                <input
                    value={email}
                    onChange={(e) =>
                        setEmail(
                            e.target.value
                        )
                    }
                    placeholder="Email"
                    type="email"
                    className="bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3"
                />

                <input
                    value={payrollStartDay}
                    onChange={(e) =>
                        setPayrollStartDay(
                            e.target.value
                        )
                    }
                    placeholder="Tanggal Mulai Payroll"
                    type="number"
                    min="1"
                    max="31"
                    className="bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3"
                />

                <input
                    value={salary}
                    onChange={(e) =>
                        setSalary(
                            e.target.value
                        )
                    }
                    placeholder="Gaji Pokok"
                    type="number"
                    className="bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3"
                />

                <input
                    value={overtimeRate}
                    onChange={(e) =>
                        setOvertimeRate(
                            e.target.value
                        )
                    }
                    placeholder="Tarif Lembur"
                    type="number"
                    className="bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3"
                />

                <input
                    value={deduction}
                    onChange={(e) =>
                        setDeduction(
                            e.target.value
                        )
                    }
                    placeholder="Potongan Alpha"
                    type="number"
                    className="bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3"
                />

                <input
                    value={bankName}
                    onChange={(e) =>
                        setBankName(
                            e.target.value
                        )
                    }
                    placeholder="Nama Bank"
                    className="bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3"
                />

                <input
                    value={bankAccountNumber}
                    onChange={(e) =>
                        setBankAccountNumber(
                            e.target.value
                        )
                    }
                    placeholder="Nomor Rekening"
                    className="bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3"
                />

                <input
                    value={bankAccountName}
                    onChange={(e) =>
                        setBankAccountName(
                            e.target.value
                        )
                    }
                    placeholder="Atas Nama Rekening"
                    className="bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3"
                />

                <input
                    value={permitDeduction}
                    onChange={(e) =>
                        setPermitDeduction(
                            e.target.value
                        )
                    }
                    placeholder="Potongan Izin"
                    type="number"
                    className="bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3"
                />

            </div>

            <button
                onClick={addEmployee}
                className="mt-6 px-5 py-3 rounded-xl bg-white text-black font-semibold"
            >
                Simpan Karyawan
            </button>
        </div>
    )
}