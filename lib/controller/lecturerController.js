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
exports.getGradedExams =
  exports.getLecturerDashboard =
  exports.gradeExam =
  exports.setExamQuestions =
  exports.getCourses =
  exports.updateLecturerPassword =
  exports.verifyOTP =
  exports.resetPasswordToken =
  exports.resetPassword =
  exports.lecturerLogin =
  exports.lecturerSignup =
    void 0;
const lecturerModel_1 = __importDefault(require('../model/lecturerModel'));
const studentModel_1 = __importDefault(require('../model/studentModel'));
const bcryptjs_1 = __importDefault(require('bcryptjs'));
const emailsender_1 = require('../utils/emailsender');
const crypto_1 = __importDefault(require('crypto'));
const speakeasy_1 = __importDefault(require('speakeasy'));
const questionModel_1 = __importDefault(require('../model/questionModel'));
const examModel_1 = __importDefault(require('../model/examModel'));
const courseModel_1 = __importDefault(require('../model/courseModel'));
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
const studentResponseModel_1 = __importDefault(
  require('../model/studentResponseModel'),
);
const gradingModel_1 = __importDefault(require('../model/gradingModel'));
const secret = (_a = process.env.secret) !== null && _a !== void 0 ? _a : '';
const lecturerSignup = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const {
        firstName,
        lastName,
        faculty,
        department,
        password,
        email,
        title,
      } = req.body;
      const existingLecturer = yield lecturerModel_1.default.findOne({
        where: { email },
      });
      if (existingLecturer) {
        res.json({
          existingLecturerError: 'Lecturer already exists',
        });
      } else {
        const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
        const noOfLecturer = ((yield lecturerModel_1.default.count()) + 1)
          .toString()
          .padStart(4, '0');
        const employeeID = `QUICK/LT/${faculty.toUpperCase().slice(0, 3)}/${noOfLecturer}`;
        const createdLecturer = yield lecturerModel_1.default.create({
          firstName,
          lastName,
          faculty,
          title,
          department,
          password: hashedPassword,
          email,
          employeeID,
        });
        // sending employeeID  and password to Lecturer email
        if (!createdLecturer) {
          res.json({
            failedSignup: 'Lecturer signup failed',
          });
        } else {
          const lecturerDetail = yield lecturerModel_1.default.findOne({
            where: { email },
          });
          if (!lecturerDetail) {
            res.json({ lecturerNotFoundError: 'Lecturer record not found' });
          } else {
            const totpSecret = speakeasy_1.default.generateSecret({
              length: 20,
            });
            // Update the lecturer instance with TOTP details
            yield lecturerDetail.update({
              otpSecret: totpSecret.base32,
              otp: speakeasy_1.default.totp({
                secret: totpSecret.base32,
                encoding: 'base32',
              }),
              otpExpiration: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
            });
            const mailOptions = {
              from: {
                name: 'QuickGrade App',
                address: 'quickgradedecagon@gmail.com',
              },
              to: email,
              subject: 'Quick Grade App - Email Verification Code',
              text: `TOTP: ${lecturerDetail.otp}`,
              html: `<h3>Hi there,
        Thank you for signing up for QuickGrade. Copy OTP below to verify your email:</h3>
        <h1>${lecturerDetail.otp}</h1>
        <h3>This OTP will expire in 10 minutes. If you did not sign up for a QuickGrade account,
        you can safely ignore this email. <br>
        <br>

        Best regards, <br>
        The QuickGrade Team</h3>`,
            };
            yield emailsender_1.transporter.sendMail(mailOptions);
            res.json({ successfulSignup: 'lecturer signup successful' });
          }
        }
      }
    } catch (error) {
      res.status(500).json({
        message: ` error: ${error}`,
      });
    }
  });
exports.lecturerSignup = lecturerSignup;
const lecturerLogin = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { employeeID, password } = req.body;
    try {
      const existingLecturer = yield lecturerModel_1.default.findOne({
        where: { employeeID },
      });
      if (!existingLecturer) {
        res.json({
          lecturerNotFoundError: 'Invalid lecturerId',
        });
      } else {
        const isPasswordValid = yield bcryptjs_1.default.compare(
          password,
          existingLecturer.dataValues.password,
        );
        if (!isPasswordValid) {
          res.json({
            inValidPassword: 'Invalid password',
          });
        } else {
          const token = jsonwebtoken_1.default.sign(
            { loginkey: existingLecturer.dataValues.lecturerId },
            secret,
            { expiresIn: '1h' },
          );
          res.json({ token });
          // res.cookie('lecturerToken', token)
          // res.json({
          //   successfulLogin: 'login successful'
          // })
        }
      }
    } catch (error) {
      res.status(500).json({
        internalServerError: `Error: ${error}`,
      });
    }
  });
