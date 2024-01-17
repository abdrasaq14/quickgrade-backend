"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const http_errors_1 = __importDefault(require("http-errors"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const databaseSqlite_1 = __importDefault(require("./database/databaseSqlite"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
// import usersRouter from './routes/users';
const oauth_1 = __importDefault(require("./routes/oauth"));
const request_1 = __importDefault(require("./routes/request"));
const index_1 = __importDefault(require("./routes/index"));
const otp_1 = __importDefault(require("./routes/otp"));
const oauth_1 = __importDefault(require("./routes/oauth"));
const request_1 = __importDefault(require("./routes/request"));
const studentsRoutes_1 = __importDefault(require("./routes/studentsRoutes"));
const lecturersRoutes_1 = __importDefault(require("./routes/lecturersRoutes"));
(0, dotenv_1.config)();
databaseSqlite_1.default
    .sync({ force: true })
    .then(() => {
    console.log('Connection has been established successfully.');
})
    .catch((err) => {
    console.log('Unable to connect to the database:', err);
});
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true,
}));
// view engine setup
app.set('views', path_1.default.join(__dirname, '../', 'views'));
app.set('view engine', 'ejs');
app.use(body_parser_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, '../', 'public')));
app.use('/', index_1.default);
// app.use('/users', usersRouter);
app.use('/oauth', oauth_1.default);
app.use('/request', request_1.default);
app.use('/students', studentsRoutes_1.default);
app.use('/lecturers', lecturersRoutes_1.default);
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
