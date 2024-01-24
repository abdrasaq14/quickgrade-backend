import express from 'express'
import { getExamResults } from '../controller/examResult'

const router = express.Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/exam-results', getExamResults)

export default router
