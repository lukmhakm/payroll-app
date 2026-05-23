export type EmploymentType =
  | 'tetap'
  | 'tidak_tetap'
  | 'freelance'

export type AttendanceStatus =
  | 'hadir'
  | 'izin'
  | 'alpha'
  | 'libur'

export type Employee = {
  id: string
  name: string
  position: string
  employmentType: EmploymentType
  salary: number
  deduction?: number
  payrollStartDay?: number
  bonus?: number
}

export type Attendance = {
  id: string
  employeeId: string
  date: string
  overtime: number
  status: AttendanceStatus
}

export type PayrollResult = {
  basicSalary: number
  overtime: number
  bonus: number
  deduction: number
  attendanceCount: number
  totalSalary: number
}