/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Banco` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Banco` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Cheque` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Cheque` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `CuentaBancaria` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `CuentaBancaria` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Entidad` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Entidad` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Operacion` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Operacion` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `TipoOperacion` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `TipoOperacion` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Banco" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Cheque" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "CuentaBancaria" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Entidad" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Operacion" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "TipoOperacion" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";
