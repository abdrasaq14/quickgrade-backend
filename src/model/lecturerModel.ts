import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/databaseSqlite';
import { v4 as uuidv4 } from 'uuid';
import Courses from '../model/courseModel';

class Lecturer extends Model {
  static associate(models: any): void {
    // Define relationships here
    Lecturer.belongsToMany(Courses, {
      through: 'LecturerCourses', // Create an intermediate table if needed
      foreignKey: 'lecturerId',
      otherKey: 'courseId',
      as: 'courses',
    });
  }
}

Lecturer.init(
  {
    lecturerId: {
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
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
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
    modelName: 'Lecturer',
  },
);

export default Lecturer;
