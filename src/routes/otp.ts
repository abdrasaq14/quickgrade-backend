import express from 'express';
// import express, { type Response } from 'express'
// import express from 'express'
import  { sendStudentOTP, verifyStudentOTP, sendLecturerOTP, verifyLecturerOTP } from '../controller/otp';
import { type AuthenticatedRequest } from '../../extender';

const router = express.Router();

router.post('/sendStudent-otp',  sendStudentOTP);
router.post('/verifyStudent-otp', verifyStudentOTP);
router.post('/sendLecturer-otp', sendLecturerOTP);
router.post('/verifyLecturer-otp', verifyLecturerOTP);


export default router;
