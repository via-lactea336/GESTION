/*
  Warnings:

  - You are about to drop the `FacturaDetalles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Producto` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FacturaDetalles" DROP CONSTRAINT "FacturaDetalles_facturaId_fkey";

-- DropForeignKey
ALTER TABLE "FacturaDetalles" DROP CONSTRAINT "FacturaDetalles_productoId_fkey";

-- DropTable
DROP TABLE "FacturaDetalles";

-- DropTable
DROP TABLE "Producto";
