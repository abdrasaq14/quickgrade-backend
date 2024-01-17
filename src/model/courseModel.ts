import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/databaseSqlite';
import StudentCourses from '../model/studentCourseModel';
import Student from '../model/studentModel';
import { v4 as uuidv4 } from 'uuid';

class Courses extends Model {
  static associate(models: any): void {
    Courses.belongsToMany(Student, {
      through: StudentCourses,
      foreignKey: 'courseId',
      otherKey: 'studentId',
      as: 'students',
    });
  }
}

Courses.init(
  {
    courseId: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false,
    },
    courseTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    creditUnit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Courses',
  },
);

export default Courses;

