import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function addSubscriber(email: string) {
  const cleanEmail = email.trim().toLowerCase()
  const localDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(localDir)) fs.mkdirSync(localDir, { recursive: true })
  
  const filePath = path.join(localDir, 'subscribers.json')
  let subscribers = []
  if (fs.existsSync(filePath)) {
    subscribers = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  }

  const existing = subscribers.find((s: any) => s.email === cleanEmail)
  if (existing) {
    return { alreadySubscribed: true, total: subscribers.length }
  }

  subscribers.push({ email: cleanEmail, subscribedAt: new Date().toISOString() })
  fs.writeFileSync(filePath, JSON.stringify(subscribers, null, 2))
  return { alreadySubscribed: false, total: subscribers.length }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { email } = body

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    const result = addSubscriber(email)

    return NextResponse.json({
      success: true,
      alreadySubscribed: result.alreadySubscribed,
      totalSubscribers: result.total,
      message: result.alreadySubscribed
        ? "You're already on the list! Keep an eye on your inbox."
        : "You're all set! Your first weekly meal plan is on the way.",
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Could not complete subscription. Please try again.' },
      { status: 500 }
    )
  }
}
