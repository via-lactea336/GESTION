/*
  Warnings:

  - You are about to alter the column `username` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(128)`.
  - You are about to drop the `Cajero` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[docIdentidad]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `apellido` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `docIdentidad` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AperturaCaja" DROP CONSTRAINT "AperturaCaja_cajeroId_fkey";

-- DropForeignKey
ALTER TABLE "Cajero" DROP CONSTRAINT "Cajero_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "apellido" VARCHAR(128) NOT NULL,
ADD COLUMN     "deleted" TIMESTAMP(3),
ADD COLUMN     "docIdentidad" VARCHAR(128) NOT NULL,
ADD COLUMN     "nombre" VARCHAR(128) NOT NULL,
ALTER COLUMN "username" SET DATA TYPE VARCHAR(128);

-- DropTable
DROP TABLE "Cajero";

-- CreateIndex
CREATE UNIQUE INDEX "User_docIdentidad_key" ON "User"("docIdentidad");

-- AddForeignKey
ALTER TABLE "AperturaCaja" ADD CONSTRAINT "AperturaCaja_cajeroId_fkey" FOREIGN KEY ("cajeroId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
