import nodemailer from 'nodemailer'

let transporter: nodemailer.Transporter | null = null

const initTransporter = async () => {
  if (transporter) return transporter
  // Generate a new test account dynamically
  const testAccount = await nodemailer.createTestAccount()
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, 
      pass: testAccount.pass
    }
  })
  return transporter
}

export const sendResetPasswordEmail = async (to: string, token: string) => {
  const mailTransporter = await initTransporter()
  const resetLink = `http://localhost:5173/reset-password?token=${token}`
  
  const info = await mailTransporter.sendMail({
    from: '"PC Store" <no-reply@pcstore.com>',
    to,
    subject: 'Reset Your Password',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #333;">Khôi phục mật khẩu của bạn</h2>
        <p>Bạn đã yêu cầu đặt lại mật khẩu tại PC Store. Vui lòng bấm vào nút dưới đây để thiết lập mật khẩu mới:</p>
        <div style="margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Đặt lại Mật khẩu
          </a>
        </div>
        <p>Hoặc bạn có thể copy và dán đường link sau vào trình duyệt:</p>
        <p style="color: #666; word-break: break-all;">${resetLink}</p>
        <p>Lưu ý: Link này sẽ hết hạn sau 15 phút.</p>
      </div>
    `
  })

  // Log the ethereal url to the console so developer can click and view the email
  console.log('----------------------------------------')
  console.log('📧 MOCK EMAIL SENT!')
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
  console.log('----------------------------------------')
  
  return info
}
