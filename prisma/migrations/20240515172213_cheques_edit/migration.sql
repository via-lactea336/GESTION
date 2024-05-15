/*
  Warnings:

  - Added the required column `involucradoCuentaBancaria` to the `Cheque` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cheque" ADD COLUMN     "involucradoCuentaBancaria" VARCHAR(128) NOT NULL;
