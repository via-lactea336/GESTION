/*
  Warnings:

  - You are about to drop the column `saldo` on the `Caja` table. All the data in the column will be lost.
  - You are about to drop the column `tipoMovId` on the `MovimientoDetalle` table. All the data in the column will be lost.
  - You are about to drop the `TipoMovimiento` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `montoEsperado` to the `ArqueoDeCaja` table without a default value. This is not possible if the table is not empty.
  - Added the required column `esIngreso` to the `Movimiento` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MovimientoDetalle" DROP CONSTRAINT "MovimientoDetalle_tipoMovId_fkey";

-- AlterTable
ALTER TABLE "ArqueoDeCaja" ADD COLUMN     "montoEsperado" MONEY NOT NULL;

-- AlterTable
ALTER TABLE "Caja" DROP COLUMN "saldo";

-- AlterTable
ALTER TABLE "Movimiento" ADD COLUMN     "esIngreso" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "MovimientoDetalle" DROP COLUMN "tipoMovId",
ADD COLUMN     "metodoPago" "medioDePago" NOT NULL DEFAULT 'EFECTIVO';

-- DropTable
DROP TABLE "TipoMovimiento";
