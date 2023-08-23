import {AcademicSemester} from '@prisma/client';
import httpStatus from "http-status";
import {Request, Response} from "express";

import {AcademicSemesterService} from "./academicSemester.service";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import {AcademicSemesterFilterAbleFields} from "./academicSemester.contants";

const createAcademicSemester = catchAsync(async (req: Request, res: Response) => {

  const result = await AcademicSemesterService.createAcademicSemester(req.body);

  sendResponse<AcademicSemester>(res, {
    statusCode: httpStatus.CREATED,
    message: 'Academic Semester Created',
    data: result,
    success: true,
  });
});

const getAllAcademicSemesters = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, AcademicSemesterFilterAbleFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await AcademicSemesterService.getAllAcademicSemesters(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Academic Semesters Fetched',
    data: result.data,
    success: true,
    meta: result.meta,
  });
});

const getAcademicSemesterById = catchAsync(async (req: Request, res: Response) => {
  const {id} = req.params;

  const result = await AcademicSemesterService.getAcademicSemesterById(id);

  if(!result) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      message: 'Academic Semester Not Found',
      success: false,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Academic Semester Fetched',
      data: result,
      success: true,
    });
  }
});

export const AcademicSemesterController = {
  createAcademicSemester,
  getAllAcademicSemesters,
  getAcademicSemesterById,
}