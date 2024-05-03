/*
  Warnings:

  - You are about to drop the column `descripcion` on the `Operacion` table. All the data in the column will be lost.
  - Added the required column `bancoInvolucrado` to the `Operacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `concepto` to the `Operacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cuentaBancariaOrigenId` to the `Operacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cuentaInvolucrado` to the `Operacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombreInvolucrado` to the `Operacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rucInvolucrado` to the `Operacion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Operacion" DROP COLUMN "descripcion",
ADD COLUMN     "bancoInvolucrado" TEXT NOT NULL,
ADD COLUMN     "concepto" TEXT NOT NULL,
ADD COLUMN     "cuentaBancariaOrigenId" TEXT NOT NULL,
ADD COLUMN     "cuentaInvolucrado" TEXT NOT NULL,
ADD COLUMN     "nombreInvolucrado" TEXT NOT NULL,
ADD COLUMN     "rucInvolucrado" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Operacion" ADD CONSTRAINT "Operacion_cuentaBancariaOrigenId_fkey" FOREIGN KEY ("cuentaBancariaOrigenId") REFERENCES "CuentaBancaria"("id") ON DELETE CASCADE ON UPDATE CASCADE;
