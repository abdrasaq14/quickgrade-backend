import { type Request, type Response } from 'express'
import Grading from '../model/gradingModel'
import Courses from '../model/courseModel'
import Student from '../model/studentModel'
import Exam from '../model/examModel'

Grading.belongsTo(Student, { foreignKey: 'studentId' })
Grading.belongsTo(Courses, { foreignKey: 'courseId' })
Grading.belongsTo(Exam, { foreignKey: 'examId' })

export const getExamResults = async (req: Request, res: Response): Promise<any> => {
  try {
    const { courseCode, session, semester } = req.params
    if (!courseCode || !session || !semester) {
      const errorMessage = 'Course code, Session, and Semester are required'
      res.render('error', { errorMessage })
    } else {
      const examResults = await Grading.findAll({
        include: [
          {
            model: Courses,
            attributes: ['courseCode', 'courseTitle'],
            where: {
              courseCode
            }
          },
          {
            model: Student,
            attributes: ['studentId', 'department', 'faculty', 'level']
          },
          {
            model: Exam,
            attributes: ['totalScore'],
            where: {
              session,
              semester
            }
          }
        ]

      })

      res.render('result', { examResults })
      res.status(200).json(examResults)
    }
  } catch (error) {
    const errorMessage = 'Internal Server Error'
    res.render('error', { errorMessage })
    // res.status(500).json({ error: 'Internal Server Error' })
  }
}
