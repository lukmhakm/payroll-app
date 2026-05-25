import { PayrollStatus } from '@/types/payrollStatus'

type Props = {
  status: PayrollStatus
}

const STYLES: Record<PayrollStatus, string> = {
  draft: 'bg-yellow-300',
  generated: 'bg-blue-300',
  paid: 'bg-green-300',
  cancelled: 'bg-red-300',
}

export default function PayrollStatusBadge({
  status,
}: Props) {
  return (
    <div
      className={`
        px-3
        py-1
        border-4
        border-black
        shadow-[4px_4px_0px_black]
        font-black
        uppercase
        text-xs
        inline-flex
        ${STYLES[status]}
      `}
    >
      {status}
    </div>
  )
}