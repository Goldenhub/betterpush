/*
  Warnings:

  - You are about to drop the column `status` on the `deployment_provider_integrations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "deployment_provider_integrations" DROP COLUMN "status";

-- DropEnum
DROP TYPE "public"."DeploymentProviderIntegrationStatus";
