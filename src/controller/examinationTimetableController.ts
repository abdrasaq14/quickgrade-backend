import { type Request, type Response } from 'express'
import Courses from '../model/courseModel'
import Student from '../model/studentModel'
import Exam from '../model/examModel'
import { ExaminationTimetable } from '../model/examinationTimetableModel'

export const getExamTimetable = async (req: Request, res: Response): Promise<any> => {
  try {
    const { coursecode, session, semester } = req.params
    if (!coursecode || !session || !semester) {
      const errorMessage = 'Course code, Session and Semester are required'
      res.json({ error: errorMessage })
    //   res.status(400).json({ error: errorMessage });
    } else {
      const examTimetable = await Exam.findAll({
        include: [
          {
            model: ExaminationTimetable,
            attributes: ['id', 'course code', 'date', 'status'],
            where: {
              session,
              semester
            }

          },

          {
            model: Courses,
            attributes: ['courseCode', 'courseTitle'],
            where: {
              coursecode
            }
          },
          {
            model: Student,
            attributes: ['studentId', 'department', 'faculty', 'level']
          },
          {
            model: Exam,
            attributes: ['examId, examDuration, courseCode, courseTitle'],
            where: {
              session,
              semester
            }
          }
        ]

      })
      res.render('Timetable', { examTimetable })
      res.status(200).json(examTimetable)
    }
  } catch (error) {
    console.error('Error in getExamTimetable:', error)
    res.json({ error })
    // res.status(500).json({ error: errorMessage });
  }
}
