import express from 'express'
import { lecturerSignup, updateLecturerPassword, lecturerLogin, verifyOTP, resetPassword, resetPasswordToken, createCourse, setExamQuestions } from '../controller/lecturerController'
import { authenticateStudent } from '../middleware/middleware'
const router = express.Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/signup', lecturerSignup)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/login', lecturerLogin)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/verify-otp/', verifyOTP)
// The route for updating the students's password
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/reset-password', resetPassword)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/reset-password/:token', resetPasswordToken)

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/create-course', createCourse)

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/set-exam', setExamQuestions)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.put('students/update-password/:userId', updateLecturerPassword)
// Retrieve and return lecturer profile
// eslint-disable-next-line @typescript-eslint/no-misused-promises
// router.get('/profile', authenticateToken, getLecturerProfile)
// router.get('/profile', authenticateToken, getLecturerProfile);

export default router
