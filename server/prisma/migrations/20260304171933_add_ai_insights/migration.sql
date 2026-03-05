-- CreateTable
CREATE TABLE "public"."ai_insights" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "insight" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_insights_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ai_insights" ADD CONSTRAINT "ai_insights_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
