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
import SettingsModal from '@/components/SettingModal'
import { useTheme } from '@/providers/ThemeProvider'

export default function Home() {

  const [employees, setEmployees] =
    useState<any[]>([])

  const [employmentType, setEmploymentType] = useState('tetap')

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

  const [showSettings, setShowSettings] =
    useState(false)

  const [companyName, setCompanyName] =
    useState('GAJYUN')

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

  const { theme } = useTheme()

  const [mounted, setMounted] =
    useState(false)

  useEffect(() => {

    setMounted(true)

    fetchEmployees()
    fetchAttendances()
    fetchPayrollHistories()

    const savedCompany =
      localStorage.getItem('company_name')

    if (savedCompany) {
      setCompanyName(savedCompany.toUpperCase())
    }

  }, [showSettings])

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
      .select(`
  *,
  employees (
    id,
    name
  )
`)
      .order('work_date', { ascending: false })

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

  async function deleteEmployee(id: string) {

    await supabase
      .from('employees')
      .delete()
      .eq('id', id)

    fetchEmployees()
  }

  if (!mounted) {
    return null
  }

  return (
    <main
      className="min-h-screen font-sans pb-24 relative overflow-hidden transition-colors"
      style={{
        backgroundColor: theme.surface,
        color: theme.primary,
      }}
    >

      {/* Red Ambient Glow - Efek lampu merah redup dari atas ala interior mobil */}
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[800px] sm:w-[1000px] h-[500px] sm:h-[600px] bg-red-600/[0.06] blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-8 lg:pt-12 relative z-10">

        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative z-10">
          <div>
            <h1
              className="text-5xl md:text-6xl font-black tracking-tighter uppercase mb-2 transition-colors"
              style={{ color: theme.accent }}
            >
              {companyName}
            </h1>
            <p
              className="text-sm md:text-base font-bold uppercase tracking-widest max-w-xl"
              style={{ color: theme.primary }}
            >
              Manage payroll, track attendance, and overview your team.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-end">
            {/* Month Picker bergaya Neo-Brutalism 
              Gue pakai trik "Fake Button" biar bisa diklik di mana aja 
              dan teksnya bisa di-format jadi "MAY 2026"
            */}
            <div className="relative group w-full md:w-auto mt-4 md:mt-0">

              {/* Ini UI Tombol Palsunya yang keliatan sama User */}
              <div
                className="
                  border-4 rounded-2xl
                  pl-14 pr-5 py-4 flex items-center justify-between
                  text-base font-black uppercase tracking-widest
                  transition-all
                  group-active:translate-y-[4px] group-active:shadow-[2px_2px_0px]
              "
                style={{
                  backgroundColor: theme.surface,
                  borderColor: theme.primary,
                  color: theme.primary,
                  boxShadow: `6px 6px 0px ${theme.primary}`,
                }}
              >
                <div
                  className="absolute inset-y-0 left-4 flex items-center transition-colors z-10 pointer-events-none"
                  style={{ color: theme.primary }}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>

                {/* Trik format '2026-05' jadi 'MAY 2026' */}
                <span>
                  {(() => {
                    if (!selectedMonth) return 'SELECT MONTH';
                    const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
                    const [year, monthNum] = selectedMonth.split('-');
                    return `${monthNames[parseInt(monthNum) - 1]} ${year}`;
                  })()}
                </span>
              </div>

              {/* Ini Input Aslinya (Tembus Pandang, numpuk di atas tombol palsu) */}
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                onClick={(e) => {
                  // Trik sakti biar diklik di mana aja kalendernya maksa kebuka
                  if ('showPicker' in HTMLInputElement.prototype) {
                    try {
                      e.currentTarget.showPicker();
                    } catch (err) {
                      console.log("Browser doesn't support showPicker");
                    }
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />

            </div>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="border-4 rounded-2xl px-5 py-4 font-black uppercase tracking-widest text-xs transition-all active:translate-y-[3px] active:shadow-[3px_3px_0px]"
            style={{
              backgroundColor: theme.primary,
              color: theme.surface,
              borderColor: theme.primary,
              boxShadow: `6px 6px 0px ${theme.primary}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.highlight
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.primary
            }}
          >
            ⚙ Settings
          </button>
        </header>

        {/* Layout Utama: Flex Column dengan jarak (gap) yang lega */}
        <div className="flex flex-col gap-12 md:gap-16">

          <section>
            <PayrollAnalytics
              employees={employees}
              attendances={attendances}
              selectedMonth={selectedMonth}
            />
          </section>

          <section>
            <PayrollSummary
              employees={employees}
              attendances={attendances}
              selectedMonth={selectedMonth}
              onGenerateSlip={setSelectedPayroll}
            />
          </section>

          {/* Grid Layout untuk form & list di Desktop */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

            {/* Kolom Kiri: Area Absensi */}
            <div className="flex flex-col gap-8">
              <AttendanceForm
                employees={employees}
                refreshAttendances={fetchAttendances}
              />
              <AttendanceList
                attendances={attendances}
                employees={employees}
                selectedMonth={selectedMonth}
              />
            </div>

            {/* Kolom Kanan: Area Karyawan */}
            <div className="flex flex-col gap-8">
              <EmployeeForm
                name={name} setName={setName}
                position={position} setPosition={setPosition}
                salary={salary} setSalary={setSalary}
                overtimeRate={overtimeRate} setOvertimeRate={setOvertimeRate}
                deduction={deduction} setDeduction={setDeduction}
                bankName={bankName} setBankName={setBankName}
                bankAccountNumber={bankAccountNumber} setBankAccountNumber={setBankAccountNumber}
                bankAccountName={bankAccountName} setBankAccountName={setBankAccountName}
                email={email} setEmail={setEmail}
                payrollStartDay={payrollStartDay} setPayrollStartDay={setPayrollStartDay}
                employmentType={employmentType} setEmploymentType={setEmploymentType}
                addEmployee={addEmployee}
              />

              <div className="space-y-4">
                <h3
                  className="text-3xl md:text-[42px] font-black uppercase tracking-[-0.04em] leading-none px-1 mb-4 transition-colors"
                  style={{ color: theme.accent }}
                >
                  TEAM DIRECTORY
                </h3>
                {employees.map((employee) => (
                  <EmployeeCard
                    key={employee.id}
                    employee={employee}
                    deleteEmployee={deleteEmployee}
                    refreshEmployees={fetchEmployees}
                  />
                ))}
              </div>
            </div>

          </section>

          <section>
            <PayrollHistory
              histories={payrollHistories}
              refreshPayrollHistories={fetchPayrollHistories}
              onSelectHistory={setSelectedHistory}
            />
          </section>
        </div>

      </div>

      {/* Modal / Overlays */}
      <SettingsModal
        open={showSettings}
        onClose={() => setShowSettings(false)}
      />
      {selectedPayroll && (
        <SalarySlipCard
          employee={selectedPayroll.employee}
          payroll={selectedPayroll.payroll}
          month={selectedMonth}
          onClose={() => setSelectedPayroll(null)}
        />
      )}

      {selectedHistory && (
        <SalarySlipCard
          employee={{
            name: selectedHistory.employee_name,
            position: selectedHistory.employee_position,
            bank_name: selectedHistory.bank_name,
            bank_account_number: selectedHistory.bank_account_number,
          }}
          payroll={{
            baseSalary: selectedHistory.base_salary,
            totalOvertimePay: selectedHistory.overtime_pay,
            bonus: selectedHistory.bonus,
            deduction: selectedHistory.deduction,
            finalSalary: selectedHistory.final_salary,
          }}
          month={selectedHistory.payroll_month}
          onClose={() => setSelectedHistory(null)}
        />
      )}

    </main>
  )
}