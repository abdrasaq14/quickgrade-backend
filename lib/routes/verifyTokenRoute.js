"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyToken_1 = require("../utils/verifyToken");
const router = express_1.default.Router();
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/students', verifyToken_1.checkAndVerifyStudentToken);
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/lecturers', verifyToken_1.checkAndVerifyLecturerToken);
exports.default = router;
