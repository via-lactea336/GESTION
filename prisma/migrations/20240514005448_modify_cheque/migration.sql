/*
  Warnings:

  - You are about to drop the column `involucrado` on the `Cheque` table. All the data in the column will be lost.
  - Added the required column `involucradoDocumentoIdentidad` to the `Cheque` table without a default value. This is not possible if the table is not empty.
  - Added the required column `involucradoNombre` to the `Cheque` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('ADMIN', 'EMPLOYEES');

-- AlterEnum
ALTER TYPE "estadoCheque" ADD VALUE 'ANULADO';

-- AlterTable
ALTER TABLE "Cheque" DROP COLUMN "involucrado",
ADD COLUMN     "involucradoDocumentoIdentidad" VARCHAR(128) NOT NULL,
ADD COLUMN     "involucradoNombre" VARCHAR(128) NOT NULL;

-- AlterTable
ALTER TABLE "TipoOperacion" ADD COLUMN     "deleted" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "rol" "Roles" NOT NULL DEFAULT 'EMPLOYEES';
