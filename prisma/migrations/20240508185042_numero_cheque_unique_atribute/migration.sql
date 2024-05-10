/*
  Warnings:

  - A unique constraint covering the columns `[numeroCheque]` on the table `Cheque` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `numeroCheque` to the `Cheque` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cheque" ADD COLUMN     "numeroCheque" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Cheque_numeroCheque_key" ON "Cheque"("numeroCheque");
