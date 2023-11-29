"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseValidation = void 0;
const zod_1 = require("zod");
const create = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: 'Title is required'
        }),
        code: zod_1.z.string({
            required_error: 'Code is required'
        }),
        credits: zod_1.z.number({
            required_error: 'Credits is required'
        }),
        preRequisiteCourses: zod_1.z
            .array(zod_1.z.object({
            courseId: zod_1.z.string({})
        }))
            .optional()
    })
});
const update = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        code: zod_1.z.string().optional(),
        credits: zod_1.z.number().optional(),
        preRequisiteCourses: zod_1.z
            .array(zod_1.z.object({
            courseId: zod_1.z.string({}),
            isDeleted: zod_1.z.boolean({}).optional()
        }))
            .optional()
    })
});
const assignOrRemoveFaculties = zod_1.z.object({
    body: zod_1.z.object({
        faculties: zod_1.z.array(zod_1.z.string(), {
            required_error: "Facultis are required"
        })
    })
});
exports.CourseValidation = {
    create,
    update,
    assignOrRemoveFaculties
};
