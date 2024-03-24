/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import { getExamResults } from '../controller/examResult'

const router = express.Router()

router.get('/exam-results', getExamResults)

export default router
