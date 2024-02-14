import { type Request, type Response, type NextFunction } from 'express'

import jwt from 'jsonwebtoken'
import Lecturer from '../model/lecturerModel'

interface AuthRequestLecturer extends Request {
  lecturer?: { lecturerId: string } // Add the user property
}
const secret: string = (process.env.secret ?? '')

export async function authenticateLecturer (req: AuthRequestLecturer, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    console.log('token', token)
    if (!token) {
      res.json({ noTokenError: 'Unauthorized - Token not provided' })
    } else {
      const decoded = jwt.verify(token, secret) as { loginkey: string }

      const lecturer = await Lecturer.findOne({
        where: { lecturerId: decoded.loginkey }
      })

      req.lecturer = { lecturerId: lecturer?.dataValues.lecturerId }

      next()
    }
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      // Handle the case when the token is expired
      res.json({ tokenExpiredError: 'Unauthorized - Token has expired' })
    } else {
      // Handle other token verification errors
      res.json({ verificationError: 'Unauthorized - Token verification failed' })
    }
  }
}
