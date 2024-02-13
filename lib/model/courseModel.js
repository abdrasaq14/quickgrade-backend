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
const studentModel_1 = __importDefault(require('./studentModel'));
const sessionModel_1 = __importDefault(require('./sessionModel'));
const semesterModel_1 = __importDefault(require('./semesterModel'));
class Courses extends sequelize_1.Model {
  static associate(models) {
    Courses.belongsToMany(studentModel_1.default, {
      through: 'StudentCourses',
      as: 'students',
    });
    Courses.belongsToMany(lecturerModel_1.default, {
      through: 'LecturerCourses',
      as: 'lecturers',
    });
    Courses.belongsTo(sessionModel_1.default, {
      foreignKey: 'session',
      as: 'courseSession',
    });
    Courses.belongsTo(semesterModel_1.default, {
      foreignKey: 'semester',
      as: 'courseSemester',
    });
  }
}
Courses.init(
  {
    courseId: {
      type: sequelize_1.DataTypes.UUID,
      defaultValue: () => (0, uuid_1.v4)(),
      primaryKey: true,
      allowNull: false,
    },
    courseCode: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
    courseTitle: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
    creditUnit: {
      type: sequelize_1.DataTypes.INTEGER,
      allowNull: false,
    },
    session: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
    semester: {
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
  },
  {
    sequelize: databaseSqlite_1.default,
    modelName: 'Courses',
  },
);
exports.default = Courses;
