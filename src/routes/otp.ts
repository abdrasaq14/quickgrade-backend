import express from 'express';
import  { sendStudentOTP, verifyStudentOTP, sendLecturerOTP, verifyLecturerOTP } from '../controller/otp';
const router = express.Router();

router.post('/sendStudent-otp', sendStudentOTP);
router.post('/verifyStudent-otp', verifyStudentOTP);
router.post('/sendLecturer-otp', sendLecturerOTP);
router.post('/verifyLecturer-otp', verifyLecturerOTP);


export default router;