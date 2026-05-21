'use client'

import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

type Props = {
    employee: any
    payroll: any
    onClose: () => void
}

export default function SalarySlipCard({
    employee,
    payroll,
    onClose,
}: Props) {

    const [loading, setLoading] = useState(false)
    const [sending, setSending] = useState(false)
    const slipRef = useRef<any>(null)

    async function downloadSlip() {

        if (loading) return

        if (!slipRef.current) return

        setLoading(true)

        const canvas =
            await html2canvas(
                slipRef.current,
                {
                    backgroundColor: '#000000',
                    useCORS: true,
                    logging: false,
                    scale: 2,
                }
            )

        const image =
            canvas.toDataURL(
                'image/png'
            )

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: 'a4',
        })

        const pdfWidth =
            pdf.internal.pageSize.getWidth()

        const pdfHeight =
            (canvas.height * pdfWidth) /
            canvas.width

        pdf.addImage(
            image,
            'PNG',
            0,
            0,
            pdfWidth,
            pdfHeight
        )

        pdf.save(
            `salary-slip-${employee.name}.pdf`
        )

        setLoading(false)
    }

    async function downloadPNG() {

        if (loading) return

        if (!slipRef.current) return

        setLoading(true)

        const canvas =
            await html2canvas(
                slipRef.current,
                {
                    backgroundColor: '#000000',
                    useCORS: true,
                    logging: false,
                    scale: 2,
                }
            )

        const image =
            canvas.toDataURL(
                'image/png'
            )

        const link =
            document.createElement('a')

        link.href = image

        link.download =
            `salary-slip-${employee.name}.png`

        link.click()

        setLoading(false)
    }

    async function sendEmail() {

        if (sending) return

        if (!slipRef.current) return

        if (!employee.email) {

            alert(
                'Employee email not found'
            )

            return
        }

        setSending(true)

        const canvas =
            await html2canvas(
                slipRef.current,
                {
                    backgroundColor:
                        '#000000',

                    useCORS: true,

                    logging: false,

                    scale: 2,
                }
            )

        const image =
            canvas.toDataURL(
                'image/png'
            )

        const response =
            await fetch(
                '/api/send-slip',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json',
                    },

                    body: JSON.stringify({
                        email:
                            employee.email,

                        employeeName:
                            employee.name,

                        image,

                        month:
                            payroll.payroll_month ||
                            'Payroll',

                        finalSalary:
                            payroll.finalSalary,
                    }),
                }
            )

        if (response.ok) {

            alert(
                'Slip sent successfully'
            )

        } else {

            alert(
                'Failed to send email'
            )
        }

        setSending(false)
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{
                backgroundColor:
                    'rgba(0,0,0,0.7)',
            }}
        >

            <div className="w-full max-w-sm max-h-[95vh] overflow-y-auto">

                <div
                    ref={slipRef}
                    id="salary-slip"
                    className="rounded-[32px] p-6"
                    style={{
                        marginBottom: '16px',
                        backgroundColor: '#09090b',
                        border: '1px solid #27272a',
                        color: '#ffffff',
                    }}
                >

                    <div
                        style={{
                            borderBottom:
                                '1px solid #27272a',

                            paddingBottom: '20px',
                            textAlign: 'center',
                        }}
                    >

                        <div
                            style={{
                                fontSize: '28px',
                                fontWeight: '700',
                            }}
                        >
                            Salary Slip
                        </div>

                        <div
                            style={{
                                marginTop: '8px',
                                color: '#71717a',
                                fontSize: '14px',
                            }}
                        >
                            Mei 2026
                        </div>

                    </div>

                    <div
                        style={{
                            marginTop: '28px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '22px',
                        }}
                    >

                        <div>

                            <div
                                style={{
                                    color: '#71717a',
                                    fontSize: '13px',
                                }}
                            >
                                Nama
                            </div>

                            <div
                                style={{
                                    marginTop: '6px',
                                    fontSize: '20px',
                                    fontWeight: '600',
                                }}
                            >
                                {employee.name}
                            </div>

                        </div>

                        <div>

                            <div
                                style={{
                                    color: '#71717a',
                                    fontSize: '13px',
                                }}
                            >
                                Jabatan
                            </div>

                            <div
                                style={{
                                    marginTop: '6px',
                                    fontWeight: '600',
                                }}
                            >
                                {employee.position}
                            </div>

                        </div>

                        <div>

                            <div
                                style={{
                                    color: '#71717a',
                                    fontSize: '13px',
                                }}
                            >
                                Bank
                            </div>

                            <div
                                style={{
                                    marginTop: '6px',
                                    fontWeight: '600',
                                }}
                            >
                                {employee.bank_name || '-'}
                            </div>

                        </div>

                        <div>

                            <div
                                style={{
                                    color: '#71717a',
                                    fontSize: '13px',
                                }}
                            >
                                No Rekening
                            </div>

                            <div
                                style={{
                                    marginTop: '6px',
                                    fontWeight: '600',
                                }}
                            >
                                {
                                    employee.bank_account_number
                                    || '-'
                                }
                            </div>

                        </div>

                    </div>

                    <div
                        style={{
                            marginTop: '32px',
                            paddingTop: '24px',
                            borderTop:
                                '1px solid #27272a',

                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                        }}
                    >

                        <div
                            style={{
                                display: 'flex',
                                justifyContent:
                                    'space-between',
                            }}
                        >

                            <div
                                style={{
                                    color: '#a1a1aa',
                                }}
                            >
                                Gaji Pokok
                            </div>

                            <div
                                style={{
                                    fontWeight: '600',
                                }}
                            >
                                Rp {
                                    Math.round(
                                        payroll.baseSalary || 0
                                    ).toLocaleString()
                                }
                            </div>

                        </div>

                        <div
                            style={{
                                display: 'flex',
                                justifyContent:
                                    'space-between',
                            }}
                        >

                            <div
                                style={{
                                    color: '#a1a1aa',
                                }}
                            >
                                Lembur
                            </div>

                            <div
                                style={{
                                    color: '#4ade80',
                                    fontWeight: '600',
                                }}
                            >
                                Rp {
                                    Math.round(
                                        payroll.totalOvertimePay || 0
                                    ).toLocaleString()
                                }
                            </div>

                        </div>

                        <div
                            style={{
                                display: 'flex',
                                justifyContent:
                                    'space-between',
                            }}
                        >

                            <div
                                style={{
                                    color: '#a1a1aa',
                                }}
                            >
                                Bonus
                            </div>

                            <div
                                style={{
                                    color: '#4ade80',
                                    fontWeight: '600',
                                }}
                            >
                                Rp {
                                    Math.round(
                                        payroll.bonus || 0
                                    ).toLocaleString()
                                }
                            </div>

                        </div>

                        <div
                            style={{
                                display: 'flex',
                                justifyContent:
                                    'space-between',
                            }}
                        >

                            <div
                                style={{
                                    color: '#a1a1aa',
                                }}
                            >
                                Potongan
                            </div>

                            <div
                                style={{
                                    color: '#f87171',
                                    fontWeight: '600',
                                }}
                            >
                                Rp {
                                    Math.round(
                                        payroll.deduction || 0
                                    ).toLocaleString()
                                }
                            </div>

                        </div>

                    </div>

                    <div
                        style={{
                            marginTop: '36px',
                            paddingTop: '24px',
                            borderTop:
                                '1px solid #27272a',
                        }}
                    >

                        <div
                            style={{
                                color: '#71717a',
                                fontSize: '13px',
                            }}
                        >
                            Total Gaji
                        </div>

                        <div
                            style={{
                                marginTop: '10px',
                                fontSize: '38px',
                                fontWeight: '700',
                                color: '#4ade80',
                                lineHeight: 1.1,
                            }}
                        >
                            Rp {
                                Math.round(
                                    payroll.finalSalary || 0
                                ).toLocaleString()
                            }
                        </div>

                    </div>

                    <div
                        style={{
                            marginTop: '42px',
                            textAlign: 'center',
                            fontSize: '11px',
                            color: '#71717a',
                        }}
                    >
                        Generated automatically by Payroll App
                    </div>

                </div>

                <div className="grid grid-cols-3 gap-3 mt-5">

                    <button
                        onClick={downloadPNG}
                        disabled={loading}
                        className="
                            bg-zinc-800 text-white
                            rounded-2xl py-4
                            font-semibold
                            disabled:opacity-50
                        "
                    >
                        Download PNG
                    </button>

                    <button
                        onClick={downloadSlip}
                        disabled={loading}
                        className="
                            bg-white text-black
                            rounded-2xl py-4
                            font-semibold
                            disabled:opacity-50
                        "
                    >
                        {
                            loading
                                ? 'Generating...'
                                : 'Download PDF'
                        }
                    </button>

                    <button
                        onClick={sendEmail}
                        disabled={sending}
                        className="
                            bg-blue-500 text-white
                            rounded-2xl py-4
                            font-semibold
                            disabled:opacity-50
                        "
                    >
                        {
                            sending
                                ? 'Sending...'
                                : 'Send Email'
                        }
                    </button>

                </div>

                <button
                    onClick={onClose}
                    className="w-full mt-4 rounded-2xl py-4 font-semibold"
                    style={{
                        backgroundColor: '#ffffff10',
                        color: '#ffffff',
                        border: '1px solid #3f3f46',
                    }}
                >
                    Tutup
                </button>

            </div>

        </div>
    )
}