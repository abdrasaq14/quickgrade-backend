import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/databaseSqlite';
import { v4 as uuidv4 } from 'uuid';
import Courses from '../model/courseModel';

class Lecturer extends Model {}

Lecturer.init(
  {
    lecturerId: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
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
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Courses,
        key: 'courseId',
      },
    },
  },
  {
    sequelize,
    modelName: 'lecturer',
  },
);

Lecturer.hasMany(Courses, { foreignKey: 'lecturerId' });

export default Lecturer;
