/*
  Warnings:

  - Added the required column `device_id` to the `refresh_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ip` to the `refresh_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_agent` to the `refresh_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "refresh_tokens" ADD COLUMN     "device_id" TEXT NOT NULL,
ADD COLUMN     "ip" TEXT NOT NULL,
ADD COLUMN     "user_agent" TEXT NOT NULL;
