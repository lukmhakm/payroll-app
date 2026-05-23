import { Attendance } from '@/types/payroll'

export function calculateOvertime(attendances: Attendance[]) {
  return attendances.reduce((total, item) => {
    return total + (item.overtime || 0)
  }, 0)
}