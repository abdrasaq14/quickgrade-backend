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
exports.checkAndVerifyLecturerToken = exports.checkAndVerifyStudentToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const studentModel_1 = __importDefault(require("../model/studentModel"));
const lecturerModel_1 = __importDefault(require("../model/lecturerModel"));
const secret = ((_a = process.env.secret) !== null && _a !== void 0 ? _a : '');
console.log('secret', secret);
function checkAndVerifyStudentToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.cookies.token;
            console.log('verifytoken', token);
            if (!token) {
                res.json({ noTokenError: 'Unauthorized - Token not provided' });
            }
            else {
                const decoded = jsonwebtoken_1.default.verify(token, secret);
                const student = yield studentModel_1.default.findOne({
                    where: { studentId: decoded.loginkey }
                });
                console.log('student');
                res.json({ student });
                // req.student = { studentId: student?.dataValues.studentId }
            }
        }
        catch (error) {
            console.log('error', error);
            if (error.name === 'TokenExpiredError') {
                console.log('expired', error);
                res.json({ tokenExpiredError: 'Unauthorized - Token has expired' });
            }
            else {
                console.log('unknown', error);
                res.json({ verificationError: 'Unauthorized - Token verification failed' });
            }
        }
    });
}
exports.checkAndVerifyStudentToken = checkAndVerifyStudentToken;
function checkAndVerifyLecturerToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.cookies.lecturerToken;
            if (!token) {
                res.json({ noTokenError: 'Unauthorized - Token not provided' });
            }
            else {
                const decoded = jsonwebtoken_1.default.verify(token, secret);
                const lecturer = yield lecturerModel_1.default.findOne({
                    where: { lecturerId: decoded.loginkey }
                });
                console.log('lecturer');
                res.json({ lecturer });
                // req.student = { lecturerId: student?.dataValues.lecturerId }
            }
        }
        catch (error) {
            console.log('error', error);
            if (error.name === 'TokenExpiredError') {
                console.log('expired', error);
                res.json({ tokenExpiredError: 'Unauthorized - Token has expired' });
            }
            else {
                console.log('unknown', error);
                res.json({ verificationError: 'Unauthorized - Token verification failed' });
            }
        }
    });
}
exports.checkAndVerifyLecturerToken = checkAndVerifyLecturerToken;
