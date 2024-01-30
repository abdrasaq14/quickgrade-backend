import express, {
  type Request,
  type Response,
  type NextFunction
} from 'express'
import { createCourse, getAllCourses } from '../controller'
const router = express.Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/create-course', createCourse)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/get-courses', getAllCourses)
/* GET home page. */
router.get('/:role', function (req: Request, res: Response, next: NextFunction) {
  const { role } = req.params
  console.log('role', role)
  res.json({ role })
}
)
export default router
