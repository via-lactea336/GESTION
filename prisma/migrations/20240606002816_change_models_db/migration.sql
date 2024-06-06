/*
  Warnings:

  - You are about to drop the column `docIdentidad` on the `Comprobante` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `Comprobante` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Comprobante` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ArqueoDeCaja" ADD COLUMN     "observaciones" TEXT;

-- AlterTable
ALTER TABLE "Comprobante" DROP COLUMN "docIdentidad",
DROP COLUMN "nombre",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Movimiento" ALTER COLUMN "facturaId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Comprobante" ADD CONSTRAINT "Comprobante_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