exports.lecturerLogin = lecturerLogin;
const resetPassword = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield lecturerModel_1.default.findOne({ where: { email } });
    if (!user) {
      res.json({ userNotFoundError: 'User not found' });
      return;
    } else {
      const token = crypto_1.default.randomBytes(20).toString('hex');
      user.resetPasswordToken = token;
      user.resetPasswordExpiration = new Date(Date.now() + 3600000); // 1 hour
      yield user.save();
      const mailOptions = {
        from: 'quickgradedecagon@gmail.com',
        to: email,
        subject: 'Password Reset',
        // text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\nhttp://${req.headers.host}/reset-password/${token}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\nhttp://localhost:5173/lecturers/reset-password/${token}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };
      yield emailsender_1.transporter.sendMail(mailOptions);
    }
    res.json({
      linkSentSuccessfully:
        'An email has been sent to the address provided with further instructions.',
    });
  });
exports.resetPassword = resetPassword;
const resetPasswordToken = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const { password } = req.body;
    const user = yield lecturerModel_1.default.findOne({
      where: { resetPasswordToken: token },
    });
    if (!user) {
      res
        .status(404)
        .json({
          invalidPasswordResetToken:
            'Password reset token is invalid or has expired.',
        });
      return;
    }
    if (
      !user.resetPasswordExpiration ||
      Date.now() > user.resetPasswordExpiration.getTime()
    ) {
      res
        .status(401)
        .json({
          tokenExpired: 'Password reset token is invalid or has expired.',
        });
      return;
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpiration = null;
    yield user.save();
    res.json({ passwordResetSuccessful: 'Your password has been reset!' });
  });
exports.resetPasswordToken = resetPasswordToken;
const verifyOTP = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { otp } = req.body;
      const lecturer = yield lecturerModel_1.default.findOne({
        where: { otp },
      });
      const email =
        lecturer === null || lecturer === void 0
          ? void 0
          : lecturer.dataValues.email;
      if (!lecturer) {
        res.json({ invalidOtp: 'Invalid otp' });
      } else {
        const now = new Date();
        if (now > lecturer.otpExpiration) {
          res.json({ expiredOtpError: 'OTP has expired' });
          return;
        }
        yield lecturer.update({
          isVerified: true,
          otp: null,
          otpExpiration: null,
          otpSecret: null,
        });
        // res.redirect('http://localhost:5173/students/reset-password')
        const mailOptions = {
          from: {
            name: 'QuickGrade App',
            address: 'quickgradedecagon@gmail.com',
          },
          to: email,
          subject: 'Quick Grade App - Login Details',
          text: 'Login Detail',
          html: `<h3>Hi there,
          Your Account has been successfully created and Email verification is successful. kindly find your login details below:</h3>

          <h1> EmployeeID: ${lecturer.dataValues.employeeID}</h1>
          <br>
          <br>
          

          <h3>Best regards,<br>
          <h3>The QuickGrade Team</h3>`,
        };
        yield emailsender_1.transporter.sendMail(mailOptions);
        res.json({ OtpVerificationSuccess: 'OTP verified successfully' });
      }
    } catch (error) {
      res.json({ internalServerError: 'Internal Server Error' });
    }
  });
exports.verifyOTP = verifyOTP;
const updateLecturerPassword = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const lecturerId =
      (_b = req.lecturer) === null || _b === void 0 ? void 0 : _b.lecturerId;
    const { newPassword } = req.body;
    try {
      // Find the user by ID
      const user = yield lecturerModel_1.default.findByPk(lecturerId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
      } else {
        user.dataValues.password = newPassword;
        // Save the updated user to the database
        yield user.save();
        res.status(200).json({ message: 'Password updated successfully' });
      }
      // Update the user's password
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
exports.updateLecturerPassword = updateLecturerPassword;
const getCourses = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { semester, session } = req.body;
      const courses = yield courseModel_1.default.findAll({
        where: {
          semester,
          session,
        },
      });
      if (!courses) {
        res.json({
          message: 'courses not available',
        });
      } else {
        res.json({
          message: 'Here are the available courses',
          data: courses,
        });
      }
    } catch (error) {}
  });
