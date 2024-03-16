import express, {
  type Request,
  type Response,
  type NextFunction
} from 'express'
import session from 'express-session'
import { config } from 'dotenv'
import createError from 'http-errors'
import path from 'path'
import cookieParser from 'cookie-parser'
import sequelize from './database/databaseSqlite'
import logger from 'morgan'
import cors from 'cors'
import indexRouter from './routes/index'
import otpRouter from './routes/otp'
import oauthRouter from './routes/oauth'
import requestRouter from './routes/request'
import studentRouter from './routes/studentsRoutes'
import lecturerRouter from './routes/lecturersRoutes'
import resetPasswordRouter from './routes/reset_pass'
import gradeRouter from './routes/grade'
import examResultRouter from './routes/examResultRoute'
import examTimeTableRoute from './routes/examinationTimetable_Route'
import protectedRouter from './routes/verifyTokenRoute'
import departmentRouter from './routes/departmentRoute'

config()

const secret: string = (process.env.secret ?? '')
const FRONTEND_URL = process.env.FRONTEND_URL
interface customCookie extends cookieParser.CookieParseOptions {
  domain: string
  httpOnly: boolean
  secure: boolean
  sameSite: string
}

sequelize
  .sync()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch((err) => {
    console.log('Unable to connect to the database:', err)
  })
const app = express()

app.use(
  session({
    secret,
    resave: false,
    saveUninitialized: true
  })
)
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true
  })
)

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
app.use(cookieParser(secret, {
  domain: '.onrender.com',
  httpOnly: true,
  secure: true,
  sameSite: 'none', // to allow  cookie to be sent with cross-site requests
  path: '/' // to make cookie available in all path in the domain
} as customCookie)
)
app.use(express.static(path.join(__dirname, '../', 'public')))

app.use('/otp', otpRouter)
app.use('/protected-routes', protectedRouter)
app.use('/students', studentRouter)
app.use('/lecturers', lecturerRouter)
app.use('/oauth', oauthRouter)
app.use('/request', requestRouter)
app.use('/reset_pass', resetPasswordRouter)
app.use('/results', gradeRouter)
app.use('/exam-results', examResultRouter)
app.use('/exam-timetable', examTimeTableRoute)
app.use('/departments', departmentRouter)
app.use('/', indexRouter)
// app.use('/reset-password', passResetRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

export default app
