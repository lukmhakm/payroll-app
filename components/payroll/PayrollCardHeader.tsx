'use client'

interface Props {
  employee: any
  totalSalary?: number
  expanded: boolean
  isFinalized?: boolean
  onToggle: () => void
}

export default function PayrollCardHeader({
  employee,
  totalSalary,
  expanded,
  isFinalized,
  onToggle,
}: Props) {
  return (
    <button
      onClick={onToggle}
      className={`w-full text-left bg-[var(--theme-accent)] px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-3 sm:gap-4 transition-all duration-300 ${expanded ? 'border-b-4 border-[var(--theme-primary)]' : ''}`}
    >
      <div className="flex flex-col items-start gap-1.5 min-w-0">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-[var(--theme-surface)] leading-none truncate max-w-full transition-colors duration-300">
          {employee.name}
        </h3>
        <div className="flex flex-col items-start gap-1 mt-0.5">
          <div className="flex items-center gap-2">
            <span className="inline-block bg-[var(--theme-primary)] text-[var(--theme-surface)] text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-widest border-2 border-[var(--theme-primary)] w-max shrink-0 transition-colors duration-300">
              {employee.position || 'Employee'}
            </span>
            {isFinalized && (
              <span className="inline-block bg-[var(--theme-accent)] text-[var(--theme-surface)] text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-widest border-2 border-[var(--theme-primary)] w-max shrink-0 shadow-[2px_2px_0px_var(--theme-primary)] transition-colors duration-300">
                FINALIZED
              </span>
            )}
          </div>
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[var(--theme-surface)] opacity-90 transition-colors duration-300">
            {employee.employment_type?.replace('_', ' ') || 'TETAP'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="text-right hidden sm:block">
          <p className="text-[10px] uppercase font-black tracking-widest text-[var(--theme-primary)] mb-1 transition-colors duration-300">
            Final Salary
          </p>
          <div className="text-[var(--theme-surface)] text-2xl md:text-3xl leading-none font-black tracking-tight whitespace-nowrap transition-colors duration-300">
            Rp {Math.round(totalSalary || 0).toLocaleString()}
          </div>
        </div>
        
        <div className="text-[var(--theme-surface)] text-lg leading-none font-black tracking-tight whitespace-nowrap sm:hidden block transition-colors duration-300">
          Rp {Math.round(totalSalary || 0).toLocaleString()}
        </div>

        <div
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--theme-surface)] flex items-center justify-center text-[var(--theme-primary)] text-xs sm:text-sm font-bold shrink-0 transition-all duration-300"
          style={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          ▼
        </div>
      </div>
    </button>
  )
}