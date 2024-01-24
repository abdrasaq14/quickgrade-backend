import { DataTypes, Model } from 'sequelize'
import sequelize from '../database/databaseSqlite'
import { v4 as uuidv4 } from 'uuid'

class ExamResult extends Model {}

ExamResult.init(
  {
    resultId: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false
    },
    examId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    lecturerId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    grade: {
      type: DataTypes.STRING,
      allowNull: false
    },
    totalMarks: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'ExamResult'
  }
)

export default ExamResult
