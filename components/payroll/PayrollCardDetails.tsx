'use client'

interface Props {
  employee: any
  payroll: any
  adjustment?: any
  isFinalized?: boolean
  onUpdateAdjustment?: (field: string, value: number) => void
  onGenerateSlip: () => void
  onFinalize: () => void
}

export default function PayrollCardDetails({
  employee,
  payroll,
  adjustment = { bonus: 0, deduction: 0 },
  isFinalized,
  onUpdateAdjustment,
  onGenerateSlip,
  onFinalize,
}: Props) {
  function formatCurrency(value?: number) {
    return `Rp ${Math.round(value || 0).toLocaleString()}`
  }

  return (
    <div className="bg-gray-950 p-4 sm:p-6 flex flex-col gap-4 sm:gap-5">
      <div className="bg-[#111111] rounded-xl px-4 py-3 sm:mb-1 flex items-center justify-between border-2 border-white/10 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.05)]">
        <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Periode Gaji</span>
        <span className="text-xs font-mono font-bold text-[#F3EBD9]">{payroll.periodStart} s/d {payroll.periodEnd}</span>
      </div>

      {employee.employment_type === 'freelance' && (
        <div className="flex justify-between items-center border-b-4 border-[#111111] pb-3 sm:pb-4 gap-2">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-white/70">Total Days Worked</span>
          <span className="text-base sm:text-lg md:text-xl font-mono font-bold text-white shrink-0">
            {payroll.attendanceCount || payroll.hadirCount || 0} Days
          </span>
        </div>
      )}

      <div className="flex justify-between items-center border-b-4 border-[#111111] pb-3 sm:pb-4 gap-2">
        <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-white/70">
          {employee.employment_type === 'freelance' ? 'Daily Salary' : 'Base Salary'}
        </span>
        <span className="text-base sm:text-lg md:text-xl font-mono font-bold text-white shrink-0 text-right">
          {formatCurrency(employee.base_salary || payroll.baseSalary || 0)}
          {employee.employment_type === 'freelance' && <span className="text-sm text-white/70"> / day</span>}
        </span>
      </div>

      <div className="flex justify-between items-center border-b-4 border-[#111111] pb-3 sm:pb-4 gap-2">
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-white/70">Overtime</span>
          {Number(payroll.overtimeHours || 0) > 0 && (
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-white/50 mt-0.5">
              ({payroll.overtimeDays} Kali • {payroll.overtimeHours} Jam)
            </span>
          )}
        </div>
        <span className="text-base sm:text-lg md:text-xl font-mono font-bold text-white shrink-0 text-right">
          + {formatCurrency(payroll.totalOvertimePay || payroll.overtime || 0)}
        </span>
      </div>

      <div className="flex justify-between items-center border-b-4 border-[#111111] pb-3 sm:pb-4 gap-2">
        <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-white/70">Bonus</span>
        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg md:text-xl font-mono font-bold text-white shrink-0">+ Rp</span>
          <input
            type="number"
            value={adjustment.bonus || ''}
            onChange={(e) => onUpdateAdjustment?.('bonus', Number(e.target.value))}
            placeholder="0"
            disabled={isFinalized}
            className={`bg-transparent text-right text-base sm:text-lg md:text-xl font-mono font-bold text-white border-b border-dashed border-white/40 focus:border-white focus:outline-none placeholder:text-white/20 w-28 sm:w-36 md:w-48 ${isFinalized ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        </div>
      </div>

      {employee.employment_type !== 'freelance' && Number(payroll.totalDeduction || payroll.deduction || 0) > 0 && (
        <div className="flex justify-between items-center border-b-4 border-[#111111] pb-3 sm:pb-4 gap-2">
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#E64A19]">
              Absence Deduction
            </span>
            {(() => {
              const totalDed = Number(payroll.totalDeduction || payroll.deduction || 0)
              const dailyDed = Number(employee.daily_deduction || 0)
              
              if (dailyDed > 0) {
                const absentDays = Math.floor(totalDed / dailyDed)
                if (absentDays > 0) {
                  return (
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#E64A19]/70 mt-0.5">
                      ({absentDays} Hari)
                    </span>
                  )
                }
              }
              return null
            })()}
          </div>
          <span className="text-base sm:text-lg md:text-xl font-mono font-bold text-[#E64A19] shrink-0 text-right">
            - {formatCurrency(payroll.totalDeduction || payroll.deduction || 0)}
          </span>
        </div>
      )}

      <div className="flex justify-between items-center border-b-4 border-[#111111] pb-3 sm:pb-4 gap-2">
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#E64A19]">Extra</span>
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#E64A19]/70 mt-0.5">
            (THR/Kasbon)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg md:text-xl font-mono font-bold text-[#E64A19] shrink-0">Rp</span>
          <input
            type="number"
            value={adjustment.deduction || ''}
            onChange={(e) => onUpdateAdjustment?.('deduction', Number(e.target.value))}
            placeholder="+ / -"
            disabled={isFinalized}
            className={`bg-transparent text-right text-base sm:text-lg md:text-xl font-mono font-bold text-[#E64A19] border-b border-dashed border-[#E64A19]/40 focus:border-[#E64A19] focus:outline-none placeholder:text-[#E64A19]/30 w-28 sm:w-36 md:w-48 ${isFinalized ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {!isFinalized && (
              <button
                  onClick={onFinalize}
                  className="w-full bg-[#E43427] hover:bg-[#D32F2F] text-white py-3 sm:py-4 px-4 font-black uppercase tracking-widest rounded-2xl border-4 border-[#111111] shadow-[6px_6px_0px_#111111] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                  Finalize Payroll
              </button>
          )}
          <button
              onClick={onGenerateSlip}
              className={`w-full bg-[#15438D] hover:bg-[#113670] text-white py-3 sm:py-4 px-4 font-black uppercase tracking-widest rounded-2xl border-4 border-[#111111] shadow-[6px_6px_0px_#111111] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2 text-sm sm:text-base ${isFinalized ? 'sm:col-span-2' : ''}`}
          >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Generate Slip
          </button>
      </div>
    </div>
  )
}