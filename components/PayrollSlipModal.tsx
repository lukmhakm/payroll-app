'use client'

import { useRef } from 'react'
import { toPng } from 'html-to-image'

import SalarySlip from './SalarySlip'

type Props = {
  employee: any
  payroll: any
  onClose: () => void
}

export default function PayrollSlipModal({
  employee,
  payroll,
  onClose,
}: Props) {

  const slipRef =
    useRef<HTMLDivElement>(null)

  async function downloadSlip() {

    if (!slipRef.current) return

    const dataUrl =
      await toPng(slipRef.current)

    const link =
      document.createElement('a')

    link.download =
      `${employee.name}-salary-slip.png`

    link.href = dataUrl

    link.click()
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-10 overflow-auto">

      <div className="relative">

        <button
          onClick={onClose}
          className="absolute -top-5 -right-5 bg-red-500 text-white w-10 h-10 rounded-full"
        >
          ✕
        </button>

        <div ref={slipRef}>
          <SalarySlip
            employee={employee}
            payroll={payroll}
          />
        </div>

        <button
          onClick={downloadSlip}
          className="w-full mt-5 bg-white text-black py-4 rounded-2xl font-bold"
        >
          Download Slip
        </button>

      </div>

    </div>
  )
}