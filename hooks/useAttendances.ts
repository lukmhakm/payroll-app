import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export function useAttendances() {
  const [attendances, setAttendances] = useState<any[]>([])

  const fetchAttendances = useCallback(async () => {
    const { data, error } = await supabase
      .from('attendance')
      .select(`
        *,
        employees (id, name)
      `)
      .order('work_date', { ascending: false })

    if (error) console.error('ATTENDANCE ERROR:', error)
    setAttendances(data || [])
  }, [])

  return {
    attendances,
    fetchAttendances,
  }
}