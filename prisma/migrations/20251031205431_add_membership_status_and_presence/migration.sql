/*
  Warnings:

  - The `status` column on the `UsuarioMinisterio` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('PENDENTE', 'APROVADO', 'REJEITADO');

-- AlterTable
ALTER TABLE "EscalaVoluntario" ADD COLUMN     "presenteConfirmado" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "UsuarioMinisterio" DROP COLUMN "status",
ADD COLUMN     "status" "MembershipStatus" NOT NULL DEFAULT 'PENDENTE';
