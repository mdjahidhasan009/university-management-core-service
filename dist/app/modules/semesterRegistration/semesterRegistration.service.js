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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemesterRegistrationService = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const utils_1 = require("../../../shared/utils");
const studentEnrolledCourseMark_service_1 = require("../studentEnrolledCourseMark/studentEnrolledCourseMark.service");
const studentSemesterPayment_service_1 = require("../studentSemesterPayment/studentSemesterPayment.service");
const studentSemesterRegistrationCourse_service_1 = require("../studentSemesterRegistrationCourse/studentSemesterRegistrationCourse.service");
const semesterRegistration_constants_1 = require("./semesterRegistration.constants");
const semesterRegistration_utils_1 = require("./semesterRegistration.utils");
const insertIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const isAnySemesterRegUpcomingOrOngoing = yield prisma_1.default.semesterRegistration.findFirst({
        where: {
            OR: [
                {
                    status: client_1.SemesterRegistrationStatus.UPCOMING
                },
                {
                    status: client_1.SemesterRegistrationStatus.ONGOING
                }
            ]
        }
    });
    if (isAnySemesterRegUpcomingOrOngoing) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Thers is already an ${isAnySemesterRegUpcomingOrOngoing.status} registration.`);
    }
    const result = yield prisma_1.default.semesterRegistration.create({
        data
    });
    return result;
});
const getAllFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: semesterRegistration_constants_1.semesterRegistrationSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => {
                if (semesterRegistration_constants_1.semesterRegistrationRelationalFields.includes(key)) {
                    return {
                        [semesterRegistration_constants_1.semesterRegistrationRelationalFieldsMapper[key]]: {
                            id: filterData[key]
                        }
                    };
                }
                else {
                    return {
                        [key]: {
                            equals: filterData[key]
                        }
                    };
                }
            })
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.semesterRegistration.findMany({
        include: {
            academicSemester: true
        },
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {
                createdAt: 'desc'
            }
    });
    const total = yield prisma_1.default.semesterRegistration.count({
        where: whereConditions
    });
    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    };
});
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.semesterRegistration.findUnique({
        where: {
            id
        },
        include: {
            academicSemester: true
        }
    });
    return result;
});
// UPCOMING > ONGOING  > ENDED
const updateOneInDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(payload.status);
    const isExist = yield prisma_1.default.semesterRegistration.findUnique({
        where: {
            id
        }
    });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Data not found!");
    }
    if (payload.status && isExist.status === client_1.SemesterRegistrationStatus.UPCOMING && payload.status !== client_1.SemesterRegistrationStatus.ONGOING) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Can only move from UPCOMING to ONGOING");
    }
    if (payload.status && isExist.status === client_1.SemesterRegistrationStatus.ONGOING && payload.status !== client_1.SemesterRegistrationStatus.ENDED) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Can only move from ONGOING to ENDED");
    }
    const result = yield prisma_1.default.semesterRegistration.update({
        where: {
            id
        },
        data: payload,
        include: {
            academicSemester: true
        }
    });
    return result;
});
const deleteByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.semesterRegistration.delete({
        where: {
            id
        },
        include: {
            academicSemester: true
        }
    });
    return result;
});
const startMyRegistration = (authUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const studentInfo = yield prisma_1.default.student.findFirst({
        where: {
            studentId: authUserId
        }
    });
    if (!studentInfo) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Student Info not found!");
    }
    const semesterRegistrationInfo = yield prisma_1.default.semesterRegistration.findFirst({
        where: {
            status: {
                in: [client_1.SemesterRegistrationStatus.ONGOING, client_1.SemesterRegistrationStatus.UPCOMING]
            }
        }
    });
    if ((semesterRegistrationInfo === null || semesterRegistrationInfo === void 0 ? void 0 : semesterRegistrationInfo.status) === client_1.SemesterRegistrationStatus.UPCOMING) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Registration is not started yet");
    }
    let studentRegistration = yield prisma_1.default.studentSemesterRegistration.findFirst({
        where: {
            student: {
                id: studentInfo === null || studentInfo === void 0 ? void 0 : studentInfo.id
            },
            semesterRegistration: {
                id: semesterRegistrationInfo === null || semesterRegistrationInfo === void 0 ? void 0 : semesterRegistrationInfo.id
            }
        }
    });
    if (!studentRegistration) {
        studentRegistration = yield prisma_1.default.studentSemesterRegistration.create({
            data: {
                student: {
                    connect: {
                        id: studentInfo === null || studentInfo === void 0 ? void 0 : studentInfo.id
                    }
                },
                semesterRegistration: {
                    connect: {
                        id: semesterRegistrationInfo === null || semesterRegistrationInfo === void 0 ? void 0 : semesterRegistrationInfo.id
                    }
                }
            }
        });
    }
    return {
        semesterRegistration: semesterRegistrationInfo,
        studentSemesterRegistration: studentRegistration
    };
});
const enrollIntoCourse = (authUserId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return studentSemesterRegistrationCourse_service_1.studentSemesterRegistrationCourseService.enrollIntoCourse(authUserId, payload);
});
const withdrewFromCourse = (authUserId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return studentSemesterRegistrationCourse_service_1.studentSemesterRegistrationCourseService.withdrewFromCourse(authUserId, payload);
});
const confirmMyRegistration = (authUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const semesterRegistration = yield prisma_1.default.semesterRegistration.findFirst({
        where: {
            status: client_1.SemesterRegistrationStatus.ONGOING
        }
    });
    // 3 - 6
    const studentSemesterRegistration = yield prisma_1.default.studentSemesterRegistration.findFirst({
        where: {
            semesterRegistration: {
                id: semesterRegistration === null || semesterRegistration === void 0 ? void 0 : semesterRegistration.id
            },
            student: {
                studentId: authUserId
            }
        }
    });
    if (!studentSemesterRegistration) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "You are not recognized for this semester!");
    }
    if (studentSemesterRegistration.totalCreditsTaken === 0) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "You are not enrolled in any course!");
    }
    if (studentSemesterRegistration.totalCreditsTaken &&
        (semesterRegistration === null || semesterRegistration === void 0 ? void 0 : semesterRegistration.minCredit) &&
        semesterRegistration.maxCredit &&
        (studentSemesterRegistration.totalCreditsTaken < (semesterRegistration === null || semesterRegistration === void 0 ? void 0 : semesterRegistration.minCredit) ||
            studentSemesterRegistration.totalCreditsTaken > (semesterRegistration === null || semesterRegistration === void 0 ? void 0 : semesterRegistration.maxCredit))) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `You can take only ${semesterRegistration.minCredit} to ${semesterRegistration.maxCredit} credits`);
    }
    yield prisma_1.default.studentSemesterRegistration.update({
        where: {
            id: studentSemesterRegistration.id
        },
        data: {
            isConfirmed: true
        }
    });
    return {
        message: "Your registration is confirmed!"
    };
});
const getMyRegistration = (authUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const semesterRegistration = yield prisma_1.default.semesterRegistration.findFirst({
        where: {
            status: client_1.SemesterRegistrationStatus.ONGOING
        },
        include: {
            academicSemester: true
        }
    });
    const studentSemesterRegistration = yield prisma_1.default.studentSemesterRegistration.findFirst({
        where: {
            semesterRegistration: {
                id: semesterRegistration === null || semesterRegistration === void 0 ? void 0 : semesterRegistration.id
            },
            student: {
                studentId: authUserId
            }
        },
        include: {
            student: true
        }
    });
    return { semesterRegistration, studentSemesterRegistration };
});
const startNewSemester = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const semesterRegistration = yield prisma_1.default.semesterRegistration.findUnique({
        where: {
            id
        },
        include: {
            academicSemester: true
        }
    });
    if (!semesterRegistration) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Semester Registration Not found!");
    }
    if (semesterRegistration.status !== client_1.SemesterRegistrationStatus.ENDED) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Semester Registration is not ended yet!");
    }
    if (semesterRegistration.academicSemester.isCurrent) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Semester is already started!");
    }
    yield prisma_1.default.$transaction((prismaTransactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        yield prismaTransactionClient.academicSemester.updateMany({
            where: {
                isCurrent: true
            },
            data: {
                isCurrent: false
            }
        });
        yield prismaTransactionClient.academicSemester.update({
            where: {
                id: semesterRegistration.academicSemesterId
            },
            data: {
                isCurrent: true
            }
        });
        const studentSemesterRegistrations = yield prisma_1.default.studentSemesterRegistration.findMany({
            where: {
                semesterRegistration: {
                    id
                },
                isConfirmed: true
            }
        });
        yield (0, utils_1.asyncForEach)(studentSemesterRegistrations, (studentSemReg) => __awaiter(void 0, void 0, void 0, function* () {
            if (studentSemReg.totalCreditsTaken) {
                const totalSemesterPaymentAmount = studentSemReg.totalCreditsTaken * 5000;
                yield studentSemesterPayment_service_1.StudentSemesterPaymentService.createSemesterPayment(prismaTransactionClient, {
                    studentId: studentSemReg.studentId,
                    academicSemesterId: semesterRegistration.academicSemesterId,
                    totalPaymentAmount: totalSemesterPaymentAmount
                });
            }
            const studentSemesterRegistrationCourses = yield prismaTransactionClient.studentSemesterRegistrationCourse.findMany({
                where: {
                    semesterRegistration: {
                        id
                    },
                    student: {
                        id: studentSemReg.studentId
                    }
                },
                include: {
                    offeredCourse: {
                        include: {
                            course: true
                        }
                    }
                }
            });
            yield (0, utils_1.asyncForEach)(studentSemesterRegistrationCourses, (item) => __awaiter(void 0, void 0, void 0, function* () {
                const isExistEnrolledData = yield prismaTransactionClient.studentEnrolledCourse.findFirst({
                    where: {
                        student: { id: item.studentId },
                        course: { id: item.offeredCourse.courseId },
                        academicSemester: { id: semesterRegistration.academicSemesterId }
                    }
                });
                if (!isExistEnrolledData) {
                    const enrolledCourseData = {
                        studentId: item.studentId,
                        courseId: item.offeredCourse.courseId,
                        academicSemesterId: semesterRegistration.academicSemesterId
                    };
                    const studentEnrolledCourseData = yield prismaTransactionClient.studentEnrolledCourse.create({
                        data: enrolledCourseData
                    });
                    yield studentEnrolledCourseMark_service_1.StudentEnrolledCourseMarkService.createStudentEnrolledCourseDefaultMark(prismaTransactionClient, {
                        studentId: item.studentId,
                        studentEnrolledCourseId: studentEnrolledCourseData.id,
                        academicSemesterId: semesterRegistration.academicSemesterId
                    });
                }
            }));
        }));
    }));
    return {
        message: "Semester started successfully!"
    };
});
const getMySemesterRegCourses = (authUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const student = yield prisma_1.default.student.findFirst({
        where: {
            studentId: authUserId
        }
    });
    //console.log(student);
    const semesterRegistration = yield prisma_1.default.semesterRegistration.findFirst({
        where: {
            status: {
                in: [client_1.SemesterRegistrationStatus.UPCOMING, client_1.SemesterRegistrationStatus.ONGOING]
            }
        },
        include: {
            academicSemester: true
        }
    });
    if (!semesterRegistration) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "No semester registration not found!");
    }
    const studentCompletedCourse = yield prisma_1.default.studentEnrolledCourse.findMany({
        where: {
            status: client_1.StudentEnrolledCourseStatus.COMPLETED,
            student: {
                id: student === null || student === void 0 ? void 0 : student.id
            }
        },
        include: {
            course: true
        }
    });
    const studentCurrentSemesterTakenCourse = yield prisma_1.default.studentSemesterRegistrationCourse.findMany({
        where: {
            student: {
                id: student === null || student === void 0 ? void 0 : student.id
            },
            semesterRegistration: {
                id: semesterRegistration === null || semesterRegistration === void 0 ? void 0 : semesterRegistration.id
            }
        },
        include: {
            offeredCourse: true,
            offeredCourseSection: true
        }
    });
    // console.log(studentCurrentSemesterTakenCourse)
    const offeredCourse = yield prisma_1.default.offeredCourse.findMany({
        where: {
            semesterRegistration: {
                id: semesterRegistration.id
            },
            academicDepartment: {
                id: student === null || student === void 0 ? void 0 : student.academicDepartmentId
            }
        },
        include: {
            course: {
                include: {
                    preRequisite: {
                        include: {
                            preRequisite: true
                        }
                    }
                }
            },
            offeredCourseSections: {
                include: {
                    offeredCourseClassSchedules: {
                        include: {
                            room: {
                                include: {
                                    building: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    //console.log("Offered course: ", offeredCourse)
    const availableCourses = semesterRegistration_utils_1.SemesterRegistrationUtils.getAvailableCourses(offeredCourse, studentCompletedCourse, studentCurrentSemesterTakenCourse);
    return availableCourses;
});
exports.SemesterRegistrationService = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB,
    startMyRegistration,
    enrollIntoCourse,
    withdrewFromCourse,
    confirmMyRegistration,
    getMyRegistration,
    startNewSemester,
    getMySemesterRegCourses
};
