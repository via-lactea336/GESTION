/*
  Warnings:

  - Added the required column `operacionId` to the `Cheque` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "medioDePago" AS ENUM ('EFECTIVO', 'CHEQUE', 'TARJETA');

-- AlterEnum
ALTER TYPE "estadoCheque" ADD VALUE 'PENDIENTE';

-- AlterTable
ALTER TABLE "Cheque" ADD COLUMN     "operacionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Operacion" ALTER COLUMN "bancoInvolucrado" DROP NOT NULL,
ALTER COLUMN "cuentaInvolucrado" DROP NOT NULL,
ALTER COLUMN "rucInvolucrado" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Cajero" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deleted" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cajero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Caja" (
    "id" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "saldo" MONEY NOT NULL,
    "deleted" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Caja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AperturaCaja" (
    "id" TEXT NOT NULL,
    "cajaId" TEXT NOT NULL,
    "cajeroId" TEXT NOT NULL,
    "apertura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aperturaDeCaja" MONEY NOT NULL,
    "cierreCaja" TIMESTAMP(3),
    "observaciones" TEXT,
    "deleted" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AperturaCaja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "nombre" VARCHAR(128) NOT NULL,
    "docIdentidad" VARCHAR(128) NOT NULL,
    "deleted" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArqueoDeCaja" (
    "id" TEXT NOT NULL,
    "aperturaId" TEXT NOT NULL,
    "montoRegistrado" MONEY NOT NULL,
    "deleted" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArqueoDeCaja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoMovimiento" (
    "id" TEXT NOT NULL,
    "nombre" VARCHAR(128) NOT NULL,
    "metodoPago" "medioDePago" NOT NULL DEFAULT 'EFECTIVO',
    "esIngreso" BOOLEAN NOT NULL,
    "deleted" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TipoMovimiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movimiento" (
    "id" TEXT NOT NULL,
    "aperturaId" TEXT NOT NULL,
    "monto" MONEY NOT NULL,
    "deleted" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Movimiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovimientoDetalle" (
    "id" TEXT NOT NULL,
    "movimientoId" TEXT NOT NULL,
    "monto" MONEY NOT NULL,
    "tipoMovId" TEXT NOT NULL,
    "deleted" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MovimientoDetalle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Factura" (
    "id" TEXT NOT NULL,
    "ruc" VARCHAR(128) NOT NULL,
    "nombre" VARCHAR(128) NOT NULL,
    "esContado" BOOLEAN NOT NULL,
    "total" MONEY NOT NULL,
    "iva" MONEY NOT NULL,
    "deleted" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Factura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacturaDetalles" (
    "id" TEXT NOT NULL,
    "facturaId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "costoUnit" MONEY NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "monto" MONEY NOT NULL,
    "deleted" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FacturaDetalles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recibos" (
    "id" TEXT NOT NULL,
    "ruc" VARCHAR(128) NOT NULL,
    "nombre" VARCHAR(128) NOT NULL,
    "facturaId" TEXT NOT NULL,
    "totalPagado" MONEY NOT NULL,
    "estaPagado" BOOLEAN NOT NULL,
    "deleted" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recibos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReciboDetalle" (
    "id" TEXT NOT NULL,
    "monto" MONEY NOT NULL,
    "reciboId" TEXT NOT NULL,
    "movimientoId" TEXT NOT NULL,
    "deleted" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReciboDetalle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" TEXT NOT NULL,
    "nombre" VARCHAR(128) NOT NULL,
    "precio" MONEY NOT NULL,
    "deleted" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comprobante" (
    "id" TEXT NOT NULL,
    "concepto" TEXT NOT NULL,
    "monto" MONEY NOT NULL,
    "docIdentidad" VARCHAR(128) NOT NULL,
    "nombre" VARCHAR(128) NOT NULL,
    "movimientoId" TEXT NOT NULL,
    "deleted" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comprobante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChequeCaja" (
    "id" TEXT NOT NULL,
    "numeroCheque" TEXT NOT NULL,
    "librador" VARCHAR(128) NOT NULL,
    "movimientoId" TEXT NOT NULL,
    "deleted" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChequeCaja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tarjeta" (
    "id" TEXT NOT NULL,
    "esCredito" BOOLEAN NOT NULL,
    "numeroTarjeta" TEXT NOT NULL,
    "exp" TIMESTAMP(3) NOT NULL,
    "cvv" TEXT NOT NULL,
    "nombre" VARCHAR(128) NOT NULL,
    "movimientoId" TEXT NOT NULL,
    "deleted" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tarjeta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cajero_userId_key" ON "Cajero"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Caja_numero_key" ON "Caja"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "Recibos_facturaId_key" ON "Recibos"("facturaId");

-- CreateIndex
CREATE UNIQUE INDEX "ChequeCaja_numeroCheque_key" ON "ChequeCaja"("numeroCheque");

-- CreateIndex
CREATE UNIQUE INDEX "Tarjeta_numeroTarjeta_key" ON "Tarjeta"("numeroTarjeta");

-- AddForeignKey
ALTER TABLE "Cheque" ADD CONSTRAINT "Cheque_operacionId_fkey" FOREIGN KEY ("operacionId") REFERENCES "Operacion"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cajero" ADD CONSTRAINT "Cajero_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AperturaCaja" ADD CONSTRAINT "AperturaCaja_cajaId_fkey" FOREIGN KEY ("cajaId") REFERENCES "Caja"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AperturaCaja" ADD CONSTRAINT "AperturaCaja_cajeroId_fkey" FOREIGN KEY ("cajeroId") REFERENCES "Cajero"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArqueoDeCaja" ADD CONSTRAINT "ArqueoDeCaja_aperturaId_fkey" FOREIGN KEY ("aperturaId") REFERENCES "AperturaCaja"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimiento" ADD CONSTRAINT "Movimiento_aperturaId_fkey" FOREIGN KEY ("aperturaId") REFERENCES "AperturaCaja"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoDetalle" ADD CONSTRAINT "MovimientoDetalle_movimientoId_fkey" FOREIGN KEY ("movimientoId") REFERENCES "Movimiento"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoDetalle" ADD CONSTRAINT "MovimientoDetalle_tipoMovId_fkey" FOREIGN KEY ("tipoMovId") REFERENCES "TipoMovimiento"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacturaDetalles" ADD CONSTRAINT "FacturaDetalles_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "Factura"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacturaDetalles" ADD CONSTRAINT "FacturaDetalles_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recibos" ADD CONSTRAINT "Recibos_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "Factura"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReciboDetalle" ADD CONSTRAINT "ReciboDetalle_reciboId_fkey" FOREIGN KEY ("reciboId") REFERENCES "Recibos"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReciboDetalle" ADD CONSTRAINT "ReciboDetalle_movimientoId_fkey" FOREIGN KEY ("movimientoId") REFERENCES "Movimiento"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comprobante" ADD CONSTRAINT "Comprobante_movimientoId_fkey" FOREIGN KEY ("movimientoId") REFERENCES "Movimiento"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChequeCaja" ADD CONSTRAINT "ChequeCaja_movimientoId_fkey" FOREIGN KEY ("movimientoId") REFERENCES "MovimientoDetalle"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tarjeta" ADD CONSTRAINT "Tarjeta_movimientoId_fkey" FOREIGN KEY ("movimientoId") REFERENCES "MovimientoDetalle"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
