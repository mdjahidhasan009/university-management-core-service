"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.daysInWeek = exports.offeredCourseSectionRelationalFieldsMapper = exports.offeredCourseSectionRelationalFields = exports.offeredCourseSectionSearchableFields = exports.offeredCourseSectionFilterableFields = void 0;
exports.offeredCourseSectionFilterableFields = [
    'searchTerm',
    'id',
    'offeredCourseId',
    'semesterRegistrationId'
];
exports.offeredCourseSectionSearchableFields = [];
exports.offeredCourseSectionRelationalFields = [
    'offeredCourseId',
    'semesterRegistrationId'
];
exports.offeredCourseSectionRelationalFieldsMapper = {
    offeredCourseId: 'offeredCourse',
    semesterRegistrationId: 'semesterRegistration'
};
exports.daysInWeek = [
    'SATURDAY',
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY'
];
