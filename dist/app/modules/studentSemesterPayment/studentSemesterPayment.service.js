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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentSemesterPaymentService = void 0;
const client_1 = require("@prisma/client");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const studentSemesterPayment_constants_1 = require("./studentSemesterPayment.constants");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../../../config"));
const createSemesterPayment = (prismaClient, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prismaClient.studentSemesterPayment.findFirst({
        where: {
            student: {
                id: payload.studentId
            },
            academicSemester: {
                id: payload.academicSemesterId
            }
        }
    });
    if (!isExist) {
        const dataToInsert = {
            studentId: payload.studentId,
            academicSemesterId: payload.academicSemesterId,
            fullPaymentAmount: payload.totalPaymentAmount,
            partialPaymentAmount: payload.totalPaymentAmount * 0.5,
            totalDueAmount: payload.totalPaymentAmount,
            totalPaidAmount: 0
        };
        yield prismaClient.studentSemesterPayment.create({
            data: dataToInsert
        });
    }
});
const getAllFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: studentSemesterPayment_constants_1.studentSemesterPaymentSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => {
                if (studentSemesterPayment_constants_1.studentSemesterPaymentRelationalFields.includes(key)) {
                    return {
                        [studentSemesterPayment_constants_1.studentSemesterPaymentRelationalFieldsMapper[key]]: {
                            id: filterData[key]
                        }
                    };
                }
                else {
                    return {
                        [key]: {
                            equals: filterData[key]
                        }
                    };
                }
            })
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.studentSemesterPayment.findMany({
        include: {
            academicSemester: true,
            student: true
        },
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {
                createdAt: 'desc'
            }
    });
    const total = yield prisma_1.default.studentSemesterPayment.count({
        where: whereConditions
    });
    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    };
});
const initiatePayment = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const student = yield prisma_1.default.student.findFirst({
        where: {
            studentId: user === null || user === void 0 ? void 0 : user.userId
        }
    });
    if (!student) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Student not found');
    }
    const studentSemesterPayment = yield prisma_1.default.studentSemesterPayment.findFirst({
        where: {
            student: {
                id: student.id
            },
            academicSemester: {
                id: payload.academicSemesterId
            }
        },
        include: {
            academicSemester: true,
        }
    });
    if (!studentSemesterPayment) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Payment Information Not Found');
    }
    if (studentSemesterPayment.paymentStatus === client_1.PaymentStatus.FULL_PAID) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Already Paid');
    }
    if (studentSemesterPayment.paymentStatus === client_1.PaymentStatus.PARTIAL_PAID && (payload === null || payload === void 0 ? void 0 : payload.paymentType) !== 'FULL') {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Already Partial Paid');
    }
    const isPendingPaymentExist = yield prisma_1.default.studentSemesterPaymentHistory.findFirst({
        where: {
            studentSemesterPayment: {
                id: studentSemesterPayment.id
            },
            isPaid: false
        }
    });
    if (isPendingPaymentExist) {
        const paymentResponse = yield axios_1.default.post(config_1.default.initPaymentEndpoint || 'http://localhost:3333/api/v1/payment/init', {
            amount: isPendingPaymentExist.dueAmount,
            transactionId: isPendingPaymentExist.transactionId,
            studentName: `${student.firstName} ${student.lastName}`,
            studentId: student.studentId,
            studentEmail: student.email,
            address: "Dhaka, Bangladesh",
            phone: student.contactNo
        });
        return {
            paymentUrl: paymentResponse.data,
            paymentDetails: isPendingPaymentExist
        };
    }
    let payableAmount = 0;
    if (payload.paymentType === 'PARTIAL' && studentSemesterPayment.totalPaidAmount === 0) {
        payableAmount = studentSemesterPayment.partialPaymentAmount;
    }
    else {
        payableAmount = studentSemesterPayment.totalDueAmount;
    }
    const dataToInsert = {
        studentSemesterPaymentId: studentSemesterPayment.id,
        transactionId: `${student.studentId}-${studentSemesterPayment.academicSemester.title}-${Date.now()}`,
        dueAmount: payableAmount,
        paidAmount: 0,
    };
    const studentSemesterPaymentHistory = yield prisma_1.default.studentSemesterPaymentHistory.create({
        data: dataToInsert
    });
    ////TODO: Have to refertor this code as almost save as code inside if (isPendingPaymentExist) {
    const paymentResponse = yield axios_1.default.post(config_1.default.initPaymentEndpoint || 'http://localhost:3333/api/v1/payment/init', {
        amount: studentSemesterPaymentHistory.dueAmount,
        transactionId: studentSemesterPaymentHistory.transactionId,
        studentName: `${student.firstName} ${student.lastName}`,
        studentId: student.studentId,
        studentEmail: student.email,
        address: "Dhaka, Bangladesh",
        phone: student.contactNo
    });
    return {
        paymentUrl: paymentResponse.data,
        paymentDetails: isPendingPaymentExist
    };
});
const completePayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentDetails = yield prisma_1.default.studentSemesterPaymentHistory.findFirst({
        where: {
            transactionId: payload.transactionId
        }
    });
    if (!paymentDetails) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Payment Information Not Found');
    }
    if (paymentDetails.isPaid) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Already Paid');
    }
    const studentSemesterPayment = yield prisma_1.default.studentSemesterPayment.findFirst({
        where: {
            id: paymentDetails.studentSemesterPaymentId
        }
    });
    if (!studentSemesterPayment) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Payment Information Not Found');
    }
    yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        yield transactionClient.studentSemesterPaymentHistory.update({
            where: {
                id: paymentDetails.id
            },
            data: {
                isPaid: true,
                paidAmount: paymentDetails.dueAmount,
                dueAmount: 0
            }
        });
        yield transactionClient.studentSemesterPayment.update({
            where: {
                id: paymentDetails.studentSemesterPaymentId
            },
            data: {
                totalPaidAmount: studentSemesterPayment.totalPaidAmount + paymentDetails.dueAmount,
                totalDueAmount: studentSemesterPayment.totalDueAmount - paymentDetails.dueAmount,
                paymentStatus: studentSemesterPayment.totalDueAmount - paymentDetails.dueAmount === 0
                    ? client_1.PaymentStatus.FULL_PAID
                    : client_1.PaymentStatus.PARTIAL_PAID
            }
        });
    }));
    return {
        message: 'Payment Completed'
    };
});
const getMySemesterPayments = (filters, options, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const student = yield prisma_1.default.student.findFirst({
        where: {
            studentId: authUser.id
        }
    });
    if (!student) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Student not found');
    }
    filterData.studentId = student.id;
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: studentSemesterPayment_constants_1.studentSemesterPaymentSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => {
                if (studentSemesterPayment_constants_1.studentSemesterPaymentRelationalFields.includes(key)) {
                    return {
                        [studentSemesterPayment_constants_1.studentSemesterPaymentRelationalFieldsMapper[key]]: {
                            id: filterData[key]
                        }
                    };
                }
                else {
                    return {
                        [key]: {
                            equals: filterData[key]
                        }
                    };
                }
            })
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.studentSemesterPayment.findMany({
        include: {
            academicSemester: true,
            student: true
        },
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {
                createdAt: 'desc'
            }
    });
    const total = yield prisma_1.default.studentSemesterPayment.count({
        where: whereConditions
    });
    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    };
});
exports.StudentSemesterPaymentService = {
    createSemesterPayment,
    getAllFromDB,
    initiatePayment,
    completePayment,
    getMySemesterPayments
};
