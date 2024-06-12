/*
  Warnings:

  - A unique constraint covering the columns `[movimientoId]` on the table `Comprobante` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[movimientoId]` on the table `Recibos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `movimientoId` to the `Recibos` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AsientoDesc" AS ENUM ('COBRO_FACTURAS', 'EXTRACCION_CAJA');

-- AlterTable
ALTER TABLE "Asiento" ALTER COLUMN "fecha" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "Recibos" ADD COLUMN     "movimientoId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Comprobante_movimientoId_key" ON "Comprobante"("movimientoId");

-- CreateIndex
CREATE UNIQUE INDEX "Recibos_movimientoId_key" ON "Recibos"("movimientoId");

-- AddForeignKey
ALTER TABLE "Recibos" ADD CONSTRAINT "Recibos_movimientoId_fkey" FOREIGN KEY ("movimientoId") REFERENCES "Movimiento"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
