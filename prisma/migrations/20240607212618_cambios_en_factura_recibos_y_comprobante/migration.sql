/*
  Warnings:

  - A unique constraint covering the columns `[numeroFactura]` on the table `Factura` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fechaEmision` to the `Factura` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaVencimiento` to the `Factura` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numeroFactura` to the `Factura` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pagado` to the `Factura` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaEmision` to the `Recibos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Factura" ADD COLUMN     "fechaEmision" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fechaVencimiento" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "numeroFactura" TEXT NOT NULL,
ADD COLUMN     "pagado" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Recibos" ADD COLUMN     "fechaEmision" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Factura_numeroFactura_key" ON "Factura"("numeroFactura");
