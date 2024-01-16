"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const databaseSqlite_1 = __importDefault(require("../database/databaseSqlite"));
<<<<<<< HEAD
const studentCourseModel_1 = __importDefault(require("./studentCourseModel"));
const studentModel_1 = __importDefault(require("./studentModel"));
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
=======
const uuid_1 = require("uuid");
const lecturerModel_1 = __importDefault(require("../model/lecturerModel")); // Import the Lecturer model
class Courses extends sequelize_1.Model {
>>>>>>> 2ea20dc66b78cf3c1775b9f152efad19840ab751
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
<<<<<<< HEAD
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: databaseSqlite_1.default,
    modelName: 'Courses',
});
=======
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
}, {
    sequelize: databaseSqlite_1.default,
    modelName: 'courses',
});
Courses.belongsTo(lecturerModel_1.default, { foreignKey: 'lecturerId' });
>>>>>>> 2ea20dc66b78cf3c1775b9f152efad19840ab751
exports.default = Courses;
