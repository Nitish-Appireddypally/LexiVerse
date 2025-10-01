/*
  Warnings:

  - You are about to drop the column `status` on the `firs` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."CaseStatus" ADD VALUE 'FIR_Accepted';
ALTER TYPE "public"."CaseStatus" ADD VALUE 'Investigation_In_Progress';
ALTER TYPE "public"."CaseStatus" ADD VALUE 'Chargesheet_Filed';
ALTER TYPE "public"."CaseStatus" ADD VALUE 'Closure_Report_Filed';

-- AlterTable
ALTER TABLE "public"."firs" DROP COLUMN "status",
ADD COLUMN     "io_contact" TEXT;
