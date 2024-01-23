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
    const courseCode = req.params.courseCode
    if (!courseCode) {
      res.status(400).json({ error: 'Course code is required' })
    } else {
      const examResults = await Grading.findAll({
        include: [
          {
            model: Courses,
            attributes: ['courseCode', 'courseTitle']
          },
          {
            model: Student,
            attributes: ['studentId', 'department', 'faculty', 'level']
          },
          {
            model: Exam,
            attributes: ['totalScore']
          }
        ],
        attributes: ['score', 'grade'],
        where: {
          courseCode
        }
      })

      res.status(200).json(examResults)
    }

    // const examResults = await Grading.findAll({
    //   include: [
    //     {
    //       model: Courses,
    //       attributes: ['courseCode', 'courseTitle']
    //     },
    //     {
    //       model: Student,
    //       attributes: ['studentId', 'department', 'faculty', 'level']
    //     },
    //     {
    //       model: Exam,
    //       attributes: ['totalScore']
    //     }
    //   ],
    //   attributes: ['score', 'grade']
    // })

    // res.status(200).json(examResults)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
