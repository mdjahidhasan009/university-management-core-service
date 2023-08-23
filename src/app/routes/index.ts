import express from 'express';
import AcademicSemesterRoutes from "../modules/academicSemester/academicSemester.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/academic-semesters",
    route: AcademicSemesterRoutes
  }
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
