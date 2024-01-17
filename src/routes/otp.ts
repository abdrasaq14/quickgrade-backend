import express from 'express';
import  { sendOTP } from '../controller/otp';
const router = express.Router();

router.post('/send-otp', sendOTP);


export default router;
