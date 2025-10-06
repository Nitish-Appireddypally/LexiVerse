/*
  Warnings:

  - A unique constraint covering the columns `[aadhar_number]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "aadhar_number" TEXT,
ADD COLUMN     "date_of_birth" TIMESTAMP(3),
ADD COLUMN     "father_name" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "profile_pic_url" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_aadhar_number_key" ON "public"."users"("aadhar_number");
