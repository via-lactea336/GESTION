/*
  Warnings:

  - A unique constraint covering the columns `[codigo]` on the table `Producto` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre]` on the table `Producto` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `codigo` to the `Producto` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Recibos_facturaId_key";

-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "codigo" TEXT NOT NULL,
ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(256);

-- CreateIndex
CREATE UNIQUE INDEX "Producto_codigo_key" ON "Producto"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Producto_nombre_key" ON "Producto"("nombre");
