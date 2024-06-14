import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getNextMonthDate(date) {
    const nextMonthDate = new Date(date);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
  
    // Ajustar el día del mes si la fecha del próximo mes no es válida
    // (por ejemplo, de enero 31 a marzo 3, ya que febrero 31 no es válido)
    if (nextMonthDate.getDate() !== date.getDate()) {
      nextMonthDate.setDate(0); // Configurar al último día del mes anterior
    }
  
    return nextMonthDate;
}

const facturas = await prisma.factura.createMany({
    data: [
        {
            clienteId: "1a461332-9a14-4d60-9ac6-70b77fc863cb",
            numeroFactura: "001-001-1401",
            esContado: true,
            totalSaldoPagado: 1800000,
            fechaEmision: new Date("2023-07-02"),
            pagado:new Date("2023-07-02"),
            fechaVencimiento: getNextMonthDate(new Date()),
            total: 1800000,
            ivaTotal: 163636,
        },
        {
            clienteId: "6d25ad3d-93c0-4ee7-9d33-1a077f9750d4",
            numeroFactura: "001-001-1501",
            esContado: true,
            totalSaldoPagado: 3800000,
            fechaEmision: new Date("2023-08-02"),
            pagado:new Date("2023-08-02"),
            fechaVencimiento: getNextMonthDate(new Date()),
            total: 3800000,
            ivaTotal: 345454,
        },
        {
            clienteId: "6d25ad3d-93c0-4ee7-9d33-1a077f9750d4",
            numeroFactura: "001-001-1601",
            esContado: true,
            totalSaldoPagado: 3000000,
            fechaEmision: new Date("2023-09-02"),
            pagado:new Date("2023-09-02"),
            fechaVencimiento: getNextMonthDate(new Date()),
            total: 3000000,
            ivaTotal: 272727,
        },
        {
            clienteId: "d292ca5d-c5d6-4ce4-a03d-1d135c162e60",
            numeroFactura: "001-001-1701",
            esContado: true,
            totalSaldoPagado: 2700000,
            fechaEmision: new Date("2023-10-02"),
            pagado:new Date("2023-10-02"),
            fechaVencimiento: getNextMonthDate(new Date()),
            total: 2700000,
            ivaTotal: 245454,
        },
        {
            clienteId: "d292ca5d-c5d6-4ce4-a03d-1d135c162e60",
            numeroFactura: "001-001-1801",
            esContado: true,
            totalSaldoPagado: 2000000,
            fechaEmision: new Date("2023-11-02"),
            pagado:new Date("2023-11-02"),
            fechaVencimiento: getNextMonthDate(new Date()),
            total: 2000000,
            ivaTotal: 181818,
        },
        {
            clienteId: "d292ca5d-c5d6-4ce4-a03d-1d135c162e60",
            numeroFactura: "001-001-1901",
            esContado: true,
            totalSaldoPagado: 1000000,
            fechaEmision: new Date("2023-12-02"),
            pagado:new Date("2023-12-02"),
            fechaVencimiento: getNextMonthDate(new Date()),
            total: 1000000,
            ivaTotal: 90909,
        },
        {
            clienteId: "1a461332-9a14-4d60-9ac6-70b77fc863cb",
            numeroFactura: "001-001-2021",
            esContado: true,
            totalSaldoPagado: 2000000,
            fechaEmision: new Date("2024-01-02"),
            pagado:new Date("2024-01-02"),
            total: 2000000,
            ivaTotal: 181818,
        },
        {
            clienteId: "9a569332-0710-42c6-99bc-039a0b14b9cc",
            numeroFactura: "001-001-2122",
            esContado: true,
            totalSaldoPagado: 2500000,
            fechaEmision: new Date("2024-02-02"),
            pagado:new Date("2024-02-02"),
            total: 2500000,
            ivaTotal: 227272,
        },
        {
            clienteId: "57909003-563c-4d3d-bca7-f4a7e63d8e01",
            numeroFactura: "001-001-2223",
            esContado: true,
            totalSaldoPagado: 1000000,
            fechaEmision: new Date("2024-03-02"),
            pagado:new Date("2024-03-02"),
            total: 1000000,
            ivaTotal: 90909,
        },
        {
            clienteId: "c88dab58-8ff0-40cc-a921-878b045dc091",
            numeroFactura: "001-001-2324",
            esContado: true,
            totalSaldoPagado: 1000000,
            fechaEmision: new Date("2024-04-02"),
            fechaVencimiento: getNextMonthDate(new Date()),
            total: 1000000,
            pagado:new Date("2024-04-02"),
            ivaTotal: 90909,
        },
        {
            clienteId: "9a569332-0710-42c6-99bc-039a0b14b9cc",
            numeroFactura: "001-002-2425",
            esContado: true,
            totalSaldoPagado: 4000000,
            fechaEmision: new Date("2024-05-02"),
            pagado:new Date("2024-05-02"),
            fechaVencimiento: getNextMonthDate(new Date()),
            total: 4000000,
            ivaTotal: 363636,
        },
        {
            clienteId: "57909003-563c-4d3d-bca7-f4a7e63d8e01",
            numeroFactura: "001-002-2526",
            esContado: true,
            totalSaldoPagado: 4500000,
            fechaEmision: new Date("2024-06-02"),
            pagado:new Date("2024-06-02"),
            fechaVencimiento: getNextMonthDate(new Date()),
            total: 4500000,
            ivaTotal: 409090,
        },
        
    ],
});