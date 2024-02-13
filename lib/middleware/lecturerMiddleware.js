'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
var _a;
Object.defineProperty(exports, '__esModule', { value: true });
exports.authenticateLecturer = void 0;
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
const lecturerModel_1 = __importDefault(require('../model/lecturerModel'));
const secret = (_a = process.env.secret) !== null && _a !== void 0 ? _a : '';
// export async function authenticate (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
//   const email = req.session.email
//   console.log('email', email)
//   try {
//     if (!email) {
//       console.log('no email')
//       res.json({ unathorized: 'unathorized' })
//     } else {
//       req.user = email
//       next()
//     }
//   } catch (error) {
//     console.error(error)
//     res.status(401).json({ message: 'Unauthorized' })
//   }
// };
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function authenticateLecturer(req, res, next) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      // console.log('auth token', req.session.lecturerId)
      // const token = req.session.lecturerToken
      const token = req.cookies.lecturerToken;
      console.log('lecturer-token', token);
      if (!token) {
        res.json({
          lectuerUnauthorizedError: 'Unauthorized - Token not provided',
        });
      } else {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        const lecturer = yield lecturerModel_1.default.findOne({
          where: { lecturerId: decoded.loginkey },
        });
        req.lecturer = {
          lecturerId:
            lecturer === null || lecturer === void 0
              ? void 0
              : lecturer.dataValues.lecturerId,
        };
        next();
      }
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
  });
}
exports.authenticateLecturer = authenticateLecturer;
