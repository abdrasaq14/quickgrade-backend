import { DataTypes, Model } from "sequelize";
import sequelize from "../database/databaseSqlite";
import { v4 as uuidv4 } from "uuid";


class Exam extends Model {
  static associate(models: any): void {
    // Define the many-to-many relationship with the Course model
    Exam.belongsTo(models.Courses, {
      foreignKey: "courseId",
      as: "course",
    });
    Exam.belongsTo(models.Student, {
      foreignKey: "studentId",
      as: "student",
    });
  }
}

Exam.init(
    {
        examId: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
        allowNull: false,
        },
        courseId: {
        type: DataTypes.UUID,
        allowNull: false,
        },
        studentId: {
        type: DataTypes.UUID,
        allowNull: false,
        },
        semester: {
        type: DataTypes.STRING,
        allowNull: false,
        },
        session: {
        type: DataTypes.STRING,
        allowNull: false,
        },
        examDate: {
        type: DataTypes.DATE,
        allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Exam",
    }
    );

export default Exam;