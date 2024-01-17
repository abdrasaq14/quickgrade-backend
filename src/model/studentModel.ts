import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/databaseSqlite';
import Courses from '../model/courseModel';
import { v4 as uuidv4 } from 'uuid';

class Student extends Model {
  static associate(models: any): void {
    Student.belongsToMany(Courses, { through: 'StudentCourses', as: 'courses' });
    } )
  
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
  },
  {
    sequelize,
    modelName: 'Student',
  },
);

export default Student;
