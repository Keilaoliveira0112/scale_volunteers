/*
  Warnings:

  - You are about to drop the `_EscalaToUsuario` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `atualizadoEm` to the `Escala` table without a default value. This is not possible if the table is not empty.
  - Added the required column `atualizadoEm` to the `Ministerio` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_EscalaToUsuario" DROP CONSTRAINT "_EscalaToUsuario_A_fkey";

-- DropForeignKey
ALTER TABLE "_EscalaToUsuario" DROP CONSTRAINT "_EscalaToUsuario_B_fkey";

-- AlterTable
ALTER TABLE "Escala" ADD COLUMN     "atualizadoEm" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Ministerio" ADD COLUMN     "atualizadoEm" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "atualizadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "UsuarioMinisterio" ADD COLUMN     "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "_EscalaToUsuario";

-- CreateTable
CREATE TABLE "EscalaVoluntario" (
    "id" SERIAL NOT NULL,
    "escalaId" INTEGER NOT NULL,
    "voluntarioId" INTEGER NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EscalaVoluntario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EscalaVoluntario_escalaId_voluntarioId_key" ON "EscalaVoluntario"("escalaId", "voluntarioId");

-- AddForeignKey
ALTER TABLE "EscalaVoluntario" ADD CONSTRAINT "EscalaVoluntario_escalaId_fkey" FOREIGN KEY ("escalaId") REFERENCES "Escala"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EscalaVoluntario" ADD CONSTRAINT "EscalaVoluntario_voluntarioId_fkey" FOREIGN KEY ("voluntarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
