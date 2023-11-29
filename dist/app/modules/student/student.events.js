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
const student_constants_1 = require("./student.constants");
const student_service_1 = require("./student.service");
const initStudentEvents = () => {
    redis_1.RedisClient.subscribe(student_constants_1.EVENT_STUDENT_CREATED, (e) => __awaiter(void 0, void 0, void 0, function* () {
        const data = JSON.parse(e);
        yield student_service_1.StudentService.createStudentFromEvent(data);
    }));
    redis_1.RedisClient.subscribe(student_constants_1.EVENT_STUDENT_UPDATED, (e) => __awaiter(void 0, void 0, void 0, function* () {
        const data = JSON.parse(e);
        yield student_service_1.StudentService.updateStudentFromEvent(data);
    }));
};
exports.default = initStudentEvents;
