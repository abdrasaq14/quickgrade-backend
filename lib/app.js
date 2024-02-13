'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
var _a;
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const dotenv_1 = require('dotenv');
const http_errors_1 = __importDefault(require('http-errors'));
const path_1 = __importDefault(require('path'));
const cookie_parser_1 = __importDefault(require('cookie-parser'));
const databaseSqlite_1 = __importDefault(require('./database/databaseSqlite'));
const morgan_1 = __importDefault(require('morgan'));
const cors_1 = __importDefault(require('cors'));
const express_session_1 = __importDefault(require('express-session'));
const index_1 = __importDefault(require('./routes/index'));
const otp_1 = __importDefault(require('./routes/otp'));
const oauth_1 = __importDefault(require('./routes/oauth'));
const request_1 = __importDefault(require('./routes/request'));
const studentsRoutes_1 = __importDefault(require('./routes/studentsRoutes'));
const lecturersRoutes_1 = __importDefault(require('./routes/lecturersRoutes'));
const reset_pass_1 = __importDefault(require('./routes/reset_pass'));
const grade_1 = __importDefault(require('./routes/grade'));
const examResultRoute_1 = __importDefault(require('./routes/examResultRoute'));
const examinationTimetable_Route_1 = __importDefault(
  require('./routes/examinationTimetable_Route'),
);
const verifyTokenRoute_1 = __importDefault(
  require('./routes/verifyTokenRoute'),
);
// import passResetRouter from './routes/reset-password'
(0, dotenv_1.config)();
databaseSqlite_1.default
  .sync()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.log('Unable to connect to the database:', err);
  });
const app = (0, express_1.default)();
app.use(
  (0, express_session_1.default)({
    secret: (_a = process.env.secret) !== null && _a !== void 0 ? _a : '',
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(
  (0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);
// view engine setup
app.set('views', path_1.default.join(__dirname, '../', 'views'));
app.set('view engine', 'ejs');
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(
  express_1.default.static(path_1.default.join(__dirname, '../', 'public')),
);
app.use('/otp', otp_1.default);
app.use('/protected-routes', verifyTokenRoute_1.default);
app.use('/students', studentsRoutes_1.default);
app.use('/lecturers', lecturersRoutes_1.default);
app.use('/oauth', oauth_1.default);
app.use('/request', request_1.default);
app.use('/reset_pass', reset_pass_1.default);
app.use('/results', grade_1.default);
app.use('/exam-results', examResultRoute_1.default);
app.use('/exam-timetable', examinationTimetable_Route_1.default);
app.use('/', index_1.default);
// app.use('/reset-password', passResetRouter)
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next((0, http_errors_1.default)(404));
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
exports.default = app;
