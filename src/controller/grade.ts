import { type Request, type Response } from 'express'
import Grading from '../model/gradingModel'

const gradingCriteria = {
  A: { min: 70, max: 100 },
  B: { min: 60, max: 69 },
  C: { min: 50, max: 59 },
  D: { min: 40, max: 49 },
  F: { min: 0, max: 39 }
}

function calculateGrade (gradeValue: number): string {
  for (const [grade, range] of Object.entries(gradingCriteria)) {
    if (gradeValue >= range.min && gradeValue <= range.max) {
      return grade
    }
  }
  return 'Invalid'
}

export const grades = async (req: Request, res: Response): Promise<void> => {
  try {
    const { gradingId, studentId, responseId, department, grade } = req.body

    if (!gradingId || !studentId || !responseId || !department || !grade) {
      res.status(400).json({ error: 'Invalid input data' })
      return
    }

    const studentGrade = calculateGrade(grade)

    const gradeData = await Grading.create({ gradingId, studentId, responseId, department, grade: studentGrade })
    console.log(gradeData)

    res.status(200).json(gradeData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
