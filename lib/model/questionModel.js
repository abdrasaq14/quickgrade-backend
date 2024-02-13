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
const examModel_1 = __importDefault(require('./examModel'));
const lecturerModel_1 = __importDefault(require('./lecturerModel'));
class Question extends sequelize_1.Model {
  static associate(models) {
    // Define the many-to-many relationship with the Course model
    Question.belongsTo(models.Exam, {
      foreignKey: 'examId',
      as: 'exam',
    });
  }
}
Question.init(
  {
    questionId: {
      type: sequelize_1.DataTypes.UUID,
      defaultValue: () => (0, uuid_1.v4)(),
      primaryKey: true,
      allowNull: false,
    },
    questionText: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    optionA: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    optionB: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    optionC: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    optionD: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    courseCode: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
    correctAnswer: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    questionType: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
    examId: {
      type: sequelize_1.DataTypes.STRING,
      references: {
        model: examModel_1.default,
        key: 'examId',
      },
    },
    lecturerId: {
      type: sequelize_1.DataTypes.STRING,
      references: {
        model: lecturerModel_1.default,
        key: 'lecturerId',
      },
    },
  },
  {
    sequelize: databaseSqlite_1.default,
    modelName: 'Question',
  },
);
exports.default = Question;
