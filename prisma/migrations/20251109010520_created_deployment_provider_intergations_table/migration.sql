/*
  Warnings:

  - You are about to drop the column `github_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `provider_integrations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."provider_integrations" DROP CONSTRAINT "provider_integrations_user_id_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "github_id";

-- DropTable
DROP TABLE "public"."provider_integrations";

-- CreateTable
CREATE TABLE "deployment_provider_integrations" (
    "id" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deployment_provider_integrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "git_credentials" (
    "id" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_url" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "provider_user_id" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "git_credentials_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "deployment_provider_integrations" ADD CONSTRAINT "deployment_provider_integrations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "git_credentials" ADD CONSTRAINT "git_credentials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
