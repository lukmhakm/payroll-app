'use client'

import React, { useState } from 'react'
import PayrollCardHeader from './PayrollCardHeader'
import PayrollCardDetails from './PayrollCardDetails'

// TODO: These types should be imported from a central types file (e.g., @/types/payroll.ts)
import type { Employee, CalculatedPayroll as Payroll, PayrollAdjustment } from '@/types'

type Props = {
    employee: Employee
    payroll: Payroll
    adjustment?: PayrollAdjustment
    isFinalized: boolean
    onUpdateAdjustment?: (field: 'bonus' | 'deduction', value: number) => void
    onGenerateSlip: () => void
    onFinalize: () => void
}

export default function PayrollCard({ employee, payroll, adjustment, isFinalized, onUpdateAdjustment, onGenerateSlip, onFinalize }: Props) {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <div className="border-4 border-[var(--theme-primary)] shadow-[8px_8px_0px_var(--theme-primary)] flex flex-col mb-6 overflow-hidden rounded-3xl bg-[var(--theme-primary)] transition-colors duration-300">
            <PayrollCardHeader 
                employee={employee} 
                totalSalary={payroll.finalSalary} 
                expanded={isExpanded} 
                isFinalized={isFinalized}
                onToggle={() => setIsExpanded(!isExpanded)} 
            />
            
            <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <PayrollCardDetails 
                        employee={employee}
                        payroll={payroll} 
                        adjustment={adjustment}
                        isFinalized={isFinalized}
                        onUpdateAdjustment={onUpdateAdjustment}
                        onGenerateSlip={onGenerateSlip} 
                        onFinalize={onFinalize}
                    />
                </div>
            </div>
        </div>
    )
}