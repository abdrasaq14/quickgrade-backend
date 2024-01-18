import express from 'express'
import { lecturerSignup, updateLecturerPassword, lecturerLogin } from '../controller/lecturerController'

const router = express.Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/signup', lecturerSignup)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/login', lecturerLogin)

// The route for updating the students's password
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.put('students/update-password/:userId', updateLecturerPassword)

export default router
