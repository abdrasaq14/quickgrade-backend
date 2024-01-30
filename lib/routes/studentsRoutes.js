"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentController_1 = require("../controller/studentController");
const router = express_1.default.Router();
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/signup', studentController_1.studentSignup);
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/login', studentController_1.studentLogin);
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/verify-otp/', studentController_1.verifyOTP);
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/reset-password', studentController_1.resetPassword);
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/reset-password/:token', studentController_1.resetPasswordToken);
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/dashboard', studentController_1.getStudentDashboard);
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.put('/dashboard/change-password', studentController_1.updateStudentPassword);
exports.default = router;
