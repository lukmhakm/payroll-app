'use client'

import { supabase } from '@/lib/supabase'

type Props = {
    histories: any[]
    refreshPayrollHistories: any
    onSelectHistory: any
}

export default function PayrollHistory({
    histories,
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
            <h2 className="text-3xl md:text-[42px] font-black uppercase tracking-[-0.04em] leading-none text-[#E43427] mb-4 px-1">
                Payroll History
            </h2>

            <div className="space-y-6 md:space-y-8">

                {Object.entries(grouped).length === 0 && (
                    <div className="bg-[#F3EBD9] border-4 border-[#111111] rounded-[32px] p-10 text-center shadow-[8px_8px_0px_#111111]">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-500">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div className="text-zinc-400 font-medium">No payroll history yet</div>
                        <p className="text-sm text-zinc-600 mt-1">Histori gaji bulanan akan muncul di sini</p>
                    </div>
                )}

                {Object.entries(grouped)
                    // Urutkan bulan dari yang terbaru (Z-A) jika formatnya YYYY-MM
                    .sort(([monthA], [monthB]) => monthB.localeCompare(monthA))
                    .map(([month, items]: any) => {

                        const total = items.reduce((total: number, item: any) => total + Number(item.final_salary || 0), 0)
                        const isAllPaid = items.every((item: any) => item.status === 'paid')

                        return (
                            <div key={month} className="bg-[#F3EBD9] border-4 border-[#111111] rounded-[32px] overflow-hidden shadow-[8px_8px_0px_#111111]">
                                
                                {/* Header Card Bulan */}
                                <div className="p-6 flex flex-col gap-5 border-b-4 border-[#111111] bg-[#15438D] text-[#F3EBD9]">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-[#F3EBD9] text-[#15438D] border-4 border-[#111111] flex items-center justify-center shadow-[4px_4px_0px_#111111]">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-3xl font-black uppercase tracking-tight text-[#F3EBD9]">{month}</h3>
                                                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border-4 border-[#111111] shadow-[2px_2px_0px_#111111] ${isAllPaid ? 'bg-[#F3EBD9] text-[#15438D]' : 'bg-[#E43427] text-[#F3EBD9]'}`}>
                                                    {isAllPaid ? 'All Paid' : 'Finalized'}
                                                </span>
                                            </div>
                                            <div className="text-sm font-black uppercase tracking-wide text-[#F3EBD9]/80 mt-1">{items.length} Employees Processed</div>
                                        </div>
                                    </div>
                                    <div className="md:text-right">
                                        <div className="text-sm font-black uppercase tracking-wide text-[#F3EBD9]/70 mb-1">Total Payroll</div>
                                        <div className="text-4xl font-black tracking-tight text-[#F3EBD9]">
                                            Rp {Math.round(total).toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                {/* List Karyawan */}
                                <div className="p-5 space-y-4 bg-[#F3EBD9]">
                                    {items.map((item: any) => (
                                        <div
                                            key={item.id}
                                            onClick={() => onSelectHistory?.(item)}
                                            className="group flex flex-col gap-5 bg-white border-4 border-[#111111] rounded-[28px] p-5 cursor-pointer shadow-[6px_6px_0px_#111111] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-[#15438D] text-[#F3EBD9] border-4 border-[#111111] flex items-center justify-center font-black text-lg shadow-[3px_3px_0px_#111111]">
                                                    {(item.employee_name || item.employees?.name || 'E').substring(0, 1).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-black uppercase text-[#111111] text-xl">
                                                        {item.employee_name || item.employees?.name || 'Employee'}
                                                    </div>
                                                    <div className="text-[#15438D] text-xs mt-1 font-black uppercase tracking-wide">
                                                        Bonus: Rp {Math.round(item.bonus || 0).toLocaleString()} • Potongan: Rp {Math.round(item.deduction || 0).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between gap-4 border-t-4 border-[#111111] pt-4">
                                                <div className="text-left sm:text-right">
                                                    <div className="text-[#111111] font-black text-2xl tracking-tight">
                                                        Rp {Math.round(item.final_salary || 0).toLocaleString()}
                                                    </div>
                                                    <div className="text-xs text-[#15438D] mt-1 font-black uppercase tracking-wide">Final Salary</div>
                                                </div>

                                                {item.status !== 'paid' ? (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            markAsPaid(item.id)
                                                        }}
                                                        className="bg-[#15438D] text-[#F3EBD9] border-4 border-[#111111] px-4 py-3 rounded-2xl text-xs font-black uppercase shadow-[3px_3px_0px_#111111] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                                                    >
                                                        Mark as Paid
                                                    </button>
                                                ) : (
                                                    <div className="px-3 py-2 rounded-2xl bg-[#E43427] text-[#F3EBD9] text-xs font-black uppercase border-4 border-[#111111] shadow-[3px_3px_0px_#111111] flex items-center gap-2">
                                                        <svg className="w-3.5 h-3.5 text-[#F3EBD9]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                        PAID
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
            </div>
        </div>
    )
}