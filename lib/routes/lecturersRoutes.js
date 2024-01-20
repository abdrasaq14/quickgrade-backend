"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const lecturerController_1 = require("../controller/lecturerController");
const router = express_1.default.Router();
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/signup', lecturerController_1.lecturerSignup);
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/login', lecturerController_1.lecturerLogin);
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/verify-otp', lecturerController_1.verifyOTP);
// The route for updating the students's password
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.put('students/update-password/:userId', lecturerController_1.updateLecturerPassword);
exports.default = router;
