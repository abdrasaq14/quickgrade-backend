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
exports.updateStudentPassword = exports.studentLogin = exports.studentSignup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const studentModel_1 = __importDefault(require("../model/studentModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// import StudentModel from '../model/studentModel'; // Import the missing StudentModel
const secret = ((_a = process.env.secret) !== null && _a !== void 0 ? _a : '');
const studentSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('req', req.body);
        const { faculty, email, department, password } = req.body;
        const existingStudent = yield studentModel_1.default.findOne({ where: { email } });
        if (existingStudent) {
            console.log('user already exists');
            res.json({
                existingStudentError: 'Lecturer already exists'
            });
        }
        else {
            console.log('enter password');
            const noOfStudent = ((yield studentModel_1.default.count()) + 1).toString().padStart(4, '0');
            const matricNo = `${faculty.toUpperCase().slice(0, 4)}/${department.toUpperCase().slice(0, 4)}/${noOfStudent}`;
            console.log('matric no', matricNo);
            const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
            console.log('password', hashedPassword);
            const createdStudent = yield studentModel_1.default.create({
                faculty,
                department,
                email,
                password: hashedPassword,
                matricNo
            });
            if (!createdStudent) {
                res.json({
                    failedSignup: 'Student signup failed'
                });
            }
            else {
                console.log('success');
                res.json({ successfulSignup: createdStudent });
            }
        }
    }
    catch (error) {
        console.error('Error creating student: ', error);
        res.json({
            InternaServerError: 'Internal server error'
        });
    }
});
exports.studentSignup = studentSignup;
const studentLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { matricNo, password } = req.body;
    try {
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
                res.cookie('token', token, { httpOnly: true, secure: true });
                res.json({
                    successfulLogin: 'Login successful'
                });
            }
        }
    }
    catch (error) {
        console.error('Error during student login:', error);
        res.status(500).json({
            internalServerError: `Error: ${error}`
        });
    }
});
exports.studentLogin = studentLogin;
const updateStudentPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { newPassword } = req.body;
    try {
        // Find the user by ID
        const user = yield studentModel_1.default.findByPk(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
        }
        else {
            // Update the user's password
            user.dataValues.password = newPassword;
            // Save the updated user to the database
            yield user.save();
            res.status(200).json({ message: 'Password updated successfully' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.updateStudentPassword = updateStudentPassword;
