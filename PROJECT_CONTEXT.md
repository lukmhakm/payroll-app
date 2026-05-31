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

### 1. Fulltime
- Monthly salary
- Payroll period usually starts on day 1
- If attendance missing:
  - considered PRESENT
  - no overtime

### 2. Contract
- Monthly salary
- Payroll period can start on custom day
- If attendance missing:
  - considered PRESENT
  - no overtime

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
app/
├── page.tsx (Dashboard)
├── api/generate-slip/route.ts (Puppeteer API)
└── slip-template/page.tsx (Printable Slip)

components/
├── payroll/
│     ├── PayrollSummary.tsx
│     ├── PayrollCard.tsx
│     ├── SalarySlipCard.tsx (Uses SlipContent)
│     ├── SlipContent.tsx (Shared UI)
│     └── PayrollHistory.tsx
├── employee/
│     ├── EmployeeForm.tsx
│     └── EmployeeCard.tsx
├── attendance/
│     ├── AttendanceForm.tsx
│     └── AttendanceList.tsx
└── ... (other components)

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

Menampilkan pratinjau slip gaji dan mengontrol proses pembuatannya.

Features:

- Memicu pembuatan PNG/PDF melalui API di sisi server (Puppeteer).
- Mengelola UI untuk pengaturan slip (footer, watermark, dll).
- Menangani logika pengiriman slip via email.
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
Primary   → #2b2b2b
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
- theme presets system
- dynamic HSL-based color generator

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

## Fulltime / Contract

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
- migrated `any` types to strict TypeScript interfaces
- extracted payroll calculation logic to centralized `lib/payrollEngine.ts` (Logic ≠ Visual)
- eliminated prop-drilling in `app/page.tsx` by isolating form states
- normalized legacy employment type data (`tetap` -> `fulltime`)
- centralized global settings via `SettingsProvider` (Point 4)
- standardized UI headings, forms, and placeholders to English for visual consistency
- unified layout gaps and masonry balance between columns in `page.tsx`
- added color hex normalization (auto `#` insertion) in `ThemeProvider` to prevent UI breakage
- blocked duplicate attendance saving logic with user alert
- repositioned `PayrollHistory` to balance masonry grid layout
- Migrated salary slip generation from client-side `html2canvas` to server-side Puppeteer to achieve 100% pixel-perfect rendering and fix all "background shifting" issues.
- added delete confirmation prompt for employee deletion to prevent accidental data loss
- fixed iOS Safari flexbox rendering bug on date and time inputs (`min-w-0`, `appearance-none`)
- added mechanical "snappy" expand/collapse animations (`grid-rows-[0fr]/[1fr]`) to `PayrollCard`, `PayrollAnalytics`, and `EmployeeForm`
- repositioned `EmployeeForm` below the Team Directory list in `page.tsx` for better visual hierarchy and layout balance
- implemented Global Dynamic Colors using HSL color theory to auto-calculate balanced Neo-Brutalist themes from a single base color selection
- added 6 preconfigured premium Neo-Brutalist theme presets (Original Brutalist, Cyberpunk Neon, Forest Mint, Warm Terracotta, Midnight Slate, Lavender Mist) in `lib/theme.ts` with instant preview UI in the settings modal



---

# KNOWN FUTURE ROADMAP

## Planned Features

### High Priority

- Auto payroll generator
- Payroll status system

---

### Medium Priority

- Employee avatars
- Company logo upload
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
TypeScript type-safety and centralized calculation engine applied.
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