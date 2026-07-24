import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Employee } from '@/types'

export interface EmployeeFormData {
  name: string; position: string; employmentType: string;
  salary: string; overtimeRate: string; deduction: string;
  bankName: string; bankAccountNumber: string; bankAccountName: string;
  email: string; payrollStartDay: string;
}

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([])

  const fetchEmployees = useCallback(async () => {
    const { data, error } = await supabase.from('employees').select('*')
    if (error) console.error('EMPLOYEE ERROR:', error)
    
    // Normalisasi data legacy dari database agar sesuai dengan istilah baru
    const normalizedData = (data || []).map(emp => ({
      ...emp,
      employment_type: emp.employment_type === 'tetap' ? 'fulltime' : (emp.employment_type === 'tidak_tetap' ? 'contract' : emp.employment_type)
    }))

    const sortedData = [...normalizedData].sort((a, b) => {
      // 1. Prioritas Tipe Pekerjaan
      const normalizeType = (type: string) => {
        const t = String(type || '').toLowerCase().trim()
        if (t.includes('contract') || t.includes('tidak')) return 2
        if (t.includes('freelance')) return 3
        // Jika tipe kosong, null, typo, atau 'fulltime', paksa masuk ke prioritas 1 (Paling Atas)
        return 1
      }
      
      const orderA = normalizeType(a.employment_type)
      const orderB = normalizeType(b.employment_type)

      if (orderA !== orderB) {
        return orderA - orderB
      }

      // 2. Jika tipe sama, urutkan Gaji Pokok dari yang Terbesar ke Terkecil (Descending)
      const parseSalary = (val: unknown) => {
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

    setEmployees(sortedData as Employee[])
  }, [])

  const addEmployee = async (data: EmployeeFormData) => {
    if (!data.name) return

    await supabase.from('employees').insert({
      name: data.name,
      position: data.position,
      employment_type: data.employmentType,
      base_salary: Number(data.salary),
      overtime_rate: Number(data.overtimeRate),
      daily_deduction: Number(data.deduction),
      bank_name: data.bankName,
      bank_account_number: data.bankAccountNumber,
      bank_account_name: data.bankAccountName,
      email: data.email,
      payroll_start_day: Number(data.payrollStartDay),
    })

    fetchEmployees()
  }

  const resignEmployee = async (id: string) => {
    try {
      const { error } = await supabase.from('employees').update({ is_active: false }).eq('id', id)
      if (error) {
        console.error('EMPLOYEE RESIGN ERROR:', error)
        alert(`Gagal memproses resign karyawan: ${error.message}`)
        return false
      }
      return true
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.error('EMPLOYEE RESIGN UNEXPECTED ERROR:', err)
      alert(`Terjadi kesalahan saat memproses resign: ${message}`)
      return false
    } finally {
      fetchEmployees()
    }
  }

  const reactivateEmployee = async (id: string) => {
    try {
      const { error } = await supabase.from('employees').update({ is_active: true }).eq('id', id)
      if (error) {
        console.error('EMPLOYEE REACTIVATE ERROR:', error)
        alert(`Gagal mengaktifkan karyawan: ${error.message}`)
        return false
      }
      return true
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.error('EMPLOYEE REACTIVATE UNEXPECTED ERROR:', err)
      alert(`Terjadi kesalahan saat mengaktifkan karyawan: ${message}`)
      return false
    } finally {
      fetchEmployees()
    }
  }

  const deleteEmployee = async (id: string) => {
    try {
      // Hapus data absensi & riwayat penggajian terkait terlebih dahulu (mencegah error foreign key 23503)
      const { error: attErr } = await supabase.from('attendance').delete().eq('employee_id', id)
      if (attErr) console.error('ATTENDANCE DELETE ERROR:', attErr)

      const { error: histErr } = await supabase.from('payroll_history').delete().eq('employee_id', id)
      if (histErr) console.error('PAYROLL HISTORY DELETE ERROR:', histErr)

      const { error: empErr } = await supabase.from('employees').delete().eq('id', id)
      if (empErr) {
        console.error('EMPLOYEE DELETE ERROR:', empErr)
        alert(`Gagal menghapus data karyawan: ${empErr.message}`)
        return false
      }
      return true
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.error('EMPLOYEE DELETE UNEXPECTED ERROR:', err)
      alert(`Terjadi kesalahan saat menghapus karyawan: ${message}`)
      return false
    } finally {
      fetchEmployees()
    }
  }

  return {
    employees,
    fetchEmployees,
    addEmployee,
    resignEmployee,
    reactivateEmployee,
    deleteEmployee,
  }
}