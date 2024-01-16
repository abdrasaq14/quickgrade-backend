import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/databaseSqlite';
import { v4 as uuidv4 } from 'uuid';
import Courses from '../model/courseModel';
import Student from '../model/studentModel';

class Enrolment extends Model {}

Enrolment.init(
  {
    enrolmentId: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
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
    courseName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Student,
        key: 'studentId',
      },
    },
  },
  {
    sequelize,
    modelName: 'enrolment',
  },
);

Enrolment.belongsTo(Courses, { foreignKey: 'courseId' });
Enrolment.hasMany(Student, { foreignKey: 'studentId' });

export default Enrolment;
