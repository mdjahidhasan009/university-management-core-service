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
exports.OfferedCourseSectionService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const utils_1 = require("../../../shared/utils");
const offeredCourseClassSchedule_utils_1 = require("../offeredCourseClassSchedule/offeredCourseClassSchedule.utils");
const offeredCourseSection_constants_1 = require("./offeredCourseSection.constants");
const insertIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { classSchedules } = payload, data = __rest(payload, ["classSchedules"]);
    const isExistOfferedCourse = yield prisma_1.default.offeredCourse.findFirst({
        where: {
            id: data.offeredCourseId
        }
    });
    if (!isExistOfferedCourse) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Offered Course does not exist!");
    }
    yield (0, utils_1.asyncForEach)(classSchedules, (schedule) => __awaiter(void 0, void 0, void 0, function* () {
        yield offeredCourseClassSchedule_utils_1.OfferedCourseClassScheduleUtils.checkRoomAvailable(schedule);
        yield offeredCourseClassSchedule_utils_1.OfferedCourseClassScheduleUtils.checkFacultyAvailable(schedule);
    }));
    const offerCourseSectionData = yield prisma_1.default.offeredCourseSection.findFirst({
        where: {
            offeredCourse: {
                id: data.offeredCourseId
            },
            title: data.title
        }
    });
    if (offerCourseSectionData) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Course Section already exists");
    }
    const createSection = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const createOfferedCourseSection = yield transactionClient.offeredCourseSection.create({
            data: {
                title: data.title,
                maxCapacity: data.maxCapacity,
                offeredCourseId: data.offeredCourseId,
                semesterRegistrationId: isExistOfferedCourse.semesterRegistrationId
            }
        });
        const scheduleData = classSchedules.map((schedule) => ({
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            dayOfWeek: schedule.dayOfWeek,
            roomId: schedule.roomId,
            facultyId: schedule.facultyId,
            offeredCourseSectionId: createOfferedCourseSection.id,
            semesterRegistrationId: isExistOfferedCourse.semesterRegistrationId
        }));
        yield transactionClient.offeredCourseClassSchedule.createMany({
            data: scheduleData
        });
        return createOfferedCourseSection;
    }));
    const result = yield prisma_1.default.offeredCourseSection.findFirst({
        where: {
            id: createSection.id
        },
        include: {
            offeredCourse: {
                include: {
                    course: true
                }
            },
            offeredCourseClassSchedules: {
                include: {
                    room: {
                        include: {
                            building: true
                        }
                    },
                    faculty: true
                }
            }
        }
    });
    return result;
});
const getAllFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: offeredCourseSection_constants_1.offeredCourseSectionSearchableFields.map((field) => ({
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
                if (offeredCourseSection_constants_1.offeredCourseSectionRelationalFields.includes(key)) {
                    return {
                        [offeredCourseSection_constants_1.offeredCourseSectionRelationalFieldsMapper[key]]: {
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
    const result = yield prisma_1.default.offeredCourseSection.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {
                createdAt: 'desc'
            },
        include: {
            offeredCourse: {
                include: {
                    course: true
                }
            }
        },
    });
    const total = yield prisma_1.default.offeredCourseSection.count({
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
    const result = yield prisma_1.default.offeredCourseSection.findUnique({
        where: {
            id
        },
        include: {
            offeredCourse: {
                include: {
                    course: true
                }
            }
        }
    });
    return result;
});
const updateOneInDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    //update 
    const result = yield prisma_1.default.offeredCourseSection.update({
        where: {
            id
        },
        data: payload,
        include: {
            offeredCourse: {
                include: {
                    course: true
                }
            }
        }
    });
    return result;
});
const deleteByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.offeredCourseSection.delete({
        where: {
            id
        },
        include: {
            offeredCourse: {
                include: {
                    course: true
                }
            }
        }
    });
    return result;
});
exports.OfferedCourseSectionService = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB
};
