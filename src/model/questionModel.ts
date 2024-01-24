// import { DataTypes, Model } from 'sequelize'
// import sequelize from '../database/databaseSqlite'
// import { v4 as uuidv4 } from 'uuid'
// import Courses from './courseModel'

// class Question extends Model {
//   static associate (models: any): void {
//     // Define the many-to-many relationship with the Course model
//     Question.belongsTo(models.Exam, {
//       foreignKey: 'examId',
//       as: 'exam'
//     })
//   }
// }

// Question.init(
//   {
//     questionId: {
//       type: DataTypes.UUID,
//       defaultValue: () => uuidv4(),
//       primaryKey: true,
//       allowNull: false
//     },
//     // examId: {
//     //   type: DataTypes.UUID,
//     //   allowNull: false
//     // },
//     courseId: {
//         type: DataTypes.STRING,
//         references: {
//             model: Courses,
//             key: 'coureID'
//         }
//     },

//     lecturerId: {
//       type: DataTypes.STRING,
//         references: {
//             model: Courses,
//             key: 'categoryID'
//         }
//     }

//     },

//   },
//   {
//     sequelize,
//     modelName: 'Question'
//   }
// )

// export default Question

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
      allowNull: false,
      unique: true
    },
    optionA: {
      type: DataTypes.STRING,
      allowNull: false
    },
    optionB: {
      type: DataTypes.STRING,
      allowNull: false
    },
    optionC: {
      type: DataTypes.STRING,
      allowNull: false
    },
    optionD: {
      type: DataTypes.STRING,
      allowNull: false
    },
    courseCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    correctAnswer: {
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