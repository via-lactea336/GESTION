/*
  Warnings:

  - You are about to alter the column `nombre` on the `Banco` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(128)`.
  - You are about to alter the column `numeroCuenta` on the `CuentaBancaria` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(128)`.
  - You are about to alter the column `nombre` on the `Entidad` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(128)`.
  - You are about to alter the column `ruc` on the `Entidad` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(128)`.
  - You are about to alter the column `numeroComprobante` on the `Operacion` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(128)`.
  - You are about to alter the column `bancoInvolucrado` on the `Operacion` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(128)`.
  - You are about to alter the column `concepto` on the `Operacion` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `cuentaInvolucrado` on the `Operacion` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(128)`.
  - You are about to alter the column `nombreInvolucrado` on the `Operacion` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(128)`.
  - You are about to alter the column `rucInvolucrado` on the `Operacion` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(128)`.
  - Changed the type of `saldo` on the `CuentaBancaria` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `saldoDisponible` on the `CuentaBancaria` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `monto` on the `Operacion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "estadoCheque" AS ENUM ('EMITIDO', 'PAGADO');

-- AlterTable
ALTER TABLE "Banco" ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(128);

-- AlterTable
ALTER TABLE "CuentaBancaria" ALTER COLUMN "numeroCuenta" SET DATA TYPE VARCHAR(128);

-- DropColumnAndAddColumn
ALTER TABLE "CuentaBancaria" DROP COLUMN "saldo";
ALTER TABLE "CuentaBancaria" ADD COLUMN "saldo" MONEY NOT NULL;

-- DropColumnAndAddColumn
ALTER TABLE "CuentaBancaria" DROP COLUMN "saldoDisponible";
ALTER TABLE "CuentaBancaria" ADD COLUMN "saldoDisponible" MONEY NOT NULL;

-- AlterTable
ALTER TABLE "Entidad" ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(128);
ALTER TABLE "Entidad" ALTER COLUMN "ruc" SET DATA TYPE VARCHAR(128);

-- AlterTable
ALTER TABLE "Operacion" DROP COLUMN "monto";
ALTER TABLE "Operacion" ADD COLUMN "monto" MONEY NOT NULL;

-- AlterTable
ALTER TABLE "Operacion" ALTER COLUMN "numeroComprobante" SET DATA TYPE VARCHAR(128);
ALTER TABLE "Operacion" ALTER COLUMN "bancoInvolucrado" SET DATA TYPE VARCHAR(128);
ALTER TABLE "Operacion" ALTER COLUMN "concepto" SET DATA TYPE VARCHAR(255);
ALTER TABLE "Operacion" ALTER COLUMN "cuentaInvolucrado" SET DATA TYPE VARCHAR(128);
ALTER TABLE "Operacion" ALTER COLUMN "nombreInvolucrado" SET DATA TYPE VARCHAR(128);
ALTER TABLE "Operacion" ALTER COLUMN "rucInvolucrado" SET DATA TYPE VARCHAR(128);

-- CreateTable
CREATE TABLE "Cheque" (
    "id" TEXT NOT NULL,
    "esRecibido" BOOLEAN NOT NULL,
    "monto" MONEY NOT NULL,
    "bancoId" TEXT NOT NULL,
    "fechaEmision" TIMESTAMP(3) NOT NULL,
    "fechaPago" TIMESTAMP(3),
    "estado" "estadoCheque" NOT NULL DEFAULT 'EMITIDO',
    "tipoOperacionId" TEXT NOT NULL,
    "cuentaBancariaOrigenId" TEXT NOT NULL,

    CONSTRAINT "Cheque_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Cheque" ADD CONSTRAINT "Cheque_bancoId_fkey" FOREIGN KEY ("bancoId") REFERENCES "Banco"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cheque" ADD CONSTRAINT "Cheque_tipoOperacionId_fkey" FOREIGN KEY ("tipoOperacionId") REFERENCES "TipoOperacion"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cheque" ADD CONSTRAINT "Cheque_cuentaBancariaOrigenId_fkey" FOREIGN KEY ("cuentaBancariaOrigenId") REFERENCES "CuentaBancaria"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
