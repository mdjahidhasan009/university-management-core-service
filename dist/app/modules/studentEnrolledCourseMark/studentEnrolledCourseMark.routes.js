"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentEnrolledCourseMarkRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const studentEnrolledCourseMark_controller_1 = require("./studentEnrolledCourseMark.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const studentEnrolledCourseMark_validations_1 = require("./studentEnrolledCourseMark.validations");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.FACULTY), studentEnrolledCourseMark_controller_1.StudentEnrolledCourseMarkConroller.getAllFromDB);
router.get('/my-marks', (0, auth_1.default)(user_1.ENUM_USER_ROLE.STUDENT), studentEnrolledCourseMark_controller_1.StudentEnrolledCourseMarkConroller.getMyCourseMarks);
router.post('/update-marks', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.FACULTY), (0, validateRequest_1.default)(studentEnrolledCourseMark_validations_1.StudentEnrolledCourseMarkValidation.updateStudentMarks), studentEnrolledCourseMark_controller_1.StudentEnrolledCourseMarkConroller.updateStudentMarks);
router.post('/update-final-marks', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.FACULTY), (0, validateRequest_1.default)(studentEnrolledCourseMark_validations_1.StudentEnrolledCourseMarkValidation.updateStudentCourseFinalMarks), studentEnrolledCourseMark_controller_1.StudentEnrolledCourseMarkConroller.updateFinalMarks);
exports.studentEnrolledCourseMarkRoutes = router;
