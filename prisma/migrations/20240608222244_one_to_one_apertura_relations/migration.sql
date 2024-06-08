/*
  Warnings:

  - You are about to drop the column `montoEgresoCheque` on the `RegistroCaja` table. All the data in the column will be lost.
  - You are about to drop the column `montoEgresoTarjeta` on the `RegistroCaja` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[aperturaId]` on the table `ArqueoDeCaja` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[numeroComprobante]` on the table `Operacion` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "RegistroCaja" DROP COLUMN "montoEgresoCheque",
DROP COLUMN "montoEgresoTarjeta";

-- CreateIndex
CREATE UNIQUE INDEX "ArqueoDeCaja_aperturaId_key" ON "ArqueoDeCaja"("aperturaId");

-- CreateIndex
CREATE UNIQUE INDEX "Operacion_numeroComprobante_key" ON "Operacion"("numeroComprobante");
