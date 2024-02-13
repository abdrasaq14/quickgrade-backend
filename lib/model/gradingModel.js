"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const databaseSqlite_1 = __importDefault(require("../database/databaseSqlite"));
const uuid_1 = require("uuid");
const examModel_1 = __importDefault(require("./examModel"));
class Grading extends sequelize_1.Model {
}
Grading.init({
    gradingId: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: () => (0, uuid_1.v4)(),
        primaryKey: true,
        allowNull: false
    },
    studentId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    courseCode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    examId: {
        type: sequelize_1.DataTypes.STRING,
        references: {
            model: examModel_1.default,
            key: 'examId'
        }
    },
    semester: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    objectiveGrade: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    theoryGrade: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    totalGrade: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    }
}, {
    sequelize: databaseSqlite_1.default,
    modelName: 'Grading'
});
exports.default = Grading;
