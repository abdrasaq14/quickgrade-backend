"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const databaseSqlite_1 = __importDefault(require("../database/databaseSqlite"));
const uuid_1 = require("uuid");
const courseModel_1 = __importDefault(require("./courseModel"));
class Lecturer extends sequelize_1.Model {
    static associate(models) {
        // Define the many-to-many relationship with the Course model
        Lecturer.belongsToMany(courseModel_1.default, {
            through: 'LecturerCourses',
            as: 'courses'
        });
    }
}
Lecturer.init({
    lecturerId: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: () => (0, uuid_1.v4)(),
        primaryKey: true,
        allowNull: false
    },
    employeeID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
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
        unique: true
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    otp: {
        type: sequelize_1.DataTypes.STRING
    },
    otpExpiration: {
        type: sequelize_1.DataTypes.DATE
    },
    isVerify: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    faculty: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    department: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: databaseSqlite_1.default,
    modelName: 'Lecturer'
});
exports.default = Lecturer;
