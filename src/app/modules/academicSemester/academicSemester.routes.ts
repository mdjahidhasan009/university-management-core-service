import express from "express";
import {AcademicSemesterController} from "./academicSemester.controller";
import {AcademicSemesterValidation} from "./academicSemester.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

router.get('/', AcademicSemesterController.getAllAcademicSemesters);
router.get('/:id', AcademicSemesterController.getAcademicSemesterById);
router.post('/',
  validateRequest(AcademicSemesterValidation.create),
  AcademicSemesterController.createAcademicSemester
);

export default router;