exports.getCourses = getCourses;
const setExamQuestions = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const {
        lecturerId,
        examDuration,
        instruction,
        courseTitle,
        courseCode,
        semester,
        session,
        faculty,
        department,
        examDate,
        totalScore,
        questions,
        sections,
      } = req.body;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const eachSectionDetail = sections.map((section) => {
        return `${section.sectionAlphabet}|${section.ScoreObtainable}|${section.questionType}`;
      });
      const createdExam = yield examModel_1.default.create({
        examDuration,
        courseTitle,
        courseCode,
        examInstruction: instruction,
        semester,
        session,
        firstSection: eachSectionDetail[0] || '',
        secondSection: eachSectionDetail[1] || '',
        thirdSection: eachSectionDetail[2] || '',
        faculty,
        lecturerId,
        department,
        examDate,
        totalScore,
        totalNoOfQuestions: questions.length,
      });
      const examId = createdExam.dataValues.examId;
      // Use Promise.all to wait for all promises to resolve
      const createdQuestions = yield Promise.all(
        questions.map((question) =>
          __awaiter(void 0, void 0, void 0, function* () {
            try {
              if (question.type === 'theory') {
                return yield questionModel_1.default.create({
                  questionText: question.questionText,
                  questionType: 'Theory',
                  optionA: question.optionA,
                  optionB: question.optionB,
                  optionC: question.optionC,
                  optionD: question.optionD,
                  lecturerId: createdExam.dataValues.lecturerId,
                  correctAnswer: question.correctAnswer,
                  courseCode,
                  examId,
                });
              } else if (question.type === 'fill-in-the-blank') {
                return yield questionModel_1.default.create({
                  questionText: question.questionText,
                  questionType: 'fill-in-the-blank',
                  optionA: question.optionA,
                  optionB: question.optionB,
                  optionC: question.optionC,
                  optionD: question.optionD,
                  lecturerId: createdExam.dataValues.lecturerId,
                  correctAnswer: question.correctAnswer,
                  courseCode,
                  examId,
                });
              } else if (question.type === 'objectives') {
                return yield questionModel_1.default.create({
                  questionText: question.questionText,
                  questionType: 'Objective',
                  optionA: question.optionA,
                  optionB: question.optionB,
                  optionC: question.optionC,
                  optionD: question.optionD,
                  lecturerId: createdExam.dataValues.lecturerId,
                  correctAnswer: question.correctAnswer,
                  courseCode,
                  examId,
                });
              }
            } catch (error) {}
          }),
        ),
      );
      if (!createdQuestions) {
        console.log('unable to create questions');
      } else {
        res.json({ examQuestionCreated: 'exam created successfully' });
      }
    } catch (error) {}
  });
