import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(
  process.env.RESEND_API_KEY
)

export async function POST(
  req: Request
) {

  try {

    const body = await req.json()

    const {
      email,
      employeeName,
      image,
      month,
      finalSalary,
    } = body

    const { error } =
      await resend.emails.send({

        from:
          'Payroll <onboarding@resend.dev>',

        to: email,

        subject:
          `Slip Gaji ${month}`,

        html: `
          <div style="
            background:#000;
            color:#fff;
            padding:40px;
            font-family:sans-serif;
          ">

            <h1>
              Slip Gaji
            </h1>

            <p>
              Halo ${employeeName},
            </p>

            <p>
              Slip gaji periode
              ${month}
              telah tersedia.
            </p>

            <p>
              Total diterima:
              <strong>
                Rp ${Number(
                  finalSalary
                ).toLocaleString()}
              </strong>
            </p>

            <img
              src="${image}"
              style="
                width:100%;
                border-radius:20px;
                margin-top:30px;
              "
            />

          </div>
        `,
      })

    if (error) {

      return NextResponse.json(
        error,
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
    })

  } catch (error) {

    return NextResponse.json(
      { error },
      { status: 500 }
    )
  }
}