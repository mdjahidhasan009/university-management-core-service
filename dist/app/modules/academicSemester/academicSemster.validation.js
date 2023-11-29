"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicSemesterValidation = void 0;
const zod_1 = require("zod");
const create = zod_1.z.object({
    body: zod_1.z.object({
        year: zod_1.z.number({
            required_error: "Year is required"
        }),
        title: zod_1.z.string({
            required_error: "Title is required"
        }),
        code: zod_1.z.string({
            required_error: "Code is required"
        }),
        startMonth: zod_1.z.string({
            required_error: "Start month is required"
        }),
        endMonth: zod_1.z.string({
            required_error: "End month is required"
        })
    })
});
const update = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        code: zod_1.z.string().optional(),
        year: zod_1.z.number().optional(),
        startMonth: zod_1.z.string().optional(),
        endMonth: zod_1.z.string().optional()
    })
});
exports.AcademicSemesterValidation = {
    create,
    update
};
