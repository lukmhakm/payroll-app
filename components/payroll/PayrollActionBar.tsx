'use client'

interface Props {
  onGenerateSlip: () => void
}

export default function PayrollActionBar({
  onGenerateSlip,
}: Props) {
  return (
    <div className="mt-0 flex flex-col md:flex-row gap-2">
      <button
        onClick={onGenerateSlip}
        className="
          flex-1 border-4 rounded-2xl px-5 py-4
          font-black uppercase tracking-widest
          active:translate-y-[4px]
          transition-all
        "
        style={{
          background: 'var(--theme-accent)',
          color: 'var(--theme-surface)',
          borderColor: 'var(--theme-primary)',
          boxShadow: '6px 6px 0px var(--theme-primary)',
        }}
      >
        Generate Slip
      </button>
    </div>
  )
}