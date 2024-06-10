/*
  Warnings:

  - A unique constraint covering the columns `[numeroComprobante]` on the table `Comprobante` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[numeroRecibo]` on the table `Recibos` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Comprobante" ADD COLUMN     "numeroComprobante" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Recibos" ADD COLUMN     "numeroRecibo" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Comprobante_numeroComprobante_key" ON "Comprobante"("numeroComprobante");

-- CreateIndex
CREATE UNIQUE INDEX "Recibos_numeroRecibo_key" ON "Recibos"("numeroRecibo");
