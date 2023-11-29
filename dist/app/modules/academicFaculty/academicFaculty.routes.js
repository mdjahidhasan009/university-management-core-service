"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.academicFacultyRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const academicFaculty_contoller_1 = require("./academicFaculty.contoller");
const academicFaculty_validation_1 = require("./academicFaculty.validation");
const router = express_1.default.Router();
router.get('/', academicFaculty_contoller_1.AcademicFacultyController.getAllFromDB);
router.get('/:id', academicFaculty_contoller_1.AcademicFacultyController.getByIdFromDB);
router.post('/', (0, validateRequest_1.default)(academicFaculty_validation_1.AcademicFacultyValidation.create), (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), academicFaculty_contoller_1.AcademicFacultyController.insertIntoDB);
router.patch('/:id', (0, validateRequest_1.default)(academicFaculty_validation_1.AcademicFacultyValidation.update), (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), academicFaculty_contoller_1.AcademicFacultyController.updateOneInDB);
router.delete('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), academicFaculty_contoller_1.AcademicFacultyController.deleteByIdFromDB);
exports.academicFacultyRoutes = router;
