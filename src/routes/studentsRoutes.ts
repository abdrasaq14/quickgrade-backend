import express, { Request, Response, NextFunction} from 'express'; 
import { studentSignup, updateStudentPassword, studentLogin } from '../controller/studentController';

 
 
 const router = express.Router();



 router.post ('/signup', studentSignup);
 router.post('/login', studentLogin);



// The route for updating the students's password
router.put('/update-password/:userId', updateStudentPassword);

export default router;
