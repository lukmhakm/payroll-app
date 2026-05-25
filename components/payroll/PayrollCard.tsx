'use client'

import React, { useState } from 'react'
import PayrollCardHeader from './PayrollCardHeader'
import PayrollCardDetails from './PayrollCardDetails'

type Props = {
    employee: any
    payroll: any
    adjustment?: any
    isFinalized: boolean
    onUpdateAdjustment?: (field: string, value: number) => void
    onGenerateSlip: () => void
    onFinalize: () => void
}

export default function PayrollCard({ employee, payroll, adjustment, isFinalized, onUpdateAdjustment, onGenerateSlip, onFinalize }: Props) {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <div className="border-4 border-[#111111] shadow-[8px_8px_0px_#111111] flex flex-col mb-6 overflow-hidden rounded-3xl bg-gray-950">
            <PayrollCardHeader 
                employee={employee} 
                totalSalary={payroll.finalSalary} 
                expanded={isExpanded} 
                isFinalized={isFinalized}
                onToggle={() => setIsExpanded(!isExpanded)} 
            />
            
            {isExpanded && (
                <PayrollCardDetails 
                    employee={employee}
                    payroll={payroll} 
                    adjustment={adjustment}
                    isFinalized={isFinalized}
                    onUpdateAdjustment={onUpdateAdjustment}
                    onGenerateSlip={onGenerateSlip} 
                    onFinalize={onFinalize}
                />
            )}
        </div>
    )
}