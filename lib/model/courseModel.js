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
const lecturerModel_1 = __importDefault(require('../model/lecturerModel')); // Import the Lecturer model
class Courses extends sequelize_1.Model {}
Courses.init(
  {
    courseId: {
      type: sequelize_1.DataTypes.UUID,
      defaultValue: () => (0, uuid_1.v4)(),
      primaryKey: true,
      allowNull: false,
    },
    courseTitle: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
    creditUnit: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
    lecturerId: {
      type: sequelize_1.DataTypes.UUID,
      allowNull: false,
      references: {
        model: lecturerModel_1.default,
        key: 'lecturerId',
      },
    },
  },
  {
    sequelize: databaseSqlite_1.default,
    modelName: 'courses',
  },
);
Courses.belongsTo(lecturerModel_1.default, { foreignKey: 'lecturerId' });
exports.default = Courses;
