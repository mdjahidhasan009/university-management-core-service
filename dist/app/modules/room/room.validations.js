"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomValidation = void 0;
const zod_1 = require("zod");
const create = zod_1.z.object({
    body: zod_1.z.object({
        roomNumber: zod_1.z.string({
            required_error: 'Room number is required'
        }),
        floor: zod_1.z.string({
            required_error: 'Floor is required'
        }),
        buildingId: zod_1.z.string({
            required_error: 'Building id is required'
        })
    })
});
const update = zod_1.z.object({
    body: zod_1.z.object({
        roomNumber: zod_1.z.string().optional(),
        floor: zod_1.z.string().optional(),
        buildingId: zod_1.z.string().optional()
    })
});
exports.RoomValidation = {
    create,
    update
};
