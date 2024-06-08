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
      nombre: "ACME S.A.",
      ruc: "80017052-0",
    },
  });

  // Crear cuentas bancarias en cada banco
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

  // Crear tipos de operaciones
  const tiposOperacion = await prisma.tipoOperacion.createMany({
    data: [
      // {
      //   nombre: "Movimiento Debito",
      //   esDebito: true,
      //   afectaSaldo: true,
      //   afectaSaldoDisponible: true,
      // },
      // {
      //   nombre: "Movimiento Credito",
      //   esDebito: false,
      //   afectaSaldo: true,
      //   afectaSaldoDisponible: true,
      // },
      {
        nombre: "Retiro",
        esDebito: true,
        afectaSaldo: true,
        afectaSaldoDisponible: true,
      },
      {
        nombre: "Depósito",
        esDebito: false,
        afectaSaldo: true,
        afectaSaldoDisponible: true,
      },
      {
        nombre: "ANULACION DE CHEQUE",
        esDebito: true,
        afectaSaldo: true,
        afectaSaldoDisponible: true,
      },
      {
        nombre: "CONCILIACION DE CHEQUE",
        esDebito: true,
        afectaSaldo: false,
        afectaSaldoDisponible: true,
      },
      {
        nombre: "Emitir Cheque",
        esDebito: true,
        afectaSaldo: true,
        afectaSaldoDisponible: false,
      },
    ],
    skipDuplicates: true,
  });

  // Obtener los tipos de operaciones creados
  const tiposOperacionData = await prisma.tipoOperacion.findMany();

  // Crear operaciones para cada cuenta bancaria
  const operacionesCuentaBancoFamiliar = await prisma.operacion.createMany({
    data: [
      {
        tipoOperacionId: tiposOperacionData.find((tipo) => tipo.nombre === "Movimiento Debito").id,
        fechaOperacion: new Date(),
        monto: 100000,
        cuentaBancariaOrigenId: cuentaBancariaBancoFamiliar.id,
        bancoInvolucrado: "Banco Familiar",
        nombreInvolucrado: "Juan Perez",
        cuentaInvolucrado: "22-2851549",
        rucInvolucrado: "80017052-0",
        concepto: "Pago de Servicios",
        numeroComprobante: "000001",
      },
      {
        tipoOperacionId: tiposOperacionData.find((tipo) => tipo.nombre === "Movimiento Debito").id,
        fechaOperacion: new Date(),
        monto: 150000,
        cuentaBancariaOrigenId: cuentaBancariaBancoFamiliar.id,
        bancoInvolucrado: "Banco Itaú",
        nombreInvolucrado: "Maria Gonzalez",
        cuentaInvolucrado: "11-223344",
        rucInvolucrado: "1234567890",
        concepto: "Pago de Salario",
        numeroComprobante: "000002",
      },
      {
        tipoOperacionId: tiposOperacionData.find((tipo) => tipo.nombre === "Transferencia").id,
        fechaOperacion: new Date(),
        monto: 50000,
        cuentaBancariaOrigenId: cuentaBancariaBancoFamiliar.id,
        bancoInvolucrado: "Banco Atlas",
        nombreInvolucrado: "Pedro Rodriguez",
        cuentaInvolucrado: "33-445566",
        rucInvolucrado: "0987654321",
        concepto: "Transferencia de fondos",
        numeroComprobante: "000003",
      },
      {
        tipoOperacionId: tiposOperacionData.find((tipo) => tipo.nombre === "Movimiento Credito").id,
        fechaOperacion: new Date(),
        monto: 200000,
        cuentaBancariaOrigenId: cuentaBancariaBancoFamiliar.id,
        bancoInvolucrado: "Banco Familiar",
        nombreInvolucrado: "María López",
        cuentaInvolucrado: "22-2851549",
        rucInvolucrado: "7654321-0",
        concepto: "Pago de Compra de Electrodomésticos",
        numeroComprobante: "000004",
      },
    ],
    skipDuplicates: true,
  });

  const operacionesCuentaBancoItau = await prisma.operacion.createMany({
    data: [
      {
        tipoOperacionId: tiposOperacionData.find((tipo) => tipo.nombre === "Movimiento Credito").id,
        fechaOperacion: new Date(),
        monto: 100000,
        cuentaBancariaOrigenId: cuentaBancariaBancoItau.id,
        bancoInvolucrado: "Banco Familiar",
        nombreInvolucrado: "Bryan Ojeda",
        cuentaInvolucrado: "22-3331549",
        rucInvolucrado: "5131477-0",
        concepto: "Pago de Servicios",
        numeroComprobante: "000005",
      },
      {
        tipoOperacionId: tiposOperacionData.find((tipo) => tipo.nombre === "Movimiento Credito").id,
        fechaOperacion: new Date(),
        monto: 150000,
        cuentaBancariaOrigenId: cuentaBancariaBancoItau.id,
        bancoInvolucrado: "Banco Itaú",
        nombreInvolucrado: "Mirian Gonzalez",
        cuentaInvolucrado: "17-203344",
        rucInvolucrado: "222333-0",
        concepto: "Pago de Salario",
        numeroComprobante: "000006",
      },
      {
        tipoOperacionId: tiposOperacionData.find((tipo) => tipo.nombre === "Transferencia").id,
        fechaOperacion: new Date(),
        monto: 50000,
        cuentaBancariaOrigenId: cuentaBancariaBancoItau.id,
        bancoInvolucrado: "Banco Atlas",
        nombreInvolucrado: "Julio Rodriguez",
        cuentaInvolucrado: "38-440066",
        rucInvolucrado: "511110-0",
        concepto: "Transferencia de fondos",
        numeroComprobante: "000007",
      },
      {
        tipoOperacionId: tiposOperacionData.find((tipo) => tipo.nombre === "Movimiento Debito").id,
        fechaOperacion: new Date(),
        monto: 200000,
        cuentaBancariaOrigenId: cuentaBancariaBancoItau.id,
        bancoInvolucrado: "Banco Familiar",
        nombreInvolucrado: "Gustavo López",
        cuentaInvolucrado: "17-203344",
        rucInvolucrado: "4454321-0",
        concepto: "Pago de Compra de Muebles",
        numeroComprobante: "000008",
      },
    ],
    skipDuplicates: true,
  });
  
  const cajas = await prisma.caja.createMany({
    data: [
      {
        "id": "db639420-1db5-4cee-8f1e-c27435baba47",
        "numero": 1,
        "estaCerrado": true,
      },
      {
        "id": "2f353283-8c52-44e8-ac6b-bb807b11b5dd",
        "numero": 2,
        "estaCerrado": true,
      },
      {
        "id": "fc103569-4d29-47b6-a43d-786d600c8008",
        "numero": 3,
        "estaCerrado": true,
      },
      {
        "id": "fc103569-4d29-47b6-a43d-786d600c8007",
        "numero": 4,
        "estaCerrado": true,
      },
      {
        "id": "fc103569-4d29-47b6-a43d-786d600c8001",
        "numero": 5,
        "estaCerrado": true,
      },
      {
        "id": "fc103569-4d29-47b6-a43d-786d600c8006",
        "numero": 316,
        "estaCerrado": true,
      }
    ]
  })


  // const cheques = await prisma.cheque.createMany({
  //   data: [
  //     {
  //       numeroCheque: "000001",
  //       esRecibido: true,
  //       fechaEmision: new Date(),
  //       involucrado: "Mirian Gonzalez",
  //       bancoChequeId: itau.id,
  //       cuentaBancariaAfectadaId: cuentaBancariaBancoItau.id,
  //       monto: 15000,
  //     },
  //     {
  //       numeroCheque: "000002",
  //       esRecibido: true,
  //       fechaEmision: new Date(),
  //       involucrado: "Pedro Ramirez",
  //       bancoChequeId: atlas.id,
  //       cuentaBancariaAfectadaId: cuentaBancariaBancoItau.id,
  //       monto: 25000,
  //     },
  //     {
  //       numeroCheque: "000003",
  //       esRecibido: false,
  //       fechaEmision: new Date(),
  //       involucrado: "Augusto Tomphson",
  //       bancoChequeId: bancoFamiliar.id,
  //       cuentaBancariaAfectadaId: cuentaBancariaBancoItau.id,
  //       monto: 7500,
  //     },
  //     {
  //       numeroCheque: "000004",
  //       esRecibido: false,
  //       fechaEmision: new Date(),
  //       involucrado: "Augusto Tomphson",
  //       bancoChequeId: bancoFamiliar.id,
  //       cuentaBancariaAfectadaId: cuentaBancariaBancoAtlas.id,
  //       monto: 7500,
  //     },
  //     {
  //       numeroCheque: "000005",
  //       esRecibido: true,
  //       fechaEmision: new Date(),
  //       involucrado: "Antonio Gonzalez",
  //       bancoChequeId: itau.id,
  //       cuentaBancariaAfectadaId: cuentaBancariaBancoFamiliar.id,
  //       monto: 18000,
  //     }
  //   ]
  // })

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
