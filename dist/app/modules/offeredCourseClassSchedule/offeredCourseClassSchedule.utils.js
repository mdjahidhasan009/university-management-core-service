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
exports.OfferedCourseClassScheduleUtils = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const utils_1 = require("../../../shared/utils");
const checkRoomAvailable = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const alreadyBookedRoomOnDay = yield prisma_1.default.offeredCourseClassSchedule.findMany({
        where: {
            dayOfWeek: data.dayOfWeek,
            room: {
                id: data.roomId
            }
        }
    });
    const existingSlots = alreadyBookedRoomOnDay.map((schedule) => ({
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        dayOfWeek: schedule.dayOfWeek
    }));
    const newSlot = {
        startTime: data.startTime,
        endTime: data.endTime,
        dayOfWeek: data.dayOfWeek
    };
    if ((0, utils_1.hasTimeConflict)(existingSlots, newSlot)) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "Room is already booked!");
    }
});
const checkFacultyAvailable = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const alreadyFcultyAssigned = yield prisma_1.default.offeredCourseClassSchedule.findMany({
        where: {
            dayOfWeek: data.dayOfWeek,
            faculty: {
                id: data.facultyId
            }
        }
    });
    const existingSlots = alreadyFcultyAssigned.map((schedule) => ({
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        dayOfWeek: schedule.dayOfWeek
    }));
    const newSlot = {
        startTime: data.startTime,
        endTime: data.endTime,
        dayOfWeek: data.dayOfWeek
    };
    if ((0, utils_1.hasTimeConflict)(existingSlots, newSlot)) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "Faculty is already booked!");
    }
});
exports.OfferedCourseClassScheduleUtils = {
    checkRoomAvailable,
    checkFacultyAvailable
};
