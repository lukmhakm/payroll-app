import { useState, useEffect } from 'react'

export function usePayrollAdjustments(selectedMonth: string) {
    const [adjustments, setAdjustments] = useState<any>({})

    // Load data bonus & deduction dari local storage ketika bulan berubah
    useEffect(() => {
        const saved = localStorage.getItem(`payroll_adjustments_${selectedMonth}`)
        if (saved) {
            try {
                setAdjustments(JSON.parse(saved))
            } catch (e) {}
        } else {
            setAdjustments({})
        }
    }, [selectedMonth])

    function handleUpdateAdjustment(employeeId: string, field: 'bonus' | 'deduction', value: number) {
        setAdjustments((prev: any) => {
            const next = {
                ...prev,
                [employeeId]: {
                    ...(prev[employeeId] || {}),
                    [field]: value
                }
            }
            // Simpan secara otomatis ke browser storage setiap kali ada ketikan
            localStorage.setItem(`payroll_adjustments_${selectedMonth}`, JSON.stringify(next))
            return next
        })
    }

    function clearAdjustments() {
        localStorage.removeItem(`payroll_adjustments_${selectedMonth}`)
        setAdjustments({})
    }

    return { adjustments, handleUpdateAdjustment, clearAdjustments }
}