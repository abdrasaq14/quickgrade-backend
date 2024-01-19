import express from 'express'
import { studentSignup, updateStudentPassword, studentLogin, verifyOTP, resetPassword, resetPasswordToken } from '../controller/studentController'
const router = express.Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/signup', studentSignup)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/login', studentLogin)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/verify-otp', verifyOTP)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/reset-password', resetPassword)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/reset-password:token', resetPasswordToken)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.put('/update-password/:userId', updateStudentPassword)

export default router
