import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/databaseSqlite';
import StudentCourses from '../model/studentCourseModel';
import Courses from '../model/courseModel';
import { v4 as uuidv4 } from 'uuid';

class Student extends Model {
  static associate() {
    Student.belongsToMany(Courses, {
      through: StudentCourses,
      foreignKey: 'studentId',
      otherKey: 'courseId',
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

