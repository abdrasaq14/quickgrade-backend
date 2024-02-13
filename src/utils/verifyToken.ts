import { type Request, type Response } from 'express'
import jwt from 'jsonwebtoken'
import Student from '../model/studentModel'
import Lecturer from '../model/lecturerModel'

const secret: string = (process.env.secret ?? '')

export async function checkAndVerifyStudentToken (req: Request, res: Response): Promise<void> {
  try {
    const token = req.cookies.token

    if (!token) {
      res.json({ noTokenError: 'Unauthorized - Token not provided' })
    } else {
      const decoded = jwt.verify(token, secret) as { loginkey: string }
      const student = await Student.findOne({
        where: { studentId: decoded.loginkey }
      })
      console.log('student')
      res.json({ student })

      // req.student = { studentId: student?.dataValues.studentId }
    }
  } catch (error: any) {
    console.log('error', error)
    if (error.name === 'TokenExpiredError') {
      console.log('expired', error)

      res.json({ tokenExpiredError: 'Unauthorized - Token has expired' })
    } else {
      console.log('unknown', error)

      res.json({ verificationError: 'Unauthorized - Token verification failed' })
    }
  }
}
export async function checkAndVerifyLecturerToken (req: Request, res: Response): Promise<void> {
  try {
    const token = req.cookies.lecturerToken
    if (!token) {
      res.json({ noTokenError: 'Unauthorized - Token not provided' })
    } else {
      const decoded = jwt.verify(token, secret) as { loginkey: string }
      const lecturer = await Lecturer.findOne({
        where: { lecturerId: decoded.loginkey }
      })
      console.log('lecturer')
      res.json({ lecturer })

      // req.student = { lecturerId: student?.dataValues.lecturerId }
    }
  } catch (error: any) {
    console.log('error', error)
    if (error.name === 'TokenExpiredError') {
      console.log('expired', error)

      res.json({ tokenExpiredError: 'Unauthorized - Token has expired' })
    } else {
      console.log('unknown', error)

      res.json({ verificationError: 'Unauthorized - Token verification failed' })
    }
  }
}
