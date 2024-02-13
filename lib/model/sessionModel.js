"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const databaseSqlite_1 = __importDefault(require("../database/databaseSqlite"));
const semesterModel_1 = __importDefault(require("../model/semesterModel"));
const uuid_1 = require("uuid");
class Session extends sequelize_1.Model {
    static associate(models) {
        Session.hasMany(semesterModel_1.default, { foreignKey: 'sessionId', as: 'sessionSemesters' });
    }
}
Session.init({
    sessionId: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: () => (0, uuid_1.v4)(),
        primaryKey: true,
        allowNull: false
    }
}, {
    sequelize: databaseSqlite_1.default,
    modelName: 'Session'
});
exports.default = Session;
