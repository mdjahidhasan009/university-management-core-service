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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentSemesterPaymentController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const studentSemesterPayment_constants_1 = require("./studentSemesterPayment.constants");
const studentSemesterPayment_service_1 = require("./studentSemesterPayment.service");
const config_1 = __importDefault(require("../../../config"));
const getAllFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, studentSemesterPayment_constants_1.studentSemesterPaymentFilterableFields);
    const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = yield studentSemesterPayment_service_1.StudentSemesterPaymentService.getAllFromDB(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Student semester payment fetched successfully',
        meta: result.meta,
        data: result.data
    });
}));
const getMySemesterPayments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, studentSemesterPayment_constants_1.studentSemesterPaymentFilterableFields);
    const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const user = req.user;
    const result = yield studentSemesterPayment_service_1.StudentSemesterPaymentService.getMySemesterPayments(filters, options, user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Student semester payment fetched successfully',
        meta: result.meta,
        data: result.data
    });
}));
const initiatePayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield studentSemesterPayment_service_1.StudentSemesterPaymentService.initiatePayment(req.body, user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Payment initiated successfully',
        data: result
    });
}));
const completePayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    console.log(req);
    console.log('req?.body' + (req === null || req === void 0 ? void 0 : req.body));
    // console.log('req?.headers' + req?.headers);
    // console.log('req?.cookies' + req?.cookies);
    // console.log('req?.params' + req?.params);
    // console.log('req?.route' + req?.route);
    // console.log('req?.signedCookies' + req?.signedCookies);
    // console.log('req?.originalUrl' + req?.originalUrl);
    // console.log('req?.baseUrl' + req?.baseUrl);
    // console.log('req?.path' + req?.path);
    // console.log('req?.hostname' + req?.hostname);
    // console.log('req?.ip' + req?.ip);
    // console.log('req?.method' + req?.method);
    // console.log('req?.protocol' + req?.protocol);
    // console.log('req?.secure' + req?.secure);
    // console.log('req?.stale' + req?.stale);
    console.log(req.headers);
    console.log(req.headers['X-API-KEY']);
    console.log((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.data);
    console.log((_c = (_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.apiKey);
    const apiKeyForEcommercePaymentFromReq = req.headers['X-API-KEY'];
    if ((apiKeyForEcommercePaymentFromReq !== config_1.default.apiKeyForEcommercePayment) || (((_e = (_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.apiKey) !== config_1.default.apiKeyForEcommercePayment)) {
        throw new Error('Invalid API Key');
    }
    const result = yield studentSemesterPayment_service_1.StudentSemesterPaymentService.completePayment(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Payment completed',
        data: result
    });
}));
exports.StudentSemesterPaymentController = {
    getAllFromDB,
    initiatePayment,
    completePayment,
    getMySemesterPayments
};
