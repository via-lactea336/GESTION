-- DropForeignKey
ALTER TABLE "CuentaBancaria" DROP CONSTRAINT "CuentaBancaria_bancoId_fkey";

-- DropForeignKey
ALTER TABLE "CuentaBancaria" DROP CONSTRAINT "CuentaBancaria_entidadId_fkey";

-- DropForeignKey
ALTER TABLE "Operacion" DROP CONSTRAINT "Operacion_cuentaBancariaOrigenId_fkey";

-- DropForeignKey
ALTER TABLE "Operacion" DROP CONSTRAINT "Operacion_tipoOperacionId_fkey";

-- AlterTable
ALTER TABLE "Banco" ADD COLUMN     "deleted" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "CuentaBancaria" ADD COLUMN     "deleted" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Entidad" ADD COLUMN     "deleted" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "TipoOperacion" ADD COLUMN     "deleted" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "CuentaBancaria" ADD CONSTRAINT "CuentaBancaria_bancoId_fkey" FOREIGN KEY ("bancoId") REFERENCES "Banco"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CuentaBancaria" ADD CONSTRAINT "CuentaBancaria_entidadId_fkey" FOREIGN KEY ("entidadId") REFERENCES "Entidad"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operacion" ADD CONSTRAINT "Operacion_tipoOperacionId_fkey" FOREIGN KEY ("tipoOperacionId") REFERENCES "TipoOperacion"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operacion" ADD CONSTRAINT "Operacion_cuentaBancariaOrigenId_fkey" FOREIGN KEY ("cuentaBancariaOrigenId") REFERENCES "CuentaBancaria"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
