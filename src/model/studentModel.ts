import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/databaseSqlite';
import Courses from '../model/courseModel';
import { v4 as uuidv4 } from 'uuid';

class Student extends Model {
  resetPasswordToken!: string | null;
  resetPasswordExpiration!: Date | null;
  otpExpiration!: Date;
  otp!: string;
  isVerified!: boolean;
  password!: string;

  static associate(models: any): void {
    Student.belongsToMany(Courses, {
      through: 'StudentCourses',
      as: 'courses',
    });
  }
}

Student.init(
  {
    studentId: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    faculty: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otpSecret: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otpExpiration: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpiration: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    }, 
  {
    sequelize,
    modelName: 'Student',
  },
);

export default Student;