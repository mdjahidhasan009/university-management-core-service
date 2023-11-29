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
exports.studentSemesterRegistrationCourseService = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const enrollIntoCourse = (authUserId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const student = yield prisma_1.default.student.findFirst({
        where: {
            studentId: authUserId
        }
    });
    const semesterRegistration = yield prisma_1.default.semesterRegistration.findFirst({
        where: {
            status: client_1.SemesterRegistrationStatus.ONGOING
        }
    });
    const offeredCourse = yield prisma_1.default.offeredCourse.findFirst({
        where: {
            id: payload.offeredCourseId
        },
        include: {
            course: true
        }
    });
    const offeredCourseSection = yield prisma_1.default.offeredCourseSection.findFirst({
        where: {
            id: payload.offeredCourseSectionId
        }
    });
    if (!student) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Student not found!");
    }
    if (!semesterRegistration) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Semester Registration not found!");
    }
    if (!offeredCourse) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Offered Course not found!");
    }
    if (!offeredCourseSection) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Offered Course Section not found!");
    }
    if (offeredCourseSection.maxCapacity &&
        offeredCourseSection.currentlyEnrolledStudent &&
        offeredCourseSection.currentlyEnrolledStudent >= offeredCourseSection.maxCapacity) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Student capacity is full!");
    }
    yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        yield transactionClient.studentSemesterRegistrationCourse.create({
            data: {
                studentId: student === null || student === void 0 ? void 0 : student.id,
                semesterRegistrationId: semesterRegistration === null || semesterRegistration === void 0 ? void 0 : semesterRegistration.id,
                offeredCourseId: payload.offeredCourseId,
                offeredCourseSectionId: payload.offeredCourseSectionId
            }
        });
        yield transactionClient.offeredCourseSection.update({
            where: {
                id: payload.offeredCourseSectionId
            },
            data: {
                currentlyEnrolledStudent: {
                    increment: 1
                }
            }
        });
        yield transactionClient.studentSemesterRegistration.updateMany({
            where: {
                student: {
                    id: student.id
                },
                semesterRegistration: {
                    id: semesterRegistration.id
                }
            },
            data: {
                totalCreditsTaken: {
                    increment: offeredCourse.course.credits
                }
            }
        });
    }));
    return {
        message: "Successfully enrolled into course"
    };
});
const withdrewFromCourse = (authUserId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const student = yield prisma_1.default.student.findFirst({
        where: {
            studentId: authUserId
        }
    });
    const semesterRegistration = yield prisma_1.default.semesterRegistration.findFirst({
        where: {
            status: client_1.SemesterRegistrationStatus.ONGOING
        }
    });
    const offeredCourse = yield prisma_1.default.offeredCourse.findFirst({
        where: {
            id: payload.offeredCourseId
        },
        include: {
            course: true
        }
    });
    if (!student) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Student not found!");
    }
    if (!semesterRegistration) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Semester Registration not found!");
    }
    if (!offeredCourse) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Offered Course not found!");
    }
    yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        yield transactionClient.studentSemesterRegistrationCourse.delete({
            where: {
                semesterRegistrationId_studentId_offeredCourseId: {
                    semesterRegistrationId: semesterRegistration === null || semesterRegistration === void 0 ? void 0 : semesterRegistration.id,
                    studentId: student === null || student === void 0 ? void 0 : student.id,
                    offeredCourseId: payload.offeredCourseId
                }
            }
        });
        yield transactionClient.offeredCourseSection.update({
            where: {
                id: payload.offeredCourseSectionId
            },
            data: {
                currentlyEnrolledStudent: {
                    decrement: 1
                }
            }
        });
        yield transactionClient.studentSemesterRegistration.updateMany({
            where: {
                student: {
                    id: student.id
                },
                semesterRegistration: {
                    id: semesterRegistration.id
                }
            },
            data: {
                totalCreditsTaken: {
                    decrement: offeredCourse.course.credits
                }
            }
        });
    }));
    return {
        message: "Successfully withdraw from course"
    };
});
exports.studentSemesterRegistrationCourseService = {
    enrollIntoCourse,
    withdrewFromCourse
};
