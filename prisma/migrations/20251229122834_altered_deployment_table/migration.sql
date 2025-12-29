-- CreateEnum
CREATE TYPE "DeploymentStatus" AS ENUM ('DEPLOYING', 'DEPLOYED', 'CANCELED');

-- AlterTable
ALTER TABLE "deployments" ADD COLUMN     "status" "DeploymentStatus" NOT NULL DEFAULT 'DEPLOYING',
ADD COLUMN     "url" TEXT;
