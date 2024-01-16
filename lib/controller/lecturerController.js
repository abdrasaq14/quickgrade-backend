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
exports.updateLecturerPassword = exports.lecturerSignup = void 0;
const lecturerModel_1 = __importDefault(require("../model/lecturerModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const lecturerModel_2 = __importDefault(require("../model/lecturerModel"));
const lecturerSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("req", req.body);
        const { firstName, lastName, faculty, department, password, email } = req.body;
        const existingLecturer = yield lecturerModel_2.default.findOne({ where: { email } });
        if (existingLecturer) {
            return res.status(400).json({
                message: "Lecturer already exists",
            });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
        const createdLecturer = yield lecturerModel_1.default.create({
            firstName,
            lastName,
            faculty,
            department,
            password: hashedPassword,
            email,
        });
        if (!createdLecturer) {
            console.error("Lecturer signup failed: Lecturer not created");
            return res.status(400).json({
                message: "Lecturer signup failed",
            });
        }
        console.log("Created Lecturer:", createdLecturer);
        return res.status(200).json({
            lecturerId: createdLecturer, // Update the property name to 'id'
            message: "Lecturer signup successful",
        });
    }
    catch (error) {
        console.error("Error creating lecturer:", error);
        return res.status(500).json({
            message: ` error: ${error}`,
        });
    }
});
exports.lecturerSignup = lecturerSignup;
const updateLecturerPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { newPassword } = req.body;
    try {
        // Find the user by ID
        const user = yield lecturerModel_1.default.findByPk(userId);
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
exports.updateLecturerPassword = updateLecturerPassword;
