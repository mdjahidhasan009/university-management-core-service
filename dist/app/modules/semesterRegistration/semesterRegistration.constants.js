"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.semesterRegistrationRelationalFieldsMapper = exports.semesterRegistrationRelationalFields = exports.semesterRegistrationSearchableFields = exports.semesterRegistrationFilterableFields = void 0;
exports.semesterRegistrationFilterableFields = [
    'searchTerm',
    'id',
    'academicSemesterId'
];
exports.semesterRegistrationSearchableFields = [];
exports.semesterRegistrationRelationalFields = ['academicSemesterId'];
exports.semesterRegistrationRelationalFieldsMapper = {
    academicSemesterId: 'academicSemester'
};
