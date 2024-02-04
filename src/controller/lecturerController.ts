import Lecturer from '../model/lecturerModel'
import { type Request, type Response } from 'express'
import bcrypt from 'bcryptjs'
import type { AuthRequest } from '../../extender'
import { transporter } from '../utils/emailsender'
import crypto from 'crypto'
import speakeasy from 'speakeasy'
import Question from '../model/questionModel'
import Exam from '../model/examModel'
import Courses from '../model/courseModel'
import jwt from 'jsonwebtoken'
import ExamResult from '../model/examResultModel'
import StudentResponse from '../model/studentResponseModel'
interface AuthRequestLecturer extends Request {
  lecturer?: { lecturerId: string } // Add the user property
}

const secret: string = (process.env.secret ?? '')

export const lecturerSignup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { firstName, lastName, faculty, department, password, email, title } = req.body
    const existingLecturer = await Lecturer.findOne({ where: { email } })

    if (existingLecturer) {
      res.json({
        existingLecturerError: 'Lecturer already exists'
      })
    } else {
      const hashedPassword = await bcrypt.hash(password, 12)
      const noOfLecturer = (await Lecturer.count() + 1).toString().padStart(4, '0')
      const employeeID = `QUICK/LT/${faculty.toUpperCase().slice(0, 3)}/${noOfLecturer}`
      const createdLecturer = await Lecturer.create({
        firstName,
        lastName,
        faculty,
        title,
        department,
        password: hashedPassword,
        email,
        employeeID
      })
      // sending employeeID  and password to Lecturer email
      if (!createdLecturer) {
        console.log('Lecturer not created')
        res.json({
          failedSignup: 'Lecturer signup failed'
        })
      } else {
        const lecturerDetail = await Lecturer.findOne({ where: { email } })

        if (!lecturerDetail) {
          res.json({ lecturerNotFoundError: 'Lecturer record not found' })
        } else {
          const totpSecret = speakeasy.generateSecret({ length: 20 })

          // Update the lecturer instance with TOTP details
          await lecturerDetail.update({
            otpSecret: totpSecret.base32,
            otp: speakeasy.totp({
              secret: totpSecret.base32,
              encoding: 'base32'
            }),
            otpExpiration: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
          })

          const mailOptions = {
            from: {
              name: 'QuickGrade App',
              address: 'quickgradedecagon@gmail.com'
            },
            to: email,
            subject: 'Quick Grade App - Email Verification Code',
            text: `TOTP: ${lecturerDetail.otp}`,
            html: `<h3>Hi there,
        Thank you for signing up for QuickGrade. Copy OTP below to verify your email:</h3>
        <h1>${lecturerDetail.otp}</h1>
        <h3>This OTP will expire in 10 minutes. If you did not sign up for a QuickGrade account,
        you can safely ignore this email. <br>
        <br>

        Best regards, <br>
        The QuickGrade Team</h3>`
          }
          await transporter.sendMail(mailOptions)
          console.log('successs')
          res.json({ successfulSignup: 'lecturer signup successful' })
        }
      }
    }
  } catch (error: any) {
    console.error('Error creating lecturer:', error)

    res.status(500).json({
      message: ` error: ${error}`
    })
  }
}

export const lecturerLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { employeeID, password } = req.body

  try {
    const existingLecturer = await Lecturer.findOne({ where: { employeeID } })

    if (!existingLecturer) {
      res.json({
        lecturerNotFoundError: 'Invalid lecturerId'
      })
    } else {
      const isPasswordValid = await bcrypt.compare(
        password,
        existingLecturer.dataValues.password
      )
      if (!isPasswordValid) {
        res.json({
          inValidPassword: 'Invalid password'
        })
      } else {
        const token = jwt.sign({ loginkey: existingLecturer.dataValues.lecturerId }, secret, { expiresIn: '3h' })

        res.cookie('lecturerToken', token, { httpOnly: true, secure: false })

        res.json({
          successfulLogin: 'login successful'
        })
      }
    }
  } 
  catch (error: any) {
    console.error('Error during lecturer login:', error)

    res.status(500).json({
      internalServerError: `Error: ${error}`
    })
  }
}

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body
  const user = await Lecturer.findOne({ where: { email } })

  if (!user) {
    res.json({ userNotFoundError: 'User not found' })
    return
  } else {
    const token = crypto.randomBytes(20).toString('hex')
    user.resetPasswordToken = token
    user.resetPasswordExpiration = new Date(Date.now() + 3600000) // 1 hour
    await user.save()

    const mailOptions = {
      from: 'quickgradedecagon@gmail.com',
      to: email,
      subject: 'Password Reset',
      // text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\nhttp://${req.headers.host}/reset-password/${token}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\nhttp://localhost:5173/lecturers/reset-password/${token}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`
    }

    await transporter.sendMail(mailOptions)
  }

  res.json({ linkSentSuccessfully: 'An email has been sent to the address provided with further instructions.' })
}

