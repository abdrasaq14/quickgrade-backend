import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/databaseSqlite';
import { v4 as uuidv4 } from 'uuid';
import Lecturer from '../model/lecturerModel';
import Enrolment from '../model/enrolmentModel';

class Student extends Model {}

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
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lecturerId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Lecturer,
        key: 'lecturerId',
      },
    },
    
  },
  {
    sequelize,
    modelName: 'student',
  },
);

export default Student;



// enrolmentId: {
//   type: DataTypes.UUID,
//   allowNull: false,
//   references: {
//     model: Enrolment,
//     key: 'enrolmentId',
//   },
// },
