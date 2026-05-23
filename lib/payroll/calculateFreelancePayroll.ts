import {
  Attendance,
  Employee,
  PayrollResult,
} from '@/types/payroll'

import { calculateOvertime } from './calculateOvertime'

export function calculateFreelancePayroll(
  employee: Employee,
  attendances: Attendance[]
): PayrollResult {
  const attendanceCount = attendances.filter(
    item => item.status === 'hadir'
  ).length

  const overtime = calculateOvertime(attendances)

  const bonus = employee.bonus || 0

  const basicSalary = attendanceCount * employee.salary

  const totalSalary = basicSalary + overtime + bonus

  return {
    basicSalary,
    overtime,
    bonus,
    deduction: 0,
    attendanceCount,
    totalSalary,
  }
}