/*
  Warnings:

  - You are about to drop the column `acreedor` on the `Cheque` table. All the data in the column will be lost.
  - You are about to drop the column `emitidoPor` on the `Cheque` table. All the data in the column will be lost.
  - Added the required column `involucrado` to the `Cheque` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cheque" DROP COLUMN "acreedor",
DROP COLUMN "emitidoPor",
ADD COLUMN     "involucrado" VARCHAR(128) NOT NULL;
