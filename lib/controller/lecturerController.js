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
exports.updateLecturerPassword = exports.lecturerLogin = exports.lecturerSignup = void 0;
const lecturerModel_1 = __importDefault(require("../model/lecturerModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const lecturerSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { faculty, department, password, email } = req.body;
        const existingLecturer = yield lecturerModel_1.default.findOne({ where: { email } });
        if (existingLecturer) {
            res.json({
                existingLecturerError: 'Lecturer already exists'
            });
        }
        else {
            const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
            const createdLecturer = yield lecturerModel_1.default.create({
                faculty,
                department,
                password: hashedPassword,
                email
            });
            if (!createdLecturer) {
                console.error('Lecturer signup failed: Lecturer not created');
                res.json({
                    failedSignup: 'Lecturer signup failed'
                });
            }
            else {
                res.json({
                    successfulSignup: 'Lecturer signup successful'
                });
            }
        }
    }
    catch (error) {
        console.error('Error creating lecturer:', error);
        res.status(500).json({
            message: ` error: ${error}`
        });
    }
});
exports.lecturerSignup = lecturerSignup;
const lecturerLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { lecturerId, password } = req.body;
    try {
        const existingLecturer = yield lecturerModel_1.default.findOne({ where: { lecturerId } });
        if (!existingLecturer) {
            res.status(400).json({
                message: 'Invalid lecturerId'
            });
        }
        else {
            const isPasswordValid = yield bcryptjs_1.default.compare(password, existingLecturer.dataValues.password);
            if (!isPasswordValid) {
                res.status(401).json({
                    message: 'Invalid password'
                });
            }
            res.status(200).json({
                lecturerId: existingLecturer.dataValues.id,
                message: 'Login successful'
            });
        }
    }
    catch (error) {
        console.error('Error during lecturer login:', error);
        res.status(500).json({
            message: `Error: ${error}`
        });
    }
});
exports.lecturerLogin = lecturerLogin;
const updateLecturerPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { newPassword } = req.body;
    try {
        // Find the user by ID
        const user = yield lecturerModel_1.default.findByPk(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
        }
        else {
            user.dataValues.password = newPassword;
            // Save the updated user to the database
            yield user.save();
            res.status(200).json({ message: 'Password updated successfully' });
        }
        // Update the user's password
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.updateLecturerPassword = updateLecturerPassword;
