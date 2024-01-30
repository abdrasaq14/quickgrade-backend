import { DataTypes, Model } from 'sequelize'
import sequelize from '../database/databaseSqlite'
import { v4 as uuidv4 } from 'uuid'
import Courses from './courseModel'

class Lecturer extends Model {
  lecturerId!: string
  title!: string
  firstName!: string
  lastName!: string
  email!: string
  employeeID!: string
  password!: string
  faculty!: string
  department!: string
  otp!: string
  otpSecret!: string | null
  otpExpiration!: Date
  isVerified!: boolean
  resetPasswordToken!: string | null
  resetPasswordExpiration!: Date | null




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
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
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
    },
    otpSecret: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetPasswordExpiration: {
      type: DataTypes.DATE,
      allowNull: true
    }

  },
  {
    sequelize,
    modelName: 'Lecturer'
  }
)

export default Lecturer
