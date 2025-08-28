/*
  Warnings:

  - You are about to drop the `VoluntarioMinisterio` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `tipo` on the `Usuario` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "VoluntarioMinisterio" DROP CONSTRAINT "VoluntarioMinisterio_ministerioId_fkey";

-- DropForeignKey
ALTER TABLE "VoluntarioMinisterio" DROP CONSTRAINT "VoluntarioMinisterio_usuarioId_fkey";

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "tipo",
ADD COLUMN     "tipo" "Role" NOT NULL;

-- DropTable
DROP TABLE "VoluntarioMinisterio";

-- CreateTable
CREATE TABLE "UsuarioMinisterio" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "ministerioId" INTEGER NOT NULL,

    CONSTRAINT "UsuarioMinisterio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioMinisterio_usuarioId_ministerioId_key" ON "UsuarioMinisterio"("usuarioId", "ministerioId");

-- AddForeignKey
ALTER TABLE "UsuarioMinisterio" ADD CONSTRAINT "UsuarioMinisterio_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioMinisterio" ADD CONSTRAINT "UsuarioMinisterio_ministerioId_fkey" FOREIGN KEY ("ministerioId") REFERENCES "Ministerio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
