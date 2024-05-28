/*
  Warnings:

  - You are about to drop the column `aperturaDeCaja` on the `AperturaCaja` table. All the data in the column will be lost.
  - You are about to alter the column `iva` on the `Factura` table. The data in that column could be lost. The data in that column will be cast from `Money` to `DoublePrecision`.
  - Added the required column `saldoInicial` to the `AperturaCaja` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AperturaCaja" DROP COLUMN "aperturaDeCaja",
ADD COLUMN     "saldoInicial" MONEY NOT NULL;

-- AlterTable
-- Step 1: Drop the old column
ALTER TABLE "Factura" DROP COLUMN "iva";

-- Step 2: Add a new column with the desired type
ALTER TABLE "Factura" ADD COLUMN "iva" double precision;