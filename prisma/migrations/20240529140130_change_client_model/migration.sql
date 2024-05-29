/*
  Warnings:

  - You are about to drop the column `librador` on the `ChequeCaja` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[docIdentidad]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ChequeCaja" DROP COLUMN "librador";

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_docIdentidad_key" ON "Cliente"("docIdentidad");
