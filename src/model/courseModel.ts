import { DataTypes, Model } from 'sequelize'
import sequelize from '../database/databaseSqlite'
import { v4 as uuidv4 } from 'uuid'
import Lecturer from './lecturerModel'
import Student from './studentModel'
import Session from './sessionModel'
import Semester from './semesterModel'

class Courses extends Model {
  static associate (models: any): void {
    Courses.belongsToMany(Student, { through: 'StudentCourses', as: 'students' })
    Courses.belongsToMany(Lecturer, { through: 'LecturerCourses', as: 'lecturers' })

    Courses.belongsTo(Session, { foreignKey: 'session', as: 'courseSession' })
    Courses.belongsTo(Semester, { foreignKey: 'semester', as: 'courseSemester' })
  }
}

Courses.init(
  {
    courseId: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
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
    creditUnit: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    session: {
      type: DataTypes.STRING,
      allowNull: false
    },
    semester: {
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
    }
  },
  {
    sequelize,
    modelName: 'Courses'
  }
)

export default Courses
