/*
  Warnings:

  - You are about to drop the column `iva` on the `Factura` table. All the data in the column will be lost.
  - Added the required column `ivaTotal` to the `Factura` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iva` to the `FacturaDetalles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Factura" DROP COLUMN "iva",
ADD COLUMN     "ivaTotal" MONEY NOT NULL;

-- AlterTable
ALTER TABLE "FacturaDetalles" ADD COLUMN     "iva" MONEY NOT NULL,
ADD COLUMN     "ivaPorcent" DOUBLE PRECISION;
