"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("../../../shared/redis");
const faculty_constants_1 = require("./faculty.constants");
const faculty_service_1 = require("./faculty.service");
const initFacultyEvents = () => {
    redis_1.RedisClient.subscribe(faculty_constants_1.EVENT_FACULTY_CREATED, (e) => __awaiter(void 0, void 0, void 0, function* () {
        const data = JSON.parse(e);
        yield faculty_service_1.FacultyService.createFacultyFromEvent(data);
    }));
    redis_1.RedisClient.subscribe(faculty_constants_1.EVENT_FACULTY_UPDATED, (e) => __awaiter(void 0, void 0, void 0, function* () {
        // const data: FacultyUpdatedEvent = JSON.parse(e);
        const data = JSON.parse(e);
        yield faculty_service_1.FacultyService.updateFacultyFromEvent(data);
    }));
};
exports.default = initFacultyEvents;
