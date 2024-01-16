import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/databaseSqlite';
import { v4 as uuidv4 } from 'uuid';
import Lecturer from '../model/lecturerModel'; // Import the Lecturer model

class Courses extends Model {}

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
      type: DataTypes.STRING,
      allowNull: false,
    },
    lecturerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Lecturer,
        key: 'lecturerId',
      },
    },
  },
  {
    sequelize,
    modelName: 'courses',
  },
);

Courses.belongsTo(Lecturer, { foreignKey: 'lecturerId' });

export default Courses;
