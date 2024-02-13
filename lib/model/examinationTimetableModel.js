"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamStatus = exports.ExaminationTimetable = void 0;
const sequelize_1 = require("sequelize");
const databaseSqlite_1 = __importDefault(require("../database/databaseSqlite"));
// import { v4 as uuidv4 } from 'uuid'
var ExamStatus;
(function (ExamStatus) {
    ExamStatus["PENDING"] = "pending";
    ExamStatus["COMPLETED"] = "completed";
    ExamStatus["UNCOMPLETED"] = "uncompleted";
    ExamStatus["ONGOING"] = "ongoing";
    ExamStatus["POSTPONED"] = "postponed";
    ExamStatus["CANCELLED"] = "cancelled";
})(ExamStatus || (exports.ExamStatus = ExamStatus = {}));
class ExaminationTimetable extends sequelize_1.Model {
}
exports.ExaminationTimetable = ExaminationTimetable;
ExaminationTimetable.init({
    examDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    examId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    courseTitle: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(ExamStatus)),
        allowNull: false
    }
}, {
    sequelize: databaseSqlite_1.default,
    modelName: 'ExaminationTimetable'
});
// app.get('/api/examination-timetable', async (_, res) => {   const timetable = await ExaminationTimetable.findAll();   res.json(timetable); });
