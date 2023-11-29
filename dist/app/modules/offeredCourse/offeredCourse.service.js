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
exports.offeredCourseService = void 0;
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const utils_1 = require("../../../shared/utils");
const offeredCourse_constants_1 = require("./offeredCourse.constants");
const insertIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { academicDepartmentId, semesterRegistrationId, courseIds } = data;
    const result = [];
    yield (0, utils_1.asyncForEach)(courseIds, (courseId) => __awaiter(void 0, void 0, void 0, function* () {
        const alreadyExist = yield prisma_1.default.offeredCourse.findFirst({
            where: {
                academicDepartmentId,
                semesterRegistrationId,
                courseId
            }
        });
        if (!alreadyExist) {
            const insertOfferedCourse = yield prisma_1.default.offeredCourse.create({
                data: {
                    academicDepartmentId,
                    semesterRegistrationId,
                    courseId
                },
                include: {
                    academicDepartment: true,
                    semesterRegistration: true,
                    course: true
                }
            });
            result.push(insertOfferedCourse);
        }
    }));
    return result;
});
const getAllFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: offeredCourse_constants_1.offeredCourseSearchableFields.map((field) => ({
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
                if (offeredCourse_constants_1.offeredCourseRelationalFields.includes(key)) {
                    return {
                        [offeredCourse_constants_1.offeredCourseRelationalFieldsMapper[key]]: {
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
    const result = yield prisma_1.default.offeredCourse.findMany({
        include: {
            semesterRegistration: true,
            course: true,
            academicDepartment: true
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
    const total = yield prisma_1.default.offeredCourse.count({
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
    const result = yield prisma_1.default.offeredCourse.findUnique({
        where: {
            id
        },
        include: {
            semesterRegistration: true,
            course: true,
            academicDepartment: true
        }
    });
    return result;
});
const updateOneInDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.offeredCourse.update({
        where: {
            id
        },
        data: payload,
        include: {
            semesterRegistration: true,
            course: true,
            academicDepartment: true
        }
    });
    return result;
});
const deleteByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.offeredCourse.delete({
        where: {
            id
        },
        include: {
            semesterRegistration: true,
            course: true,
            academicDepartment: true
        }
    });
    return result;
});
exports.offeredCourseService = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB
};
