import Lecturer from '../model/lecturerModel'
import { type Request, type Response, type NextFunction } from 'express'
import bcyrpt from 'bcryptjs'
import nodemailer from 'nodemailer'

export const lecturerSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { faculty, department, password, email } = req.body
    const existingLecturer = await Lecturer.findOne({ where: { email } })

    if (existingLecturer) {
      res.json({
        existingLecturerError: 'Lecturer already exists'
      })
    } else {
      const hashedPassword = await bcyrpt.hash(password, 12)
      const noOfLecturer = (await Lecturer.count() + 1).toString().padStart(4, '0')
      const employeeID = `LT${faculty.toUpperCase().slice(0, 4)}/${noOfLecturer}`
      console.log('employeeID', employeeID)

      const createdLecturer = await Lecturer.create({
        faculty,
        department,
        password: hashedPassword,
        email,
        employeeID
      })
      // sending employeeID  and password to student email
      if (!createdLecturer) {
        res.json({
          failedSignup: 'Lecturer signup failed'
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
        const lecturerDetail = await Lecturer.findOne({ where: { email } })
        if (!lecturerDetail) {
          res.json({ lecturerNotFoundError: 'Lecturer not found' })
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
          <h1> EmployeeID: ${lecturerDetail.dataValues.employeeID}</h1>
          <h1> Password: ${lecturerDetail.dataValues.password}</h1>
         
          Best regards,
          <h3>The QuickGrade Team</h3>`
          }

          await transporter.sendMail(mailOptions)
          if (!createdLecturer) {
            console.error('Lecturer signup failed: Lecturer not created')
            res.json({
              failedSignup: 'Lecturer signup failed'
            })
          } else {
            console.log('successs')
            res.json({ successfulSignup: 'Lecturer signup successful' })
          }
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
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log('req', req.body)
  const { employeeID, password } = req.body

  try {
    const existingLecturer = await Lecturer.findOne({ where: { employeeID } })

    if (!existingLecturer) {
      res.json({
        lecturerNotFoundError: 'Invalid lecturerId'
      })
      console.log('here')
    } else {
      console.log('now')
      const isPasswordValid = await bcyrpt.compare(
        password,
        existingLecturer.dataValues.password
      )
      if (!isPasswordValid) {
        res.status(401).json({
          inValidPassword: 'Invalid password'
        })
      }

      res.json({
        successfulLogin: 'login successful'
      })
    }
  } catch (error: any) {
    console.error('Error during lecturer login:', error)

    res.status(500).json({
      internalServerError: `Error: ${error}`
    })
  }
}

export const updateLecturerPassword = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params
  const { newPassword } = req.body

  try {
    // Find the user by ID
    const user = await Lecturer.findByPk(userId)

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
