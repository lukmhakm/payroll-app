'use client'

import { supabase } from '@/lib/supabase'

type Props = {
    histories: any[]
    employees?: any[]
    refreshPayrollHistories: any
    onSelectHistory: any
}

export default function PayrollHistory({
    histories,
    employees,
    refreshPayrollHistories,
    onSelectHistory,
}: Props) {

    async function markAsPaid(payrollId: string) {
        await supabase
            .from('payroll_history')
            .update({ status: 'paid' })
            .eq('id', payrollId)

        if (refreshPayrollHistories) {
            refreshPayrollHistories()
        }
    }

    async function resetMonth(month: string) {
        if (!confirm(`⚠ RESET PAYROLL?\n\nApakah Anda yakin ingin menghapus seluruh history payroll untuk bulan ${month}?\n\nData yang dihapus harus di-finalize ulang dari Summary.`)) return

        await supabase
            .from('payroll_history')
            .delete()
            .eq('payroll_month', month)

        if (refreshPayrollHistories) {
            refreshPayrollHistories()
        }
    }

    // FIX: Hapus console.log yang spamming di body komponen

    const grouped: any = {}
    histories.forEach((history) => {
        if (!grouped[history.payroll_month]) {
            grouped[history.payroll_month] = []
        }
        grouped[history.payroll_month].push(history)
    })

    return (
        <div className="mt-10 space-y-6">
            <h2 className="text-3xl md:text-[42px] font-black uppercase tracking-[-0.04em] leading-none text-[var(--theme-accent)] mb-4 px-1 transition-colors duration-300">
                Payroll History
            </h2>

            <div className="space-y-6 md:space-y-8">

                {Object.entries(grouped).length === 0 && (
                    <div className="bg-[var(--theme-surface)] border-4 border-[var(--theme-primary)] rounded-[32px] p-10 text-center shadow-[8px_8px_0px_var(--theme-primary)] transition-colors duration-300">
                        <div className="w-20 h-20 bg-[var(--theme-primary)] rounded-3xl flex items-center justify-center mx-auto mb-6 text-[var(--theme-surface)] border-4 border-[var(--theme-primary)] shadow-[4px_4px_0px_var(--theme-accent)] -rotate-3 transition-colors duration-300">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div className="text-[var(--theme-primary)] font-black text-2xl uppercase tracking-tight">No Payroll History Yet</div>
                        <p className="text-sm font-black uppercase tracking-widest text-[var(--theme-highlight)] mt-2">Histori gaji bulanan akan muncul di sini</p>
                    </div>
                )}

                {Object.entries(grouped)
                    // Urutkan bulan dari yang terbaru (Z-A) jika formatnya YYYY-MM
                    .sort(([monthA], [monthB]) => monthB.localeCompare(monthA))
                    .map(([month, items]: any, index: number) => {

                        const total = items.reduce((total: number, item: any) => total + Number(item.final_salary || 0), 0)
                        const isAllPaid = items.every((item: any) => item.status === 'paid')

                        return (
                            <details key={month} open={index === 0} className="group bg-[var(--theme-surface)] border-4 border-[var(--theme-primary)] rounded-[32px] overflow-hidden shadow-[8px_8px_0px_var(--theme-primary)] transition-all duration-300">
                                
                                {/* Header Card Bulan */}
                                <summary className="list-none cursor-pointer p-6 flex flex-col gap-5 bg-[var(--theme-highlight)] text-[var(--theme-surface)] group-open:border-b-4 border-[var(--theme-primary)] transition-colors duration-300">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-[var(--theme-surface)] text-[var(--theme-highlight)] border-4 border-[var(--theme-primary)] items-center justify-center shadow-[4px_4px_0px_var(--theme-primary)] shrink-0 transition-colors duration-300">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            </div>
                                            <div>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                                    <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[var(--theme-surface)] leading-none">{month}</h3>
                                                    <span className={`w-max px-2 sm:px-3 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-full border-2 sm:border-4 border-[var(--theme-primary)] shadow-[2px_2px_0px_var(--theme-primary)] transition-colors duration-300 ${isAllPaid ? 'bg-[var(--theme-surface)] text-[var(--theme-highlight)]' : 'bg-[var(--theme-accent)] text-[var(--theme-surface)]'}`}>
                                                        {isAllPaid ? 'All Paid' : 'Generated'}
                                                    </span>
                                                </div>
                                                <div className="text-xs sm:text-sm font-black uppercase tracking-wide text-[var(--theme-surface)] opacity-80 mt-2 sm:mt-1">{items.length} Employees Processed</div>
                                            </div>
                                        </div>
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--theme-surface)] text-[var(--theme-primary)] flex items-center justify-center font-bold text-sm shrink-0 transform transition-all duration-300 group-open:rotate-180 border-2 border-[var(--theme-primary)] shadow-[2px_2px_0px_var(--theme-primary)]">
                                            ▼
                                        </div>
                                    </div>
                                    <div className="flex flex-col-reverse md:flex-row md:items-end justify-between gap-4 mt-2">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                resetMonth(month)
                                            }}
                                            className="w-full md:w-auto bg-[var(--theme-accent)] hover:brightness-90 text-[var(--theme-surface)] border-2 sm:border-4 border-[var(--theme-primary)] px-5 py-3 rounded-xl sm:rounded-2xl font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_var(--theme-primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-300"
                                        >
                                            Reset Month
                                        </button>
                                        <div className="md:text-right pt-2 border-t-2 md:border-t-0 border-white/20 md:pt-0">
                                            <div className="text-xs sm:text-sm font-black uppercase tracking-wide text-[var(--theme-surface)] opacity-70 mb-1">Total Payroll</div>
                                            <div className="text-3xl sm:text-4xl font-black tracking-tight text-[var(--theme-surface)]">
                                                Rp {Math.round(total).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </summary>

                                {/* List Karyawan */}
                                <div className="p-5 space-y-4 bg-[var(--theme-surface)] transition-colors duration-300">
                                    {items.sort((a: any, b: any) => {
                                        if (!employees) return 0;
                                        const indexA = employees.findIndex(e => String(e.id) === String(a.employee_id))
                                        const indexB = employees.findIndex(e => String(e.id) === String(b.employee_id))
                                        return (indexA !== -1 ? indexA : 999) - (indexB !== -1 ? indexB : 999)
                                    }).map((item: any) => (
                                        <div
                                            key={item.id}
                                            onClick={() => onSelectHistory?.(item)}
                                            className="group flex flex-col gap-5 bg-[var(--theme-surface)] brightness-110 border-4 border-[var(--theme-primary)] rounded-[28px] p-5 cursor-pointer shadow-[6px_6px_0px_var(--theme-primary)] transition-all duration-300 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-[var(--theme-highlight)] text-[var(--theme-surface)] border-4 border-[var(--theme-primary)] flex items-center justify-center font-black text-lg shadow-[3px_3px_0px_var(--theme-primary)] transition-colors duration-300">
                                                    {(item.employee_name || item.employees?.name || 'E').substring(0, 1).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-black uppercase text-[var(--theme-primary)] text-xl transition-colors duration-300">
                                                        {item.employee_name || item.employees?.name || 'Employee'}
                                                    </div>
                                                    <div className="text-[var(--theme-highlight)] text-xs mt-1 font-black uppercase tracking-wide transition-colors duration-300">
                                                        Bonus: Rp {Math.round(item.bonus || 0).toLocaleString()} • Potongan: Rp {Math.round(item.deduction || 0).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between gap-4 border-t-4 border-[var(--theme-primary)] pt-4 transition-colors duration-300">
                                                <div className="text-left sm:text-right">
                                                    <div className="text-[var(--theme-primary)] font-black text-2xl tracking-tight transition-colors duration-300">
                                                        Rp {Math.round(item.final_salary || 0).toLocaleString()}
                                                    </div>
                                                    <div className="text-xs text-[var(--theme-highlight)] mt-1 font-black uppercase tracking-wide transition-colors duration-300">Final Salary</div>
                                                </div>

                                                {item.status !== 'paid' ? (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            markAsPaid(item.id)
                                                        }}
                                                        className="bg-[var(--theme-highlight)] hover:brightness-125 text-[var(--theme-surface)] border-4 border-[var(--theme-primary)] px-4 py-3 rounded-2xl text-xs font-black uppercase shadow-[3px_3px_0px_var(--theme-primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-300"
                                                    >
                                                        Mark as Paid
                                                    </button>
                                                ) : (
                                                    <div className="px-3 py-2 rounded-2xl bg-[var(--theme-accent)] text-[var(--theme-surface)] text-xs font-black uppercase border-4 border-[var(--theme-primary)] shadow-[3px_3px_0px_var(--theme-primary)] flex items-center gap-2 transition-colors duration-300">
                                                        <svg className="w-3.5 h-3.5 text-[var(--theme-surface)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                        PAID
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </details>
                        )
                    })}
            </div>
        </div>
    )
}