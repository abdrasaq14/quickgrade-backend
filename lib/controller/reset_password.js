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
exports.resetPassword = void 0;
const speakeasy_1 = __importDefault(require("speakeasy"));
const date_fns_1 = require("date-fns");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const otpSecretMap_1 = __importDefault(require("../utils/otpSecretMap"));
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, newPassword, otp } = req.body;
        const storedSecretInfo = otpSecretMap_1.default[email];
        if (!storedSecretInfo) {
            res.status(400).json({ error: 'Invalid or expired OTP' });
            return;
        }
        // Verify OTP
        const isValidOTP = speakeasy_1.default.totp.verify({
            secret: storedSecretInfo.secret,
            encoding: 'base32',
            token: otp,
            window: 1 // Allow 1-minute time drift
        });
        if (!isValidOTP) {
            res.status(400).json({ error: 'Invalid or expired OTP' });
            return;
        }
        // Check OTP expiration time
        const otpExpirationMinutes = 10;
        const otpCreationTime = storedSecretInfo.createdAt;
        const minutesDifference = (0, date_fns_1.differenceInMinutes)(new Date(), otpCreationTime);
        if (minutesDifference > otpExpirationMinutes) {
            res.status(400).json({ error: 'OTP has expired' });
            return;
        }
        // Reset password (you might want to hash the password before storing it)
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        storedSecretInfo.user.password = hashedPassword;
        yield storedSecretInfo.user.save();
        // Remove OTP secret from the map after successful password reset
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete otpSecretMap_1.default[email];
        res.status(200).json({ message: 'Password reset successful' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.resetPassword = resetPassword;
