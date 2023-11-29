"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferedCourseSectionValidation = void 0;
const zod_1 = require("zod");
const create = zod_1.z.object({
    body: zod_1.z.object({
        offeredCourseId: zod_1.z.string({
            required_error: 'Offered course id is required'
        }),
        maxCapacity: zod_1.z.number({
            required_error: 'Max capacity is required'
        }),
        title: zod_1.z.string({
            required_error: 'Title is required'
        })
    })
});
const update = zod_1.z.object({
    body: zod_1.z.object({
        maxCapacity: zod_1.z.number().optional(),
        title: zod_1.z.string().optional()
    })
});
exports.OfferedCourseSectionValidation = {
    create,
    update
};
