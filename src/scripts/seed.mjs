import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Crear usuario Admin

  // Crear bancos
 /* const bancoFamiliar = await prisma.banco.create({
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
  */

  // Crear entidad de ejemplo
 /* const entidad = await prisma.entidad.create({
    data: {
      nombre: "ACME S.A.",
      ruc: "80017052-0",
    },
  });
*/
  // Crear cuentas bancarias en cada banco
  /*const cuentaBancariaBancoFamiliar = await prisma.cuentaBancaria.create({
    data: {
      numeroCuenta: "22-2851549",
      bancoId: "3ae57eff-6661-44fd-a062-87d2f5d6e425",
      entidadId: "666255a1-d7bd-43f9-aaa4-a6d8198ec071",
      esCuentaAhorro: false,
      saldo: 0,
      saldoDisponible: 0,
    },
  });

  const cuentaBancariaBancoItau = await prisma.cuentaBancaria.create({
    data: {
      numeroCuenta: "11-223344",
      bancoId: "6c1bf193-23f8-48fb-be51-3c0046228801",
      entidadId: "666255a1-d7bd-43f9-aaa4-a6d8198ec071",
      esCuentaAhorro: false,
      saldo: 0,
      saldoDisponible: 0,
    },
  });

  const cuentaBancariaBancoAtlas = await prisma.cuentaBancaria.create({
    data: {
      numeroCuenta: "33-445566",
      bancoId: "0af7791c-ac7f-4476-88f0-78c94189c379",
      entidadId: "666255a1-d7bd-43f9-aaa4-a6d8198ec071",
      esCuentaAhorro: true,
      saldo: 0,
      saldoDisponible: 0,
    },
  });
  */
 /* const cuentas = await prisma.cuenta.createMany({
    data: [
      {
        codigo:"101.01.01",
        nombre:"PAGO A PROVEEDORES",
        asentable: true
      },
      {
        codigo:"101.01.02",
        nombre:"BANCOS",
        asentable: true
      },
      {
        codigo:"103.01.01",
        nombre:"CLIENTES",
        asentable: true
      },
      {
        codigo:"401.01.01",
        nombre:"RECAUDACION A DEPOSITAR",
        asentable: true
      }
    ]
  })*/
  await prisma.caja.deleteMany({});
  const cajas = await prisma.caja.createMany({
    data: [
      {
        "numero": 1,
        "estaCerrado": true,
      },
      {
        "numero": 2,
        "estaCerrado": true,
      },
      {
        "numero": 3,
        "estaCerrado": true,
      },
      {
        "numero": 4,
        "estaCerrado": true,
      },
      {
        "numero": 5,
        "estaCerrado": true,
      },
      {
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
