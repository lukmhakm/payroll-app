'use client'

// TODO: This type should be imported from a central types file (e.g., @/types/payroll.ts)
import type { Employee } from '@/types'

interface Props {
  employee: Employee
  totalSalary?: number
  expanded: boolean
  isFinalized?: boolean
  onToggle: () => void
  periodStart?: string
  periodEnd?: string
}

function formatDateShort(dateStr?: string) {
  if (!dateStr) return ''
  const parts = dateStr.split('-')
  if (parts.length < 3) return dateStr
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const day = parseInt(parts[2], 10)
  const monthIdx = parseInt(parts[1], 10) - 1
  return `${day} ${months[monthIdx] || parts[1]}`
}

export default function PayrollCardHeader({
  employee,
  totalSalary = 0,
  expanded,
  isFinalized,
  onToggle,
  periodStart,
  periodEnd,
}: Props) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-full text-left bg-[var(--theme-accent)] px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-3 sm:gap-4 transition-all duration-300 ${expanded ? 'border-b-4 border-[var(--theme-primary)]' : ''}`}
    >
      {isFinalized && (
        <div className="absolute top-0 right-0 bg-[var(--theme-surface)] text-[var(--theme-primary)] text-[9px] sm:text-[10px] font-black px-3 sm:px-4 py-1 border-b-2 sm:border-b-4 border-l-2 sm:border-l-4 border-[var(--theme-primary)] rounded-bl-xl sm:rounded-bl-2xl uppercase tracking-widest transition-colors duration-300 z-10">
          FINALIZED
        </div>
      )}

      <div className="flex flex-col items-start gap-1.5 min-w-0">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-[var(--theme-surface)] leading-none truncate max-w-full transition-colors duration-300">
          {employee.name}
        </h3>
        <div className="flex flex-col items-start gap-1 mt-0.5">
          <div className="flex items-center gap-2">
            <span className="inline-block bg-[var(--theme-primary)] text-[var(--theme-surface)] text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-widest border-2 border-[var(--theme-primary)] w-max shrink-0 transition-colors duration-300">
              {employee.position || 'Employee'}
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[var(--theme-surface)] opacity-90 transition-colors duration-300">
            {employee.employment_type?.replace('_', ' ') || 'TETAP'}
            {periodStart && periodEnd && ` • (${formatDateShort(periodStart)} - ${formatDateShort(periodEnd)})`}
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