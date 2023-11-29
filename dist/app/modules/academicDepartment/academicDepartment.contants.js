"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_ACADEMIC_DEPARTMENT_DELETED = exports.EVENT_ACADEMIC_DEPARTMENT_UPDATED = exports.EVENT_ACADEMIC_DEPARTMENT_CREATED = exports.academicDepartmentRelationalFieldsMapper = exports.academicDepartmentRelationalFields = exports.academicDepartmentSearchableFields = exports.academicDepartmentFilterableFields = void 0;
exports.academicDepartmentFilterableFields = [
    'searchTerm',
    'id',
    'academicFacultyId'
];
exports.academicDepartmentSearchableFields = ['title'];
exports.academicDepartmentRelationalFields = ['academicFacultyId'];
exports.academicDepartmentRelationalFieldsMapper = {
    academicFacultyId: 'academicFaculty'
};
exports.EVENT_ACADEMIC_DEPARTMENT_CREATED = 'academic-department.created';
exports.EVENT_ACADEMIC_DEPARTMENT_UPDATED = 'academic-department.updated';
exports.EVENT_ACADEMIC_DEPARTMENT_DELETED = 'academic-department.deleted';
