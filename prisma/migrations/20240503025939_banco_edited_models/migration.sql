/*
  Warnings:

  - You are about to drop the `OperacionDetalle` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `numeroComprobante` to the `Operacion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CuentaBancaria" DROP CONSTRAINT "CuentaBancaria_bancoId_fkey";

-- DropForeignKey
ALTER TABLE "CuentaBancaria" DROP CONSTRAINT "CuentaBancaria_entidadId_fkey";

-- DropForeignKey
ALTER TABLE "Operacion" DROP CONSTRAINT "Operacion_tipoOperacionId_fkey";

-- DropForeignKey
ALTER TABLE "OperacionDetalle" DROP CONSTRAINT "OperacionDetalle_operacionId_fkey";

-- AlterTable
ALTER TABLE "Operacion" ADD COLUMN     "numeroComprobante" TEXT NOT NULL,
ALTER COLUMN "fechaOperacion" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "OperacionDetalle";

-- AddForeignKey
ALTER TABLE "CuentaBancaria" ADD CONSTRAINT "CuentaBancaria_bancoId_fkey" FOREIGN KEY ("bancoId") REFERENCES "Banco"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CuentaBancaria" ADD CONSTRAINT "CuentaBancaria_entidadId_fkey" FOREIGN KEY ("entidadId") REFERENCES "Entidad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operacion" ADD CONSTRAINT "Operacion_tipoOperacionId_fkey" FOREIGN KEY ("tipoOperacionId") REFERENCES "TipoOperacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
