import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Attendance } from '@/types'

export type AttendanceWithEmployee = Attendance & { employees: { id: string; name: string } }

export function useAttendances() {
  const [attendances, setAttendances] = useState<AttendanceWithEmployee[]>([])

  const fetchAttendances = useCallback(async () => {
    const { data, error } = await supabase
      .from('attendance')
      .select(`
        *,
        employees (id, name)
      `)
      .order('work_date', { ascending: false })

    if (error) console.error('ATTENDANCE ERROR:', error)
    setAttendances((data as AttendanceWithEmployee[]) || [])
  }, [])

  return {
    attendances,
    fetchAttendances,
  }
}