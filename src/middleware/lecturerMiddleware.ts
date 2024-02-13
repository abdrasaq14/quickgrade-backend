import { type Request, type Response, type NextFunction } from 'express'

import jwt from 'jsonwebtoken'
import Lecturer from '../model/lecturerModel'

interface AuthRequestLecturer extends Request {
  lecturer?: { lecturerId: string } // Add the user property
}
const secret: string = (process.env.secret ?? '')

export async function authenticateLecturer (req: AuthRequestLecturer, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.cookies.lecturerToken

    console.log('lecturer-token', token)

    if (!token) {
      res.json({ lectuerUnauthorizedError: 'Unauthorized - Token not provided' })
    } else {
      const decoded = jwt.verify(token, secret) as { loginkey: string }

      const lecturer = await Lecturer.findOne({
        where: { lecturerId: decoded.loginkey }
      })

      req.lecturer = { lecturerId: lecturer?.dataValues.lecturerId }

      next()
    }
  } catch (error) {
    console.error(error)
    res.status(401).json({ error: 'Unauthorized - Invalid token' })
  }
}
