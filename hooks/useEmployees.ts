import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export function useEmployees() {
  const [employees, setEmployees] = useState<any[]>([])

  const [name, setName] = useState('')
  const [position, setPosition] = useState('')
  const [employmentType, setEmploymentType] = useState('tetap')
  const [salary, setSalary] = useState('')
  const [overtimeRate, setOvertimeRate] = useState('')
  const [deduction, setDeduction] = useState('')
  const [bankName, setBankName] = useState('')
  const [bankAccountNumber, setBankAccountNumber] = useState('')
  const [bankAccountName, setBankAccountName] = useState('')
  const [email, setEmail] = useState('')
  const [payrollStartDay, setPayrollStartDay] = useState('1')

  const fetchEmployees = useCallback(async () => {
    const { data, error } = await supabase.from('employees').select('*')
    if (error) console.error('EMPLOYEE ERROR:', error)
    
    const sortedData = [...(data || [])].sort((a, b) => {
      // 1. Prioritas Tipe Pekerjaan
      const normalizeType = (type: string) => {
        const t = String(type || '').toLowerCase().trim()
        if (t.includes('tidak')) return 2
        if (t.includes('freelance')) return 3
        // Jika tipe kosong, null, typo, atau 'tetap', paksa masuk ke prioritas 1 (Paling Atas)
        return 1
      }
      
      const orderA = normalizeType(a.employment_type)
      const orderB = normalizeType(b.employment_type)

      if (orderA !== orderB) {
        return orderA - orderB
      }

      // 2. Jika tipe sama, urutkan Gaji Pokok dari yang Terbesar ke Terkecil (Descending)
      const parseSalary = (val: any) => {
        if (!val) return 0;
        const clean = String(val).replace(/[^0-9]/g, '');
        return Number(clean) || 0;
      }

      const salaryA = parseSalary(a.base_salary)
      const salaryB = parseSalary(b.base_salary)
      
      if (salaryA !== salaryB) {
        return salaryB - salaryA
      }
      
      // 3. Fallback: Urutkan Abjad Nama
      return String(a.name || '').localeCompare(String(b.name || ''))
    })

    setEmployees(sortedData)
  }, [])

  const addEmployee = async () => {
    if (!name) return

    await supabase.from('employees').insert({
      name,
      position,
      employment_type: employmentType,
      base_salary: Number(salary),
      overtime_rate: Number(overtimeRate),
      daily_deduction: Number(deduction),
      bank_name: bankName,
      bank_account_number: bankAccountNumber,
      bank_account_name: bankAccountName,
      email,
      payroll_start_day: Number(payrollStartDay),
    })

    setName('')
    setPosition('')
    setSalary('')
    setOvertimeRate('')
    setDeduction('')
    setBankName('')
    setBankAccountNumber('')
    setBankAccountName('')
    setEmail('')
    setPayrollStartDay('1')
    setEmploymentType('tetap')

    fetchEmployees()
  }

  const deleteEmployee = async (id: string) => {
    await supabase.from('employees').delete().eq('id', id)
    fetchEmployees()
  }

  return {
    employees,
    fetchEmployees,
    addEmployee,
    deleteEmployee,
    formState: {
      name, setName,
      position, setPosition,
      employmentType, setEmploymentType,
      salary, setSalary,
      overtimeRate, setOvertimeRate,
      deduction, setDeduction,
      bankName, setBankName,
      bankAccountNumber, setBankAccountNumber,
      bankAccountName, setBankAccountName,
      email, setEmail,
      payrollStartDay, setPayrollStartDay,
    }
  }
}