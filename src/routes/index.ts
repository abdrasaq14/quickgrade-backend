/* eslint-disable @typescript-eslint/no-misused-promises */
import express, {
  type Request,
  type Response,
  type NextFunction
} from 'express'
import { createCourse, getAllCourses, getAllFacultyAndDepartments } from '../controller'
const router = express.Router()

router.post('/create-course', createCourse)
router.get('/get-faculty-and-departments', getAllFacultyAndDepartments)
router.get('/get-courses', getAllCourses)
router.get('/:role', function (req: Request, res: Response, next: NextFunction) {
  const { role } = req.params
  res.json({ role })
}
)

export default router
