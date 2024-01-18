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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStudentPassword = exports.studentLogin = exports.studentSignup = void 0;
const studentModel_1 = __importDefault(require("../model/studentModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const studentSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("req", req.body);
        const { faculty, email, department, password } = req.body;
        const existingStudent = yield studentModel_1.default.findOne({ where: { email } });
        if (existingStudent) {
            return res.status(400).json({
                message: "Student already exists",
            });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
        console.log("password", hashedPassword);
        const createdStudent = yield studentModel_1.default.create({
            faculty,
            department,
            email,
            password: hashedPassword,
        });
        if (!createdStudent) {
            return res.status(400).json({
                message: "Student signup failed",
            });
        }
        return res.status(200).json({ studentDetail: createdStudent });
    }
    catch (error) {
        console.error("Error creating student: ", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.studentSignup = studentSignup;
const studentLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId, password } = req.body;
    try {
        const existingStudent = yield studentModel_1.default.findOne({ where: { studentId } });
        if (!existingStudent) {
            return res.status(404).json({
                message: "Student not found",
            });
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, existingStudent.dataValues.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid password",
            });
        }
        return res.status(200).json({
            studentDetail: existingStudent,
            message: "Login successful",
        });
    }
    catch (error) {
        console.error("Error during student login:", error);
        return res.status(500).json({
            message: `Error: ${error}`,
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
            return res.status(404).json({ error: 'User not found' });
        }
        // Update the user's password
        user.dataValues.password = newPassword;
        // Save the updated user to the database
        yield user.save();
        return res.status(200).json({ message: 'Password updated successfully' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.updateStudentPassword = updateStudentPassword;
