import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/databaseSqlite';
import Lecturer from '../model/lecturerModel';
import express, { Request, Response, NextFunction} from 'express';
import bcyrpt from 'bcryptjs';
import lecturerModel from '../model/lecturerModel';



export const lecturerSignup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("req", req.body)
    const { firstName, lastName, faculty, department, password, email } = req.body;
    const existingLecturer = await lecturerModel.findOne({ where: { email } });

    if (existingLecturer) {
      return res.status(400).json({
        message: "Lecturer already exists",
      });
    }
    const hashedPassword = await bcyrpt.hash(password, 12);
    
    const createdLecturer = await Lecturer.create({
      firstName,
      lastName,
      faculty,
      department,
      password: hashedPassword,
      email,
     
    });
    
    if (!createdLecturer) {
      console.error("Lecturer signup failed: Lecturer not created");
      return res.status(400).json({
        message: "Lecturer signup failed",
      });
    }

    console.log("Created Lecturer:", createdLecturer);

    return res.status(200).json({
      lecturerId: createdLecturer, // Update the property name to 'id'
      message: "Lecturer signup successful",
    });
  } catch (error) {
    console.error("Error creating lecturer:", error);

    return res.status(500).json({
      message: ` error: ${error}`,
    });
  }
};



export const lecturerLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { lecturerId, password } = req.body;
 
  
  try {
   
    const existingLecturer = await lecturerModel.findOne({ where: { lecturerId } });

    if (!existingLecturer) {
      return res.status(400).json({
        message: "Invalid lecturerId",
      });
    }

    const isPasswordValid = await bcyrpt.compare(password, existingLecturer.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }


    return res.status(200).json({
      lecturerId: existingLecturer.id, // Assuming your model has an 'id' property
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error during lecturer login:", error);

    return res.status(500).json({
      message: `Error: ${error}`,
    });
  }
};



export const updateLecturerPassword = async (req: Request, res: Response) => {

    const { userId } = req.params;
    const { newPassword } = req.body;
  
    try {
      // Find the user by ID
      const user = await Lecturer.findByPk(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Update the user's password
      user.dataValues.password = newPassword
  
      // Save the updated user to the database
      await user.save();
  
      return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }


}

