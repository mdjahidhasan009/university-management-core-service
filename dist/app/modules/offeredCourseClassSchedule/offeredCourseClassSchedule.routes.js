"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.offeredCourseClassScheduleRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const offeredCourseClassSchedule_controller_1 = require("./offeredCourseClassSchedule.controller");
const offeredCourseClassSchedule_validations_1 = require("./offeredCourseClassSchedule.validations");
const router = express_1.default.Router();
router.get('/', offeredCourseClassSchedule_controller_1.OfferedCourseClassScheduleController.getAllFromDB);
router.get('/:id', offeredCourseClassSchedule_controller_1.OfferedCourseClassScheduleController.getByIdFromDB);
router.post('/', (0, validateRequest_1.default)(offeredCourseClassSchedule_validations_1.OfferedCourseClassScheduleValidation.create), (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), offeredCourseClassSchedule_controller_1.OfferedCourseClassScheduleController.insertIntoDB);
router.patch('/:id', (0, validateRequest_1.default)(offeredCourseClassSchedule_validations_1.OfferedCourseClassScheduleValidation.update), (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), offeredCourseClassSchedule_controller_1.OfferedCourseClassScheduleController.updateOneInDB);
router.delete('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), offeredCourseClassSchedule_controller_1.OfferedCourseClassScheduleController.deleteByIdFromDB);
exports.offeredCourseClassScheduleRoutes = router;
