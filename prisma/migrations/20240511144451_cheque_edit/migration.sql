/*
  Warnings:

  - You are about to drop the column `tipoOperacionId` on the `Cheque` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cheque" DROP CONSTRAINT "Cheque_tipoOperacionId_fkey";

-- AlterTable
ALTER TABLE "Cheque" DROP COLUMN "tipoOperacionId",
ALTER COLUMN "fechaPago" DROP NOT NULL;
