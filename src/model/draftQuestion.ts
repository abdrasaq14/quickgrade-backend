import { DataTypes, Model } from 'sequelize'
import sequelize from '../database/databaseSqlite'
import { v4 as uuidv4 } from 'uuid'
import SetExamDraftModel from './setExamDraftModel'
import Lecturer from './lecturerModel'

class DraftQuestion extends Model {
  static associate (models: any): void {
    // Define the many-to-many relationship with the Course model
    DraftQuestion.belongsTo(models.SetExamDraftModel, {
      foreignKey: 'draftExamId',
      as: 'draftExam'
    })
  }
}
DraftQuestion.init(
  {
    questionId: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false
    },
    questionText: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
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
      type: DataTypes.UUID,
      references: {
        model: SetExamDraftModel,
        key: 'draftExamId'
      }
    },
    lecturerId: {
      type: DataTypes.UUID,
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

export default DraftQuestion
