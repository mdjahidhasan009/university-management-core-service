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
exports.StudentEnrolledCourseService = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const studentEnrolledCourse_constants_1 = require("./studentEnrolledCourse.constants");
const insertIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Use Prisma to find the first record in the 'studentEnrolledCourse' table that matches certain conditions.
    const isCourseOngoingOrCompleted = yield prisma_1.default.studentEnrolledCourse.findFirst({
        where: {
            OR: [
                // Check if the 'status' property of the record is equal to 'ONGOING'.
                {
                    status: client_1.StudentEnrolledCourseStatus.ONGOING
                },
                // Check if the 'status' property of the record is equal to 'COMPLETED'.
                {
                    status: client_1.StudentEnrolledCourseStatus.COMPLETED
                }
            ]
        }
    });
    // If there is a course that is ongoing or completed, throw an error with a specific message.
    if (isCourseOngoingOrCompleted) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `There is already an ${(_a = isCourseOngoingOrCompleted.status) === null || _a === void 0 ? void 0 : _a.toLowerCase()} registration`);
    }
    // Use Prisma to create a new record in the 'studentEnrolledCourse' table with the provided 'data'.
    // Include related data from the 'academicSemester', 'student', and 'course' tables in the result.
    const result = yield prisma_1.default.studentEnrolledCourse.create({
        data,
        include: {
            academicSemester: true,
            student: true,
            course: true
        }
    });
    return result;
});
const getAllFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    if (!filterData.academicSemesterId) {
        const currentAcademicSemester = yield prisma_1.default.academicSemester.findFirst({
            where: {
                isCurrent: true
            }
        });
        if (currentAcademicSemester) {
            filterData.academicSemesterId = currentAcademicSemester.id;
        }
    }
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: studentEnrolledCourse_constants_1.studentEnrolledCourseSearchableFields.map((field) => ({
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
                if (studentEnrolledCourse_constants_1.studentEnrolledCourseRelationalFields.includes(key)) {
                    return {
                        [studentEnrolledCourse_constants_1.studentEnrolledCourseRelationalFieldsMapper[key]]: {
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
    const result = yield prisma_1.default.studentEnrolledCourse.findMany({
        include: {
            academicSemester: true,
            student: true,
            course: true
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
    const total = yield prisma_1.default.studentEnrolledCourse.count({
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
    const result = yield prisma_1.default.studentEnrolledCourse.findUnique({
        where: {
            id
        },
        include: {
            academicSemester: true,
            student: true,
            course: true
        }
    });
    return result;
});
const updateOneInDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.studentEnrolledCourse.update({
        where: {
            id
        },
        data: payload,
        include: {
            academicSemester: true,
            student: true,
            course: true
        }
    });
    return result;
});
const deleteByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.studentEnrolledCourse.delete({
        where: {
            id
        },
        include: {
            academicSemester: true,
            student: true,
            course: true
        }
    });
    return result;
});
exports.StudentEnrolledCourseService = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB
};
