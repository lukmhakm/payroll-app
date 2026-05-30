'use client'

import { useEffect, useState } from 'react'
import type { Employee, CalculatedPayroll, AppSettings, ThemePalette } from '@/types';
import SlipContent from '@/components/payroll/SlipContent';

interface SlipPayload {
    employee: Employee;
    payroll: CalculatedPayroll;
    settings: AppSettings;
    theme: ThemePalette;
}

export default function Page() {
    const [slipData, setSlipData] = useState<SlipPayload | null>(null)

    useEffect(() => {
        // Data is injected by Puppeteer into the window object
        const data = (window as any).__SALARY_SLIP_DATA__;
        const theme = (window as any).__SALARY_SLIP_THEME__;
        if (data && theme) {
            setSlipData({ ...data, theme } as SlipPayload);
        }
    }, []);
    
    if (!slipData) {
        return <div style={{ padding: 40, fontFamily: 'sans-serif' }}>Loading slip data...</div>;
    }

    return (
        // The container for Puppeteer needs a fixed width.
        <div style={{ width: '448px' }}>
            <SlipContent
                employee={slipData.employee}
                payroll={slipData.payroll}
                settings={slipData.settings}
                theme={slipData.theme}
            />
        </div>
    )
}