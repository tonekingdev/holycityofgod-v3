// Email utility for sending approval notifications
interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  // This would integrate with your email service (SendGrid, AWS SES, etc.)
  // For now, we'll log the email content
  console.log(`[EMAIL] To: ${to}`)
  console.log(`[EMAIL] Subject: ${subject}`)
  console.log(`[EMAIL] Content: ${html}`)

  // In production, implement actual email sending:
  // const response = await fetch('your-email-service-endpoint', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ to, subject, html })
  // })

  return { success: true }
}