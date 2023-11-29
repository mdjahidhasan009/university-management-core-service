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
exports.CourseService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const utils_1 = require("../../../shared/utils");
const course_constants_1 = require("./course.constants");
const insertIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { preRequisiteCourses } = data, courseData = __rest(data, ["preRequisiteCourses"]);
    console.log("course data", courseData);
    console.log("pre requisite course data: ", preRequisiteCourses);
    const newCourse = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield transactionClient.course.create({
            data: courseData
        });
        if (!result) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Unable to create course");
        }
        if (preRequisiteCourses && preRequisiteCourses.length > 0) {
            yield (0, utils_1.asyncForEach)(preRequisiteCourses, (preRequisiteCourse) => __awaiter(void 0, void 0, void 0, function* () {
                const createPrerequisite = yield transactionClient.courseToPrerequisite.create({
                    data: {
                        courseId: result.id,
                        preRequisiteId: preRequisiteCourse.courseId
                    }
                });
                console.log(createPrerequisite);
            }));
        }
        return result;
    }));
    if (newCourse) {
        const responseData = yield prisma_1.default.course.findUnique({
            where: {
                id: newCourse.id
            },
            include: {
                preRequisite: {
                    include: {
                        preRequisite: true
                    }
                },
                preRequisiteFor: {
                    include: {
                        course: true
                    }
                }
            }
        });
        return responseData;
    }
    throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Unable to create course");
});
const getAllFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: course_constants_1.courseSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.course.findMany({
        include: {
            preRequisite: {
                include: {
                    preRequisite: true
                }
            },
            preRequisiteFor: {
                include: {
                    course: true
                }
            }
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
    const total = yield prisma_1.default.course.count({
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
    const result = yield prisma_1.default.course.findUnique({
        where: {
            id
        },
        include: {
            preRequisite: {
                include: {
                    preRequisite: true
                }
            },
            preRequisiteFor: {
                include: {
                    course: true
                }
            }
        }
    });
    return result;
});
const updateOneInDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { preRequisiteCourses } = payload, courseData = __rest(payload, ["preRequisiteCourses"]);
    yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield transactionClient.course.update({
            where: {
                id
            },
            data: courseData
        });
        if (!result) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Unable to update course");
        }
        if (preRequisiteCourses && preRequisiteCourses.length > 0) {
            const deletePrerequisite = preRequisiteCourses.filter((coursePrerequisite) => coursePrerequisite.courseId && coursePrerequisite.isDeleted);
            const newPrerequisite = preRequisiteCourses.filter((coursePrerequisite) => coursePrerequisite.courseId && !coursePrerequisite.isDeleted);
            yield (0, utils_1.asyncForEach)(deletePrerequisite, (deletePreCourse) => __awaiter(void 0, void 0, void 0, function* () {
                yield transactionClient.courseToPrerequisite.deleteMany({
                    where: {
                        AND: [
                            {
                                courseId: id
                            },
                            {
                                preRequisiteId: deletePreCourse.courseId
                            }
                        ]
                    }
                });
            }));
            yield (0, utils_1.asyncForEach)(newPrerequisite, (insertPrerequisite) => __awaiter(void 0, void 0, void 0, function* () {
                yield transactionClient.courseToPrerequisite.create({
                    data: {
                        courseId: id,
                        preRequisiteId: insertPrerequisite.courseId
                    }
                });
            }));
        }
        return result;
    }));
    const responseData = yield prisma_1.default.course.findUnique({
        where: {
            id
        },
        include: {
            preRequisite: {
                include: {
                    preRequisite: true
                }
            },
            preRequisiteFor: {
                include: {
                    course: true
                }
            }
        }
    });
    return responseData;
});
const deleteByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.courseToPrerequisite.deleteMany({
        where: {
            OR: [
                {
                    courseId: id
                },
                {
                    preRequisiteId: id
                }
            ]
        }
    });
    const result = yield prisma_1.default.course.delete({
        where: {
            id
        }
    });
    return result;
});
const assignFaculies = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.courseFaculty.createMany({
        data: payload.map((facultyId) => ({
            courseId: id,
            facultyId: facultyId
        }))
    });
    const assignFacultiesData = yield prisma_1.default.courseFaculty.findMany({
        where: {
            courseId: id
        },
        include: {
            faculty: true
        }
    });
    return assignFacultiesData;
});
const removeFaculties = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.courseFaculty.deleteMany({
        where: {
            courseId: id,
            facultyId: {
                in: payload
            }
        }
    });
    const assignFacultiesData = yield prisma_1.default.courseFaculty.findMany({
        where: {
            courseId: id
        },
        include: {
            faculty: true
        }
    });
    return assignFacultiesData;
});
exports.CourseService = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    deleteByIdFromDB,
    updateOneInDB,
    assignFaculies,
    removeFaculties
};
