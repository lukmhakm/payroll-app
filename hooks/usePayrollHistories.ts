import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { PayrollHistory } from '@/types'

export function usePayrollHistories() {
  const [payrollHistories, setPayrollHistories] = useState<PayrollHistory[]>([])

  const fetchPayrollHistories = useCallback(async () => {
    const { data, error } = await supabase.from('payroll_history').select('*')
    if (error) console.error('PAYROLL HISTORY ERROR:', error)
    setPayrollHistories((data as PayrollHistory[]) || [])
  }, [])

  return {
    payrollHistories,
    fetchPayrollHistories,
  }
}