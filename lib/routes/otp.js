"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const otp_1 = require("../controller/otp");
const router = express_1.default.Router();
router.post('/send-otp', otp_1.sendOTP);
router.post('/verify-otp', otp_1.verifyOTP);
exports.default = router;
