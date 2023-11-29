"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentEnrolledCourseMarkRelationalFieldsMapper = exports.studentEnrolledCourseMarkRelationalFields = exports.studentEnrolledCourseMarkSearchableFields = exports.studentEnrolledCourseMarkFilterableFields = void 0;
exports.studentEnrolledCourseMarkFilterableFields = [
    'academicSemesterId',
    'studentId',
    'studentEnrolledCourseId',
    'examType',
    'courseId'
];
exports.studentEnrolledCourseMarkSearchableFields = ['examType', 'grade'];
exports.studentEnrolledCourseMarkRelationalFields = [
    'academicSemesterId',
    'studentId',
    'studentEnrolledCourseId'
];
exports.studentEnrolledCourseMarkRelationalFieldsMapper = {
    academicSemesterId: 'academicSemester',
    studentId: 'student',
    studentEnrolledCourseId: 'studentEnrolledCourse'
};
