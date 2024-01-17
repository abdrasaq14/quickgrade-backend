import Student from '../model/studentModel';
import { Request, Response} from 'express';






export const updateStudentPassword = async (req: Request, res: Response) => {

    const { userId } = req.params;
    const { newPassword } = req.body;
  
    try {
      // Find the user by ID
      const user = await Student.findByPk(userId);
  
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