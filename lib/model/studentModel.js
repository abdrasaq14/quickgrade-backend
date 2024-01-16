"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const databaseSqlite_1 = __importDefault(require("../database/databaseSqlite"));
<<<<<<< HEAD
const studentCourseModel_1 = __importDefault(require("./studentCourseModel"));
const courseModel_1 = __importDefault(require("./courseModel"));
const uuid_1 = require("uuid");
class Student extends sequelize_1.Model {
    static associate() {
        Student.belongsToMany(courseModel_1.default, {
            through: studentCourseModel_1.default,
            foreignKey: 'studentId',
            otherKey: 'courseId',
            as: 'courses',
        });
    }
=======
const uuid_1 = require("uuid");
const lecturerModel_1 = __importDefault(require("../model/lecturerModel"));
const enrolmentModel_1 = __importDefault(require("../model/enrolmentModel"));
class Student extends sequelize_1.Model {
>>>>>>> 2ea20dc66b78cf3c1775b9f152efad19840ab751
}
Student.init({
    studentId: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: () => (0, uuid_1.v4)(),
        primaryKey: true,
        allowNull: false,
    },
<<<<<<< HEAD
    faculty: {
=======
    name: {
>>>>>>> 2ea20dc66b78cf3c1775b9f152efad19840ab751
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    department: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
<<<<<<< HEAD
}, {
    sequelize: databaseSqlite_1.default,
    modelName: 'Student',
=======
    lecturerId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: lecturerModel_1.default,
            key: 'lecturerId',
        },
    },
    enrolmentId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: enrolmentModel_1.default,
            key: 'enrolmentId',
        },
    },
}, {
    sequelize: databaseSqlite_1.default,
    modelName: 'student',
>>>>>>> 2ea20dc66b78cf3c1775b9f152efad19840ab751
});
exports.default = Student;
