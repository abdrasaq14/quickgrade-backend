import { type Response } from 'express'

import type { AuthRequest } from '../../extender'

export const logout = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    res.clearCookie('token')

    // Send a success response
    res.status(200).json({ message: 'Logout successful' })
  } catch (error) {
    console.error('Error in logout:', error)
    const errorMessage = 'Internal Server Error'
    res.status(500).json({ error: errorMessage })
  }
}
