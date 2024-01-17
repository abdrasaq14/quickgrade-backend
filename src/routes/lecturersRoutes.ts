import express, { Request, Response, NextFunction} from 'express'; 
import { lecturerSignup, updateLecturerPassword } from '../controller/lecturerController';
 
 
 const router = express.Router();



router.post ('/lecturers/signup', lecturerSignup);

// The route for updating the students's password
router.put('students/update-password/:userId', updateLecturerPassword);

export default router;
