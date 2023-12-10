/*
  Warnings:

  - Made the column `paymentMethod` on table `student_semester_payment_histories` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "student_semester_payment_histories" ALTER COLUMN "paymentMethod" SET NOT NULL;
