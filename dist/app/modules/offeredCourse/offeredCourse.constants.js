"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.offeredCourseRelationalFieldsMapper = exports.offeredCourseRelationalFields = exports.offeredCourseSearchableFields = exports.offeredCourseFilterableFields = void 0;
exports.offeredCourseFilterableFields = [
    'searchTerm',
    'id',
    'semesterRegistrationId',
    'courseId',
    'academicDepartmentId'
];
exports.offeredCourseSearchableFields = [];
exports.offeredCourseRelationalFields = [
    'semesterRegistrationId',
    'courseId',
    'academicDepartmentId'
];
exports.offeredCourseRelationalFieldsMapper = {
    semesterRegistrationId: 'semesterRegistration',
    courseId: 'course',
    academicDepartmentId: 'academicDepartment'
};
