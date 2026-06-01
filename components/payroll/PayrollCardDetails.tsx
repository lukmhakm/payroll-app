'use client'

// TODO: These types should be imported from a central types file (e.g., @/types/payroll.ts)
import type { Employee, CalculatedPayroll as Payroll, PayrollAdjustment } from '@/types'

interface Props {
  employee: Employee
  payroll: Payroll
  adjustment?: PayrollAdjustment
  isFinalized?: boolean
  onUpdateAdjustment?: (field: 'bonus' | 'deduction', value: number) => void
  onGenerateSlip: () => void
  onFinalize: () => void
}

export default function PayrollCardDetails({
  employee,
  payroll,
  adjustment = { bonus: 0, deduction: 0 } as PayrollAdjustment,
  isFinalized,
  onUpdateAdjustment,
  onGenerateSlip,
  onFinalize,
}: Props) {
  function formatCurrency(value?: number) {
    return `Rp ${Math.round(value || 0).toLocaleString()}`
  }

  return (
    <div className="bg-black/20 p-4 sm:p-6 flex flex-col gap-4 sm:gap-5">
      <div className="bg-black/30 rounded-xl px-4 py-3 sm:mb-1 flex items-center justify-between border-2 border-white/10 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.05)]">
        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--theme-surface)] opacity-50">Periode Gaji</span>
        <span className="text-xs font-mono font-bold text-[var(--theme-surface)] transition-colors duration-300">{payroll.periodStart} s/d {payroll.periodEnd}</span>
      </div>

      {employee.employment_type === 'freelance' && (
        <div className="flex justify-between items-center border-b-4 border-white/10 pb-3 sm:pb-4 gap-2">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[var(--theme-surface)] opacity-70">Total Days Worked</span>
          <span className="text-base sm:text-lg md:text-xl font-mono font-bold text-[var(--theme-surface)] shrink-0 transition-colors duration-300">
            {payroll.attendanceCount || payroll.hadirCount || 0} Days
          </span>
        </div>
      )}

      <div className="flex justify-between items-center border-b-4 border-white/10 pb-3 sm:pb-4 gap-2">
        <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[var(--theme-surface)] opacity-70">
          {employee.employment_type === 'freelance' ? 'Daily Salary' : 'Base Salary'}
        </span>
        <span className="text-base sm:text-lg md:text-xl font-mono font-bold text-[var(--theme-surface)] shrink-0 text-right transition-colors duration-300">
          {formatCurrency(employee.base_salary || payroll.baseSalary || 0)}
          {employee.employment_type === 'freelance' && <span className="text-sm text-[var(--theme-surface)] opacity-70"> / day</span>}
        </span>
      </div>

      <div className="flex justify-between items-center border-b-4 border-white/10 pb-3 sm:pb-4 gap-2">
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[var(--theme-surface)] opacity-70">Overtime</span>
          {Number(payroll.overtimeHours || 0) > 0 && (
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[var(--theme-surface)] opacity-50 mt-0.5">
              ({payroll.overtimeDays} Kali • {Number(Number(payroll.overtimeHours || 0).toFixed(2))} Jam)
            </span>
          )}
        </div>
        <span className="text-base sm:text-lg md:text-xl font-mono font-bold text-[var(--theme-surface)] shrink-0 text-right transition-colors duration-300">
          + {formatCurrency(payroll.totalOvertimePay || payroll.overtime || 0)}
        </span>
      </div>

      <div className="flex justify-between items-center border-b-4 border-white/10 pb-3 sm:pb-4 gap-2">
        <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[var(--theme-surface)] opacity-70">Bonus</span>
        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg md:text-xl font-mono font-bold text-[var(--theme-surface)] shrink-0 transition-colors duration-300">+ Rp</span>
          <input
            type="number"
            value={adjustment.bonus || ''}
            onChange={(e) => onUpdateAdjustment?.('bonus', Number(e.target.value))}
            placeholder="0"
            disabled={isFinalized}
            className={`bg-transparent text-right text-base sm:text-lg md:text-xl font-mono font-bold text-[var(--theme-surface)] border-b border-dashed border-white/40 focus:border-white focus:outline-none placeholder:text-[var(--theme-surface)] placeholder:opacity-20 w-28 sm:w-36 md:w-48 transition-colors duration-300 ${isFinalized ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        </div>
      </div>

      {employee.employment_type !== 'freelance' && Number(payroll.totalDeduction || payroll.deduction || 0) > 0 && (
        <div className="flex justify-between items-center border-b-4 border-white/10 pb-3 sm:pb-4 gap-2">
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[var(--theme-accent)] transition-colors duration-300">
              Absence Deduction
            </span>
            {(() => {
              const totalDed = Number(payroll.totalDeduction || payroll.deduction || 0)
              const dailyDed = Number(employee.daily_deduction || 0)
              
              if (dailyDed > 0) {
                const absentDays = Math.floor(totalDed / dailyDed)
                if (absentDays > 0) {
                  return (
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[var(--theme-accent)] opacity-70 mt-0.5 transition-colors duration-300">
                      ({absentDays} Hari)
                    </span>
                  )
                }
              }
              return null
            })()}
          </div>
          <span className="text-base sm:text-lg md:text-xl font-mono font-bold text-[var(--theme-accent)] shrink-0 text-right transition-colors duration-300">
            - {formatCurrency(payroll.totalDeduction || payroll.deduction || 0)}
          </span>
        </div>
      )}

      <div className="flex justify-between items-center border-b-4 border-white/10 pb-3 sm:pb-4 gap-2">
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[var(--theme-accent)] transition-colors duration-300">Extra</span>
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[var(--theme-accent)] opacity-70 mt-0.5 transition-colors duration-300">
            (THR/Kasbon)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg md:text-xl font-mono font-bold text-[var(--theme-accent)] shrink-0 transition-colors duration-300">Rp</span>
          <input
            type="number"
            value={adjustment.deduction || ''}
            onChange={(e) => onUpdateAdjustment?.('deduction', Number(e.target.value))}
            placeholder="+ / -"
            disabled={isFinalized}
            className={`bg-transparent text-right text-base sm:text-lg md:text-xl font-mono font-bold text-[var(--theme-accent)] border-b border-dashed border-[var(--theme-accent)] focus:border-[var(--theme-accent)] focus:outline-none placeholder:text-[var(--theme-accent)] placeholder:opacity-30 w-28 sm:w-36 md:w-48 transition-colors duration-300 ${isFinalized ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {!isFinalized && (
              <button
                  onClick={onFinalize}
                  className="w-full bg-[var(--theme-accent)] hover:brightness-90 text-[var(--theme-surface)] py-3 sm:py-4 px-4 font-black uppercase tracking-widest rounded-2xl border-4 border-[var(--theme-primary)] shadow-[6px_6px_0px_var(--theme-primary)] transition-all duration-300 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                  Finalize Payroll
              </button>
          )}
          <button
              onClick={onGenerateSlip}
              className={`w-full bg-[var(--theme-highlight)] hover:brightness-90 text-[var(--theme-surface)] py-3 sm:py-4 px-4 font-black uppercase tracking-widest rounded-2xl border-4 border-[var(--theme-primary)] shadow-[6px_6px_0px_var(--theme-primary)] transition-all duration-300 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2 text-sm sm:text-base ${isFinalized ? 'sm:col-span-2' : ''}`}
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