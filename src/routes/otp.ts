import express from 'express'
import { sendOTP, verifyOTP } from '../controller/otp'
const router = express.Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/send-otp', sendOTP)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/verify-otp', verifyOTP)

export default router
