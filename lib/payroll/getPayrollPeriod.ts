export function getPayrollPeriod(
  payrollStartDay: number
) {
  const today = new Date()

  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  let startDate = new Date(
    currentYear,
    currentMonth,
    payrollStartDay
  )

  let endDate = new Date(
    currentYear,
    currentMonth + 1,
    payrollStartDay - 1
  )

  return {
    startDate,
    endDate,
  }
}