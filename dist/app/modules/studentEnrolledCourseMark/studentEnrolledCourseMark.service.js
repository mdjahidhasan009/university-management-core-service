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
exports.StudentEnrolledCourseMarkService = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const studentEnrolledCousreMark_utils_1 = require("./studentEnrolledCousreMark.utils");
const createStudentEnrolledCourseDefaultMark = (prismaClient, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExitMidtermData = yield prismaClient.studentEnrolledCourseMark.findFirst({
        where: {
            examType: client_1.ExamType.MIDTERM,
            student: {
                id: payload.studentId
            },
            studentEnrolledCourse: {
                id: payload.studentEnrolledCourseId
            },
            academicSemester: {
                id: payload.academicSemesterId
            }
        }
    });
    if (!isExitMidtermData) {
        yield prismaClient.studentEnrolledCourseMark.create({
            data: {
                student: {
                    connect: {
                        id: payload.studentId
                    }
                },
                studentEnrolledCourse: {
                    connect: {
                        id: payload.studentEnrolledCourseId
                    }
                },
                academicSemester: {
                    connect: {
                        id: payload.academicSemesterId
                    }
                },
                examType: client_1.ExamType.MIDTERM
            }
        });
    }
    const isExistFinalData = yield prismaClient.studentEnrolledCourseMark.findFirst({
        where: {
            examType: client_1.ExamType.FINAL,
            student: {
                id: payload.studentId
            },
            studentEnrolledCourse: {
                id: payload.studentEnrolledCourseId
            },
            academicSemester: {
                id: payload.academicSemesterId
            }
        }
    });
    if (!isExistFinalData) {
        yield prismaClient.studentEnrolledCourseMark.create({
            data: {
                student: {
                    connect: {
                        id: payload.studentId
                    }
                },
                studentEnrolledCourse: {
                    connect: {
                        id: payload.studentEnrolledCourseId
                    }
                },
                academicSemester: {
                    connect: {
                        id: payload.academicSemesterId
                    }
                },
                examType: client_1.ExamType.FINAL
            }
        });
    }
});
const getAllFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const marks = yield prisma_1.default.studentEnrolledCourseMark.findMany({
        where: {
            student: {
                id: filters.studentId
            },
            academicSemester: {
                id: filters.academicSemesterId
            },
            studentEnrolledCourse: {
                course: {
                    id: filters.courseId
                }
            }
        },
        include: {
            studentEnrolledCourse: {
                include: {
                    course: true
                }
            },
            student: true
        }
    });
    return {
        meta: {
            total: marks.length,
            page,
            limit
        },
        data: marks
    };
});
const updateStudentMarks = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(payload);
    const { studentId, academicSemesterId, courseId, examType, marks } = payload;
    const studentEnrolledCourseMarks = yield prisma_1.default.studentEnrolledCourseMark.findFirst({
        where: {
            student: {
                id: studentId
            },
            academicSemester: {
                id: academicSemesterId
            },
            studentEnrolledCourse: {
                course: {
                    id: courseId
                }
            },
            examType
        }
    });
    if (!studentEnrolledCourseMarks) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Student enrolled course mark not found!");
    }
    const result = studentEnrolledCousreMark_utils_1.StudentEnrolledCourseMarkUtils.getGradeFromMarks(marks);
    const updateStudentMarks = yield prisma_1.default.studentEnrolledCourseMark.update({
        where: {
            id: studentEnrolledCourseMarks.id
        },
        data: {
            marks,
            grade: result.grade
        }
    });
    return updateStudentMarks;
});
const updateFinalMarks = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { studentId, academicSemesterId, courseId } = payload;
    const studentEnrolledCourse = yield prisma_1.default.studentEnrolledCourse.findFirst({
        where: {
            student: {
                id: studentId
            },
            academicSemester: {
                id: academicSemesterId
            },
            course: {
                id: courseId
            }
        }
    });
    if (!studentEnrolledCourse) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Student enrolled course data not found!");
    }
    //console.log(studentEnrolledCourse)
    const studentEnrolledCourseMarks = yield prisma_1.default.studentEnrolledCourseMark.findMany({
        where: {
            student: {
                id: studentId
            },
            academicSemester: {
                id: academicSemesterId
            },
            studentEnrolledCourse: {
                course: {
                    id: courseId
                }
            }
        }
    });
    //console.log(studentEnrolledCourseMarks)
    if (!studentEnrolledCourseMarks.length) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "student enrolled course mark not found!");
    }
    const midTermMarks = ((_a = studentEnrolledCourseMarks.find((item) => item.examType === client_1.ExamType.MIDTERM)) === null || _a === void 0 ? void 0 : _a.marks) || 0;
    const finalTermMarks = ((_b = studentEnrolledCourseMarks.find((item) => item.examType === client_1.ExamType.FINAL)) === null || _b === void 0 ? void 0 : _b.marks) || 0;
    //console.log(midTermMarks, finalTermMarks)
    const totalFinalMarks = Math.ceil(midTermMarks * 0.4) + Math.ceil(finalTermMarks * 0.6);
    const result = studentEnrolledCousreMark_utils_1.StudentEnrolledCourseMarkUtils.getGradeFromMarks(totalFinalMarks);
    yield prisma_1.default.studentEnrolledCourse.updateMany({
        where: {
            student: {
                id: studentId
            },
            academicSemester: {
                id: academicSemesterId
            },
            course: {
                id: courseId
            }
        },
        data: {
            grade: result.grade,
            point: result.point,
            totalMarks: totalFinalMarks,
            status: client_1.StudentEnrolledCourseStatus.COMPLETED
        }
    });
    const grades = yield prisma_1.default.studentEnrolledCourse.findMany({
        where: {
            student: {
                id: studentId
            },
            status: client_1.StudentEnrolledCourseStatus.COMPLETED
        },
        include: {
            course: true
        }
    });
    const academicResult = yield studentEnrolledCousreMark_utils_1.StudentEnrolledCourseMarkUtils.calcCGPAandGrade(grades);
    const studentAcademicInfo = yield prisma_1.default.studentAcademicInfo.findFirst({
        where: {
            student: {
                id: studentId
            }
        }
    });
    if (studentAcademicInfo) {
        yield prisma_1.default.studentAcademicInfo.update({
            where: {
                id: studentAcademicInfo.id
            },
            data: {
                totalCompletedCredit: academicResult.totalCompletedCredit,
                cgpa: academicResult.cgpa
            }
        });
    }
    else {
        yield prisma_1.default.studentAcademicInfo.create({
            data: {
                student: {
                    connect: {
                        id: studentId
                    }
                },
                totalCompletedCredit: academicResult.totalCompletedCredit,
                cgpa: academicResult.cgpa
            }
        });
    }
    return grades;
});
const getMyCourseMarks = (filters, options, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const student = yield prisma_1.default.student.findFirst({
        where: {
            studentId: authUser.id
        }
    });
    if (!student) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Student not found');
    }
    const marks = yield prisma_1.default.studentEnrolledCourseMark.findMany({
        where: {
            student: {
                id: student.id
            },
            academicSemester: {
                id: filters.academicSemesterId
            },
            studentEnrolledCourse: {
                course: {
                    id: filters.courseId
                }
            }
        },
        include: {
            studentEnrolledCourse: {
                include: {
                    course: true
                }
            }
        }
    });
    return {
        meta: {
            total: marks.length,
            page,
            limit
        },
        data: marks
    };
});
exports.StudentEnrolledCourseMarkService = {
    createStudentEnrolledCourseDefaultMark,
    getAllFromDB,
    updateStudentMarks,
    updateFinalMarks,
    getMyCourseMarks
};
