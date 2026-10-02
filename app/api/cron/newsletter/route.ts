import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: Request) {
  // Check Vercel cron auth header in production
  const authHeader = request.headers.get('authorization')
  if (
    process.env.NODE_ENV === 'production' &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const localDir = path.join(process.cwd(), 'data')
    const filePath = path.join(localDir, 'subscribers.json')
    
    let subscribers = []
    if (fs.existsSync(filePath)) {
      subscribers = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    }

    if (subscribers.length === 0) {
      return NextResponse.json({ success: true, message: 'No subscribers yet.' })
    }

    // In a real app, this would use Resend to broadcast the newsletter.
    // For now, it just loops and "sends".
    
    console.log(`Sending weekly meal plan to ${subscribers.length} subscribers...`)

    return NextResponse.json({ 
      success: true, 
      message: `Sent newsletter to ${subscribers.length} subscribers.` 
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to send newsletter.' },
      { status: 500 }
    )
  }
}
