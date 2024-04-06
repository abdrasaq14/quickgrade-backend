import nodemailer from 'nodemailer'
import { config } from 'dotenv'
config()
const { USER, APP_PASSWORD } = process.env
export const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: USER,
    pass: APP_PASSWORD
  }
})
