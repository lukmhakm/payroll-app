import {
  Attendance,
  Employee,
  PayrollResult,
} from '@/types/payroll'

import { calculateOvertime } from './calculateOvertime'
import { calculateDeduction } from './calculateDeduction'

export function calculatePermanentPayroll(
  employee: Employee,
  attendances: Attendance[]
): PayrollResult {
  const overtime = calculateOvertime(attendances)

  const deduction = calculateDeduction(employee.deduction)

  const bonus = employee.bonus || 0

  const totalSalary =
    employee.salary + overtime + bonus - deduction

  return {
    basicSalary: employee.salary,
    overtime,
    bonus,
    deduction,
    attendanceCount: attendances.length,
    totalSalary,
  }
}