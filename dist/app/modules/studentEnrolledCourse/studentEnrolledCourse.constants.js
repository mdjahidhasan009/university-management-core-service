"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentEnrolledCourseRelationalFieldsMapper = exports.studentEnrolledCourseRelationalFields = exports.studentEnrolledCourseSearchableFields = exports.studentEnrolledCourseFilterableFields = void 0;
exports.studentEnrolledCourseFilterableFields = [
    'academicSemesterId',
    'studentId',
    'courseId',
    'status',
    'grade'
];
exports.studentEnrolledCourseSearchableFields = [];
exports.studentEnrolledCourseRelationalFields = [
    'academicSemesterId',
    'studentId',
    'courseId'
];
exports.studentEnrolledCourseRelationalFieldsMapper = {
    academicSemesterId: 'academicSemester',
    studentId: 'student',
    courseId: 'course'
};
