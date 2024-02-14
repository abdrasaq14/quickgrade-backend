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
exports.getAllCourses = exports.createCourse = void 0;
const courseModel_1 = __importDefault(require('../model/courseModel'));
const createCourse = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const {
        courseCode,
        courseTitle,
        creditUnit,
        session,
        semester,
        department,
        faculty,
      } = req.body;
      const newCourse = yield courseModel_1.default.create({
        courseCode,
        courseTitle,
        creditUnit,
        session,
        semester,
        department,
        faculty,
      });
      if (!newCourse) {
        res.json({
          message: 'unable to create course',
        });
      } else {
        res.json({
          message: 'course created succesfully',
        });
      }
    } catch (error) {}
  });
exports.createCourse = createCourse;
const getAllCourses = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const courses = yield courseModel_1.default.findAll();
      if (!courses) {
        res.json({
          message: 'unable to fetch courses',
        });
      } else {
        res.json({
          coureDetailFromServer: courses,
        });
      }
    } catch (error) {}
  });
exports.getAllCourses = getAllCourses;
