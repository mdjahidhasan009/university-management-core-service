"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentEnrolledCourseValidation = void 0;
const zod_1 = require("zod");
const create = zod_1.z.object({
    body: zod_1.z.object({
        academicSemesterId: zod_1.z.string({
            required_error: 'Academic semester id is required'
        }),
        studentId: zod_1.z.string({
            required_error: 'Student id is required'
        }),
        courseId: zod_1.z.string({
            required_error: 'Course id is required'
        })
    })
});
const update = zod_1.z.object({
    body: zod_1.z.object({
        academicSemesterId: zod_1.z.string().optional(),
        studentId: zod_1.z.string().optional(),
        courseId: zod_1.z.string().optional(),
        status: zod_1.z.string().optional(),
        grade: zod_1.z.string().optional(),
        point: zod_1.z.number().optional(),
        marks: zod_1.z.number().optional()
    })
});
exports.StudentEnrolledCourseValidation = {
    create,
    update
};
