import { Model, DataTypes } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'
import sequelize from '../database/databaseSqlite'
import Lecturer from './lecturerModel'

class DraftExam extends Model {
  public draftExamId!: string
  public lecturerId!: string
  public examDuration!: string
  public examInstruction!: string
  public firstSection!: string
  public secondSection!: string
  public thirdSection!: string
  public semester!: string
  public session!: string
  public faculty!: string
  public department!: string
  public examDate!: Date
  public totalScore!: number
  public courseCode!: string
  public courseTitle!: string
  public totalNoOfQuestions!: number
  public questionText!: string
  public optionA!: string
  public optionB!: string
  public optionC!: string
  public optionD!: string
  public correctAnswer!: string
  public questionType!: string
  static associate (models: any): void {
    DraftExam.belongsTo(models.Lecturer, {
      foreignKey: 'lecturerId', as: 'DraftExam'
    })
    // DraftExam.belongsTo(models.Course, {
    //   foreignKey: 'courseTitle', as: 'DraftExam'
    // })
  }
}

DraftExam.init(
  {
    draftExamId: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false
    },
    lecturerId: {
      type: DataTypes.UUID,
      references: {
        model: Lecturer,
        key: 'lecturerId'
      },
      allowNull: false
    },
    examDuration: {
      type: DataTypes.STRING,
      allowNull: false
    },
    examInstruction: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstSection: {
      type: DataTypes.STRING,
      allowNull: false
    },
    secondSection: {
      type: DataTypes.STRING,
      allowNull: false
    },
    thirdSection: {
      type: DataTypes.STRING,
      allowNull: false
    },
    courseTitle: {
      type: DataTypes.STRING,
      allowNull: false
    },
    courseCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    semester: {
      type: DataTypes.STRING,
      allowNull: false
    },
    session: {
      type: DataTypes.STRING,
      allowNull: false
    },
    faculty: {
      type: DataTypes.STRING,
      allowNull: false
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false
    },
    examDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    totalScore: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    totalNoOfQuestions: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'DraftExam'
  }

)

export default DraftExam
