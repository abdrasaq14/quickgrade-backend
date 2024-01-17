import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import speakeasy from 'speakeasy';
import Student from '../model/studentModel';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'quickgradedecagon@gmail.com',
    pass: 'tdynykegchtuzfog',
  },
});

export const sendOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const student = await Student.findOne({ where: { email } });

    if (!student) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const totpSecret = speakeasy.generateSecret({ length: 20 });

    // Update the student instance with TOTP details
    await student.update({
      otpSecret: totpSecret.base32,
      otp: speakeasy.totp({
        secret: totpSecret.base32,
        encoding: 'base32',
      }),
      otpExpiration: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    const mailOptions = {
      from: {
        name: 'QuickGrade App',
        address: 'quickgradedecagon@gmail.com',
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
      The QuickGrade Team</h3>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'TOTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    const student = await Student.findOne({ where: { email, otp } });

    if (!student) {
      res.status(401).json({ error: 'Invalid OTP' });
      return;
    }

    // Check if OTP is still valid (not expired)
    const now = new Date();
    if (now > student.otpExpiration) {
      res.status(401).json({ error: 'OTP has expired' });
      return;
    }

    await student.update({ isVerified: true });

    res.status(200).json({ message: 'OTP verified successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};