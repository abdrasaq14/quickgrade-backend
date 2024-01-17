import express, { Request, Response, NextFunction} from 'express'; 
import { studentSignup, updateStudentPassword } from '../controller/studentController';

 
 
 const router = express.Router();



 router.post ('/students/signup', studentSignup);



// The route for updating the students's password
router.put('students/update-password/:userId', updateStudentPassword);

export default router;
