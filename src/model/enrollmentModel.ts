import { DataTypes, Model } from 'sequelize'
import sequelize from '../database/databaseSqlite'
import { v4 as uuidv4 } from 'uuid'

class Enrollment extends Model {
  static associate (models: any): void {
    // Define the many-to-many relationship with the Course model
    Enrollment.belongsTo(models.Courses, {
      foreignKey: 'courseId',
      as: 'course'
    })
    Enrollment.belongsTo(models.Student, {
      foreignKey: 'studentId',
      as: 'student'
    })
  }
}

Enrollment.init(
  {
    enrollmentId: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    enrollmentDate: {
      type: DataTypes.DATE,
      defaultValue: Date.now,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Enrollment'
  }
)

export default Enrollment
