/*
  Warnings:

  - The values [ADMIN,LIDER,VOLUNTARIO] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('admin', 'lider', 'voluntario');
ALTER TABLE "Usuario" ALTER COLUMN "tipo" TYPE "Role_new" USING ("tipo"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;
