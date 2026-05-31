import { NextResponse } from 'next/server'
// Use puppeteer-core and the chromium-lambda package for serverless environments
import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium'
import type { Employee, CalculatedPayroll, AppSettings, ThemePalette } from '@/types'

export async function POST(request: Request) {
    const {
        data: dataPayload,
        theme,
        secret,
        format,
    } = await request.json()

    // 1. Security Check
    if (secret !== process.env.NEXT_PUBLIC_PUPPETEER_SECRET) {
        return new NextResponse('Invalid secret token', { status: 401 })
    }

    if (!dataPayload || !theme) {
        return new NextResponse('Missing required data or theme parameters', { status: 400 })
    }

    // Fallback for local development. In production, this should always be set.
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    if (!process.env.NEXT_PUBLIC_BASE_URL) {
        // Log a warning if the env var is missing, but allow fallback for local dev.
        console.warn('Warning: NEXT_PUBLIC_BASE_URL is not set. Falling back to default http://localhost:3000.');
    }

    let browser
    try {
        // Configure Puppeteer for Vercel
        browser = await puppeteer.launch({
            args: chromium.args,
            // Use a standard viewport size. The `defaultViewport` from the chromium
            // object can be unstable across versions, so we hardcode a reliable default.
            defaultViewport: { width: 1280, height: 720 },
            executablePath: await chromium.executablePath(),
            // The `chromium.headless` property can be unstable across environments.
            // Setting to `true` is a reliable way to enable headless mode.
            headless: true,
            // Allow insecure HTTPS connections. This is the correct property name for launch options.
            acceptInsecureCerts: true,
        });

        const page = await browser.newPage();

        // Inject data into the page's window object before navigation.
        // This avoids long URLs and is the most reliable method.
        await page.evaluateOnNewDocument(
            (data: { employee: Employee, payroll: CalculatedPayroll, settings: AppSettings }, theme: ThemePalette) => {
                (window as any).__SALARY_SLIP_DATA__ = data;
                (window as any).__SALARY_SLIP_THEME__ = theme;
            },
            dataPayload,
            theme
        );

        const url = `${baseUrl}/slip-template`;
        await page.goto(url, { waitUntil: 'networkidle0' });

        // Wait for the target element to be rendered by React, with a timeout.
        const slipSelector = '#salary-slip';
        await page.waitForSelector(slipSelector, { timeout: 10000 });

        const slipElement = await page.$(slipSelector);
        if (!slipElement) {
            // This is now a more critical error, as it means the element didn't appear even after waiting.
            throw new Error(`Could not find selector '${slipSelector}' on the page after waiting.`);
        }

        if (format === 'pdf') {
            const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' } });
            // Ensure the buffer is correctly typed for the NextResponse body
            return new NextResponse(Buffer.from(pdfBuffer), {
                status: 200,
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': `attachment; filename="salary-slip.pdf"`,
                },
            })
        }

        // Default to PNG
        const pngBuffer = await slipElement.screenshot({ type: 'png' });
        // Ensure the buffer is correctly typed for the NextResponse body
        return new NextResponse(Buffer.from(pngBuffer), {
            status: 200,
            headers: {
                'Content-Type': 'image/png',
                'Content-Disposition': `attachment; filename="salary-slip.png"`,
            },
        })
    } catch (error: any) {
        console.error('Error generating slip with Puppeteer:', error)
        return new NextResponse(`Puppeteer error: ${error.message}`, { status: 500 })
    } finally {
        if (browser) {
            await browser.close()
        }
    }
}