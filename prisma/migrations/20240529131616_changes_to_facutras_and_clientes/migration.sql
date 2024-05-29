/*
  Warnings:

  - You are about to drop the column `nombre` on the `Factura` table. All the data in the column will be lost.
  - You are about to drop the column `ruc` on the `Factura` table. All the data in the column will be lost.
  - You are about to drop the column `estaPagado` on the `Recibos` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `Recibos` table. All the data in the column will be lost.
  - You are about to drop the column `ruc` on the `Recibos` table. All the data in the column will be lost.
  - You are about to drop the `ReciboDetalle` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `clienteId` to the `Factura` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalSaldoPagado` to the `Factura` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clienteId` to the `Recibos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `movimientoId` to the `Recibos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ReciboDetalle" DROP CONSTRAINT "ReciboDetalle_movimientoId_fkey";

-- DropForeignKey
ALTER TABLE "ReciboDetalle" DROP CONSTRAINT "ReciboDetalle_reciboId_fkey";

-- AlterTable
ALTER TABLE "Factura" DROP COLUMN "nombre",
DROP COLUMN "ruc",
ADD COLUMN     "clienteId" TEXT NOT NULL,
ADD COLUMN     "totalSaldoPagado" MONEY NOT NULL;

-- AlterTable
ALTER TABLE "Recibos" DROP COLUMN "estaPagado",
DROP COLUMN "nombre",
DROP COLUMN "ruc",
ADD COLUMN     "clienteId" TEXT NOT NULL,
ADD COLUMN     "movimientoId" TEXT NOT NULL;

-- DropTable
DROP TABLE "ReciboDetalle";

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recibos" ADD CONSTRAINT "Recibos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recibos" ADD CONSTRAINT "Recibos_movimientoId_fkey" FOREIGN KEY ("movimientoId") REFERENCES "Movimiento"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
