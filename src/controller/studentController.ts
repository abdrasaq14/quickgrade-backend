import jwt from 'jsonwebtoken'
import Student from '../model/studentModel'
import { type Request, type Response, type NextFunction } from 'express'
import bcrypt from 'bcryptjs'

// import StudentModel from '../model/studentModel'; // Import the missing StudentModel
const secret: string = (process.env.secret ?? '')
export const studentSignup = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('req', req.body)
    const { faculty, email, department, password } = req.body

    const existingStudent = await Student.findOne({ where: { email } })

    if (existingStudent) {
      console.log('user already exists')
      res.json({
        existingStudentError: 'Lecturer already exists'
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
        password: hashedPassword
      })

      if (!createdStudent) {
        res.json({
          failedSignup: 'Student signup failed'
        })
      } else {
        console.log('success')
        res.json({ successfulSignup: createdStudent })
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
  const { studentId, password } = req.body
  try {
    const existingStudent = await Student.findOne({ where: { studentId } })

    if (!existingStudent) {
      res.status(404).json({
        message: 'Student not found'
      })
    } else {
      const isPasswordValid = await bcrypt.compare(password, existingStudent.dataValues.password)

      if (!isPasswordValid) {
        res.status(401).json({
          message: 'Invalid password'
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
      message: `Error: ${error}`
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
