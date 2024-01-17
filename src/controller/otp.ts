import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import speakeasy from 'speakeasy';
import Student from '../model/studentModel';
import Lecturer from '../model/lecturerModel';

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

interface TOTPSecretMap {
  [email: string]: {
    secret: string;
    user: Student | Lecturer;
  };
}

const totpSecretMap: TOTPSecretMap = {};

export const sendOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    let user: Student | Lecturer | undefined;

    const student = await Student.findOne({ where: { email } });
    const lecturer = await Lecturer.findOne({ where: { email } });

    if (student) {
      user = student;
    } else if (lecturer) {
      user = lecturer;
    }

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const totpSecret = speakeasy.generateSecret({ length: 20 });

    // Store the TOTP secret in the map along with the user
    totpSecretMap[email] = { secret: totpSecret.base32, user };

    const totpToken = speakeasy.totp({
      secret: totpSecret.base32,
      encoding: 'base32',
    });

    const mailOptions = {
      from: {
        name: 'Quick Grade App',
        address: 'quickgradedecagon@gmail.com',
      },
      to: email,
      subject: 'Quick Grade App - Email Verification Code',
      text: `TOTP: ${totpToken}`,
      html: `<b>TOTP: ${totpToken}</b>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'TOTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

