-- CreateEnum
CREATE TYPE "public"."CaseParticipantStatus" AS ENUM ('Pending', 'Accepted', 'Declined');

-- AlterTable
ALTER TABLE "public"."case_participants" ADD COLUMN     "status" "public"."CaseParticipantStatus" NOT NULL DEFAULT 'Pending';
