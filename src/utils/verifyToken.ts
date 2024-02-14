import { type Request, type Response } from 'express'
import jwt from 'jsonwebtoken'
import Student from '../model/studentModel'
import Lecturer from '../model/lecturerModel'

const secret: string = (process.env.secret ?? '')
export async function checkAndVerifyStudentToken (req: Request, res: Response): Promise<void> {
  try {
    // const token = req.cookies.token
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      res.json({ noTokenError: 'Unauthorized - Token not provided' })
    } else {
      const decoded = jwt.verify(token, secret) as { loginkey: string }
      const student = await Student.findOne({
        where: { studentId: decoded.loginkey }
      })
      res.json({ student })

      // req.student = { studentId: student?.dataValues.studentId }
    }
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.json({ tokenExpiredError: 'Unauthorized - Token has expired' })
    } else {
      res.json({ verificationError: 'Unauthorized - Token verification failed' })
    }
  }
}
export async function checkAndVerifyLecturerToken (req: Request, res: Response): Promise<void> {
  try {
    // const token = req.cookies.lecturerToken
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      res.json({ noTokenError: 'Unauthorized - Token not provided' })
    } else {
      const decoded = jwt.verify(token, secret) as { loginkey: string }
      const lecturer = await Lecturer.findOne({
        where: { lecturerId: decoded.loginkey }
      })
      res.json({ lecturer })

      // req.student = { lecturerId: student?.dataValues.lecturerId }
    }
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.json({ tokenExpiredError: 'Unauthorized - Token has expired' })
    } else {
      res.json({ verificationError: 'Unauthorized - Token verification failed' })
    }
  }
}
