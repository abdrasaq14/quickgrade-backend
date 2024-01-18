import express, {
  type Request,
  type Response,
  type NextFunction
} from 'express'

const router = express.Router()

/* GET home page. */
router.get(
  '/:role',
  function (req: Request, res: Response, next: NextFunction) {
    const { role } = req.params
    console.log('role', role)
    res.json({ message: role })
  }
)

export default router
