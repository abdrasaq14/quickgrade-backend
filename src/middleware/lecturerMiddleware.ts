import { type Request, type Response, type NextFunction } from 'express'

import jwt from 'jsonwebtoken'
import Lecturer from '../model/lecturerModel'

interface AuthRequestLecturer extends Request {
  lecturer?: { lecturerId: string } // Add the user property
}
const secret: string = (process.env.secret ?? '')

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

export async function authenticateLecturer (req: AuthRequestLecturer, res: Response, next: NextFunction): Promise<void> {
  try {
    // console.log('auth token', req.session.lecturerId)
    // const token = req.session.lecturerToken
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
