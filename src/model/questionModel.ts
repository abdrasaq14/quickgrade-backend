import { DataTypes, Model } from 'sequelize'
import sequelize from '../database/databaseSqlite'
import { v4 as uuidv4 } from 'uuid'
import Exam from './examModel'
import Lecturer from './lecturerModel'
class Question extends Model {
  static associate (models: any): void {
    // Define the many-to-many relationship with the Course model
    Question.belongsTo(models.Exam, {
      foreignKey: 'examId',
      as: 'exam'
    })
  }
}
Question.init(
  {
    questionId: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false
    },
    questionText: {
      type: DataTypes.STRING,
      allowNull: false
    },
    optionA: {
      type: DataTypes.STRING,
      allowNull: true
    },
    optionB: {
      type: DataTypes.STRING,
      allowNull: true
    },
    optionC: {
      type: DataTypes.STRING,
      allowNull: true
    },
    optionD: {
      type: DataTypes.STRING,
      allowNull: true
    },
    courseCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    correctAnswer: {
      type: DataTypes.STRING,
      allowNull: true
    },
    questionType: {
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
    lecturerId: {
      type: DataTypes.STRING,
      references: {
        model: Lecturer,
        key: 'lecturerId'
      }
    }

  },
  {
    sequelize,
    modelName: 'Question'
  }
)

export default Question
