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
exports.verifyOTP = exports.sendOTP = void 0;
const speakeasy_1 = __importDefault(require("speakeasy"));
const studentModel_1 = __importDefault(require("../model/studentModel"));
const emailsender_1 = require("../utils/emailsender");
const sendOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const student = yield studentModel_1.default.findOne({ where: { email } });
        if (!student) {
            res.json({ error: 'User not found' });
            return;
        }
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
      Thank you for signing up for QuickGrade. Copy OTP below to verify your email:</h3>
      <h1>${student.otp}</h1>
      <h3>This OTP will expire in 10 minutes. If you did not sign up for a QuickGrade account,
      you can safely ignore this email.
      Best,
      The QuickGrade Team</h3>`
        };
        yield emailsender_1.transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'TOTP sent successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.sendOTP = sendOTP;
const verifyOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('req.body', req.body);
        const { otp } = req.body;
        const email = req.session.email;
        console.log('email', email);
        const student = yield studentModel_1.default.findOne({ where: { email, otp } });
        if (!student) {
            res.json({ studentNotSignupError: 'User not signed up' });
        }
        else {
            const now = new Date();
            if (now > student.otpExpiration) {
                res.json({ expiredOtpError: 'OTP has expired' });
                return;
            }
            yield student.update({ isVerified: true });
            res.json({ OtpVerificationSuccess: 'OTP verified successfully' });
        }
    }
    catch (error) {
        console.error(error);
        res.json({ internalServerError: 'Internal Server Error' });
    }
});
exports.verifyOTP = verifyOTP;
