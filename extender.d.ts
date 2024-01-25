import {type Request} from 'express'

export interface AuthRequest extends Request {
    lecturerId?: string
    lecturer?: { lecturerId: string } // Add the user property
    session: Session & Partial<SessionData> & { lecturerId?: string }
    student?: { studentId: string }
  }