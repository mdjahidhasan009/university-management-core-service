"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_FACULTY_UPDATED = exports.EVENT_FACULTY_CREATED = exports.facultyRelationalFieldsMapper = exports.facultyRelationalFields = exports.facultySearchableFields = exports.facultyFilterableFields = void 0;
exports.facultyFilterableFields = [
    'searchTerm',
    'facultyId',
    'email',
    'contactNo',
    'gender',
    'bloodGroup',
    'gender',
    'designation',
    'academicFacultyId',
    'academicDepartmentId'
];
exports.facultySearchableFields = [
    'firstName',
    'lastName',
    'middleName',
    'email',
    'contactNo',
    'facultyId',
    'designation'
];
exports.facultyRelationalFields = ['academicFacultyId', 'academicDepartmentId'];
exports.facultyRelationalFieldsMapper = {
    academicFacultyId: 'academicFaculty',
    academicDepartmentId: 'academicDepartment'
};
exports.EVENT_FACULTY_CREATED = 'faculty.created';
exports.EVENT_FACULTY_UPDATED = 'faculty.updated';
