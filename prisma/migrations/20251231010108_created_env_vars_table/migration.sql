-- CreateTable
CREATE TABLE "env_vars" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "environment" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "encrypted_value" TEXT NOT NULL,

    CONSTRAINT "env_vars_pkey" PRIMARY KEY ("id")
);
