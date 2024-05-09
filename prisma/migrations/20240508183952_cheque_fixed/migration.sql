/*
  Warnings:

  - You are about to drop the column `bancoId` on the `Cheque` table. All the data in the column will be lost.
  - You are about to drop the column `cuentaBancariaOrigenId` on the `Cheque` table. All the data in the column will be lost.
  - Added the required column `acreedor` to the `Cheque` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bancoChequeId` to the `Cheque` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cuentaBancariaAfectadaId` to the `Cheque` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emitidoPor` to the `Cheque` table without a default value. This is not possible if the table is not empty.
  - Made the column `fechaPago` on table `Cheque` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Cheque" DROP CONSTRAINT "Cheque_bancoId_fkey";

-- DropForeignKey
ALTER TABLE "Cheque" DROP CONSTRAINT "Cheque_cuentaBancariaOrigenId_fkey";

-- AlterTable
ALTER TABLE "Cheque" DROP COLUMN "bancoId",
DROP COLUMN "cuentaBancariaOrigenId",
ADD COLUMN     "acreedor" VARCHAR(128) NOT NULL,
ADD COLUMN     "bancoChequeId" TEXT NOT NULL,
ADD COLUMN     "cuentaBancariaAfectadaId" TEXT NOT NULL,
ADD COLUMN     "emitidoPor" VARCHAR(128) NOT NULL,
ALTER COLUMN "fechaPago" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Cheque" ADD CONSTRAINT "Cheque_bancoChequeId_fkey" FOREIGN KEY ("bancoChequeId") REFERENCES "Banco"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cheque" ADD CONSTRAINT "Cheque_cuentaBancariaAfectadaId_fkey" FOREIGN KEY ("cuentaBancariaAfectadaId") REFERENCES "CuentaBancaria"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
