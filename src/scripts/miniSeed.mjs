import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

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