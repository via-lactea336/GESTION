/*
  Warnings:

  - You are about to drop the column `montoEgreso` on the `RegistroCaja` table. All the data in the column will be lost.
  - You are about to drop the column `montoIngreso` on the `RegistroCaja` table. All the data in the column will be lost.
  - Added the required column `montoEgresoTotal` to the `RegistroCaja` table without a default value. This is not possible if the table is not empty.
  - Added the required column `montoIngresoEfectivo` to the `RegistroCaja` table without a default value. This is not possible if the table is not empty.
  - Added the required column `montoIngresoTotal` to the `RegistroCaja` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RegistroCaja" DROP COLUMN "montoEgreso",
DROP COLUMN "montoIngreso",
ADD COLUMN     "montoEgresoTotal" MONEY NOT NULL,
ADD COLUMN     "montoIngresoEfectivo" MONEY NOT NULL,
ADD COLUMN     "montoIngresoTotal" MONEY NOT NULL;
