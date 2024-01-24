import express from 'express'
import { grades } from '../controller/grade'

const router = express.Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/grade', grades)

// eslint-disable-next-line @typescript-eslint/no-misused-promises
// router.get('/grade', getGrades)

export default router
