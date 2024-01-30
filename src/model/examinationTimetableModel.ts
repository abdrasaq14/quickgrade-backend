import { DataTypes, Model } from 'sequelize'
import sequelize from '../database/databaseSqlite'
// import { v4 as uuidv4 } from 'uuid'

enum ExamStatus { PENDING = 'pending', COMPLETED = 'completed', UNCOMPLETED = 'uncompleted', ONGOING = 'ongoing', POSTPONED = 'postponed', CANCELLED = 'cancelled' }

class ExaminationTimetable extends Model {}

ExaminationTimetable.init(
  {
    examDate: {
      type: DataTypes.DATE,
      allowNull: false
    },

    examId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    courseTitle: {
      type: DataTypes.STRING,
      allowNull: false
    },

    status: {
      type: DataTypes.ENUM(...Object.values(ExamStatus)),
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'ExaminationTimetable'
  }
)

export { ExaminationTimetable, ExamStatus }

// app.get('/api/examination-timetable', async (_, res) => {   const timetable = await ExaminationTimetable.findAll();   res.json(timetable); });
