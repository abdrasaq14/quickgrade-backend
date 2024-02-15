import Lecturer from '../model/lecturerModel'
import Student from '../model/studentModel'
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
import StudentResponse from '../model/studentResponseModel'
import Grading from '../model/gradingModel'

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
          res.json({ successfulSignup: 'lecturer signup successful' })
        }
      }
    }
  } catch (error: any) {
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
        const token = jwt.sign({ loginkey: existingLecturer.dataValues.lecturerId }, secret, { expiresIn: '1h' })
        res.json({ token })
        // res.cookie('lecturerToken', token)

        // res.json({
        //   successfulLogin: 'login successful'
        // })
      }
    }
  } catch (error: any) {
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
      res.json({ OtpVerificationSuccess: 'OTP verified successfully' })
    }
  } catch (error) {
    res.json({ internalServerError: 'Internal Server Error' })
  }
}

export const updateLecturerPassword = async (req: AuthRequest, res: Response): Promise<void> => {
  const lecturerId = req.lecturer?.lecturerId

  const { newPassword } = req.body

  try {
    // Find the user by ID
    const user = await Lecturer.findByPk(lecturerId)

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
    res.status(500).json({ error: 'Internal Server Error' })
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
  }
}

export const setExamQuestions = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      lecturerId, examDuration, instruction, courseTitle, courseCode, semester, session, faculty, department, examDate,
      totalScore, questions, sections
    } = req.body
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const eachSectionDetail = sections.map((section: Record<string, string>) => {
      return `${section.sectionAlphabet}|${section.ScoreObtainable}|${section.questionType}`
    })

    const createdExam = await Exam.create({
      examDuration,
      courseTitle,
      courseCode,
      examInstruction: instruction,
      semester,
      session,
      firstSection: eachSectionDetail[0] || '',
      secondSection: eachSectionDetail[1] || '',
      thirdSection: eachSectionDetail[2] || '',
      faculty,
      lecturerId,
      department,
      examDate,
      totalScore,
      totalNoOfQuestions: questions.length
    })

    const examId = createdExam.dataValues.examId
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
      }
    }))
    if (!createdQuestions) {
      console.log('unable to create questions')
    } else {
      res.json({ examQuestionCreated: 'exam created successfully' })
    }
  } catch (error) {
  }
}

export const gradeExam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseCode } = req.params
    const { studentId, examId, assembledQuestions } = req.body
    const semester = await Exam.findOne({ attributes: ['semester'], where: { examId } })
    const studentResponse = await Promise.all(assembledQuestions.map(async (response: Record<string, any>) => {
      try {
        if (response.questionType === 'Objective') {
          const correctAnswer = await Question.findOne({ where: { questionId: response.questionId } })

          return await StudentResponse.create({
            studentId,
            examId,
            semester: semester?.dataValues.semester,
            courseCode,
            questionId: response.questionId,
            responseText: response.questionText,
            isCorrect: correctAnswer?.dataValues.correctAnswer === response.typedAnswer
          })
        }
      } catch (error) {
        res.json({ error: 'Internal Server Error' })
      }
    }))

    if (!studentResponse) {
      console.log('unable to grade student response')
    } else {
      // to get the number of objective questions answered by each student
      const findStudentResponse = await StudentResponse.findAll({ attributes: ['studentId', 'courseCode', 'examId', 'isCorrect'], where: { studentId } })
      // filter only the current course in case of existing courses
      const filterCurrentCourseOnly = findStudentResponse.filter((currentCourse) => currentCourse.dataValues.courseCode === courseCode)
      // reducing it to the number of questions in each course
      const result = filterCurrentCourseOnly.reduce((acc: Record<string, number>, curr) => {
        const key = curr.dataValues.courseCode
        if (!acc[key]) {
          acc[key] = 0
        }
        acc[key]++

        return acc
      }, {})

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      const eachQuetionAllocatedMarks = Object.keys(result).map(async (key) => {
        const course = await Exam.findOne({ where: { courseCode: key } })
        if (course) {
          // getting the allocated mark for that section
          const AllocatedTotalMarks = Number(course.dataValues.firstSection.split('|')[1])
          // getting the marks for each question
          const eachQuestionMark = AllocatedTotalMarks / result[key]
          let count = 0
          // eslint-disable-next-line array-callback-return
          filterCurrentCourseOnly.map((studentResponse) => {
            studentResponse.dataValues.isCorrect === true ? count++ : count += 0
          })
          const objectiveGrade = parseFloat((eachQuestionMark * count).toFixed(2))
          const theoryGrade = 0
          await Grading.create({
            studentId,
            examId,
            courseCode: key,
            theoryGrade: 0,
            objectiveGrade: parseFloat((eachQuestionMark * count).toFixed(2)),
            totalGrade: parseFloat((objectiveGrade + theoryGrade).toFixed(2)),
            semester: course.dataValues.semester
          })
        }
      })
      const studentResponseAutograding = await Promise.all(eachQuetionAllocatedMarks)
      if (!studentResponseAutograding) {
        res.json({ unableToGradeStudent: 'Internal Server Error' })
      } else {
        console.log('student', studentResponseAutograding)
        res.json({ objectivesAutoGradedSuccessfully: 'exam created successfully' })
      }
    }
  } catch (error) {

  }
}
export const getLecturerDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    // const semester = req.query.semester || 'first semester'

    const exams = await Exam.findAll(

    )

    const student = await Student.findAll()

    const noOfStudents = student.length

    const examsTotal = exams.map((exam) => ({ ...exam.dataValues, noOfStudents }))

    res.json({ examsTotal })
  } catch (error) {
  }
}

export const getGradedExams = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lecturerId, semester } = req.query
    const checkExamQuestions = await Exam.findAll({ where: { lecturerId } })
    const firstSemester = checkExamQuestions.filter((filterBySemester) => filterBySemester.dataValues.semester === semester)

    // eslint-disable-next-line @typescript-eslint/no-floating-promises, @typescript-eslint/no-confusing-void-expression
    await Promise.all(firstSemester.map(async (eachStudentThatTookExam) => {
      const examId = eachStudentThatTookExam.dataValues.examId
      return await Grading.findAll({ where: { examId } })
        .then(async gradings => {
          return await Promise.all(gradings.map(async grading => {
            const studentId = grading.dataValues.studentId
            return await Student.findOne({ attributes: ['matricNo'], where: { studentId } })
              .then(matricNo => {
                const returnedObject = {
                  ...grading.dataValues,
                  matricNo: matricNo?.dataValues.matricNo ?? ''
                }
                return returnedObject
              })
          }))
        })
    })).then(response => {
      const StudentResult = response.flat()
      res.json({ StudentResult })
    }).catch(error => {
      console.log(error)
    })
  } catch (error) {
  }
}
