// yourPasswordResetController.js
import { type Request, type Response } from 'express'
import speakeasy from 'speakeasy'
import { differenceInMinutes } from 'date-fns'
import bcrypt from 'bcryptjs'
import otpSecretMap from '../utils/otpSecretMap'

interface ResetPasswordRequest {
  email: string
  newPassword: string
  otp: string
}

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, newPassword, otp } = req.body as ResetPasswordRequest

    const storedSecretInfo = otpSecretMap[email]

    if (!storedSecretInfo) {
      res.status(400).json({ error: 'Invalid or expired OTP' })
      return
    }

    // Verify OTP
    const isValidOTP = speakeasy.totp.verify({
      secret: storedSecretInfo.secret,
      encoding: 'base32',
      token: otp,
      window: 1 // Allow 1-minute time drift
    })

    if (!isValidOTP) {
      res.status(400).json({ error: 'Invalid or expired OTP' })
      return
    }

    // Check OTP expiration time
    const otpExpirationMinutes = 10
    const otpCreationTime = storedSecretInfo.createdAt
    const minutesDifference = differenceInMinutes(new Date(), otpCreationTime)

    if (minutesDifference > otpExpirationMinutes) {
      res.status(400).json({ error: 'OTP has expired' })
      return
    }

    // Reset password (you might want to hash the password before storing it)
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    storedSecretInfo.user.password = hashedPassword
    await storedSecretInfo.user.save()

    // Remove OTP secret from the map after successful password reset
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete otpSecretMap[email]

    res.status(200).json({ message: 'Password reset successful' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
