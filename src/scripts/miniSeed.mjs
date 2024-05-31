import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

    // productos de ferreteria
    const productos = await prisma.producto.createMany({
        data: [
            {
                nombre:"Martillo de carpintero",
                precio: 250000,
                codigo: "001",
                createdAt: new Date(),
                updatedAt: new Date(),
                deleted:null,
            },
            {
                nombre:"Taladro inalambrico",
                precio: 750000,
                codigo: "002",
                createdAt: new Date(),
                updatedAt: new Date(),
                deleted:null,
            },
            {
                nombre:"Cinta metrica",
                precio: 50000,
                codigo: "003",
                createdAt: new Date(),
                updatedAt: new Date(),
                deleted:null,
            },
            {
                nombre:"Caja de herramientas",
                precio: 350000,
                codigo: "004",
                createdAt: new Date(),
                updatedAt: new Date(),
                deleted:null,
            },
            {
                nombre:"Sierra electrica",
                precio: 450000,
                codigo: "005",
                createdAt: new Date(),
                updatedAt: new Date(),
                deleted:null,
            },
            {
                nombre:"Llave de tubo",
                precio: 150000,
                codigo: "006",
                createdAt: new Date(),
                updatedAt: new Date(),
                deleted:null,
            },
            {
                nombre:"Destornillador",
                precio: 75000,
                codigo: "007",
                createdAt: new Date(),
                updatedAt: new Date(),
                deleted:null,
            },
            {
                nombre:"Clavos de acero",
                precio: 20000,
                codigo: "008",
                createdAt: new Date(),
                updatedAt: new Date(),
                deleted:null,
            },
            {
                nombre:"Tornillos de acero",
                precio: 25000,
                codigo: "009",
                createdAt: new Date(),
                updatedAt: new Date(),
                deleted:null,
            },
            {
                nombre:"Pegamento de contacto",
                precio: 30000,
                codigo: "010",
                createdAt: new Date(),
                updatedAt: new Date(),
                deleted:null,
            
            },
        ],
        skipDuplicates: true,
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