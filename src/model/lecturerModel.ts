import { DataTypes, Model } from 'sequelize'
import sequelize from '../database/databaseSqlite'
import { v4 as uuidv4 } from 'uuid'
import Courses from './courseModel'

class Lecturer extends Model {
  otpExpiration!: Date;
  otp!: string;
  isVerify!: boolean;
  password!: string;

  static associate (models: any): void {
    // Define the many-to-many relationship with the Course model
    Lecturer.belongsToMany(Courses, {
      through: 'LecturerCourses',
      as: 'courses'
    })
  }
}

Lecturer.init(
  {
    lecturerId: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false
    },
    employeeID: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    otp: {
      type: DataTypes.STRING
    },
    otpExpiration: {
      type: DataTypes.DATE
    },
    isVerify: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
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
    modelName: 'Lecturer'
  }
)

export default Lecturer
