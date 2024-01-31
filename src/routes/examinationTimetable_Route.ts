import express from 'express'
import { getExamTimetable } from '../controller/examinationTimetableController'

const router = express.Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/', getExamTimetable)

export default router
