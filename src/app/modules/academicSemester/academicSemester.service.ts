import { AcademicSemester, Prisma } from '@prisma/client';
import {IGenericResponse} from "../../../interfaces/common";
import {paginationHelpers} from "../../../helpers/paginationHelper";
import {IAcademicSemesterFilterRequest} from "./academicSemester.interface";
import {IPaginationOptions} from "../../../interfaces/pagination";
import {AcademicSemesterSearchableFields} from "./academicSemester.contants";
import prisma from "../../../shared/prisma";

export const createAcademicSemester = async (academicSemesterData: AcademicSemester): Promise<AcademicSemester> => {
  const result = await prisma.academicSemester.create({
    data: academicSemesterData
  });

  return result;
}

const getAllAcademicSemesters = async (
  filters: IAcademicSemesterFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<AcademicSemester[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];
  if(searchTerm) {
    andConditions.push({
      OR: AcademicSemesterSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm || '',
          mode: 'insensitive',
        }
      }))
    })
  }

  if(Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key: string) => ({
          [key]: {
            equals: (filterData as any)[key] || '',
          }
        }))
    });
  }

  const whereConditions: Prisma.AcademicSemesterWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.academicSemester.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: options.sortBy && options.sortOrder ? {
      [options.sortBy]: options.sortOrder
    } : {
      createdAt: 'desc'
    }
  });

  const total = await prisma.academicSemester.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
}

const getAcademicSemesterById = async (id: string): Promise<AcademicSemester | null> => {
  const result = await prisma.academicSemester.findUnique({
    where: {
      id
    }
  });

  return result;
}

export const AcademicSemesterService = {
  createAcademicSemester,
  getAllAcademicSemesters,
  getAcademicSemesterById
}