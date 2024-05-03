-- CreateTable
CREATE TABLE "Banco" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Banco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CuentaBancaria" (
    "id" TEXT NOT NULL,
    "numeroCuenta" TEXT NOT NULL,
    "bancoId" TEXT NOT NULL,
    "entidadId" TEXT NOT NULL,
    "esCuentaAhorro" BOOLEAN NOT NULL,
    "saldo" INTEGER NOT NULL,
    "saldoDisponible" INTEGER NOT NULL,

    CONSTRAINT "CuentaBancaria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entidad" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "ruc" TEXT NOT NULL,

    CONSTRAINT "Entidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoOperacion" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "esDebito" BOOLEAN NOT NULL,
    "afectaSaldo" BOOLEAN NOT NULL,

    CONSTRAINT "TipoOperacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Operacion" (
    "id" TEXT NOT NULL,
    "tipoOperacionId" TEXT NOT NULL,
    "fechaOperacion" TIMESTAMP(3) NOT NULL,
    "monto" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "Operacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OperacionDetalle" (
    "id" TEXT NOT NULL,
    "numeroComprobante" TEXT NOT NULL,
    "operacionId" TEXT NOT NULL,

    CONSTRAINT "OperacionDetalle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Banco_nombre_key" ON "Banco"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "CuentaBancaria_numeroCuenta_key" ON "CuentaBancaria"("numeroCuenta");

-- CreateIndex
CREATE UNIQUE INDEX "Entidad_nombre_key" ON "Entidad"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Entidad_ruc_key" ON "Entidad"("ruc");

-- CreateIndex
CREATE UNIQUE INDEX "TipoOperacion_nombre_key" ON "TipoOperacion"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "CuentaBancaria" ADD CONSTRAINT "CuentaBancaria_bancoId_fkey" FOREIGN KEY ("bancoId") REFERENCES "Banco"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CuentaBancaria" ADD CONSTRAINT "CuentaBancaria_entidadId_fkey" FOREIGN KEY ("entidadId") REFERENCES "Entidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operacion" ADD CONSTRAINT "Operacion_tipoOperacionId_fkey" FOREIGN KEY ("tipoOperacionId") REFERENCES "TipoOperacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OperacionDetalle" ADD CONSTRAINT "OperacionDetalle_operacionId_fkey" FOREIGN KEY ("operacionId") REFERENCES "Operacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
