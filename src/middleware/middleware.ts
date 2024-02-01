import { type Request, type Response, type NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import Student from '../model/studentModel'

const secret: string = (process.env.secret ?? '')

interface AuthRequest extends Request {
  student?: { studentId: string } // Add the user property
}

<<<<<<< HEAD


export async function authenticateStudent(req: AuthRequest, res: Response, next: NextFunction) {

=======
export async function authenticateStudent (req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
>>>>>>> b50c88f (improved the implementation that links the backend and frontend)
  try {
    const token = req.cookies.token
    console.log('token', token)

    if (!token) {
      res.status(401).json({ error: 'Unauthorized - Token not provided' })
    } else {
      const decoded = jwt.verify(token, secret) as { loginkey: string }
      console.log(decoded)

      const student = await Student.findOne({
        where: { studentId: decoded.loginkey }
      })

      req.student = { studentId: student?.dataValues.studentId }

      next()
    }
  } catch (error) {
    console.error(error)
    res.status(401).json({ error: 'Unauthorized - Invalid token' })
  }
}
