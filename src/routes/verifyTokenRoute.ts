import express from 'express'
import { checkAndVerifyStudentToken, checkAndVerifyLecturerToken } from '../utils/verifyToken'
const router = express.Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/students', checkAndVerifyStudentToken)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/lecturers', checkAndVerifyLecturerToken)

export default router
