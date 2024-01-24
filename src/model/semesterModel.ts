import { DataTypes, Model } from 'sequelize'
import sequelize from '../database/databaseSqlite'
import Courses from '../model/courseModel'
import Session from '../model/sessionModel'
import { v4 as uuidv4 } from 'uuid'

class Semester extends Model {
  static associate (models: any): void {
    Semester.belongsTo(Session, { foreignKey: 'sessionId', as: 'semesterSession' })
    Semester.hasMany(Courses, { foreignKey: 'semester', as: 'semesterCourses' })
  }
}

Semester.init(
  {
    semesterId: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false
    }

  },
  {
    sequelize,
    modelName: 'Semester'
  }
)

export default Semester
