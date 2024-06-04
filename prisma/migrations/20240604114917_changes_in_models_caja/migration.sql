/*
  Warnings:

  - You are about to drop the column `movimientoId` on the `Recibos` table. All the data in the column will be lost.
  - Added the required column `facturaId` to the `Movimiento` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Recibos" DROP CONSTRAINT "Recibos_movimientoId_fkey";

-- AlterTable
ALTER TABLE "Movimiento" ADD COLUMN     "facturaId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Recibos" DROP COLUMN "movimientoId";

-- AddForeignKey
ALTER TABLE "Movimiento" ADD CONSTRAINT "Movimiento_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "Factura"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
