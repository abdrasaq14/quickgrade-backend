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
exports.sendOTP = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const speakeasy_1 = __importDefault(require("speakeasy"));
const studentModel_1 = __importDefault(require("../model/studentModel"));
const lecturerModel_1 = __importDefault(require("../model/lecturerModel"));
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
const totpSecretMap = {};
const sendOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        let user;
        const student = yield studentModel_1.default.findOne({ where: { email } });
        const lecturer = yield lecturerModel_1.default.findOne({ where: { email } });
        if (student) {
            user = student;
        }
        else if (lecturer) {
            user = lecturer;
        }
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        const totpSecret = speakeasy_1.default.generateSecret({ length: 20 });
        // Store the TOTP secret in the map along with the user
        totpSecretMap[email] = { secret: totpSecret.base32, user };
        const totpToken = speakeasy_1.default.totp({
            secret: totpSecret.base32,
            encoding: 'base32',
        });
        const mailOptions = {
            from: {
                name: 'Quick Grade App',
                address: 'quickgradedecagon@gmail.com',
            },
            to: email,
            subject: 'Quick Grade App - Email Verification Code',
            text: `TOTP: ${totpToken}`,
            html: `<b>TOTP: ${totpToken}</b>`,
        };
        yield transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'TOTP sent successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.sendOTP = sendOTP;
