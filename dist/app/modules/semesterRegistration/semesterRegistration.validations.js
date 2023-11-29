"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemesterRegistrationValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const create = zod_1.z.object({
    body: zod_1.z.object({
        startDate: zod_1.z.string({
            required_error: 'Start date is required'
        }),
        endDate: zod_1.z.string({
            required_error: 'End date is required'
        }),
        academicSemesterId: zod_1.z.string({
            required_error: 'Academic semester id is required'
        }),
        minCredit: zod_1.z.number({
            required_error: 'Min credit is required'
        }),
        maxCredit: zod_1.z.number({
            required_error: 'Max credit is required'
        })
    })
});
const update = zod_1.z.object({
    body: zod_1.z.object({
        startDate: zod_1.z.string().optional(),
        endDate: zod_1.z.string().optional(),
        academicSemesterId: zod_1.z.string().optional(),
        minCredit: zod_1.z.number().optional(),
        maxCredit: zod_1.z.number().optional(),
        status: zod_1.z.enum([...Object.values(client_1.SemesterRegistrationStatus)], {}).optional()
    })
});
const enrollOrWithdrawCourse = zod_1.z.object({
    body: zod_1.z.object({
        offeredCourseId: zod_1.z.string({
            required_error: "Offered course id is required"
        }),
        offeredCourseSectionId: zod_1.z.string({
            required_error: "Offered course Section id is required"
        })
    })
});
exports.SemesterRegistrationValidation = {
    create,
    update,
    enrollOrWithdrawCourse
};
