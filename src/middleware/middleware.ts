import { type AuthenticatedRequest } from '../../extender';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your-secret-key';

export async function authenticate (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  const email = req.session.email
  console.log('email', email)
  try {
    if (!email) {
      console.log('no email')
      res.json({ unathorized: 'unathorized' })
    } else {
      req.user = email
      next()
    }
  } catch (error) {
    console.error(error)
    res.status(401).json({ message: 'Unauthorized' })
  }
};


declare global {
  namespace Express {
    interface Request {
      user?: any; 
    }
  }
}


export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const token = (req.headers['x-access-token']) as string;
  if (!token) {
    res.status(401).json({ error: 'Unauthorized - Token not provided' });
    return next();
  }

  try {
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, SECRET_KEY, (error, decoded) => {
        if (error) reject(error);
        else resolve(decoded);
      });
    });
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Unauthorized - Invalid token' });
    return next();
  }
}


