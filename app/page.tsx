'use client'

import { useEffect, useState } from 'react'

import PayrollAnalytics from '@/components/analytics/PayrollAnalytics'
import PayrollSummary from '@/components/payroll/PayrollSummary'
import PayrollHistory from '@/components/payroll/PayrollHistory'
import AttendanceList from '@/components/attendance/AttendanceList'
import AttendanceForm from '@/components/attendance/AttendanceForm'
import EmployeeForm from '@/components/employee/EmployeeForm'
import EmployeeCard from '@/components/employee/EmployeeCard'
import SalarySlipCard from '@/components/payroll/SalarySlipCard'
import SettingsModal from '@/components/settings/SettingModal'
import { useTheme } from '@/providers/ThemeProvider'
import { useSettings } from '@/providers/SettingsProvider'
import { useEmployees } from '@/hooks/useEmployees'
import { useAttendances } from '@/hooks/useAttendances'
import { usePayrollHistories } from '@/hooks/usePayrollHistories'
import { usePayrollAdjustments } from '@/hooks/usePayrollAdjustments'
import type { PayrollHistory as PayrollHistoryType } from '@/types'

export default function Home() {

  const { employees, fetchEmployees, addEmployee, deleteEmployee } = useEmployees()
  const { attendances, fetchAttendances } = useAttendances()
  const { payrollHistories, fetchPayrollHistories } = usePayrollHistories()

  const [selectedPayroll, setSelectedPayroll] =
    useState<any>(null)

  const [selectedHistory, setSelectedHistory] =
    useState<PayrollHistoryType | null>(null)

  const [selectedMonth, setSelectedMonth] =
    useState(
      new Date().toISOString().slice(0, 7)
    )

  const { adjustments, handleUpdateAdjustment, clearAdjustments } = usePayrollAdjustments(selectedMonth)

  const [showSettings, setShowSettings] =
    useState(false)

  const { theme } = useTheme()
  const { settings } = useSettings()

  const [mounted, setMounted] =
    useState(false)

  useEffect(() => {

    setMounted(true)

    fetchEmployees()
    fetchAttendances()
    fetchPayrollHistories()

  }, [fetchEmployees, fetchAttendances, fetchPayrollHistories])

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

      {/* Ambient Glow - Efek lampu redup dari atas ala interior mobil */}
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[800px] sm:w-[1000px] h-[500px] sm:h-[600px] bg-[var(--theme-accent)] opacity-[0.06] blur-[100px] rounded-full pointer-events-none transition-colors duration-500" />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-8 lg:pt-12 relative z-10">

        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 md:mb-16 relative z-10">
          <div>
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter uppercase mb-2 transition-colors break-words"
              style={{ color: theme.accent }}
            >
            {settings.companyName.toUpperCase()}
            </h1>
            <p
              className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-widest max-w-xl"
              style={{ color: theme.primary }}
            >
              Manage payroll, track attendance, and overview your team.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
            {/* Month Picker bergaya Neo-Brutalism 
              Gue pakai trik "Fake Button" biar bisa diklik di mana aja 
              dan teksnya bisa di-format jadi "MAY 2026"
            */}
            <div className="relative group w-full sm:w-auto">

              {/* Ini UI Tombol Palsunya yang keliatan sama User */}
              <div
                className="
                  border-4 rounded-2xl
                  pl-12 sm:pl-14 pr-4 sm:pr-5 py-3 sm:py-4 flex items-center justify-between
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
                  className="absolute inset-y-0 left-3 sm:left-4 flex items-center transition-colors z-10 pointer-events-none"
                  style={{ color: theme.primary }}
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
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
          <button
            onClick={() => setShowSettings(true)}
            className="w-full sm:w-auto border-4 rounded-2xl px-4 sm:px-5 py-3 sm:py-4 font-black uppercase tracking-widest text-xs sm:text-sm transition-all active:translate-y-[3px] active:shadow-[3px_3px_0px] flex items-center justify-center gap-2"
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
          </div>
        </header>

        {/* Layout Utama: Flex Column dengan jarak (gap) yang lega */}
        <div className="flex flex-col gap-12 md:gap-16">

          <section>
            <PayrollAnalytics
              employees={employees}
              attendances={attendances}
              selectedMonth={selectedMonth}
              adjustments={adjustments}
              payrollHistories={payrollHistories}
            />
          </section>

          <section>
            <PayrollSummary
              employees={employees}
              attendances={attendances}
              selectedMonth={selectedMonth}
              onGenerateSlip={setSelectedPayroll}
              refreshPayrollHistories={fetchPayrollHistories}
              adjustments={adjustments}
              onUpdateAdjustment={handleUpdateAdjustment}
              onClearAdjustments={clearAdjustments}
              payrollHistories={payrollHistories}
            />
          </section>

          {/* Grid Layout untuk form & list di Desktop */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-start">

            {/* Kolom Kiri: Area Absensi */}
            <div className="flex flex-col gap-12 md:gap-16">
              <AttendanceForm
                employees={employees}
                attendances={attendances}
                refreshAttendances={fetchAttendances}
              />
              <AttendanceList
                attendances={attendances}
                employees={employees}
                selectedMonth={selectedMonth}
                refreshAttendances={fetchAttendances}
              />
            </div>

            {/* Kolom Kanan: Area Karyawan */}
            <div className="flex flex-col gap-12 md:gap-16">
              <div className="flex flex-col gap-8 md:gap-16">
                <div>
                  <h3
                    className="text-3xl md:text-[42px] font-black uppercase tracking-[-0.04em] leading-none px-1 mb-6 transition-colors duration-300 text-[var(--theme-accent)]"
                  >
                    TEAM DIRECTORY
                  </h3>
                  <div className="space-y-4">
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

                <EmployeeForm addEmployee={addEmployee} />

                <PayrollHistory
                  histories={payrollHistories}
                  employees={employees}
                  refreshPayrollHistories={fetchPayrollHistories}
                  onSelectHistory={setSelectedHistory}
                />
              </div>
            </div>

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

      {selectedHistory && (() => {
        // Find the full employee profile from the current list of employees.
        const emp = employees.find(e => String(e.id) === String(selectedHistory.employee_id))

        // Guard clause: If the employee is not found (e.g., has been deleted),
        // show an alert and do not render the slip.
        if (!emp) {
          alert(`Cannot generate slip. Employee "${selectedHistory.employee_name}" may have been deleted.`)
          setSelectedHistory(null) // Close the broken view
          return null
        }
        
        return (
          <SalarySlipCard
            employee={emp}
            payroll={{
              // Reconstruct the payroll object from the history record.
              payroll_month: selectedHistory.payroll_month,
              baseSalary: selectedHistory.base_salary,
              totalOvertimePay: selectedHistory.overtime_pay,
              bonus: selectedHistory.bonus,
              deduction: selectedHistory.deduction,
              finalSalary: selectedHistory.final_salary,
              // Note: attendanceCount, overtimeHours, etc., are not available in history
              // and will be displayed as 0 or hidden in the slip, which is acceptable for historical views.
            }}
            month={selectedHistory.payroll_month}
            onClose={() => setSelectedHistory(null)}
          />
        )
      })()}

    </main>
  )
}