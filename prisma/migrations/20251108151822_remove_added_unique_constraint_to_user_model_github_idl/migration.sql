-- DropIndex
DROP INDEX "public"."users_github_id_key";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL;
