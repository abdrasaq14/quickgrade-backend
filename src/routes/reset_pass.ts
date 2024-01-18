
import express from 'express'
import { resetPassword, resetPasswordToken } from '../controller/reset_password' // Added missing equal sign here
const router = express.Router()

router.post('/reset-password', resetPassword) // New route for password reset
router.post('/reset/:token', resetPasswordToken) // New route for password reset

export default router;
