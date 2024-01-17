"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const databaseSqlite_1 = __importDefault(require("../database/databaseSqlite"));
const uuid_1 = require("uuid");
const courseModel_1 = __importDefault(require("../model/courseModel"));
const studentModel_1 = __importDefault(require("../model/studentModel"));
class Enrolment extends sequelize_1.Model {
}
Enrolment.init({
    enrolmentId: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: () => (0, uuid_1.v4)(),
        primaryKey: true,
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
    courseName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    studentId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: studentModel_1.default,
            key: 'studentId',
        },
    },
}, {
    sequelize: databaseSqlite_1.default,
    modelName: 'enrolment',
});
Enrolment.belongsTo(courseModel_1.default, { foreignKey: 'courseId' });
Enrolment.hasMany(studentModel_1.default, { foreignKey: 'studentId' });
exports.default = Enrolment;
