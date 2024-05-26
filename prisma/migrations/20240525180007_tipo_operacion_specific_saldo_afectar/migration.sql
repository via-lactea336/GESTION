/*
  Warnings:

  - Added the required column `afectaSaldoDisponible` to the `TipoOperacion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TipoOperacion" ADD COLUMN     "afectaSaldoDisponible" BOOLEAN NOT NULL;
