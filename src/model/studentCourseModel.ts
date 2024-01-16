import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/databaseSqlite';
import { v4 as uuidv4 } from 'uuid';

class StudentCourses extends Model {}

StudentCourses.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'StudentCourses',
  },
);

export default StudentCourses;
