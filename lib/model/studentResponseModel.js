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
class StudentResponse extends sequelize_1.Model {}
StudentResponse.init(
  {
    responseId: {
      type: sequelize_1.DataTypes.UUID,
      defaultValue: () => (0, uuid_1.v4)(),
      primaryKey: true,
      allowNull: false,
    },
    studentId: {
      type: sequelize_1.DataTypes.UUID,
      allowNull: false,
    },
    examId: {
      type: sequelize_1.DataTypes.UUID,
      allowNull: false,
    },
    questionId: {
      type: sequelize_1.DataTypes.UUID,
      allowNull: false,
    },
    responseText: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
    courseCode: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
    semester: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
    isCorrect: {
      type: sequelize_1.DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize: databaseSqlite_1.default,
    modelName: 'StudentResponse',
  },
);
exports.default = StudentResponse;
