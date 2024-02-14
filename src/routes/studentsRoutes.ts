import express from 'express'
import { studentSignup, updateStudentPassword, studentLogin, verifyOTP, resetPassword, resetPasswordToken, getStudentDashboard, logout, getExamTimetable, takeExam, getObjectivesScore } from '../controller/studentController'
import { authenticateStudent } from '../middleware/middleware'
const router = express.Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/signup', studentSignup)

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/login', studentLogin)

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/verify-otp/', verifyOTP)

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/reset-password', resetPassword)

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/reset-password/:token', resetPasswordToken)

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/dashboard', getStudentDashboard)

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/dashboard/take-exams/:courseCode', takeExam)

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/dashboard/enrolled-courses', getExamTimetable)

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/dashboard/get-results', getObjectivesScore)

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.put('/dashboard/change-password', authenticateStudent, updateStudentPassword)

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/dashboard/logout', logout)

export default router
