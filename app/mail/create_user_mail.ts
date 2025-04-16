import env from '#start/env'
import mail from '@adonisjs/mail/services/main'

export const sendCreds = async ({
  username,
  code,
  email,
  loginUrl,
}: {
  id?: number
  username: string
  code?: string
  email: string
  loginUrl: string
}) => {
  const mailer = await mail.send((message) => {
    message
      .from(env.get('SMTP_USERNAME'), 'Access folder')
      .to(email)
      .subject('There it is your credentials !')
      .htmlView('email/send_credentials.edge', {
        username,
        code,
        loginUrl,
      })
  })

  return mailer
}
