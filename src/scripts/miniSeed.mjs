import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

    /*const facturas = await prisma.factura.createMany({
        data: [
            {
                clienteId: "1a461332-9a14-4d60-9ac6-70b77fc863cb",
                esContado: true,
                totalSaldoPagado: 100000,
                total: 100000,
                ivaTotal: 9090,
            },
            {
                clienteId: "9a569332-0710-42c6-99bc-039a0b14b9cc",
                esContado: true,
                totalSaldoPagado: 50000,
                total: 50000,
                ivaTotal: 4545,
            },
            {
                clienteId: "9a569332-0710-42c6-99bc-039a0b14b9cc",
                esContado: true,
                totalSaldoPagado: 200000,
                total: 200000,
                ivaTotal: 18180,
            },
            {
                clienteId: "57909003-563c-4d3d-bca7-f4a7e63d8e01",
                esContado: true,
                totalSaldoPagado: 100000,
                total: 100000,
                ivaTotal: 9090,
            },
            {
                clienteId: "57909003-563c-4d3d-bca7-f4a7e63d8e01",
                esContado: true,
                totalSaldoPagado: 300000,
                total: 300000,
                ivaTotal: 27270,
            },
            {
                clienteId: "9a569332-0710-42c6-99bc-039a0b14b9cc",
                esContado: true,
                totalSaldoPagado: 150000,
                total: 150000,
                ivaTotal: 13635,
            },
        ],
    });*/

    const facturas = await prisma.factura.findMany({});
   const movimientos = await prisma.movimiento.createMany({
        data: [
            {
                id: "579ed428-b2e6-4da4-ae53-ea5b00068137",
                aperturaId: "29a5265c-eb44-432f-9564-d92280cbbd2e",
                esIngreso: true,
                monto: 100000,
                facturaId: facturas[0].id,
            },
            {
                id: "840eac3b-28d8-4fb2-80c7-053fee78656e",
                aperturaId: "29a5265c-eb44-432f-9564-d92280cbbd2e",
                esIngreso: false,
                monto: 50000,
                facturaId: facturas[1].id,
            },
            {
                id: "cdd3b710-48ce-4253-b842-39858fef7dd7",
                aperturaId: "29a5265c-eb44-432f-9564-d92280cbbd2e",
                esIngreso: true,
                monto: 200000,
                facturaId: facturas[2].id,
            },
            {
                id: "be1f3a4b-67e2-4219-b83f-fd4e1e6a5163",
                aperturaId: "29a5265c-eb44-432f-9564-d92280cbbd2e",
                esIngreso: true,
                monto: 100000,
                facturaId: facturas[3].id,
            },
            {
                id: "c032da29-bb2c-4254-bf7f-89f5414b0cba",
                aperturaId: "29a5265c-eb44-432f-9564-d92280cbbd2e",
                esIngreso: true,
                monto: 300000,
                facturaId: facturas[4].id,
            },
            {
                id: "0dbd3dcb-f5a9-43d3-bfa8-d8754040f111",
                aperturaId: "29a5265c-eb44-432f-9564-d92280cbbd2e",
                esIngreso: true,
                monto: 150000,
                facturaId: facturas[5].id,
            },
        ],
    });

    const detalleMovimientos = await prisma.movimientoDetalle.createMany({
        data: [
            {
                movimientoId: "579ed428-b2e6-4da4-ae53-ea5b00068137",
                monto: 100000,
                createdAt: new Date(),
                updatedAt: new Date(),
                metodoPago: "EFECTIVO",
            },
            {
                movimientoId:"840eac3b-28d8-4fb2-80c7-053fee78656e",
                monto: 50000,
                createdAt: new Date(),
                updatedAt: new Date(),
                metodoPago: "EFECTIVO",
            },
            {
                movimientoId: "cdd3b710-48ce-4253-b842-39858fef7dd7",
                monto: 200000,
                createdAt: new Date(),
                updatedAt: new Date(),
                metodoPago: "EFECTIVO",
            },
            {
                movimientoId: "be1f3a4b-67e2-4219-b83f-fd4e1e6a5163",
                monto: 100000,
                createdAt: new Date(),
                updatedAt: new Date(),
                metodoPago: "EFECTIVO",
            },
            {
                movimientoId: "c032da29-bb2c-4254-bf7f-89f5414b0cba",
                monto: 300000,
                createdAt: new Date(),
                updatedAt: new Date(),
                metodoPago: "EFECTIVO",
            },
            {
                movimientoId: "0dbd3dcb-f5a9-43d3-bfa8-d8754040f111",
                monto: 150000,
                createdAt: new Date(),
                updatedAt: new Date(),
                metodoPago: "EFECTIVO",
            },    
        ],
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