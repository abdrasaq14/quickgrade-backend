"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const databaseSqlite_1 = __importDefault(require("../database/databaseSqlite"));
const uuid_1 = require("uuid");
const courseModel_1 = __importDefault(require("../model/courseModel"));
class Lecturer extends sequelize_1.Model {
<<<<<<< HEAD
    static associate() {
        // Define relationships here
        Lecturer.belongsToMany(courseModel_1.default, {
            through: 'LecturerCourses', // Create an intermediate table if needed
            foreignKey: 'lecturerId',
            otherKey: 'courseId',
            as: 'courses',
        });
    }
=======
>>>>>>> 2ea20dc66b78cf3c1775b9f152efad19840ab751
}
Lecturer.init({
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
<<<<<<< HEAD
}, {
    sequelize: databaseSqlite_1.default,
    modelName: 'Lecturer',
});
=======
    courseId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: courseModel_1.default,
            key: 'courseId',
        },
    },
}, {
    sequelize: databaseSqlite_1.default,
    modelName: 'lecturer',
});
Lecturer.hasMany(courseModel_1.default, { foreignKey: 'lecturerId' });
>>>>>>> 2ea20dc66b78cf3c1775b9f152efad19840ab751
exports.default = Lecturer;
