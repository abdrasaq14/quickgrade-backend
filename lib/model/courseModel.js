"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const databaseSqlite_1 = __importDefault(require("../database/databaseSqlite"));
const studentCourseModel_1 = __importDefault(require("../model/studentCourseModel"));
const studentModel_1 = __importDefault(require("../model/studentModel"));
const uuid_1 = require("uuid");
class Courses extends sequelize_1.Model {
    static associate() {
        Courses.belongsToMany(studentModel_1.default, {
            through: studentCourseModel_1.default,
            foreignKey: 'courseId',
            otherKey: 'studentId',
            as: 'students',
        });
    }
}
Courses.init({
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
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: databaseSqlite_1.default,
    modelName: 'Courses',
});
exports.default = Courses;
