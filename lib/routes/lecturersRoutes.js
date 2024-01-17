"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const lecturerController_1 = require("../controller/lecturerController");
const router = express_1.default.Router();
router.post('/lecturers/signup', lecturerController_1.lecturerSignup);
// The route for updating the students's password
router.put('students/update-password/:userId', lecturerController_1.updateLecturerPassword);
exports.default = router;
