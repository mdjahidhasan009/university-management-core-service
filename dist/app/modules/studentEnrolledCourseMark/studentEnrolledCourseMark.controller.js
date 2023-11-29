"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentEnrolledCourseMarkConroller = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const studentEnrolledCourseMark_constants_1 = require("./studentEnrolledCourseMark.constants");
const studentEnrolledCourseMark_service_1 = require("./studentEnrolledCourseMark.service");
const getAllFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, studentEnrolledCourseMark_constants_1.studentEnrolledCourseMarkFilterableFields);
    const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = yield studentEnrolledCourseMark_service_1.StudentEnrolledCourseMarkService.getAllFromDB(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Student course marks fetched successfully',
        meta: result.meta,
        data: result.data
    });
}));
const updateStudentMarks = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield studentEnrolledCourseMark_service_1.StudentEnrolledCourseMarkService.updateStudentMarks(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "marks updated!",
        data: result
    });
}));
const updateFinalMarks = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield studentEnrolledCourseMark_service_1.StudentEnrolledCourseMarkService.updateFinalMarks(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Final marks updated!",
        data: result
    });
}));
const getMyCourseMarks = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, studentEnrolledCourseMark_constants_1.studentEnrolledCourseMarkFilterableFields);
    const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const user = req.user;
    const result = yield studentEnrolledCourseMark_service_1.StudentEnrolledCourseMarkService.getMyCourseMarks(filters, options, user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Student course marks fetched successfully',
        meta: result.meta,
        data: result.data
    });
}));
exports.StudentEnrolledCourseMarkConroller = {
    getAllFromDB,
    updateStudentMarks,
    updateFinalMarks,
    getMyCourseMarks
};
