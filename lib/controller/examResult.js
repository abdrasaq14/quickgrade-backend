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
exports.getExamResults = void 0;
const gradingModel_1 = __importDefault(require("../model/gradingModel"));
const courseModel_1 = __importDefault(require("../model/courseModel"));
const studentModel_1 = __importDefault(require("../model/studentModel"));
const examModel_1 = __importDefault(require("../model/examModel"));
gradingModel_1.default.belongsTo(studentModel_1.default, { foreignKey: 'studentId' });
gradingModel_1.default.belongsTo(courseModel_1.default, { foreignKey: 'courseId' });
gradingModel_1.default.belongsTo(examModel_1.default, { foreignKey: 'examId' });
const getExamResults = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseCode, session, semester } = req.params;
        if (!courseCode || !session || !semester) {
            const errorMessage = 'Course code, Session, and Semester are required';
            res.render('error', { errorMessage });
        }
        else {
            const examResults = yield gradingModel_1.default.findAll({
                include: [
                    {
                        model: courseModel_1.default,
                        attributes: ['courseCode', 'courseTitle'],
                        where: {
                            courseCode
                        }
                    },
                    {
                        model: studentModel_1.default,
                        attributes: ['studentId', 'department', 'faculty', 'level']
                    },
                    {
                        model: examModel_1.default,
                        attributes: ['totalScore'],
                        where: {
                            session,
                            semester
                        }
                    }
                ]
            });
            res.render('result', { examResults });
            res.status(200).json(examResults);
        }
    }
    catch (error) {
        console.error('Error in getExamResults:', error);
        const errorMessage = 'Internal Server Error';
        res.render('error', { errorMessage });
        // res.status(500).json({ error: 'Internal Server Error' })
    }
});
exports.getExamResults = getExamResults;
