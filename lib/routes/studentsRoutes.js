"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentController_1 = require("../controller/studentController");
const middleware_1 = require("../middleware/middleware");
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
router.get('/dashboard', middleware_1.authenticateStudent, studentController_1.getStudentDashboard);
router.get('/dashboard/enrolled-courses', middleware_1.authenticateStudent, studentController_1.getExamTimetable);
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.put('/dashboard/change-password', middleware_1.authenticateStudent, studentController_1.updateStudentPassword);
router.get('/dashboard/logout', middleware_1.authenticateStudent, studentController_1.logout);
exports.default = router;
