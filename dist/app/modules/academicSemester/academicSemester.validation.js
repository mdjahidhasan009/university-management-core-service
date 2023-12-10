"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicSemesterValidation = void 0;
const zod_1 = require("zod");
const academicSemester_contants_1 = require("./academicSemester.contants");
const create = zod_1.z.object({
    body: zod_1.z.object({
        year: zod_1.z.number({
            required_error: "Year is required"
        }),
        title: zod_1.z.enum([...academicSemester_contants_1.academicSemesterTitles], {
            required_error: "Title is required"
        }),
        code: zod_1.z.enum([...academicSemester_contants_1.academicSemesterCodes], {
            required_error: "Code is required"
        }),
        startMonth: zod_1.z.enum([...academicSemester_contants_1.academicSemesterMonths], {
            required_error: "Start month is required"
        }),
        endMonth: zod_1.z.enum([...academicSemester_contants_1.academicSemesterMonths], {
            required_error: "End month is required"
        })
    })
});
const update = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.enum([...academicSemester_contants_1.academicSemesterTitles]).optional(),
        code: zod_1.z.enum([...academicSemester_contants_1.academicSemesterCodes]).optional(),
        year: zod_1.z.number().optional(),
        startMonth: zod_1.z.enum([...academicSemester_contants_1.academicSemesterMonths]).optional(),
        endMonth: zod_1.z.enum([...academicSemester_contants_1.academicSemesterMonths]).optional()
    })
});
exports.AcademicSemesterValidation = {
    create,
    update
};
