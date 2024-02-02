import { type Request, type Response, type NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import Student from '../model/studentModel'

const secret: string = (process.env.secret ?? '')

interface AuthRequest extends Request {
  student?: { studentId: string } // Add the user property
}

export async function authenticateStudent (req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.cookies.token
    console.log('token 1', token)

    if (!token) {
      res.json({ noTokenError: 'Unauthorized - Token not provided' })
    } else {
      const decoded = jwt.verify(token, secret) as { loginkey: string }
      console.log('decoded', decoded)

      const student = await Student.findOne({
        where: { studentId: decoded.loginkey }
      })

      req.student = { studentId: student?.dataValues.studentId }

      next()
    }
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      console.log('expired', error)
      // Handle the case when the token is expired
      res.json({ tokenExpiredError: 'Unauthorized - Token has expired' })
    } else {
      console.log('unknown', error)
      // Handle other token verification errors
      res.json({ verificationError: 'Unauthorized - Token verification failed' })
    }
  }
}
