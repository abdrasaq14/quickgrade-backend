'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const sequelize_1 = require('sequelize');
const databaseSqlite_1 = __importDefault(require('../database/databaseSqlite'));
const uuid_1 = require('uuid');
const lecturerModel_1 = __importDefault(require('./lecturerModel'));
class Exam extends sequelize_1.Model {
  static associate(models) {
    // Define the many-to-many relationship with the Course model
    Exam.belongsTo(models.Courses, {
      foreignKey: 'courseCode',
      as: 'course',
    });
  }
}
Exam.init(
  {
    examId: {
      type: sequelize_1.DataTypes.UUID,
      defaultValue: () => (0, uuid_1.v4)(),
      primaryKey: true,
      allowNull: false,
    },
    examDuration: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
    examInstruction: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
    courseCode: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
    firstSection: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
    secondSection: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
    thirdSection: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
    courseTitle: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
    semester: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
    session: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
    faculty: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
    lecturerId: {
      type: sequelize_1.DataTypes.STRING,
      references: {
        model: lecturerModel_1.default,
        key: 'lecturerId',
      },
    },
    department: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
    examDate: {
      type: sequelize_1.DataTypes.DATE,
      allowNull: false,
    },
    totalScore: {
      type: sequelize_1.DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    totalNoOfQuestions: {
      type: sequelize_1.DataTypes.INTEGER,
    },
  },
  {
    sequelize: databaseSqlite_1.default,
    modelName: 'Exam',
  },
);
exports.default = Exam;
