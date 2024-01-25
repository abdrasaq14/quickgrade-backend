import { type Request, type Response, type NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import Student from '../model/studentModel'

const secret: string = (process.env.secret ?? '')

interface AuthRequest extends Request {
  student?: { studentId: string } // Add the user property
}

// export async function authenticate (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
//   const email = req.session.email
//   console.log('email', email)
//   try {
//     if (!email) {
//       console.log('no email')
//       res.json({ unathorized: 'unathorized' })
//     } else {
//       req.user = email
//       next()
//     }
//   } catch (error) {
//     console.error(error)
//     res.status(401).json({ message: 'Unauthorized' })
//   }
// };

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function authenticateStudent (req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.token

    if (!token) {
      console.log('no token')
      res.json({ UnauthorizedError: 'Unauthorized - Token not provided' })
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
