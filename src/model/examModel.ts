import { DataTypes, Model } from 'sequelize'
import sequelize from '../database/databaseSqlite'
import { v4 as uuidv4 } from 'uuid'
import Lecturer from './lecturerModel'
class Exam extends Model {
  static associate (models: any): void {
    // Define the many-to-many relationship with the Course model
    Exam.belongsTo(models.Courses, {
      foreignKey: 'courseCode',
      as: 'course'
    })
  }
}

// Exam.init(
//   {
//     examId: {
//       type: DataTypes.UUID,
//       defaultValue: () => uuidv4(),
//       primaryKey: true,
//       allowNull: false
//     },
//     examDuration: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     courseId: {
//       type: DataTypes.UUID,
//       allowNull: false
//     },
//     questionId: {
//       type: DataTypes.UUID,
//       allowNull: false
//     },
//     studentId: {
//       type: DataTypes.UUID,
//       allowNull: false
//     },
//     semester: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     session: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     faculty: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     department: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     examDate: {
//       type: DataTypes.DATE,
//       allowNull: false
//     },
//     totalScore: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//       defaultValue: null
//     }
//   },
//   {
//     sequelize,
//     modelName: 'Exam'
//   }
// )

// export default Exam

Exam.init(
  {
    examId: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false
    },
    examDuration: {
      type: DataTypes.STRING,
      allowNull: false
    },
    courseCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    courseTitle: {
      type: DataTypes.STRING,
      allowNull: false
    },

    // studentId: {
    //   type: DataTypes.UUID,
    //   allowNull: true
    // },
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
    lecturerId: {
      type: DataTypes.STRING,
      references: {
        model: Lecturer,
        key: 'lecturerId'
      }
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
      allowNull: true,
      defaultValue: null
    },
    totalNoOfQuestions: {
      type: DataTypes.INTEGER
    }
    // grade: {
    //   type: DataTypes.STRING,
    //   allowNull: false
    // }
  },
  {
    sequelize,
    modelName: 'Exam'
  }
)
export default Exam