exports.setExamQuestions = setExamQuestions;
const gradeExam = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { courseCode } = req.params;
      const { studentId, examId, assembledQuestions } = req.body;
      const semester = yield examModel_1.default.findOne({
        attributes: ['semester'],
        where: { examId },
      });
      const studentResponse = yield Promise.all(
        assembledQuestions.map((response) =>
          __awaiter(void 0, void 0, void 0, function* () {
            try {
              if (response.questionType === 'Objective') {
                const correctAnswer = yield questionModel_1.default.findOne({
                  where: { questionId: response.questionId },
                });
                return yield studentResponseModel_1.default.create({
                  studentId,
                  examId,
                  semester:
                    semester === null || semester === void 0
                      ? void 0
                      : semester.dataValues.semester,
                  courseCode,
                  questionId: response.questionId,
                  responseText: response.questionText,
                  isCorrect:
                    (correctAnswer === null || correctAnswer === void 0
                      ? void 0
                      : correctAnswer.dataValues.correctAnswer) ===
                    response.typedAnswer,
                });
              }
            } catch (error) {
              res.json({ error: 'Internal Server Error' });
            }
          }),
        ),
      );
      if (!studentResponse) {
        console.log('unable to grade student response');
      } else {
        // to get the number of objective questions answered by each student
        const findStudentResponse =
          yield studentResponseModel_1.default.findAll({
            attributes: ['studentId', 'courseCode', 'examId', 'isCorrect'],
            where: { studentId },
          });
        // filter only the current course in case of existing courses
        const filterCurrentCourseOnly = findStudentResponse.filter(
          (currentCourse) => currentCourse.dataValues.courseCode === courseCode,
        );
        // reducing it to the number of questions in each course
        const result = filterCurrentCourseOnly.reduce((acc, curr) => {
          const key = curr.dataValues.courseCode;
          if (!acc[key]) {
            acc[key] = 0;
          }
          acc[key]++;
          return acc;
        }, {});
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        const eachQuetionAllocatedMarks = Object.keys(result).map((key) =>
          __awaiter(void 0, void 0, void 0, function* () {
            const course = yield examModel_1.default.findOne({
              where: { courseCode: key },
            });
            if (course) {
              // getting the allocated mark for that section
              const AllocatedTotalMarks = Number(
                course.dataValues.firstSection.split('|')[1],
              );
              // getting the marks for each question
              const eachQuestionMark = AllocatedTotalMarks / result[key];
              let count = 0;
              // eslint-disable-next-line array-callback-return
              filterCurrentCourseOnly.map((studentResponse) => {
                studentResponse.dataValues.isCorrect === true
                  ? count++
                  : (count += 0);
              });
              const objectiveGrade = parseFloat(
                (eachQuestionMark * count).toFixed(2),
              );
              const theoryGrade = 0;
              yield gradingModel_1.default.create({
                studentId,
                examId,
                courseCode: key,
                theoryGrade: 0,
                objectiveGrade: parseFloat(
                  (eachQuestionMark * count).toFixed(2),
                ),
                totalGrade: parseFloat(
                  (objectiveGrade + theoryGrade).toFixed(2),
                ),
                semester: course.dataValues.semester,
              });
            }
          }),
        );
        const studentResponseAutograding = yield Promise.all(
          eachQuetionAllocatedMarks,
        );
        if (!studentResponseAutograding) {
          res.json({ unableToGradeStudent: 'Internal Server Error' });
        } else {
          console.log('student', studentResponseAutograding);
          res.json({
            objectivesAutoGradedSuccessfully: 'exam created successfully',
          });
        }
      }
    } catch (error) {}
  });
exports.gradeExam = gradeExam;
const getLecturerDashboard = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // const semester = req.query.semester || 'first semester'
      const exams = yield examModel_1.default.findAll();
      const student = yield studentModel_1.default.findAll();
      const noOfStudents = student.length;
      const examsTotal = exams.map((exam) =>
        Object.assign(Object.assign({}, exam.dataValues), { noOfStudents }),
      );
      res.json({ examsTotal });
    } catch (error) {}
  });
exports.getLecturerDashboard = getLecturerDashboard;
const getGradedExams = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { lecturerId, semester } = req.query;
      const checkExamQuestions = yield examModel_1.default.findAll({
        where: { lecturerId },
      });
      const firstSemester = checkExamQuestions.filter(
        (filterBySemester) => filterBySemester.dataValues.semester === semester,
      );
      // eslint-disable-next-line @typescript-eslint/no-floating-promises, @typescript-eslint/no-confusing-void-expression
      yield Promise.all(
        firstSemester.map((eachStudentThatTookExam) =>
          __awaiter(void 0, void 0, void 0, function* () {
            const examId = eachStudentThatTookExam.dataValues.examId;
            return yield gradingModel_1.default
              .findAll({ where: { examId } })
              .then((gradings) =>
                __awaiter(void 0, void 0, void 0, function* () {
                  return yield Promise.all(
                    gradings.map((grading) =>
                      __awaiter(void 0, void 0, void 0, function* () {
                        const studentId = grading.dataValues.studentId;
                        return yield studentModel_1.default
                          .findOne({
                            attributes: ['matricNo'],
                            where: { studentId },
                          })
                          .then((matricNo) => {
                            var _a;
                            const returnedObject = Object.assign(
                              Object.assign({}, grading.dataValues),
                              {
                                matricNo:
                                  (_a =
                                    matricNo === null || matricNo === void 0
                                      ? void 0
                                      : matricNo.dataValues.matricNo) !==
                                    null && _a !== void 0
                                    ? _a
                                    : '',
                              },
                            );
                            return returnedObject;
                          });
                      }),
                    ),
                  );
                }),
              );
          }),
        ),
      )
        .then((response) => {
          const StudentResult = response.flat();
          res.json({ StudentResult });
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {}
  });
exports.getGradedExams = getGradedExams;
