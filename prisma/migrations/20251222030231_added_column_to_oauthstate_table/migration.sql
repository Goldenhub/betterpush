/*
  Warnings:

  - Added the required column `status` to the `deployment_provider_integrations` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DeploymentProviderIntegrationStatus" AS ENUM ('PENDING', 'CONNECTED', 'DISCONNECTED');

-- AlterTable
ALTER TABLE "deployment_provider_integrations" ADD COLUMN     "status" "DeploymentProviderIntegrationStatus" NOT NULL;