export const resetPasswordToken = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.params
  const { password } = req.body

  const user = await Lecturer.findOne({ where: { resetPasswordToken: token } })

  if (!user) {
    res
      .status(404)
      .json({ invalidPasswordResetToken: 'Password reset token is invalid or has expired.' })
    return
  }

  if (!user.resetPasswordExpiration || Date.now() > user.resetPasswordExpiration.getTime()) {
    res
      .status(401)
      .json({ tokenExpired: 'Password reset token is invalid or has expired.' })
    return
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  user.password = hashedPassword

  user.resetPasswordToken = null
  user.resetPasswordExpiration = null
  await user.save()

  res.json({ passwordResetSuccessful: 'Your password has been reset!' })
}
export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { otp } = req.body
    const lecturer = await Lecturer.findOne({ where: { otp } })
    const email = lecturer?.dataValues.email

    if (!lecturer) {
      res.json({ invalidOtp: 'Invalid otp' })
    } else {
      const now = new Date()
      if (now > lecturer.otpExpiration) {
        res.json({ expiredOtpError: 'OTP has expired' })
        return
      }

      await lecturer.update({ isVerified: true, otp: null, otpExpiration: null, otpSecret: null })
      // res.redirect('http://localhost:5173/students/reset-password')
      const mailOptions = {
        from: {
          name: 'QuickGrade App',
          address: 'quickgradedecagon@gmail.com'
        },
        to: email,
        subject: 'Quick Grade App - Login Details',
        text: 'Login Detail',
        html: `<h3>Hi there,
          Your Account has been successfully created and Email verification is successful. kindly find your login details below:</h3>

          <h1> EmployeeID: ${lecturer.dataValues.employeeID}</h1>
          <br>
          <br>
          

          <h3>Best regards,<br>
          <h3>The QuickGrade Team</h3>`
      }

      await transporter.sendMail(mailOptions)
      console.log('successs')
      // res.json({ successfulSignup: 'Student signup successful' })
      res.json({ OtpVerificationSuccess: 'OTP verified successfully' })
    }
  } catch (error) {
    console.error(error)
    res.json({ internalServerError: 'Internal Server Error' })
  }
}

export const updateLecturerPassword = async (req: AuthRequest, res: Response): Promise<void> => {
  const studentId = req.student?.studentId

  const { newPassword } = req.body

  try {
    // Find the user by ID
    const user = await Lecturer.findByPk(studentId)

    if (!user) {
      res.status(404).json({ error: 'User not found' })
    } else {
      user.dataValues.password = newPassword

      // Save the updated user to the database
      await user.save()

      res.status(200).json({ message: 'Password updated successfully' })
    }

    // Update the user's password
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// export const getLecturerProfile = async (req: Request, res: Response): Promise<void> => {
//   try {
//     // Assuming that the authenticated lecturer's details are stored in req.user after authentication
//     const lecturerProfile = req.user

//     // You can customize the data you want to include in the profile response
//     const profileResponse = {
//       lecturerId: lecturerProfile.lecturerId,
//       employeeID: lecturerProfile.employeeID,
//       email: lecturerProfile.email,
//       faculty: lecturerProfile.faculty,
//       department: lecturerProfile.department
//       // Add more fields as needed
//     }

//     res.status(200).json(profileResponse)
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({ error: 'Internal Server Error' })
//   }
// }

export const createCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseCode, courseTitle, creditUnit, session, semester } = req.body

    const newCourse = await Courses.create({
      courseCode,
      courseTitle,
      creditUnit,
      session,
      semester
    })
    if (!newCourse) {
      res.json({
        message: 'unable to create course'
      })
    } else {
      res.json({
        message: 'course created succesfully'
      })
    }
  } catch (error) {
    console.log(error)
  }
}

