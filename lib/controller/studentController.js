"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.takeExam = exports.getExamTimetable = exports.getStudentDashboard = exports.updateStudentPassword = exports.resetPasswordToken = exports.resetPassword = exports.studentLogin = exports.verifyOTP = exports.studentSignup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const studentModel_1 = __importDefault(require("../model/studentModel"));
const courseModel_1 = __importDefault(require("../model/courseModel"));
const examModel_1 = __importDefault(require("../model/examModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const emailsender_1 = require("../utils/emailsender");
const crypto_1 = __importDefault(require("crypto"));
const speakeasy_1 = __importDefault(require("speakeasy"));
const questionModel_1 = __importDefault(require("../model/questionModel"));
const secret = ((_a = process.env.secret) !== null && _a !== void 0 ? _a : '');
const studentSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, faculty, email, department, password } = req.body;
        const existingStudent = yield studentModel_1.default.findOne({ where: { email } });
        if (existingStudent) {
            res.json({
                existingStudentError: 'Student already exists'
            });
        }
        else {
            const noOfStudent = ((yield studentModel_1.default.count()) + 1).toString().padStart(4, '0');
            const matricNo = `${faculty.toUpperCase().slice(0, 3)}/${department.toUpperCase().slice(0, 3)}/${noOfStudent}`;
            const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
            const createdStudent = yield studentModel_1.default.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                faculty,
                department,
                matricNo
            });
            if (!createdStudent) {
                res.json({
                    failedSignup: 'Student signup failed'
                });
            }
            else {
                const student = yield studentModel_1.default.findOne({ where: { email } });
                if (!student) {
                    res.json({ studentNotFoundError: 'student record not found' });
                }
                else {
                    req.session.email = email;
                    const totpSecret = speakeasy_1.default.generateSecret({ length: 20 });
                    // Update the student instance with TOTP details
                    yield student.update({
                        otpSecret: totpSecret.base32,
                        otp: speakeasy_1.default.totp({
                            secret: totpSecret.base32,
                            encoding: 'base32'
                        }),
                        otpExpiration: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
                    });
                    const mailOptions = {
                        from: {
                            name: 'QuickGrade App',
                            address: 'quickgradedecagon@gmail.com'
                        },
                        to: email,
                        subject: 'Quick Grade App - Email Verification Code',
                        text: `TOTP: ${student.otp}`,
                        html: `<h3>Hi there,
        Thank you for signing up to QuickGrade. Copy the OTP below to verify your email:</h3>
        <h1>${student.otp}</h1>
        <h3>This OTP will expire in 10 minutes. If you did not sign up for a QuickGrade account,
        you can safely ignore this email. <br>
        <br>
        Best, <br>
        The QuickGrade Team</h3>`
                    };
                    yield emailsender_1.transporter.sendMail(mailOptions);
                    res.json({ successfulSignup: 'Student signup successful' });
                }
            }
        }
    }
    catch (error) {
        res.json({
            InternaServerError: 'Internal server error'
        });
    }
});
exports.studentSignup = studentSignup;
const verifyOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otp } = req.body;
        const student = yield studentModel_1.default.findOne({ where: { otp } });
        const email = student === null || student === void 0 ? void 0 : student.dataValues.email;
        if (!student) {
            res.json({ invalidOtp: 'Invalid otp' });
        }
        else {
            const now = new Date();
            if (now > student.otpExpiration) {
                res.json({ expiredOtpError: 'OTP has expired' });
                return;
            }
            yield student.update({ isVerified: true, otp: null, otpExpiration: null, otpSecret: null });
            // res.redirect('http://localhost:5173/students/reset-password')
            const mailOptions = {
                from: {
                    name: 'QuickGrade App',
                    address: 'quickgradedecagon@gmail.com'
                },
                to: email,
                subject: 'Quick Grade App - Login Details',
                text: 'Login Detail',
                html: `<h3>Hi there,
          Your Account has been successfully created and Email verification is successful. kindly find your login details below:</h3>
          <h2> MatricNo: ${student.dataValues.matricNo}</h2>
          
          <h3>Best regards,<h3> <br>
          <h3>The QuickGrade Team</h3>`
            };
            yield emailsender_1.transporter.sendMail(mailOptions);
            // res.json({ successfulSignup: 'Student signup successful' })
            res.json({ OtpVerificationSuccess: 'OTP verified successfully' });
        }
    }
    catch (error) {
        res.json({ internalServerError: 'Internal Server Error' });
    }
});
exports.verifyOTP = verifyOTP;
const studentLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { matricNo, password } = req.body;
        const existingStudent = yield studentModel_1.default.findOne({ where: { matricNo } });
        if (!existingStudent) {
            res.status(404).json({
                studentNotFoundError: 'Student not found'
            });
        }
        else {
            const isPasswordValid = yield bcryptjs_1.default.compare(password, existingStudent.dataValues.password);
            if (!isPasswordValid) {
                res.status(401).json({
                    inValidPassword: 'Invalid password'
                });
            }
            else {
                const token = jsonwebtoken_1.default.sign({ loginkey: existingStudent.dataValues.studentId }, secret, { expiresIn: '1h' });
                res.cookie('token', token, { httpOnly: true, secure: false });
                // localStorage.setItem('token', token)
                res.json({
                    successfulLogin: 'Login successful'
                });
            }
        }
    }
    catch (error) {
        res.status(500).json({
            internalServerError: `Error: ${error}`
        });
    }
});
exports.studentLogin = studentLogin;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield studentModel_1.default.findOne({ where: { email } });
    if (!user) {
        res.json({ userNotFoundError: 'User not found' });
        return;
    }
    else {
        const token = crypto_1.default.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpiration = new Date(Date.now() + 3600000); // 1 hour
        yield user.save();
        const mailOptions = {
            from: 'quickgradedecagon@gmail.com',
            to: email,
            subject: 'Password Reset',
            // text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\nhttp://${req.headers.host}/reset-password/${token}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\nhttp://localhost:5173/students/reset-password/${token}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`
        };
        yield emailsender_1.transporter.sendMail(mailOptions);
    }
    res.json({ linkSentSuccessfully: 'An email has been sent to the address provided with further instructions.' });
});
exports.resetPassword = resetPassword;
const resetPasswordToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const { password } = req.body;
    const user = yield studentModel_1.default.findOne({ where: { resetPasswordToken: token } });
    if (!user) {
        res
            .status(404)
            .json({ invalidPasswordResetToken: 'Password reset token is invalid or has expired.' });
        return;
    }
    if (!user.resetPasswordExpiration || Date.now() > user.resetPasswordExpiration.getTime()) {
        res
            .status(401)
            .json({ tokenExpired: 'Password reset token is invalid or has expired.' });
        return;
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpiration = null;
    yield user.save();
    res.json({ passwordResetSuccessful: 'Your password has been reset!' });
});
exports.resetPasswordToken = resetPasswordToken;
const updateStudentPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        // Find the user by ID
        const studentId = (_b = req.student) === null || _b === void 0 ? void 0 : _b.studentId;
        const { newPassword } = req.body;
        const student = yield studentModel_1.default.findByPk(studentId);
        if (!student) {
            res.status(404).json({ error: 'User not found' });
        }
        else {
            // Update the user's password
            student.dataValues.password = newPassword;
            // Save the updated user to the database
            yield student.save();
            res.status(200).json({ message: 'Password updated successfully' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.updateStudentPassword = updateStudentPassword;
const getStudentDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const semester = req.query.semester || 'First';
        if (!semester) {
            res.json({ noSemesterSelected: 'unauthorized' });
        }
        else {
            const courses = yield courseModel_1.default.findAll({
                where: {
                    semester,
                    session: '2023/2024'
                }
            });
            res.json({ courses });
        }
    }
    catch (error) {
        res.json({ internalServeError: 'internal server error' });
    }
});
exports.getStudentDashboard = getStudentDashboard;
const getExamTimetable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const semester = req.query.semester;
        if (!semester) {
            res.json({ noSemesterSelected: 'unauthorized' });
        }
        else {
            const exams = yield examModel_1.default.findAll({
                where: {
                    semester,
                    session: '2023/2024'
                }
            });
            res.json({ exams });
        }
    }
    catch (error) {
        res.json({ internalServerError: error });
        // res.status(500).json({ error: errorMessage });
    }
});
exports.getExamTimetable = getExamTimetable;
const takeExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseCode } = req.params;
        const questions = yield questionModel_1.default.findAll({ where: { courseCode } });
        if (!questions) {
            res.json({ questionNotAvailable: 'no question found' });
        }
        else {
            res.json({ questions });
        }
    }
    catch (error) {
        res.json({ internalServerError: 'internal server error' });
    }
});
exports.takeExam = takeExam;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie('token');
        // Send a success response
        res.status(200).json({ message: 'Logout successful' });
    }
    catch (error) {
        const errorMessage = 'Internal Server Error';
        res.status(500).json({ error: errorMessage });
    }
});
exports.logout = logout;
