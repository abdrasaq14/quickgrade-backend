import express from 'express'
import { studentSignup, updateStudentPassword, studentLogin } from '../controller/studentController'

const router = express.Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/signup', studentSignup)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/login', studentLogin)

// The route for updating the students's password
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.put('/update-password/:userId', updateStudentPassword)

export default router
