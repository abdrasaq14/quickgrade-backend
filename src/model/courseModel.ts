import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/databaseSqlite';
import { v4 as uuidv4 } from 'uuid';
import Lecturer from './lecturerModel';

class Courses extends Model {
  static associate(models: any): void {
    Courses.belongsToMany(Lecturer, {
      foreignKey: 'courseId',
      through: 'Courses',
      

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
    courseCode: {
      type: DataTypes.STRING,
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
    lecturers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references:{
        model:'Lecturers',
        key:'lecturerId'
      }
    },
  },
  {
    sequelize,
    modelName: 'Courses',
  },
);

export default Courses;

