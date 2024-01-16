import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import * as dotenv from 'dotenv';
import path from 'path';
import express, { Request, Response } from 'express';

dotenv.config();

const emailMessage = async (req: Request, res: Response) => {
  try {
    const { email, subject, message } = req.body;

    // Create a nodemailer transporter
    const transporter: Transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.USER,
        pass: process.env.APP_PASSWORD,
      },
    });

    // Define email options
    const mailOptions: SendMailOptions = {
      from: {
        name: 'QuickGrade',
        address: process.env.USER || 'quickgradeapp@gmail.com',  
      },
      to: email,
      subject: 'Send Email using Nodemailer and Gmail ✔',
      text: 'Hello world?',
      html: '<b>Hello world?</b>',
      attachments: [
        {
          filename: 'python.jpeg',
          path: path.join(__dirname, '..', 'public/imges', 'python.jpeg'), // Corrected the path
          contentType: 'application/pdf',
        },
        {
          filename: 'python.jpeg',
          path: path.join(__dirname, '..', 'public/images', 'python.jpeg'), // Corrected the path
          contentType: 'application/pdf', // Corrected the content type
        },
      ],
    };

    // Function to send email
    const sendMail = async (transporter: Transporter, mailOptions: SendMailOptions) => {
      await transporter.sendMail(mailOptions);
      console.log('Email has been sent successfully');
    };

    // Call the sendMail function
    await sendMail(transporter, mailOptions);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default emailMessage;
