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

    async function markAsPaid(
        payrollId: string
    ) {

        await supabase
            .from('payroll_history')
            .update({
                status: 'paid',
            })
            .eq('id', payrollId)

        if (
            refreshPayrollHistories
        ) {
            refreshPayrollHistories()
        }
    }

    console.log(
        'Payroll histories:',
        histories
    )

    const grouped: any = {}

    histories.forEach((history) => {

        if (
            !grouped[
                history.payroll_month
            ]
        ) {
            grouped[
                history.payroll_month
            ] = []
        }

        grouped[
            history.payroll_month
        ].push(history)
    })

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mt-10">

            <h2 className="text-2xl font-semibold mb-6">
                Payroll History
            </h2>

            <div className="space-y-6">

                {
                    Object.entries(grouped).length === 0 && (
                        <div className="text-zinc-500 text-sm">
                            No payroll history yet
                        </div>
                    )
                }

                {
                    Object.entries(grouped)
                        .map(([month, items]: any) => {

                            const total =
                                items.reduce(
                                    (
                                        total: number,
                                        item: any
                                    ) =>
                                        total +
                                        Number(
                                            item.final_salary || 0
                                        ),
                                    0
                                )

                            return (
                                <div
                                    key={month}
                                    className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5"
                                >

                                    <div className="flex items-center justify-between mb-5">

                                        <div>

                                            <div className="flex items-center gap-3">

                                                <div className="text-2xl font-bold">
                                                    {month}
                                                </div>

                                                <div
                                                    className={`
                                                        text-xs
                                                        px-3
                                                        py-1
                                                        rounded-full
                                                        font-semibold

                                                        ${
                                                            items[0]?.status === 'paid'
                                                                ? 'bg-blue-500/20 text-blue-400'

                                                                : items[0]?.status === 'finalized'
                                                                ? 'bg-green-500/20 text-green-400'

                                                                : 'bg-yellow-500/20 text-yellow-400'
                                                        }
                                                    `}
                                                >
                                                    {
                                                        items[0]?.status || 'draft'
                                                    }
                                                </div>

                                            </div>

                                            <div className="text-zinc-500 mt-1">
                                                {items.length} employee
                                            </div>

                                        </div>

                                        <div className="text-right">

                                            <div className="text-zinc-500 text-sm">
                                                Total Payroll
                                            </div>

                                            <div className="text-2xl font-bold text-green-400 mt-1">
                                                Rp {
                                                    Math.round(
                                                        total
                                                    ).toLocaleString()
                                                }
                                            </div>

                                        </div>

                                    </div>

                                    <div className="space-y-3">

                                        {
                                            items.map((item: any) => (

                                                <div
                                                    key={item.id}
                                                    onClick={() =>
                                                        onSelectHistory?.(item)
                                                    }
                                                    className="
                                                        flex items-center justify-between
                                                        bg-black/40 rounded-xl p-4
                                                        cursor-pointer
                                                        hover:border hover:border-zinc-700
                                                        transition
                                                    "
                                                >

                                                    <div>

                                                        <div className="font-semibold">
                                                            {
                                                                item.employees?.name ||
                                                                'Employee'
                                                            }
                                                        </div>

                                                        <div className="text-zinc-500 text-sm mt-1">
                                                            Bonus:
                                                            Rp {
                                                                Math.round(
                                                                    item.bonus || 0
                                                                ).toLocaleString()
                                                            }
                                                        </div>

                                                    </div>

                                                    <div className="text-right">

                                                        <div className="text-green-400 font-bold">
                                                            Rp {
                                                                Math.round(
                                                                    item.final_salary || 0
                                                                ).toLocaleString()
                                                            }
                                                        </div>

                                                        {
                                                            item.status !== 'paid' && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        markAsPaid(item.id)
                                                                    }}
                                                                    className="
                                                                        mt-3
                                                                        text-xs
                                                                        bg-blue-500
                                                                        hover:bg-blue-400
                                                                        text-white
                                                                        px-3
                                                                        py-2
                                                                        rounded-lg
                                                                        font-semibold
                                                                    "
                                                                >
                                                                    Mark as Paid
                                                                </button>
                                                            )
                                                        }

                                                    </div>

                                                </div>
                                            ))
                                        }

                                    </div>

                                </div>
                            )
                        })
                }

            </div>

        </div>
    )
}