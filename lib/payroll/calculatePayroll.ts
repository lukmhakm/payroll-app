import {
  Attendance,
  Employee,
} from '@/types/payroll'

import { calculateFreelancePayroll } from './calculateFreelancePayroll'
import { calculatePermanentPayroll } from './calculatePermanentPayroll'

export function calculatePayroll(
  employee: Employee,
  attendances: Attendance[]
) {
  if (employee.employmentType === 'freelance') {
    return calculateFreelancePayroll(
      employee,
      attendances
    )
  }

  return calculatePermanentPayroll(
    employee,
    attendances
  )
}