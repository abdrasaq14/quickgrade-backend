import { type Request, type Response } from 'express'
import Courses from '../model/courseModel'

export const getDepartmentsByFaculty = async (req: Request, res: Response): Promise<void> => {
  try {
    const { faculty } = req.query
    if (!faculty) {
      const errorMessage = 'Faculty is required'
      res.json({ error: errorMessage })
    } else {
      const departments = await Courses.findAll({
        where: {
          faculty
        }
      })
      res.json({ departments })
    }
  } catch (error) {
    res.json({ error })
  }
}
export const getCoursesByDepartmentAndSemester = async (req: Request, res: Response): Promise<void> => {
  try {
    const { department, semester } = req.query
    if (!department || !semester) {
      const errorMessage = 'department is required'
      res.json({ error: errorMessage })
    } else {
      const courses = await Courses.findAll({
        where: {
          department,
          semester
        }
      })

      res.json({ courses })
    }
  } catch (error) {
    res.json({ error })
  }
}
