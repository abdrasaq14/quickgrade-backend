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
function authenticateLecturer(req, res, next) {
  var _a;
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const token =
        (_a = req.headers.authorization) === null || _a === void 0
          ? void 0
          : _a.split(' ')[1];
      console.log('token', token);
      if (!token) {
        res.json({ noTokenError: 'Unauthorized - Token not provided' });
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
      if (error.name === 'TokenExpiredError') {
        // Handle the case when the token is expired
        res.json({ tokenExpiredError: 'Unauthorized - Token has expired' });
      } else {
        // Handle other token verification errors
        res.json({
          verificationError: 'Unauthorized - Token verification failed',
        });
      }
    }
  });
}
exports.authenticateLecturer = authenticateLecturer;
