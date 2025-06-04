import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ 
    message: 'PDF generation has been disabled. Puppeteer functionality removed.'
  }, { status: 410 });
}
