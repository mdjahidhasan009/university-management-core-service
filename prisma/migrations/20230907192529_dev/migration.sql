-- CreateEnum
CREATE TYPE "StudentEnrolledCourseStatus" AS ENUM ('ONGOING', 'COMPLETED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "ExamType" AS ENUM ('MIDTERM', 'FINAL');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PARTIAL_PAID', 'FULL_PAID');

-- AlterTable
ALTER TABLE "academic_semesters" ADD COLUMN     "isCurrent" BOOLEAN DEFAULT false;

-- CreateTable
CREATE TABLE "student_enrolled_courses" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "studentId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "academicSemesterId" TEXT NOT NULL,
    "grade" TEXT,
    "point" DOUBLE PRECISION DEFAULT 0,
    "totalMarks" INTEGER DEFAULT 0,
    "status" "StudentEnrolledCourseStatus" DEFAULT 'ONGOING',

    CONSTRAINT "student_enrolled_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_enrolled_course_marks" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "studentId" TEXT NOT NULL,
    "studentEnrolledCourseId" TEXT NOT NULL,
    "academicSemesterId" TEXT NOT NULL,
    "grade" TEXT,
    "marks" INTEGER,
    "examType" "ExamType" DEFAULT 'MIDTERM',

    CONSTRAINT "student_enrolled_course_marks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_semester_payments" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "studentId" TEXT NOT NULL,
    "academicSemesterId" TEXT NOT NULL,
    "fullPaymentAmount" INTEGER DEFAULT 0,
    "partialPaymentAmount" INTEGER DEFAULT 0,
    "totalDueAmount" INTEGER DEFAULT 0,
    "totalPaidAmount" INTEGER DEFAULT 0,
    "paymentStatus" "PaymentStatus" DEFAULT 'PENDING',

    CONSTRAINT "student_semester_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_academic_infos" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "studentId" TEXT NOT NULL,
    "totalCompletedCredit" INTEGER DEFAULT 0,
    "cgpa" DOUBLE PRECISION DEFAULT 0,

    CONSTRAINT "student_academic_infos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "student_enrolled_courses" ADD CONSTRAINT "student_enrolled_courses_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrolled_courses" ADD CONSTRAINT "student_enrolled_courses_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrolled_courses" ADD CONSTRAINT "student_enrolled_courses_academicSemesterId_fkey" FOREIGN KEY ("academicSemesterId") REFERENCES "academic_semesters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrolled_course_marks" ADD CONSTRAINT "student_enrolled_course_marks_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrolled_course_marks" ADD CONSTRAINT "student_enrolled_course_marks_studentEnrolledCourseId_fkey" FOREIGN KEY ("studentEnrolledCourseId") REFERENCES "student_enrolled_courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrolled_course_marks" ADD CONSTRAINT "student_enrolled_course_marks_academicSemesterId_fkey" FOREIGN KEY ("academicSemesterId") REFERENCES "academic_semesters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_semester_payments" ADD CONSTRAINT "student_semester_payments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_semester_payments" ADD CONSTRAINT "student_semester_payments_academicSemesterId_fkey" FOREIGN KEY ("academicSemesterId") REFERENCES "academic_semesters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_academic_infos" ADD CONSTRAINT "student_academic_infos_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
