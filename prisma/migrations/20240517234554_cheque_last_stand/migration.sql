/*
  Warnings:

  - You are about to drop the column `involucradoCuentaBancaria` on the `Cheque` table. All the data in the column will be lost.
  - You are about to drop the column `involucradoDocumentoIdentidad` on the `Cheque` table. All the data in the column will be lost.
  - You are about to drop the column `involucradoNombre` on the `Cheque` table. All the data in the column will be lost.
  - Added the required column `involucrado` to the `Cheque` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cheque" DROP COLUMN "involucradoCuentaBancaria",
DROP COLUMN "involucradoDocumentoIdentidad",
DROP COLUMN "involucradoNombre",
ADD COLUMN     "involucrado" VARCHAR(128) NOT NULL;
