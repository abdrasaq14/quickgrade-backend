"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const databaseSqlite_1 = __importDefault(require("../database/databaseSqlite"));
const uuid_1 = require("uuid");
class Enrollment extends sequelize_1.Model {
    static associate(models) {
        // Define the many-to-many relationship with the Course model
        Enrollment.belongsTo(models.Courses, {
            foreignKey: 'courseId',
            as: 'course'
        });
        Enrollment.belongsTo(models.Student, {
            foreignKey: 'studentId',
            as: 'student'
        });
    }
}
Enrollment.init({
    enrollmentId: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: () => (0, uuid_1.v4)(),
        primaryKey: true,
        allowNull: false
    },
    courseId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    studentId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    enrollmentDate: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: Date.now,
        allowNull: false
    }
}, {
    sequelize: databaseSqlite_1.default,
    modelName: 'Enrollment'
});
exports.default = Enrollment;
