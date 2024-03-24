/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import { lecturerSignup, updateLecturerPassword, lecturerLogin, verifyOTP, resetPassword, saveDraftExams, resetPasswordToken, setExamQuestions, getLecturerDashboard, getGradedExams, gradeExam } from '../controller/lecturerController'
import { authenticateLecturer } from '../middleware/lecturerMiddleware'
const router = express.Router()

router.post('/signup', lecturerSignup)
router.post('/login', lecturerLogin)
router.post('/verify-otp/', verifyOTP)
router.post('/reset-password', resetPassword)
router.post('/reset-password/:token', resetPasswordToken)

router.get('/dashboard', getLecturerDashboard)
router.post('/set-exam', setExamQuestions)

router.post('/grade-exam-objectives/:courseCode', gradeExam)

router.get('/get-graded-exam-objectives/', getGradedExams)

router.put('/dashboard/change-password', authenticateLecturer, updateLecturerPassword)

router.post('/save-draft-exams', saveDraftExams)

export default router
