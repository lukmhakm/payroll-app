type Props = {
  employee: any
  payroll: any
}

export default function SalarySlip({
  employee,
  payroll,
}: Props) {

  const currentDate =
    new Date()

  const month =
    currentDate.toLocaleString(
      'id-ID',
      { month: 'long' }
    )

  const year =
    currentDate.getFullYear()

  return (
    <div className="bg-white text-black rounded-2xl p-8 w-[800px]">

      <div className="flex items-center justify-between mb-10">

        <div>
          <div className="text-4xl font-bold">
            Salary Slip DEBUG
          </div>

          <div className="text-zinc-500 mt-2">
            {month} {year}
          </div>
        </div>

        <div className="text-right">
          <div className="font-semibold">
            Payroll App
          </div>

          <div className="text-zinc-500 text-sm mt-1">
            Internal Payroll System
          </div>
        </div>

      </div>

      <div className="grid grid-cols-2 gap-8 mb-10">

        <div>

          <div className="text-zinc-500 text-sm">
            Employee
          </div>

          <div className="font-bold text-2xl mt-1">
            {employee.name}
          </div>

          <pre className="text-[10px] mt-2 bg-zinc-100 p-2 rounded-lg overflow-x-auto">
            {JSON.stringify(employee, null, 2)}
          </pre>

          <div className="text-zinc-500 mt-1">
            {employee.position}
          </div>

        </div>

        <div>

          <div className="text-zinc-500 text-sm">
            Bank
          </div>

          <div className="font-semibold mt-1">
            {employee.bank_name || '-'}
          </div>

          <div className="mt-2">
            {employee.bank_account_number || '-'}
          </div>

          <div className="mt-1 text-zinc-500">
            {employee.bank_account_name || '-'}
          </div>

        </div>

      </div>

      <div className="border border-zinc-200 rounded-2xl overflow-hidden">

        <div className="grid grid-cols-2 bg-zinc-100 p-4 font-semibold">
          <div>Description</div>
          <div className="text-right">Amount</div>
        </div>

        <div className="grid grid-cols-2 p-4 border-t border-zinc-200">
          <div>
            {employee.employment_type === 'freelance'
              ? `Daily Salary • ${payroll.hadirCount || 0} Hari Kerja`
              : 'Gaji Pokok'}
          </div>

          <div className="text-right font-semibold">
            {employee.employment_type === 'freelance'
              ? `Rp ${((payroll.hadirCount || 0) * Number(employee.base_salary || 0)).toLocaleString()}`
              : `Rp ${employee.base_salary.toLocaleString()}`}
          </div>
        </div>

        <div className="grid grid-cols-2 p-4 border-t border-zinc-200">
          <div>Total Lembur</div>

          <div className="text-right">
            Rp {payroll.totalOvertimePay.toLocaleString()}
          </div>
        </div>

        {employee.employment_type !== 'freelance' && Number((payroll.totalDeduction ?? payroll.deduction) || 0) > 0 && (
          <div className="grid grid-cols-2 p-4 border-t border-zinc-200">
            <div>Potongan</div>

            <div className="text-right text-red-500">
              Rp {Number(payroll.totalDeduction ?? payroll.deduction || 0).toLocaleString()}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 p-5 border-t border-zinc-200 bg-zinc-50">

          <div className="text-xl font-bold">
            Total Salary
          </div>

          <div className="text-right text-3xl font-bold">
            Rp {payroll.finalSalary.toLocaleString()}
          </div>

        </div>

      </div>

    </div>
  )
}