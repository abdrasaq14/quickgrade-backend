'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const controller_1 = require('../controller');
const router = express_1.default.Router();
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/create-course', controller_1.createCourse);
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/get-courses', controller_1.getAllCourses);
/* GET home page. */
router.get('/:role', function (req, res, next) {
  const { role } = req.params;
  res.json({ role });
});
exports.default = router;
