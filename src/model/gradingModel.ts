import { DataTypes, Model } from 'sequelize'
import sequelize from '../database/databaseSqlite'
import { v4 as uuidv4 } from 'uuid'
import Exam from './examModel'
class Grading extends Model {}

Grading.init(
  {
    gradingId: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    courseCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    examId: {
      type: DataTypes.STRING,
      references: {
        model: Exam,
        key: 'examId'
      }
    },
    semester: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    objectiveGrade: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    theoryGrade: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    totalGrade: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Grading'
  }
)

export default Grading
