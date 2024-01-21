import { DataTypes, Model } from "sequelize";
import sequelize from "../database/databaseSqlite";
import { v4 as uuidv4 } from "uuid";


class Grading extends Model {}

Grading.init(
    {
        gradingId: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
        allowNull: false,
        },
        examId: {
        type: DataTypes.UUID,
        allowNull: false,
        },
        studentId: {
        type: DataTypes.UUID,
        allowNull: false,
        },
        lecturerId: {
        type: DataTypes.UUID,
        allowNull: false,
        },
        responseIdId: {
        type: DataTypes.UUID,
        allowNull: false,
        },
        grade: {
        type: DataTypes.STRING,
        allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Grading",
    }
    );

export default Grading;