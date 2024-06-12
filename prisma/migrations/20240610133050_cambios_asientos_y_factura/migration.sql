/*
  Warnings:

  - You are about to drop the column `debe` on the `DetalleAsiento` table. All the data in the column will be lost.
  - You are about to drop the column `haber` on the `DetalleAsiento` table. All the data in the column will be lost.
  - The `pagado` column on the `Factura` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `esDebe` to the `DetalleAsiento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monto` to the `DetalleAsiento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comprobante" ALTER COLUMN "fechaEmision" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "DetalleAsiento" DROP COLUMN "debe",
DROP COLUMN "haber",
ADD COLUMN     "esDebe" BOOLEAN NOT NULL,
ADD COLUMN     "monto" MONEY NOT NULL;

-- AlterTable
ALTER TABLE "Factura" DROP COLUMN "pagado",
ADD COLUMN     "pagado" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Recibos" ALTER COLUMN "fechaEmision" SET DEFAULT CURRENT_TIMESTAMP;
