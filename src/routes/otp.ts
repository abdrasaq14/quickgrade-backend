import express from 'express'
// import express, { type Response } from 'express'
// import express from 'express'
import { sendStudentOTP, verifyStudentOTP, sendLecturerOTP, verifyLecturerOTP } from '../controller/otp'

const router = express.Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/sendStudent-otp', sendStudentOTP)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/verifyStudent-otp', verifyStudentOTP)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/sendLecturer-otp', sendLecturerOTP)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/verifyLecturer-otp', verifyLecturerOTP)

export default router
