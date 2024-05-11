import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const bancos = await prisma.banco.findMany({});
    const entidad = await prisma.entidad.findFirst({
        where: {
          nombre: "ACME S.A.",
        },
      });
    const cuentaBancariaBancoFamiliar = await prisma.cuentaBancaria.create({
        data: {
          numeroCuenta: "27-1851249",
          bancoId: bancos.find((banco) => banco.nombre === "Banco Familiar").id,
          entidadId: entidad.id,
          esCuentaAhorro: true,
          saldo: 1890000,
          saldoDisponible: 1890000,
        },
      });
    const cuentaBancariaBancoItau = await prisma.cuentaBancaria.create({
        data: {
            numeroCuenta: "13-1234999",
            bancoId: bancos.find((banco) => banco.nombre === "Banco Itaú").id,
            entidadId: entidad.id,
            esCuentaAhorro: true,
            saldo: 800000,
            saldoDisponible: 800000,
            },
        });

    const cuentaBancariaBancoAtlas = await prisma.cuentaBancaria.create({
        data: {
            numeroCuenta: "73-9930567",
            bancoId: bancos.find((banco) => banco.nombre === "Banco Atlas").id,
            entidadId: entidad.id,
            esCuentaAhorro: true,
            saldo: 1100000,
            saldoDisponible: 1100000,
            },
        });

    const tipoOperaciones = await prisma.tipoOperacion.findMany({});
    const operaciones = await prisma.operacion.findMany({});

    const operacion1 = await prisma.operacion.create({
        data: {
            tipoOperacionId: tipoOperaciones.find((tipo) => tipo.nombre === "Pago de Servicios").id,
            fechaOperacion: new Date(),
            monto: 100000,
            cuentaBancariaOrigenId: cuentaBancariaBancoItau.id,
            bancoInvolucrado: "Banco Familiar",
            nombreInvolucrado: "ANDE",
            cuentaInvolucrado: "22-1999988",
            rucInvolucrado: "3131467-0",
            concepto: "Pago de Energía Eléctrica",
            numeroComprobante: "000009",
            },
        });

    const operacion2 = await prisma.operacion.create({
        data: {
            tipoOperacionId: tipoOperaciones.find((tipo) => tipo.nombre === "Pago de Servicios").id,
            fechaOperacion: new Date(),
            monto: 200000,
            cuentaBancariaOrigenId: cuentaBancariaBancoFamiliar.id,
            bancoInvolucrado: "Banco Itaú",
            nombreInvolucrado: "COPACO",
            cuentaInvolucrado: "13-1234999",
            rucInvolucrado: "80017052-0",
            concepto: "Pago de Internet",
            numeroComprobante: "000010",
            },
        });
    
    const operacion3 = await prisma.operacion.create({
        data: {
            tipoOperacionId: tipoOperaciones.find((tipo) => tipo.nombre === "Pago de Servicios").id,
            fechaOperacion: new Date(),
            monto: 500000,
            cuentaBancariaOrigenId: cuentaBancariaBancoAtlas.id,
            bancoInvolucrado: "Banco Familiar",
            nombreInvolucrado: "ESSAP",
            cuentaInvolucrado: "77-1234567",
            rucInvolucrado: "80000052-0",
            concepto: "Pago de Agua",
            numeroComprobante: "000011",
            },
        });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });