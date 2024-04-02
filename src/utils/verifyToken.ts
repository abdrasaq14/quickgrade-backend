import { type Request, type Response } from 'express'
import jwt from 'jsonwebtoken'
import Student from '../model/studentModel'
import Lecturer from '../model/lecturerModel'
import DraftExam from '../model/draftExamModel'

const secret: string = (process.env.secret ?? '')
export async function checkAndVerifyStudentToken (req: Request, res: Response): Promise<void> {
  try {
    // const token = req.cookies.token
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      res.json({ noTokenError: 'Unauthorized - Token not provided' })
    } else {
      const decoded = jwt.verify(token, secret) as { loginkey: string }
      const studentData = await Student.findOne({
        where: { studentId: decoded.loginkey }
      })
      const student = { studentId: studentData?.dataValues.studentId, faculty: studentData?.dataValues.faculty, department: studentData?.dataValues.department, email: studentData?.dataValues.email, matricNo: studentData?.dataValues.matricNo, firstName: studentData?.dataValues.firstName, lastName: studentData?.dataValues.lastName }
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
      const lecturerData = await Lecturer.findOne({
        where: { lecturerId: decoded.loginkey }
      })
      const checkDraftCourseByLecturer = await DraftExam.findOne({
        attributes: ['courseCode'],
        where: { lecturerId: decoded.loginkey }
      })
      const lecturer = { title: lecturerData?.dataValues.title, lecturerId: lecturerData?.dataValues.lecturerId, firstName: lecturerData?.dataValues.firstName, lastName: lecturerData?.dataValues.lastName, faculty: lecturerData?.dataValues.faculty, department: lecturerData?.dataValues.department, email: lecturerData?.dataValues.email, employeeID: lecturerData?.dataValues.employeeID, draftCourses: [checkDraftCourseByLecturer?.dataValues.courseCode] }
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
