import express, { Request, Response, NextFunction} from 'express'; 
import { updateStudentPassword } from '../controller/studentController';
 
 
 const router = express.Router();




// The route for updating the students's password
router.put('students/update-password/:userId', updateStudentPassword);

export default router;
