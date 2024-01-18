import jwt from 'jsonwebtoken'
import Student from '../model/studentModel'
import { type Request, type Response, type NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'

const secret: string = (process.env.secret ?? '')
export const studentSignup = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('req', req.body)
    const { faculty, email, department, password } = req.body

    const existingStudent = await Student.findOne({ where: { email } })

    if (existingStudent) {
      console.log('user already exists')
      res.json({
        existingStudentError: 'Student already exists'
      })
    } else {
      console.log('enter password')
      const noOfStudent = (await Student.count() + 1).toString().padStart(4, '0')
      const matricNo = `${faculty.toUpperCase().slice(0, 4)}/${department.toUpperCase().slice(0, 4)}/${noOfStudent}`
      console.log('matric no', matricNo)
      const hashedPassword = await bcrypt.hash(password, 12)
      console.log('password', hashedPassword)
      const createdStudent = await Student.create({
        faculty,
        department,
        email,
        password: hashedPassword,
        matricNo
      })

      if (!createdStudent) {
        console.log('student not created')
        res.json({
          failedSignup: 'Student signup failed'
        })
      } else {
        const transporter = nodemailer.createTransport({
          service: 'Gmail',
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: 'quickgradedecagon@gmail.com',
            pass: 'tdynykegchtuzfog'
          }
        })
        const studentDetail = await Student.findOne({ where: { email } })
        if (!studentDetail) {
          console.log('student not found after signup')
          res.json({ studentNotFoundError: 'student not found' })
        } else {
          // Update the student instance with TOTP details

          const mailOptions = {
            from: {
              name: 'QuickGrade App',
              address: 'quickgradedecagon@gmail.com'
            },
            to: email,
            subject: 'Quick Grade App - Login Details',
            text: 'Login Detail',
            html: `<h3>Hi there,
          Your Account has been successfully created. kindly find your login details below:</h3>
          <h1> EmployeeID: ${studentDetail.dataValues.matricNo}</h1>
          <h1> Password: ${studentDetail.dataValues.password}</h1>
         
          Best regards,
          <h3>The QuickGrade Team</h3>`
          }

          await transporter.sendMail(mailOptions)

          console.log('successs')
          res.json({ successfulSignup: 'Student signup successful' })
        }
      }
    }
  } catch (error) {
    console.error('Error creating student: ', error)
    res.json({
      InternaServerError: 'Internal server error'
    })
  }
}

export const studentLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { matricNo, password } = req.body
  try {
    const existingStudent = await Student.findOne({ where: { matricNo } })

    if (!existingStudent) {
      res.status(404).json({
        studentNotFoundError: 'Student not found'
      })
    } else {
      const isPasswordValid = await bcrypt.compare(password, existingStudent.dataValues.password)

      if (!isPasswordValid) {
        res.status(401).json({
          inValidPassword: 'Invalid password'
        })
      } else {
        const token = jwt.sign({ loginkey: existingStudent.dataValues.studentId }, secret, { expiresIn: '1h' })

        res.cookie('token', token, { httpOnly: true, secure: true })

        res.json({
          successfulLogin: 'Login successful'
        })
      }
    }
  } catch (error: any) {
    console.error('Error during student login:', error)

    res.status(500).json({
      internalServerError: `Error: ${error}`
    })
  }
}

export const updateStudentPassword = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params
  const { newPassword } = req.body

  try {
    // Find the user by ID
    const user = await Student.findByPk(userId)

    if (!user) {
      res.status(404).json({ error: 'User not found' })
    } else {
      // Update the user's password
      user.dataValues.password = newPassword

      // Save the updated user to the database
      await user.save()

      res.status(200).json({ message: 'Password updated successfully' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
