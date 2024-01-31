import { DataTypes, Model } from 'sequelize'
import sequelize from '../database/databaseSqlite'
import Courses from '../model/courseModel'
import { v4 as uuidv4 } from 'uuid'

class Student extends Model {
  studentId!: string
  firstName!: string
  lastName!: string
  email!: string
  matricNo!: string
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
    Student.belongsToMany(Courses, {
      through: 'StudentCourses',
      as: 'courses'
    })
  }
}

Student.init(
  {
    studentId: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
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
      allowNull: false
    },
    matricNo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
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
    otp: {
      type: DataTypes.STRING,
      allowNull: true
    },
    otpSecret: {
      type: DataTypes.STRING,
      allowNull: true
    },
    otpExpiration: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
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
    modelName: 'Student'
  }
)

export default Student
