import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

export const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'quickgradedecagon@gmail.com',
    pass: 'tdynykegchtuzfog',
  },
});