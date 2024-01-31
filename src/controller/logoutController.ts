import { type Request, type Response } from 'express'

export const logout = async (req: Request, res: Response): Promise<any> => {
  try {
    // Send a success response
    res.status(200).json({ message: 'Logout successful' })
  } catch (error) {
    console.error('Error in logout:', error)
    const errorMessage = 'Internal Server Error'
    res.status(500).json({ error: errorMessage })
  }
}
