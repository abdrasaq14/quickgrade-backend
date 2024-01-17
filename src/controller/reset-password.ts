// yourPasswordResetController.js
import { type Request, type Response } from 'express'
import speakeasy from 'speakeasy'
import { differenceInMinutes } from 'date-fns'
import bcrypt from 'bcryptjs'
import otpSecretMap from '../utils/otpSecretMap'
import { transporter } from '../utils/emailsender'
 
interface ResetPasswordRequest {
  email: string
  newPassword: string
  otp: string
}


 
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body as ResetPasswordRequest;

    // let user: Student | Lecturer | undefined;

    // const student = await Student.findOne({ where: { email } });
    // const lecturer = await Lecturer.findOne({ where: { email } });

    // if (student) {
    //   user = student;
    // } else if (lecturer) {
    //   user = lecturer;
    // }

    // if (!user) {
    //   res.status(404).json({ error: 'User not found' });
    //   return;
    // }

    const totpSecret = speakeasy.generateSecret({ length: 20 });

    const totpToken = speakeasy.totp({
       secret: totpSecret.base32,
       encoding: 'base32',
    });

    // const storedSecretInfo = otpSecretMap[email];

    // if (!storedSecretInfo) {
    //   res.status(400).json({ error: 'Invalid or expired OTP' });
    //   return;
    // }

    const mailOptions = {
      from: {
        name: 'QuickGrade App',
        address: 'quickgradedecagon@gmail.com',
      },
      to: email,
      subject: 'Quick Grade App - Reset Password Code',
      text: `TOTP: ${totpToken}`,
      html: ` <h3>Hi there,
Thank you for signing up for QuickGrade. Copy OTP below to reset your password:</h3>
<h1>${totpToken}<h1>
<h3>This OTP will expire in 24 hours. If you did not sign up for a QuickGrade account,
you can safely ignore this email.
Best,
The QuickGrade Team</h3>`,
    };

    await transporter.sendMail(mailOptions);

//     res.status(200).json({ message: 'TOTP sent successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

    // Verify OTP
    // const isValidOTP = speakeasy.totp.verify({
    //   secret: storedSecretInfo.secret,
    //   encoding: 'base32',
    //   token: otp,
    //   window: 1, // Allow 1-minute time drift
    // });

    // if (!isValidOTP) {
    //   res.status(400).json({ error: 'Invalid or expired OTP' });
    //   return;
    // }

    // Check OTP expiration time
    // const otpExpirationMinutes = 10;
    // const otpCreationTime = storedSecretInfo.createdAt;
    // const minutesDifference = differenceInMinutes(new Date(), otpCreationTime);

    // if (minutesDifference > otpExpirationMinutes) {
    //   res.status(400).json({ error: 'OTP has expired' });
    //   return;
    // }

    // Reset password (you might want to hash the password before storing it)
    // const hashedPassword = await bcrypt.hash(newPassword, 10);
    // storedSecretInfo.user.password = hashedPassword;
    // await storedSecretInfo.user.save();

    // Remove OTP secret from the map after successful password reset
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete otpSecretMap[email];

    res.status(200).json({ message: 'OTP for Password reset successful' });
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
};
 