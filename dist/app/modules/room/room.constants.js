"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomRelationalFieldsMapper = exports.roomRelationalFields = exports.roomSearchableFields = exports.roomFilterableFields = void 0;
exports.roomFilterableFields = ['searchTerm', 'id', 'buildingId'];
exports.roomSearchableFields = ['roomNumber', 'floor'];
exports.roomRelationalFields = ['buildingId'];
exports.roomRelationalFieldsMapper = {
    buildingId: 'building'
};
