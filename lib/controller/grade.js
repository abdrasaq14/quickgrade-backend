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
exports.grades = void 0;
const gradingModel_1 = __importDefault(require("../model/gradingModel"));
const gradingCriteria = {
    A: { min: 70, max: 100 },
    B: { min: 60, max: 69 },
    C: { min: 50, max: 59 },
    D: { min: 40, max: 49 },
    F: { min: 0, max: 39 }
};
function calculateGrade(gradeValue) {
    for (const [grade, range] of Object.entries(gradingCriteria)) {
        if (gradeValue >= range.min && gradeValue <= range.max) {
            return grade;
        }
    }
    return 'Invalid';
}
const grades = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { gradingId, studentId, responseId, department, grade } = req.body;
        if (!gradingId || !studentId || !responseId || !department || !grade) {
            res.status(400).json({ error: 'Invalid input data' });
            return;
        }
        const studentGrade = calculateGrade(grade);
        const gradeData = yield gradingModel_1.default.create({ gradingId, studentId, responseId, department, grade: studentGrade });
        res.status(200).json(gradeData);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.grades = grades;
