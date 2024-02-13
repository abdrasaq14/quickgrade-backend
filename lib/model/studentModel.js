'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const sequelize_1 = require('sequelize');
const databaseSqlite_1 = __importDefault(require('../database/databaseSqlite'));
const courseModel_1 = __importDefault(require('../model/courseModel'));
const uuid_1 = require('uuid');
class Student extends sequelize_1.Model {
  static associate(models) {
    Student.belongsToMany(courseModel_1.default, {
      through: 'StudentCourses',
      as: 'courses',
    });
  }
}
Student.init(
  {
    studentId: {
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
    email: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
    matricNo: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
    password: {
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
    otp: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    otpSecret: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    otpExpiration: {
      type: sequelize_1.DataTypes.DATE,
      allowNull: true,
    },
    isVerified: {
      type: sequelize_1.DataTypes.BOOLEAN,
      defaultValue: false,
    },
    resetPasswordToken: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpiration: {
      type: sequelize_1.DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize: databaseSqlite_1.default,
    modelName: 'Student',
  },
);
exports.default = Student;
