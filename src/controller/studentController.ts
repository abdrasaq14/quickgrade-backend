import Student from '../model/studentModel';
import express, { Request, Response, NextFunction} from 'express';
import Lecturer from '../model/lecturerModel';
import bcrypt from 'bcryptjs';
//import StudentModel from '../model/studentModel'; // Import the missing StudentModel


export const studentSignup = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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
      const noOfStudent = (await Student.count() + 1).toString().padStart(4, '0')
      const matricNo = `${faculty.toUpperCase().slice(0, 3)}/${department.toUpperCase().slice(0, 3)}/${noOfStudent}`

      const hashedPassword = await bcrypt.hash(password, 12)

      const createdStudent = await Student.create({
        faculty,
        department,
        email,
        password: hashedPassword,
        matricNo
      })

    if (!createdStudent) {
        return res.status(400).json({
            message: "Student signup failed",
        });
    }
return res.status(200).json({studentDetail: createdStudent});
    
  }catch (error) {
    console.error("Error creating student: ", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}






export const studentLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { studentId, password } = req.body;
  try {
    
    const existingStudent = await Student.findOne({ where: { studentId } });

    if (!existingStudent) {
      return res.status(404).json({
        message: "Student not found",
      });
    }
 
    const isPasswordValid = await bcrypt.compare(password, existingStudent.dataValues.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    return res.status(200).json({
      studentDetail: existingStudent,
      message: "Login successful",
    });
  } catch (error) {
    console.error(error)
    res.json({ internalServerError: 'Internal Server Error' })
  }
}

export const studentLogin = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { matricNo, password } = req.body
    const existingStudent = await Student.findOne({ where: { matricNo } })
    const email = existingStudent?.dataValues.email
    req.session.email = email
    console.log('ssession', req.session.email)
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
        // pass in the token into the sessions

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

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body
  const user = await Student.findOne({ where: { email } })

  if (!user) {
    res.json({ studentNotFoundError: 'User not found' })
    return
  }

  const token = crypto.randomBytes(20).toString('hex')
  user.resetPasswordToken = token
  user.resetPasswordExpiration = new Date(Date.now() + 3600000) // 1 hour
  await user.save()

  
  const mailOptions = {
    from: 'quickgradedecagon@gmail.com',
    to: email,
    subject: 'Password Reset',
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\nhttp://${req.headers.host}/reset-password/${token}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`
  }

  await transporter.sendMail(mailOptions)

  res.json({ linkSentSuccessfully: 'An email has been sent to the address provided with further instructions.' })
}

export const resetPasswordToken = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.params
  const { password } = req.body

  const user = await Student.findOne({ where: { resetPasswordToken: token } })

  if (!user) {
    res
      .status(404)
      .json({ error: 'Password reset token is invalid or has expired.' })
    return
  }

  if (!user.resetPasswordExpiration || Date.now() > user.resetPasswordExpiration.getTime()) {
    res
      .status(401)
      .json({ error: 'Password reset token is invalid or has expired.' })
    return
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  user.password = hashedPassword

  user.resetPasswordToken = null
  user.resetPasswordExpiration = null
  await user.save()

  res.json({ message: 'Your password has been reset!' })
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
