-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'LIDER', 'VOLUNTARIO');

-- CreateTable
CREATE TABLE "Ministerio" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "liderId" INTEGER NOT NULL,

    CONSTRAINT "Ministerio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoluntarioMinisterio" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "ministerioId" INTEGER NOT NULL,

    CONSTRAINT "VoluntarioMinisterio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Escala" (
    "id" SERIAL NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL,
    "ministerioId" INTEGER NOT NULL,

    CONSTRAINT "Escala_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EscalaToUsuario" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_EscalaToUsuario_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "VoluntarioMinisterio_usuarioId_ministerioId_key" ON "VoluntarioMinisterio"("usuarioId", "ministerioId");

-- CreateIndex
CREATE INDEX "_EscalaToUsuario_B_index" ON "_EscalaToUsuario"("B");

-- AddForeignKey
ALTER TABLE "Ministerio" ADD CONSTRAINT "Ministerio_liderId_fkey" FOREIGN KEY ("liderId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoluntarioMinisterio" ADD CONSTRAINT "VoluntarioMinisterio_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoluntarioMinisterio" ADD CONSTRAINT "VoluntarioMinisterio_ministerioId_fkey" FOREIGN KEY ("ministerioId") REFERENCES "Ministerio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Escala" ADD CONSTRAINT "Escala_ministerioId_fkey" FOREIGN KEY ("ministerioId") REFERENCES "Ministerio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EscalaToUsuario" ADD CONSTRAINT "_EscalaToUsuario_A_fkey" FOREIGN KEY ("A") REFERENCES "Escala"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EscalaToUsuario" ADD CONSTRAINT "_EscalaToUsuario_B_fkey" FOREIGN KEY ("B") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
