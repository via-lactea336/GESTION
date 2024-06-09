/*
  Warnings:

  - You are about to drop the column `saldo` on the `Caja` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Caja" DROP COLUMN "saldo",
ADD COLUMN     "saldoCheque" MONEY NOT NULL DEFAULT 0,
ADD COLUMN     "saldoEfectivo" MONEY NOT NULL DEFAULT 0,
ADD COLUMN     "saldoTarjeta" MONEY NOT NULL DEFAULT 0;
