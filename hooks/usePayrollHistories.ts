import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export function usePayrollHistories() {
  const [payrollHistories, setPayrollHistories] = useState<any[]>([])

  const fetchPayrollHistories = useCallback(async () => {
    const { data, error } = await supabase.from('payroll_history').select('*')
    if (error) console.error('PAYROLL HISTORY ERROR:', error)
    setPayrollHistories(data || [])
  }, [])

  return {
    payrollHistories,
    fetchPayrollHistories,
  }
}