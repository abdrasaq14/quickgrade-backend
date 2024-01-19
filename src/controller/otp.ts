import { type Response } from 'express'
import speakeasy from 'speakeasy'
import Student from '../model/studentModel'
import { transporter } from '../utils/emailsender'
import { type AuthenticatedRequest } from '../../extender'
export const sendOTP = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email } = req.body

    const student = await Student.findOne({ where: { email } })

    if (!student) {
      res.json({ error: 'User not found' })
      return
    }

    const totpSecret = speakeasy.generateSecret({ length: 20 })

    // Update the student instance with TOTP details
    await student.update({
      otpSecret: totpSecret.base32,
      otp: speakeasy.totp({
        secret: totpSecret.base32,
        encoding: 'base32'
      }),
      otpExpiration: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    })

    const mailOptions = {
      from: {
        name: 'QuickGrade App',
        address: 'quickgradedecagon@gmail.com'
      },
      to: email,
      subject: 'Quick Grade App - Email Verification Code',
      text: `TOTP: ${student.otp}`,
      html: `<h3>Hi there,
      Thank you for signing up for QuickGrade. Copy OTP below to verify your email:</h3>
      <h1>${student.otp}</h1>
      <h3>This OTP will expire in 10 minutes. If you did not sign up for a QuickGrade account,
      you can safely ignore this email.
      Best,
      The QuickGrade Team</h3>`
    }

    await transporter.sendMail(mailOptions)

    res.status(200).json({ message: 'TOTP sent successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const verifyOTP = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    console.log('req.body', req.body)
    const { otp } = req.body
    const email = req.session.email
    console.log('email', email)
    const student = await Student.findOne({ where: { email, otp } })

    if (!student) {
      res.json({ studentNotSignupError: 'User not signed up' })
    } else {
      const now = new Date()
      if (now > student.otpExpiration) {
        res.json({ expiredOtpError: 'OTP has expired' })
        return
      }

      await student.update({ isVerified: true })

      res.json({ OtpVerificationSuccess: 'OTP verified successfully' })
    }
  } catch (error) {
    console.error(error)
    res.json({ internalServerError: 'Internal Server Error' })
  }
}
