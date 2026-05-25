# PERISSEIA PAYROLL — SYSTEM ARCHITECTURE v3

## OVERVIEW
PERISSEIA Payroll adalah payroll SaaS berbasis:
- Next.js
- React
- TypeScript
- Supabase

Pendekatan:
- Modular frontend architecture
- Centralized payroll business logic
- Feature-based component system
- Mobile-first neo brutalist dashboard UI

App dirancang untuk:
- payroll management
- attendance tracking
- freelance salary calculation
- payroll analytics
- salary slip generation
- PNG/PDF export
- payroll history management
- scalable multi-role payroll workflow
- future multi-company payroll support

---

## CORE ARCHITECTURE
UI Layer ➔ Feature Components ➔ Hooks Layer ➔ Business Logic Layer ➔ Providers Layer ➔ Database Layer

## PROJECT STRUCTURE
app/
components/
   ├── analytics/
   ├── attendance/
   ├── employee/
   ├── payroll/
   └── settings/
hooks/
providers/
types/
public/

## FEATURE-BASED STRUCTURE
components/
├── payroll/
│   ├── PayrollSummary.tsx
│   ├── PayrollCard.tsx
│   ├── PayrollCardHeader.tsx
│   ├── PayrollCardDetails.tsx
│   ├── SalarySlipCard.tsx
│   └── PayrollHistory.tsx
├── attendance/
├── employee/
├── analytics/
├── settings/

---

## DESIGN SYSTEM RULES (NEO BRUTALISM)
- CORE PRINCIPLE: HEADER = expressive, BODY = clean
- APPROVED DIRECTION:
  - red identity payroll header
  - large salary typography
  - collapsible payroll cards
  - minimal nested surfaces
  - controlled brutalist shadows
  - editorial hierarchy
  - strong color blocking
  - mobile-first layout
  - simplified detail sections
- AVOID:
  - spreadsheet-looking UI
  - excessive nested cards
  - over-layered brutalism
  - heavy shadow stacking
  - generic SaaS table styling
- IMPORTANT INSIGHT: Too much brutalism removes readability.

---

## BUSINESS LOGIC & HOOKS (hooks/)
- Files: `useEmployees.ts`, `useAttendances.ts`, `usePayrollHistories.ts`, `usePayrollAdjustments.ts`.
- Logika state dan database dipusatkan di Custom Hooks untuk memisahkan UI dan data.
- Kalkulasi payroll dikerjakan langsung secara eksplisit dan transparan di dalam `PayrollSummary.tsx` & `PayrollAnalytics.tsx` tanpa engine eksternal.

---

## DATABASE ARCHITECTURE (SUPABASE)
Tables: employees, attendance, payroll_history, salary_slips, payroll_adjustments, dll.