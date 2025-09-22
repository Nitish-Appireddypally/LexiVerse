-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('Client', 'Lawyer', 'Admin');

-- CreateEnum
CREATE TYPE "public"."CaseParticipantRole" AS ENUM ('Petitioner', 'Respondent', 'Victim', 'Accused', 'Witness', 'LeadCounsel');

-- CreateEnum
CREATE TYPE "public"."CaseStatus" AS ENUM ('Draft', 'Submitted', 'FIR_Filed', 'In_Court', 'Resolved', 'Closed');

-- CreateEnum
CREATE TYPE "public"."CourtType" AS ENUM ('Supreme_Court', 'High_Court', 'District_Court', 'Magistrate');

-- CreateEnum
CREATE TYPE "public"."DocumentType" AS ENUM ('Evidence', 'Generated_FIR', 'Legal_Notice', 'Court_Order');

-- CreateEnum
CREATE TYPE "public"."ChatRole" AS ENUM ('user', 'assistant');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "phone_number" TEXT,
    "address" TEXT,
    "role" "public"."UserRole" NOT NULL DEFAULT 'Client',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."lawyer_profiles" (
    "user_id" INTEGER NOT NULL,
    "bar_council_id" TEXT NOT NULL,
    "specializations" TEXT[],
    "experience_years" INTEGER,
    "bio" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "lawyer_profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "public"."cases" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "case_type" TEXT,
    "status" "public"."CaseStatus" NOT NULL DEFAULT 'Submitted',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "court_id" INTEGER,
    "presiding_judge_id" INTEGER,

    CONSTRAINT "cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."case_participants" (
    "case_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role_in_case" "public"."CaseParticipantRole" NOT NULL,

    CONSTRAINT "case_participants_pkey" PRIMARY KEY ("case_id","user_id")
);

-- CreateTable
CREATE TABLE "public"."courts" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."CourtType" NOT NULL,
    "city" TEXT,
    "state" TEXT,

    CONSTRAINT "courts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."judges" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "current_court_id" INTEGER,

    CONSTRAINT "judges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."hearings" (
    "id" SERIAL NOT NULL,
    "hearing_date" TIMESTAMP(3) NOT NULL,
    "summary" TEXT,
    "next_hearing_date" TIMESTAMP(3),
    "case_id" INTEGER NOT NULL,

    CONSTRAINT "hearings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."firs" (
    "id" SERIAL NOT NULL,
    "fir_number" TEXT,
    "police_station" TEXT,
    "investigating_officer" TEXT,
    "receipt_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Drafted',
    "case_id" INTEGER NOT NULL,

    CONSTRAINT "firs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."case_documents" (
    "id" SERIAL NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "document_type" "public"."DocumentType" NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "case_id" INTEGER NOT NULL,

    CONSTRAINT "case_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."chat_histories" (
    "id" SERIAL NOT NULL,
    "session_id" TEXT NOT NULL,
    "role" "public"."ChatRole" NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "chat_histories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "lawyer_profiles_bar_council_id_key" ON "public"."lawyer_profiles"("bar_council_id");

-- CreateIndex
CREATE UNIQUE INDEX "firs_case_id_key" ON "public"."firs"("case_id");

-- AddForeignKey
ALTER TABLE "public"."lawyer_profiles" ADD CONSTRAINT "lawyer_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cases" ADD CONSTRAINT "cases_court_id_fkey" FOREIGN KEY ("court_id") REFERENCES "public"."courts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cases" ADD CONSTRAINT "cases_presiding_judge_id_fkey" FOREIGN KEY ("presiding_judge_id") REFERENCES "public"."judges"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."case_participants" ADD CONSTRAINT "case_participants_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "public"."cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."case_participants" ADD CONSTRAINT "case_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."judges" ADD CONSTRAINT "judges_current_court_id_fkey" FOREIGN KEY ("current_court_id") REFERENCES "public"."courts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."hearings" ADD CONSTRAINT "hearings_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "public"."cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."firs" ADD CONSTRAINT "firs_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "public"."cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."case_documents" ADD CONSTRAINT "case_documents_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "public"."cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chat_histories" ADD CONSTRAINT "chat_histories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
