"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferedCourseValidations = void 0;
const zod_1 = require("zod");
const create = zod_1.z.object({
    body: zod_1.z.object({
        academicDepartmentId: zod_1.z.string({
            required_error: "Academic Department Id is required"
        }),
        semesterRegistrationId: zod_1.z.string({
            required_error: "Semester Reg. is required"
        }),
        courseIds: zod_1.z.array(zod_1.z.string({
            required_error: "Course Id is required"
        }), {
            required_error: "Course Ids are required"
        })
    })
});
const update = zod_1.z.object({
    body: zod_1.z.object({
        semesterRegistrationId: zod_1.z.string().optional(),
        courseId: zod_1.z.string().optional(),
        academicDepartmentId: zod_1.z.string().optional()
    })
});
exports.OfferedCourseValidations = {
    create,
    update
};
