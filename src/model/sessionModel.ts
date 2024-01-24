import { DataTypes, Model } from 'sequelize'
import sequelize from '../database/databaseSqlite'
import Semester from '../model/semesterModel'
import { v4 as uuidv4 } from 'uuid'

class Session extends Model {
  static associate (models: any): void {
    Session.hasMany(Semester, { foreignKey: 'sessionId', as: 'sessionSemesters' })
  }
}

Session.init(
  {
    sessionId: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Session'
  }
)

export default Session
