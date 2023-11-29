"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferedCourseClassScheduleValidation = void 0;
const zod_1 = require("zod");
const offeredCourseSection_constants_1 = require("../offeredCourseSection/offeredCourseSection.constants");
const timeStringSchema = zod_1.z.string().refine((time) => {
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    // example: 09:45, 21:30
    return regex.test(time);
}, {
    message: "Invalid time format, expected 'HH:MM' in 24-hour format"
});
const create = zod_1.z
    .object({
    body: zod_1.z.object({
        dayOfWeek: zod_1.z.enum([...offeredCourseSection_constants_1.daysInWeek], {
            required_error: 'Day of week is required'
        }),
        startTime: timeStringSchema,
        endTime: timeStringSchema,
        roomId: zod_1.z.string({
            required_error: 'Room id is required'
        }),
        facultyId: zod_1.z.string({
            required_error: 'Faculty id is required'
        }),
        offeredCourseSectionId: zod_1.z.string({
            required_error: 'Section id is required'
        })
    })
})
    .refine(({ body }) => {
    const start = new Date(`1970-01-01T${body.startTime}:00`);
    const end = new Date(`1970-01-01T${body.endTime}:00`);
    return start < end;
}, {
    message: 'Start time must be before end time'
});
const update = zod_1.z.object({
    body: zod_1.z.object({
        roomId: zod_1.z.string().optional(),
        facultyId: zod_1.z.string().optional(),
        offeredCourseSectionId: zod_1.z.string().optional()
    })
});
exports.OfferedCourseClassScheduleValidation = {
    create,
    update
};
