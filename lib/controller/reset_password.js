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
exports.resetPasswordToken = exports.resetPassword = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const studentModel_1 = __importDefault(require("../model/studentModel"));
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const transporter = nodemailer_1.default.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'quickgradedecagon@gmail.com',
        pass: 'tdynykegchtuzfog',
    },
});
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield studentModel_1.default.findOne({ where: { email } });
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    const token = crypto_1.default.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpiration = new Date(Date.now() + 3600000); // 1 hour
    yield user.save();
    const mailOptions = {
        from: 'quickgradedecagon@gmail.com',
        to: email,
        subject: 'Password Reset',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\nhttp://${req.headers.host}/reset/${token}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };
    yield transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'An email has been sent to the address provided with further instructions.' });
});
exports.resetPassword = resetPassword;
const resetPasswordToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const { password } = req.body;
    const user = yield studentModel_1.default.findOne({ where: { resetPasswordToken: token } });
    if (!user) {
        res
            .status(404)
            .json({ error: 'Password reset token is invalid or has expired.' });
        return;
    }
    if (!user.resetPasswordExpiration || Date.now() > user.resetPasswordExpiration.getTime()) {
        res
            .status(401)
            .json({ error: 'Password reset token is invalid or has expired.' });
        return;
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpiration = null;
    yield user.save();
    res.status(200).json({ message: 'Your password has been reset!' });
});
exports.resetPasswordToken = resetPasswordToken;
