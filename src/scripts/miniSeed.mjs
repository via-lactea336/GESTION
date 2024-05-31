import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const caja1 = await prisma.caja.create({
        data: {
            numero: 1,
            deleted: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    });

    const caja2 = await prisma.caja.create({
        data: {
            numero: 2,
            deleted: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    });

    const caja3 = await prisma.caja.create({
        data: {
            numero: 3,
            deleted: null,
            createdAt: new Date(),
            updatedAt: new Date(),
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