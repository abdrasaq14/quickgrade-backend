import express, { Request, Response, NextFunction} from 'express'; 
import { lecturerSignup, updateLecturerPassword, lecturerLogin } from '../controller/lecturerController';
 
 
 const router = express.Router();



router.post ('/signup', lecturerSignup);
router.post ('/login', lecturerLogin);

// The route for updating the students's password
router.put('students/update-password/:userId', updateLecturerPassword);

export default router;