export const getCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { semester, session } = req.body

    const courses = await Courses.findAll({
      where: {
        semester,
        session
      }
    })

    if (!courses) {
      res.json({
        message: 'courses not available'
      })
    } else {
      res.json({
        message: 'Here are the available courses',
        data: courses
      })
    }
  } catch (error) {
    console.log(error)
  }
}

export const setExamQuestions = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('req.body', req.body)
    const {
      lecturerId, examDuration, courseTitle, courseCode, semester, session, faculty, department, examDate,
      totalScore, questions
    } = req.body

    const createdExam = await Exam.create({
      examDuration,
      courseTitle,
      courseCode,
      semester,
      session,
      faculty,
      lecturerId,
      department,
      examDate,
      totalScore,
      totalNoOfQuestions: questions.length
    })

    const examId = createdExam.dataValues.examId
    console.log('examId', examId)

    // Use Promise.all to wait for all promises to resolve
    const createdQuestions = await Promise.all(questions.map(async (question: Record<string, any>) => {
      try {
        if (question.type === 'theory') {
          return await Question.create({
            questionText: question.questionText,
            questionType: 'Theory',
            optionA: question.optionA,
            optionB: question.optionB,
            optionC: question.optionC,
            optionD: question.optionD,
            lecturerId: createdExam.dataValues.lecturerId,
            correctAnswer: question.correctAnswer,
            courseCode,
            examId
          })
        } else if (question.type === 'fill-in-the-blank') {
          return await Question.create({
            questionText: question.questionText,
            questionType: 'fill-in-the-blank',
            optionA: question.optionA,
            optionB: question.optionB,
            optionC: question.optionC,
            optionD: question.optionD,
            lecturerId: createdExam.dataValues.lecturerId,
            correctAnswer: question.correctAnswer,
            courseCode,
            examId
          })
        } else if (question.type === 'objectives') {
          return await Question.create({
            questionText: question.questionText,
            questionType: 'Objective',
            optionA: question.optionA,
            optionB: question.optionB,
            optionC: question.optionC,
            optionD: question.optionD,
            lecturerId: createdExam.dataValues.lecturerId,
            correctAnswer: question.correctAnswer,
            courseCode,
            examId
          })
        }
      } catch (error) {
        console.log('error', error)
      }
    }))

    if (!createdQuestions.some(question => !question)) {
      console.log('unable to create questions')
    } else {
      console.log('question created successfully')
      res.json({ examQuestionCreated: 'exam created successfully' })
    }

    const markingResult = await markExam(Exam, Question, StudentResponse)

    if (!markingResult) {
      res.status(500).json({ error: 'Unable to mark the exam' })
    } else {
      res.json({ examQuestionCreated: 'Exam and questions created and marked successfully', markingResult })
    }
  } catch (error) {
    console.log(error)
  }

  async function markExam (Exam: any, Question: any, StudentResponse: any): Promise<any> {
    try {
      const studentId = 'studentId'

      let totalMarks = 0

      for (let i = 0; i < Question.length; i++) {
        const question = Question[i]
        const correctAnswer = question.correctAnswer

        const studentAnswer = StudentResponse[i].responseText
        const isCorrect = studentAnswer === correctAnswer

        const scorePerQuestion = Exam.totalScore / Exam.totalNoOfQuestions
        const questionScore = isCorrect ? scorePerQuestion : 0

        totalMarks += questionScore
      }

      await ExamResult.create({
        examId: Exam.examId,
        studentId,
        totalMarks,
        lecturerId: Exam.lecturerId,
        courseCode: Exam.courseCode,
        semester: Exam.semester,
        faculty: Exam.faculty,
        session: Exam.session
      })

      return { totalMarks }
    } catch (error) {
      console.error(error)
      return null
    }
  }
}

export const getLecturerDashboard = async (req: AuthRequestLecturer, res: Response): Promise<void> => {
  try {
    const lecturerId = req.lecturer?.lecturerId

    console.log(lecturerId)

    if (!lecturerId) {
      res.json({ message: 'unauthorized' })
    } else {
      const semester = req.query.semester || 'First'

      const lecturer = await Lecturer.findByPk(lecturerId)

      const exam = await Exam.findAll({
        where: {
          semester,
          session: '2023/2024'
        }
      })

      res.json({ lecturer, exam })
    }
  } catch (error) {
    console.error(error)
    console.log(error)
  }
}
