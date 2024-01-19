import {type Request} from 'express'

export interface AuthenticatedRequest extends Request { 
    user? : string
    session: Session & Partial<SessionData> & { email?: string }
}