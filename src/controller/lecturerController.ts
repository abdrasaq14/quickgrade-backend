import Lecturer from '../model/lecturerModel'
import { type Request, type Response, type NextFunction } from 'express'
import bcyrpt from 'bcryptjs'

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
      const createdLecturer = await Lecturer.create({
        faculty,
        department,
        password: hashedPassword,
        email
      })

      if (!createdLecturer) {
        console.error('Lecturer signup failed: Lecturer not created')
        res.json({
          failedSignup: 'Lecturer signup failed'
        })
      } else {
        res.json({

          successfulSignup: 'Lecturer signup successful'
        })
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
  const { lecturerId, password } = req.body

  try {
    const existingLecturer = await Lecturer.findOne({ where: { lecturerId } })

    if (!existingLecturer) {
      res.status(400).json({
        message: 'Invalid lecturerId'
      })
    } else {
      const isPasswordValid = await bcyrpt.compare(
        password,
        existingLecturer.dataValues.password
      )
      if (!isPasswordValid) {
        res.status(401).json({
          message: 'Invalid password'
        })
      }

      res.status(200).json({
        lecturerId: existingLecturer.dataValues.id,
        message: 'Login successful'
      })
    }
  } catch (error: any) {
    console.error('Error during lecturer login:', error)

    res.status(500).json({
      message: `Error: ${error}`
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
