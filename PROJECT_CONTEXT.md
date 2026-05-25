# PAYROLL APP — PROJECT CONTEXT

## PROJECT OVERVIEW

Modern payroll management application built with:

- Next.js
- React
- TypeScript
- TailwindCSS
- Supabase

Design language:

- Neo Brutalism
- Editorial Dashboard
- Pop-Art inspired UI

---

# CORE FEATURES

## Employee Management

Supports 3 employee types:

### 1. Karyawan Tetap

- Monthly salary
- Payroll period usually starts on day 1
- If attendance missing:
  - considered PRESENT
  - no overtime

---

### 2. Karyawan Tidak Tetap

- Monthly salary
- Payroll period can start on custom day
- If attendance missing:
  - considered PRESENT
  - no overtime

---

### 3. Freelance

- Daily salary
- Salary calculated from attendance count
- Attendance input required
- No alpha/izin deduction logic
- Payroll based on active working days

Formula:

```text
attendanceCount × dailySalary + overtime
```

---

# CURRENT ARCHITECTURE

```text
app/page.tsx
│
├── components/employee/
│     ├── EmployeeForm.tsx
│     └── EmployeeCard.tsx
├── components/attendance/
│     ├── AttendanceForm.tsx
│     ├── AttendanceList.tsx
│     └── EditAttendanceModal.tsx
├── components/analytics/
│     └── PayrollAnalytics.tsx
├── components/payroll/
│     ├── PayrollSummary.tsx
│     ├── PayrollCard.tsx
│     ├── SalarySlipCard.tsx
│     └── PayrollHistory.tsx
└── components/settings/
      └── SettingModal.tsx

hooks/
├── useEmployees.ts
├── useAttendances.ts
├── usePayrollHistories.ts
└── usePayrollAdjustments.ts
```

---

# MAIN FILE RESPONSIBILITIES

## app/page.tsx

Main dashboard controller.

Responsibilities:

- fetch Supabase data
- global states
- modal states
- connect all components
- global settings integration
- theme loading

---

## EmployeeForm.tsx

Employee creation form.

Fields:

- employee name
- position
- employment type
- salary
- payroll start day
- deduction

---

## EmployeeCard.tsx

Displays employee data.

Includes:

- edit employee
- delete employee
- employee identity display

---

## AttendanceForm.tsx

Attendance input form.

Features:

- attendance date
- overtime
- work status
- employee selection

---

## AttendanceList.tsx

Attendance history viewer.

Structure:

```text
Year
 └── Month
      └── Day
           └── Attendance Record
```

---

## EditAttendanceModal.tsx

Edit attendance record modal.

---

## PayrollSummary.tsx

CORE PAYROLL ENGINE.

Responsible for:

- payroll calculation
- overtime calculation
- deduction calculation
- freelance calculation
- payroll period filtering
- payroll generation

### Payroll Summary UI Direction

Current visual structure:

```text
RED HEADER CARD
├── Employee identity
├── Final salary focus
├── Generated status
└── Expand / collapse interaction

CLEAN DETAIL SECTION
├── Basic salary
├── Overtime
├── Bonus
└── Deduction
```

Design principle:

```text
Top section should carry personality.
Bottom section should carry clarity.
```

Current preferred interaction:

- collapsible payroll details
- mobile-first hierarchy
- salary as primary focal point
- simplified detail rows
- action button visually integrated

---

## SalarySlipCard.tsx

Salary slip renderer.

Features:

- PNG export
- PDF export
- email sending
- dynamic theme support
- custom footer text
- payroll visualization

---

## SettingModal.tsx

Global settings system.

Features:

- company name
- footer text
- email signature
- payroll defaults
- palette system
- confidential toggle
- watermark toggle

---

# DATABASE TABLES

## employees

Stores:

- employee identity
- salary
- employment type
- payroll start day
- deductions

---

## attendance

Stores:

- attendance date
- overtime
- employee relation
- attendance status

---

## payroll_histories

Stores:

- payroll snapshot
- generated slips
- salary history

---

# THEME SYSTEM

Located in:

```text
lib/theme.ts
```

Theme variables:

```ts
primary
surface
accent
highlight
```

Saved via:

```text
localStorage
```

Keys:

```text
theme_primary
theme_surface
theme_accent
theme_highlight
```

---

# DESIGN SYSTEM

## Default Palette

```text
Primary   → #111111
Surface   → #F3EBD9
Accent    → #E43427
Highlight → #15438D
```

---

## UI STYLE

- heavy borders
- controlled brutalist shadows
- editorial typography
- modular payroll cards
- uppercase labels
- oversized headings
- bold color blocking
- mobile-first dashboard composition
- collapsible payroll sections

Important direction:

```text
Header = loud / expressive
Body = clean / structured
```

Avoid:

- spreadsheet-looking layouts
- excessive nested cards
- overly dense shadows
- generic SaaS table styling

---

# CURRENT COMPLETED FEATURES

## Payroll

- payroll summary
- overtime calculation
- freelance logic
- dynamic payroll periods
- salary deduction
- payroll history

---

## Attendance

- attendance CRUD
- attendance edit modal
- grouped attendance history

---

## Employee System

- employee CRUD
- employment types
- payroll sync

---

## Salary Slip

- PNG export
- PDF export
- email send
- footer customization
- dynamic theme integration

---

## Settings System

- global settings modal
- company branding
- palette system
- footer customization

---

# IMPORTANT PAYROLL LOGIC

## Freelance Salary

```text
attendanceCount × salary
+ overtime
+ bonus
```

No deduction logic.

---

## Tetap / Tidak Tetap

```text
monthlySalary
+ overtime
+ bonus
- deduction
```

---

# IMPORTANT FIXES ALREADY DONE

## Fixed

- freelance salary always 0
- attendance filtering bug
- payroll sync bug
- employment type edit sync
- duplicate deduction fields
- modal cancel acting like save
- missing freelance summary data
- missing attendance counts
- dynamic footer system
- settings modal system
- palette system

---

# KNOWN FUTURE ROADMAP

## Planned Features

### High Priority

- ThemeProvider system
- Watermark rendering
- Confidential toggle rendering
- Auto payroll generator
- Payroll status system
- Global dynamic colors

---

### Medium Priority

- Employee avatars
- Company logo upload
- Theme presets
- Analytics upgrade
- Better charts

---

### Long Term

- SaaS multi-company support
- Authentication system
- Mobile app
- Multi-theme engine
- Team collaboration

---

# DEVELOPMENT NOTES

## Important Principle

```text
Logic ≠ Visual
```

Business logic should stay separated from UI rendering.

---

## Debugging Priority

Always check:

```text
1. component actually rendered
2. props passed correctly
3. state source
4. localStorage values
5. payroll payload consistency
```

---

# CURRENT DESIGN DECISIONS

## Payroll Summary

Approved direction:

- red identity header
- large salary typography
- collapsible details
- simplified detail rows
- minimal card nesting
- reduced shadow intensity
- clean lower section

Rejected direction:

- boxed stat grids
- analytics-style detail cards inside payroll summary
- spreadsheet/table visual style
- over-layered brutalism

Key insight:

```text
Too much brutalism removes readability.
```

---

# CURRENT PROJECT STATUS

Current status:

```text
Production-style payroll dashboard
with scalable architecture foundation.
```

The project already includes:

- modular architecture
- reusable component system
- dynamic theming foundation
- payroll engine
- export system
- settings system
- branded UI system

---

# END