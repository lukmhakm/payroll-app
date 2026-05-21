'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

import PayrollAnalytics from '@/components/PayrollAnalytics'
import PayrollSummary from '@/components/PayrollSummary'
import PayrollHistory from '@/components/PayrollHistory'
import AttendanceList from '@/components/AttendanceList'
import AttendanceForm from '@/components/AttendanceForm'
import EmployeeForm from '@/components/EmployeeForm'
import EmployeeCard from '@/components/EmployeeCard'
import SalarySlipCard from '@/components/SalarySlipCard'

export default function Home() {

  const [employees, setEmployees] =
    useState<any[]>([])

  const [attendances, setAttendances] =
    useState<any[]>([])

  const [payrollHistories, setPayrollHistories] =
    useState<any[]>([])

  const [selectedPayroll, setSelectedPayroll] =
    useState<any>(null)

  const [selectedHistory, setSelectedHistory] =
    useState<any>(null)

  const [selectedMonth, setSelectedMonth] =
    useState(
      new Date().toISOString().slice(0, 7)
    )

  const [name, setName] =
    useState('')

  const [position, setPosition] =
    useState('')

  const [salary, setSalary] =
    useState('')

  const [overtimeRate, setOvertimeRate] =
    useState('')

  const [deduction, setDeduction] =
    useState('')

  const [permitDeduction, setPermitDeduction] =
    useState('')

  const [bankName, setBankName] =
    useState('')

  const [bankAccountNumber, setBankAccountNumber] =
    useState('')

  const [bankAccountName, setBankAccountName] =
    useState('')

  const [email, setEmail] =
    useState('')

  const [payrollStartDay, setPayrollStartDay] =
    useState('1')

  useEffect(() => {

    fetchEmployees()
    fetchAttendances()
    fetchPayrollHistories()

  }, [])

  async function fetchEmployees() {

    const {
      data,
      error,
    } = await supabase
      .from('employees')
      .select('*')

    console.log(
      'EMPLOYEES:',
      data
    )

    console.log(
      'EMPLOYEE ERROR:',
      error
    )

    setEmployees(data || [])
  }

  async function fetchAttendances() {

    const {
      data,
      error,
    } = await supabase
      .from('attendance')
      .select('*')

    console.log(
      'ATTENDANCES:',
      data
    )

    console.log(
      'ATTENDANCE ERROR:',
      error
    )

    setAttendances(data || [])
  }

  async function fetchPayrollHistories() {

    const {
      data,
      error,
    } = await supabase
      .from('payroll_history')
      .select('*')

    console.log(
      'PAYROLL HISTORIES:',
      data
    )

    console.log(
      'PAYROLL HISTORY ERROR:',
      error
    )

    setPayrollHistories(data || [])
  }

  async function addEmployee() {

    if (!name) return

    await supabase
      .from('employees')
      .insert({
        name,
        position,
        base_salary: Number(salary),
        overtime_rate: Number(overtimeRate),
        absent_deduction: Number(deduction),
        permit_deduction: Number(permitDeduction),
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
    setPermitDeduction('')
    setBankName('')
    setBankAccountNumber('')
    setBankAccountName('')
    setEmail('')
    setPayrollStartDay('1')

    fetchEmployees()
  }

  async function deleteEmployee(id: string) {

    await supabase
      .from('employees')
      .delete()
      .eq('id', id)

    fetchEmployees()
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 lg:p-10">

      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-10">

          <h1 className="text-4xl lg:text-5xl font-black">
            Payroll App
          </h1>

          <input
            type="month"
            value={selectedMonth}
            onChange={(e) =>
              setSelectedMonth(
                e.target.value
              )
            }
            className="
              bg-zinc-900
              border
              border-zinc-800
              rounded-2xl
              px-4
              py-3
            "
          />

        </div>

        <div className="mb-4 text-red-500 text-sm space-y-1">
          <div>
            Employees: {employees.length}
          </div>

          <div>
            Attendances: {attendances.length}
          </div>

          <div>
            Payroll Histories: {payrollHistories.length}
          </div>
        </div>

        <PayrollAnalytics
          employees={employees}
          attendances={attendances}
        />

        <div className="mt-10">

          <PayrollSummary
            employees={employees}
            attendances={attendances}
            selectedMonth={selectedMonth}
            onGenerateSlip={setSelectedPayroll}
          />

        </div>

        <div className="mt-10">

          <AttendanceForm
            employees={employees}
            refreshAttendances={fetchAttendances}
          />

        </div>

        <div className="mt-10">

          <AttendanceList
            attendances={attendances}
            selectedMonth={selectedMonth}
          />

        </div>

        <div className="mt-10">

          <EmployeeForm
            name={name}
            setName={setName}
            position={position}
            setPosition={setPosition}
            salary={salary}
            setSalary={setSalary}
            overtimeRate={overtimeRate}
            setOvertimeRate={setOvertimeRate}
            deduction={deduction}
            setDeduction={setDeduction}
            permitDeduction={permitDeduction}
            setPermitDeduction={setPermitDeduction}
            bankName={bankName}
            setBankName={setBankName}
            bankAccountNumber={bankAccountNumber}
            setBankAccountNumber={setBankAccountNumber}
            bankAccountName={bankAccountName}
            setBankAccountName={setBankAccountName}
            email={email}
            setEmail={setEmail}
            payrollStartDay={payrollStartDay}
            setPayrollStartDay={setPayrollStartDay}
            addEmployee={addEmployee}
          />

        </div>

        <div className="mt-10 space-y-4">

          {employees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              deleteEmployee={deleteEmployee}
              refreshEmployees={fetchEmployees}
            />
          ))}

        </div>

        <div className="mt-10">

          <PayrollHistory
            histories={payrollHistories}
            refreshPayrollHistories={fetchPayrollHistories}
            onSelectHistory={setSelectedHistory}
          />

        </div>

      </div>

      {
        selectedPayroll && (
          <SalarySlipCard
            employee={selectedPayroll.employee}
            payroll={selectedPayroll.payroll}
            onClose={() =>
              setSelectedPayroll(null)
            }
          />
        )
      }

      {
        selectedHistory && (
          <SalarySlipCard
            employee={{
              name:
                selectedHistory.employee_name,

              position:
                selectedHistory.employee_position,

              bank_name:
                selectedHistory.bank_name,

              bank_account_number:
                selectedHistory.bank_account_number,
            }}
            payroll={{
              baseSalary:
                selectedHistory.base_salary,

              totalOvertimePay:
                selectedHistory.overtime_pay,

              bonus:
                selectedHistory.bonus,

              deduction:
                selectedHistory.deduction,

              finalSalary:
                selectedHistory.final_salary,
            }}
            onClose={() =>
              setSelectedHistory(null)
            }
          />
        )
      }

    </main>
  )
}