"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacultyValidation = void 0;
const zod_1 = require("zod");
const create = zod_1.z.object({
    body: zod_1.z.object({
        facultyId: zod_1.z.string({
            required_error: 'Faculty id is required'
        }),
        firstName: zod_1.z.string({
            required_error: 'First name is required'
        }),
        lastName: zod_1.z.string({
            required_error: 'Last name is required'
        }),
        middleName: zod_1.z.string({
            required_error: 'Middle name is required'
        }),
        profileImage: zod_1.z.string({
            required_error: 'Profile image is required'
        }),
        email: zod_1.z.string({
            required_error: 'Email is required'
        }),
        contactNo: zod_1.z.string({
            required_error: 'Contact no is required'
        }),
        gender: zod_1.z.string({
            required_error: 'Gender is required'
        }),
        bloodGroup: zod_1.z.string({
            required_error: 'Blood group is required'
        }),
        designation: zod_1.z.string({
            required_error: 'Designation is required'
        }),
        academicDepartmentId: zod_1.z.string({
            required_error: 'Academic department is required'
        }),
        academicFacultyId: zod_1.z.string({
            required_error: 'Academic faculty is required'
        })
    })
});
const update = zod_1.z.object({
    body: zod_1.z.object({
        facultyId: zod_1.z.string().optional(),
        firstName: zod_1.z.string().optional(),
        lastName: zod_1.z.string().optional(),
        middleName: zod_1.z.string().optional(),
        profileImage: zod_1.z.string().optional(),
        email: zod_1.z.string().optional(),
        contactNo: zod_1.z.string().optional(),
        gender: zod_1.z.string().optional(),
        bloodGroup: zod_1.z.string().optional(),
        designation: zod_1.z.string().optional(),
        academicDepartmentId: zod_1.z.string().optional(),
        academicFacultyId: zod_1.z.string().optional()
    })
});
const assignOrRemoveCourses = zod_1.z.object({
    body: zod_1.z.object({
        courses: zod_1.z.array(zod_1.z.string(), {
            required_error: "Courses are required"
        })
    })
});
exports.FacultyValidation = {
    create,
    update,
    assignOrRemoveCourses
};
