/*
  Warnings:

  - Added the required column `build_id` to the `deployments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "deployments" ADD COLUMN     "build_id" TEXT NOT NULL;
