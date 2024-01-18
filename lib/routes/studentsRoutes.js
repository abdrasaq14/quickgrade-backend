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
// The route for updating the students's password
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.put('/update-password/:userId', studentController_1.updateStudentPassword);
exports.default = router;
