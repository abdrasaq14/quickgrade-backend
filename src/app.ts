import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express';

import { config } from 'dotenv';
import createError from 'http-errors';
import path from 'path';
import cookieParser from 'cookie-parser';
import sequelize from './database/databaseSqlite';
import logger from 'morgan';
import bodyParser from 'body-parser';

import cors from 'cors';

<<<<<<< HEAD

// import usersRouter from './routes/users';
=======
import indexRouter from './routes/index';
import otpRouter from './routes/otp';
>>>>>>> 9030e53bb91b62e73e5791475c1687a2654ced62
import oauthRouter from './routes/oauth';
import requestRouter from './routes/request';
import studentRouter from './routes/studentsRoutes';
import lecturerRouter from './routes/lecturersRoutes';
import passResetRouter from './routes/reset-password';


config();

sequelize
  .sync()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.log('Unable to connect to the database:', err);
  });
const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

// view engine setup
app.set('views', path.join(__dirname, '../', 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../', 'public')));

app.use('/', indexRouter);
<<<<<<< HEAD

// app.use('/users', usersRouter);
app.use('/oauth', oauthRouter);
app.use('/request', requestRouter);
app.use('/students', studentRouter);
app.use('/lecturers', lecturerRouter);



=======
app.use('/otp', otpRouter);
app.use('/students', studentRouter);
app.use('/lecturers', lecturerRouter);
app.use('/oauth', oauthRouter);
app.use('/request', requestRouter);
app.use('/reset-password', passResetRouter);
>>>>>>> 9030e53bb91b62e73e5791475c1687a2654ced62


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
