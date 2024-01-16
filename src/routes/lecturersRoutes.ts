import express, { Request, Response, NextFunction} from 'express'; 
import { updateLecturerPassword } from '../controller/lecturerController';
 
 
 const router = express.Router();




// The route for updating the students's password
router.put('students/update-password/:userId', updateLecturerPassword);

export default router;
