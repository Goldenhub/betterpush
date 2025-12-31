/*
  Warnings:

  - Added the required column `type` to the `env_vars` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "env_vars" ADD COLUMN     "type" TEXT NOT NULL;
