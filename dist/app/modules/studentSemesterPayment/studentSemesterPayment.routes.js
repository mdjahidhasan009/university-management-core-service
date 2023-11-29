"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentSemesterPaymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const studentSemesterPayment_controller_1 = require("./studentSemesterPayment.controller");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.FACULTY), studentSemesterPayment_controller_1.StudentSemesterPaymentController.getAllFromDB);
router.get('/my-semester-payments', (0, auth_1.default)(user_1.ENUM_USER_ROLE.STUDENT), studentSemesterPayment_controller_1.StudentSemesterPaymentController.getMySemesterPayments);
router.post('/initiate-payment', (0, auth_1.default)(user_1.ENUM_USER_ROLE.STUDENT), studentSemesterPayment_controller_1.StudentSemesterPaymentController.initiatePayment);
router.post('/complete-payment', (0, auth_1.default)(user_1.ENUM_USER_ROLE.STUDENT), studentSemesterPayment_controller_1.StudentSemesterPaymentController.completePayment);
exports.studentSemesterPaymentRoutes = router;
