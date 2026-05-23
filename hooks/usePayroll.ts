import { calculatePayroll } from '@/lib/payroll/calculatePayroll'

export function usePayroll() {
  return {
    calculatePayroll,
  }
}