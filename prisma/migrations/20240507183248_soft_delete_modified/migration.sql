/*
  Warnings:

  - You are about to drop the column `deleted` on the `Entidad` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `TipoOperacion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Entidad" DROP COLUMN "deleted";

-- AlterTable
ALTER TABLE "TipoOperacion" DROP COLUMN "deleted";
