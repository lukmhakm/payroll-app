export type EmploymentType = 'fulltime' | 'contract' | 'freelance'

export interface Employee {
  id: string
  name: string
  position: string
  employment_type: EmploymentType
  base_salary: number
  overtime_rate: number
  daily_deduction: number
  payroll_start_day: number
  bank_name?: string
  bank_account_number?: string
  bank_account_name?: string
  email?: string
  created_at?: string
}

export interface Attendance {
  id: string
  employee_id: string
  work_date: string
  check_in?: string | null
  check_out?: string | null
  status: 'hadir' | 'sakit' | 'izin' | 'alpha' | 'libur'
  is_national_holiday: boolean
  overtime_hours: number
  created_at?: string
}

export interface PayrollHistory {
  id: string
  employee_id: string
  employee_name: string
  employee_position: string
  bank_name?: string | null
  bank_account_number?: string | null
  bank_account_name?: string | null
  payroll_month: string
  base_salary: number
  overtime_pay: number
  bonus: number
  deduction: number
  final_salary: number
  status: 'generated' | 'paid'
  created_at?: string
}

export interface PayrollAdjustment {
  bonus: number
  deduction: number
}

export type AppSettings = {
  companyName: string
  slipFooterText: string
  emailSignature: string
  defaultPayrollStart: string
  showConfidential: boolean
  showWatermark: boolean
  showOvertimeDetails?: boolean
}

export type ThemePalette = {
  primary: string
  surface: string
  accent: string
  highlight: string
}

/**
 * Represents the calculated payroll data for a specific period,
 * used for display in UI components before it's finalized and saved as PayrollHistory.
 */
export interface CalculatedPayroll {
  payroll_month: string;
  periodStart?: string;
  periodEnd?: string;
  baseSalary?: number;
  overtime?: number;
  totalOvertimePay?: number;
  overtimeHours?: number;
  overtimeDays?: number;
  deduction?: number;
  totalDeduction?: number;
  absenceDeduction?: number;
  extraAdjustment?: number;
  bonus?: number;
  finalSalary?: number;
  hadirCount?: number;
  attendanceCount?: number;
}