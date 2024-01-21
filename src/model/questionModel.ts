import { DataTypes, Model } from 'sequelize'
import sequelize from '../database/databaseSqlite'
import { v4 as uuidv4 } from 'uuid'

class Question extends Model {
  static associate (models: any): void {
    // Define the many-to-many relationship with the Course model
    Question.belongsTo(models.Exam, {
      foreignKey: 'examId',
      as: 'exam'
    })
    Question.belongsTo(models.Lecturer, {
      foreignKey: 'lecturerId',
      as: 'lecturer'
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
    examId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    lecturerId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    questionText: {
      type: DataTypes.STRING,
      allowNull: false
    },
    questionType: {
      type: DataTypes.ENUM('multiple-choice', 'theory'),
      allowNull: false
    },
    answer: {
      type: DataTypes.ENUM('option A', 'option B', 'option C', 'option D'),
      allowNull: false
    },
    choices: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null
    },
    correctChoice: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    }
  },
  {
    sequelize,
    modelName: 'Question'
  }
)

export default Question
