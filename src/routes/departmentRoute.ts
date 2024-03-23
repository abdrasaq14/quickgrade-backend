/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import { getDepartmentsByFaculty, getCoursesByDepartmentAndSemester } from '../controller/department'
const router = express.Router()

router.get('/get-departments-by-faculty', getDepartmentsByFaculty)

router.get('/get-courses-by-department-and-semester', getCoursesByDepartmentAndSemester)

export default router
