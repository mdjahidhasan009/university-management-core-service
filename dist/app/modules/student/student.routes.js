"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const student_controller_1 = require("./student.controller");
const student_validations_1 = require("./student.validations");
const router = express_1.default.Router();
router.get('/', student_controller_1.StudentController.getAllFromDB);
router.get('/my-courses', (0, auth_1.default)(user_1.ENUM_USER_ROLE.STUDENT), student_controller_1.StudentController.myCourses);
router.get('/my-course-schedules', (0, auth_1.default)(user_1.ENUM_USER_ROLE.STUDENT), student_controller_1.StudentController.getMyCourseSchedules);
router.get('/my-academic-info', (0, auth_1.default)(user_1.ENUM_USER_ROLE.STUDENT), student_controller_1.StudentController.myAcademicInfo);
router.get('/:id', student_controller_1.StudentController.getByIdFromDB);
router.post('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(student_validations_1.StudentValidation.create), student_controller_1.StudentController.insertIntoDB);
router.patch('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(student_validations_1.StudentValidation.update), student_controller_1.StudentController.updateIntoDB);
router.delete('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), student_controller_1.StudentController.deleteFromDB);
exports.studentRoutes = router;
