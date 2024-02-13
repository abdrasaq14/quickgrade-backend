'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.getExamTimetable = void 0;
const courseModel_1 = __importDefault(require('../model/courseModel'));
const studentModel_1 = __importDefault(require('../model/studentModel'));
const examModel_1 = __importDefault(require('../model/examModel'));
const examinationTimetableModel_1 = require('../model/examinationTimetableModel');
const getExamTimetable = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { coursecode, session, semester } = req.params;
      if (!coursecode || !session || !semester) {
        const errorMessage = 'Course code, Session and Semester are required';
        res.json({ error: errorMessage });
        //   res.status(400).json({ error: errorMessage });
      } else {
        const examTimetable = yield examModel_1.default.findAll({
          include: [
            {
              model: examinationTimetableModel_1.ExaminationTimetable,
              attributes: ['id', 'course code', 'date', 'status'],
              where: {
                session,
                semester,
              },
            },
            {
              model: courseModel_1.default,
              attributes: ['courseCode', 'courseTitle'],
              where: {
                coursecode,
              },
            },
            {
              model: studentModel_1.default,
              attributes: ['studentId', 'department', 'faculty', 'level'],
            },
            {
              model: examModel_1.default,
              attributes: ['examId, examDuration, courseCode, courseTitle'],
              where: {
                session,
                semester,
              },
            },
          ],
        });
        res.render('Timetable', { examTimetable });
        res.status(200).json(examTimetable);
      }
    } catch (error) {
      console.error('Error in getExamTimetable:', error);
      res.json({ error });
      // res.status(500).json({ error: errorMessage });
    }
  });
exports.getExamTimetable = getExamTimetable;
