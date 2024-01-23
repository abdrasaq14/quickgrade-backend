import { type Request, type Response } from 'express'
import Exam from '../model/examModel'

const gradingCriteria = {
  A: { min: 70, max: 100 },
  B: { min: 60, max: 69 },
  C: { min: 50, max: 59 },
  D: { min: 40, max: 49 },
  F: { min: 0, max: 39 }
}

function calculateGrade (totalScore: number): string {
  for (const [grade, range] of Object.entries(gradingCriteria)) {
    if (totalScore >= range.min && totalScore <= range.max) {
      return grade
    }
  }
  return 'Invalid'
}

export const grades = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, examId, totalScore, examDuration, courseId, questionId, semester, session, faculty, department, examDate } = req.body

    if (!studentId || !examId || totalScore === undefined || isNaN(totalScore) || !examDuration || !courseId || !questionId || !semester || !session || !faculty || !department || !examDate) {
      res.status(400).json({ error: 'Invalid input data' })
      return
    }

    const grade = calculateGrade(totalScore)

    const gradeData = await Exam.create({ studentId, examId, examDuration, courseId, questionId, semester, session, faculty, department, examDate, totalScore, grade })
    console.log(gradeData)

    res.status(200).json(gradeData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
