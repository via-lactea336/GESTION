/*
  Warnings:

  - Added the required column `fechaEmision` to the `Comprobante` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comprobante" ADD COLUMN     "fechaEmision" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Factura" ALTER COLUMN "fechaVencimiento" DROP NOT NULL;
