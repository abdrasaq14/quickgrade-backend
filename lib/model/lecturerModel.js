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
const courseModel_1 = __importDefault(require('../model/courseModel'));
class Lecturer extends sequelize_1.Model {}
Lecturer.init(
  {
    lecturerId: {
      type: sequelize_1.DataTypes.UUID,
      defaultValue: () => (0, uuid_1.v4)(),
      primaryKey: true,
      allowNull: false,
    },
    firstName: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
    faculty: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
    department: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
    courseId: {
      type: sequelize_1.DataTypes.UUID,
      allowNull: false,
      references: {
        model: courseModel_1.default,
        key: 'courseId',
      },
    },
  },
  {
    sequelize: databaseSqlite_1.default,
    modelName: 'lecturer',
  },
);
Lecturer.hasMany(courseModel_1.default, { foreignKey: 'lecturerId' });
exports.default = Lecturer;
