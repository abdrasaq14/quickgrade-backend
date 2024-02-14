import Courses from '../model/courseModel'
import { type Request, type Response } from 'express'

export const createCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseCode, courseTitle, creditUnit, session, semester, department, faculty } = req.body

    const newCourse = await Courses.create({
      courseCode,
      courseTitle,
      creditUnit,
      session,
      semester,
      department,
      faculty
    })
    if (!newCourse) {
      res.json({
        message: 'unable to create course'
      })
    } else {
      res.json({
        message: 'course created succesfully'
      })
    }
  } catch (error) {
  }
}

export const getAllCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const courses = await Courses.findAll()
    if (!courses) {
      res.json({
        message: 'unable to fetch courses'
      })
    } else {
      res.json({
        coureDetailFromServer: courses
      })
    }
  } catch (error) {
  }
}
