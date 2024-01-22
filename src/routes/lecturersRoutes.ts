import express from 'express';
import { lecturerSignup, updateLecturerPassword, lecturerLogin, verifyOTP, getLecturerProfile } from '../controller/lecturerController';
import { authenticateToken } from '../middleware/middleware';


const router = express.Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/signup', lecturerSignup)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/login', lecturerLogin)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/verify-otp', verifyOTP)
// The route for updating the students's password
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.put('students/update-password/:userId', updateLecturerPassword)
// Retrieve and return lecturer profile
router.get('/profile', authenticateToken, getLecturerProfile);
// router.get('/profile', authenticateToken, getLecturerProfile);

export default router



 



