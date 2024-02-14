import express from 'express'
import { lecturerSignup, updateLecturerPassword, lecturerLogin, verifyOTP, resetPassword, resetPasswordToken, setExamQuestions, getLecturerDashboard, getGradedExams, gradeExam } from '../controller/lecturerController'
import { authenticateLecturer } from '../middleware/lecturerMiddleware'
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
router.get('/dashboard', getLecturerDashboard)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/set-exam', setExamQuestions)

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/grade-exam-objectives/:courseCode', gradeExam)

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/get-graded-exam-objectives/', getGradedExams)

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.put('/dashboard/change-password', authenticateLecturer, updateLecturerPassword)
// Retrieve and return lecturer profile

export default router
