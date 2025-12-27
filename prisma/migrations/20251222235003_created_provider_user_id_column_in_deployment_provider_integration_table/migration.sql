/*
  Warnings:

  - Added the required column `provider_user_id` to the `deployment_provider_integrations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "deployment_provider_integrations" ADD COLUMN     "provider_user_id" TEXT NOT NULL;
