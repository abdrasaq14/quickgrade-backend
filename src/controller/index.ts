import Courses from '../model/courseModel'
import { type Request, type Response } from 'express'

export const createCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseCode, courseTitle, creditUnit, session, semester } = req.body

    const newCourse = await Courses.create({
      courseCode,
      courseTitle,
      creditUnit,
      session,
      semester
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
    console.log(error)
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
      console.log(courses)
      res.json({
        coureDetailFromServer: courses
      })
    }
  } catch (error) {
    console.log(error)
  }
}
