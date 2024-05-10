import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Crear usuario Admin

  // Crear bancos
  const bancoFamiliar = await prisma.banco.create({
    data: {
      nombre: "Banco Familiar",
    },
  });

  const itau = await prisma.banco.create({
    data: {
      nombre: "Banco Itaú",
    },
  });

  const atlas = await prisma.banco.create({
    data: {
      nombre: "Banco Atlas",
    },
  });

  // Crear entidad de ejemplo
  const entidad = await prisma.entidad.create({
    data: {
      nombre: "testEntidad",
      ruc: "80017052-0",
    },
  });

  // Crear cuenta bancaria en Banco Familiar
  const cuentaBancariaBancoFamiliar = await prisma.cuentaBancaria.create({
    data: {
      numeroCuenta: "22-2851549",
      bancoId: bancoFamiliar.id,
      entidadId: entidad.id,
      esCuentaAhorro: false,
      saldo: 1000000,
      saldoDisponible: 1000000,
    },
  });

  const cuentaBancariaBancoFamiliar3 = await prisma.cuentaBancaria.create({
    data: {
      numeroCuenta: "54-7891234",
      bancoId: bancoFamiliar.id,
      entidadId: entidad.id,
      esCuentaAhorro: true,
      saldo: 1500000,
      saldoDisponible: 1500000,
    },
  });

  const cuentaBancariaBancoAtlas = await prisma.cuentaBancaria.create({
    data: {
      numeroCuenta: "33-445566",
      bancoId: atlas.id,
      entidadId: entidad.id,
      esCuentaAhorro: false,
      saldo: 500000,
      saldoDisponible: 500000,
    },
  });

  const cuentaBancariaBancoAtlas2 = await prisma.cuentaBancaria.create({
    data: {
      numeroCuenta: "66-778899",
      bancoId: atlas.id,
      entidadId: entidad.id,
      esCuentaAhorro: false,
      saldo: 300000,
      saldoDisponible: 300000,
    },
  });

  const cuentaBancariaBancoItau = await prisma.cuentaBancaria.create({
    data: {
      numeroCuenta: "11-223344",
      bancoId: itau.id,
      entidadId: entidad.id,
      esCuentaAhorro: false,
      saldo: 2000000,
      saldoDisponible: 2000000,
    },
  });

  const cuentaBancariaBancoItau2 = await prisma.cuentaBancaria.create({
    data: {
      numeroCuenta: "44-556677",
      bancoId: itau.id,
      entidadId: entidad.id,
      esCuentaAhorro: false,
      saldo: 500000,
      saldoDisponible: 500000,
    },
  });

  // Crear tipo de operación para pago de servicios
  const pagoServicios = await prisma.tipoOperacion.create({
    data: {
      nombre: "Pago de Servicios",
      esDebito: true,
      afectaSaldo: true,
    },
  });

  // Crear tipo de operación para pago de salario
  const pagoSalario = await prisma.tipoOperacion.create({
    data: {
      nombre: "Pago de Salario",
      esDebito: true,
      afectaSaldo: true,
    },
  });

  // Crear tipo de operación para transferencia
  const transferencia = await prisma.tipoOperacion.create({
    data: {
      nombre: "Transferencia",
      esDebito: true,
      afectaSaldo: true,
    },
  });

  // Crear operación de pago de servicios en Banco Familiar
  const operacionPagoServicios = await prisma.operacion.create({
    data: {
      tipoOperacionId: pagoServicios.id,
      fechaOperacion: new Date(),
      monto: 100000,
      cuentaBancariaOrigenId: cuentaBancariaBancoFamiliar.id,
      bancoInvolucrado: "Banco Familiar",
      nombreInvolucrado: "Juan Perez",
      cuentaInvolucrado: "22-2851549",
      rucInvolucrado: "80017052-0",
      concepto: "Pago de Servicios",
      numeroComprobante: "123456",
    },
  });

  // Crear operación de pago de salario en Itaú
  const operacionPagoSalario = await prisma.operacion.create({
    data: {
      tipoOperacionId: pagoSalario.id,
      fechaOperacion: new Date(),
      monto: 150000,
      cuentaBancariaOrigenId: cuentaBancariaBancoFamiliar.id, // Cambiar al ID de la cuenta en Itaú si es necesario
      bancoInvolucrado: "Banco Itaú",
      nombreInvolucrado: "Maria Gonzalez",
      cuentaInvolucrado: "11-223344",
      rucInvolucrado: "1234567890",
      concepto: "Pago de Salario",
      numeroComprobante: "789012",
    },
  });

  // Crear operación de transferencia desde Atlas a Banco Familiar
  const operacionTransferencia = await prisma.operacion.create({
    data: {
      tipoOperacionId: transferencia.id,
      fechaOperacion: new Date(),
      monto: 50000,
      cuentaBancariaOrigenId: cuentaBancariaBancoFamiliar.id, // Cambiar al ID de la cuenta en Atlas si es necesario
      bancoInvolucrado: "Banco Atlas",
      nombreInvolucrado: "Pedro Rodriguez",
      cuentaInvolucrado: "33-445566",
      rucInvolucrado: "0987654321",
      concepto: "Transferencia de fondos",
      numeroComprobante: "345678",
    },
  });

  console.log("Se han creado los registros correctamente.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
