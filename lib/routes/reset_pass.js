"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reset_password_1 = require("../controller/reset_password"); // Added missing equal sign here
const router = express_1.default.Router();
router.post('/reset-password', reset_password_1.resetPassword); // New route for password reset
router.post('/reset/:token', reset_password_1.resetPasswordToken); // New route for password reset
exports.default = router;
