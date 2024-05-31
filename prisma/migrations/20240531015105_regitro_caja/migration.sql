-- CreateTable
CREATE TABLE "RegistroCaja" (
    "id" TEXT NOT NULL,
    "aperturaId" TEXT NOT NULL,
    "montoRegistrado" MONEY NOT NULL,
    "montoEsperado" MONEY NOT NULL,
    "montoInicial" MONEY NOT NULL,
    "cantCheques" INTEGER NOT NULL,
    "cantTarjetas" INTEGER NOT NULL,
    "montoIngreso" MONEY NOT NULL,
    "montoEgreso" MONEY NOT NULL,
    "montoIngresoCheque" MONEY NOT NULL,
    "montoEgresoCheque" MONEY NOT NULL,
    "montoIngresoTarjeta" MONEY NOT NULL,
    "montoEgresoTarjeta" MONEY NOT NULL,
    "deleted" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegistroCaja_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RegistroCaja_aperturaId_key" ON "RegistroCaja"("aperturaId");

-- AddForeignKey
ALTER TABLE "RegistroCaja" ADD CONSTRAINT "RegistroCaja_aperturaId_fkey" FOREIGN KEY ("aperturaId") REFERENCES "AperturaCaja"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
