import { type AuthenticatedRequest } from '../../extender'
import { type Response, type NextFunction } from 'express'

export async function authenticate (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  const email = req.session.email || req.user
  console.log('email', email)
  try {
    if (!email) {
      console.log('no email')
      res.json({ unathorized: 'unathorized' })
    } else {
      req.session.email = email
      next()
    }
  } catch (error) {
    console.error(error)
    res.status(401).json({ message: 'Unauthorized' })
  }
};
