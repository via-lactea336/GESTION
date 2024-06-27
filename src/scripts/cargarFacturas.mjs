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
await prisma.comprobante.deleteMany({});
await prisma.recibos.deleteMany({});
  
await prisma.movimientoDetalle.deleteMany({});

await prisma.movimiento.deleteMany({});

await prisma.registroCaja.deleteMany({});

await prisma.arqueoDeCaja.deleteMany({});

await prisma.aperturaCaja.deleteMany({});


await prisma.factura.deleteMany({});
await prisma.detalleAsiento.deleteMany({});
await prisma.cuenta.deleteMany({});
await prisma.asiento.deleteMany({});
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
const cuentas = await prisma.cuenta.createMany({
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
  })

const facturas = await prisma.factura.createMany({
    data: [
        {
            clienteId: "1a461332-9a14-4d60-9ac6-70b77fc863cb",
            numeroFactura: "001-001-1401",
            esContado: true,
            totalSaldoPagado: 0,
            fechaEmision: new Date("2023-07-02"),
            total: 1800000,
            ivaTotal: 163636,
        },
        {
            clienteId: "6d25ad3d-93c0-4ee7-9d33-1a077f9750d4",
            numeroFactura: "001-001-1501",
            esContado: true,
            totalSaldoPagado: 0,
            fechaEmision: new Date("2023-08-02"),
            total: 3800000,
            ivaTotal: 345454,
        },
        {
            clienteId: "6d25ad3d-93c0-4ee7-9d33-1a077f9750d4",
            numeroFactura: "001-001-1601",
            esContado: true,
            totalSaldoPagado: 0,
            fechaEmision: new Date("2023-09-02"),
            total: 3000000,
            ivaTotal: 272727,
        },
        {
            clienteId: "d292ca5d-c5d6-4ce4-a03d-1d135c162e60",
            numeroFactura: "001-001-1701",
            esContado: true,
            totalSaldoPagado: 0,
            fechaEmision: new Date("2023-10-02"),
            total: 2700000,
            ivaTotal: 245454,
        },
        {
            clienteId: "d292ca5d-c5d6-4ce4-a03d-1d135c162e60",
            numeroFactura: "001-001-1801",
            esContado: true,
            totalSaldoPagado: 0,
            fechaEmision: new Date("2023-11-02"),
            total: 2000000,
            ivaTotal: 181818,
        },
        {
            clienteId: "d292ca5d-c5d6-4ce4-a03d-1d135c162e60",
            numeroFactura: "001-001-1901",
            esContado: true,
            totalSaldoPagado: 0,
            fechaEmision: new Date("2023-12-02"),
            total: 1000000,
            ivaTotal: 90909,
        },
        {
            clienteId: "1a461332-9a14-4d60-9ac6-70b77fc863cb",
            numeroFactura: "001-001-2021",
            esContado: true,
            totalSaldoPagado: 0,
            fechaEmision: new Date("2024-01-02"),
            total: 2000000,
            ivaTotal: 181818,
        },
        {
            clienteId: "9a569332-0710-42c6-99bc-039a0b14b9cc",
            numeroFactura: "001-001-2122",
            esContado: true,
            totalSaldoPagado: 0,
            fechaEmision: new Date("2024-02-02"),
            total: 2500000,
            ivaTotal: 227272,
        },
        {
            clienteId: "57909003-563c-4d3d-bca7-f4a7e63d8e01",
            numeroFactura: "001-001-2223",
            esContado: true,
            totalSaldoPagado: 0,
            fechaEmision: new Date("2024-03-02"),
            total: 1000000,
            ivaTotal: 90909,
        },
        {
            clienteId: "c88dab58-8ff0-40cc-a921-878b045dc091",
            numeroFactura: "001-001-2324",
            esContado: true,
            totalSaldoPagado: 0,
            fechaEmision: new Date("2024-04-02"),
            total: 1000000,
            ivaTotal: 90909,
        },
        {
            clienteId: "9a569332-0710-42c6-99bc-039a0b14b9cc",
            numeroFactura: "001-002-2425",
            esContado: true,
            totalSaldoPagado: 0,
            fechaEmision: new Date("2024-05-02"),
            total: 4000000,
            ivaTotal: 363636,
        },
        {
            clienteId: "57909003-563c-4d3d-bca7-f4a7e63d8e01",
            numeroFactura: "001-002-2526",
            esContado: true,
            totalSaldoPagado: 0,
            fechaEmision: new Date("2024-06-03"),
            total: 4500000,
            ivaTotal: 409090,
        },
        {
            clienteId: "57909003-563c-4d3d-bca7-f4a7e63d8e01",
            numeroFactura: "001-002-2527",
            esContado: false,
            totalSaldoPagado: 0,
            fechaEmision: new Date("2024-06-04"),
            fechaVencimiento: getNextMonthDate(new Date()),
            total: 450000,
            ivaTotal: 40909,
        },
        {
            clienteId: "1a461332-9a14-4d60-9ac6-70b77fc863cb",
            numeroFactura: "001-002-2528",
            esContado: false,
            totalSaldoPagado: 0,
            fechaEmision: new Date("2024-06-05"),
            fechaVencimiento: getNextMonthDate(new Date()),
            total: 370000,
            ivaTotal: 33636,
        },
        {
            clienteId: "1a461332-9a14-4d60-9ac6-70b77fc863cb",
            numeroFactura: "001-002-2529",
            esContado: true,
            totalSaldoPagado: 0,
            fechaEmision: new Date(),
            total: 520000,
            ivaTotal: 47272,
        },
        {
            clienteId: "c88dab58-8ff0-40cc-a921-878b045dc091",
            numeroFactura: "001-002-2530",
            esContado: true,
            totalSaldoPagado: 0,
            fechaEmision: new Date(),
            total: 835000,
            ivaTotal: 75909,
        },
        {
            clienteId: "9a569332-0710-42c6-99bc-039a0b14b9cc",
            numeroFactura: "001-002-2531",
            esContado: true,
            totalSaldoPagado: 0,
            fechaEmision: new Date(),
            total: 478000,
            ivaTotal: 43454,
        },
        {
            clienteId: "9a569332-0710-42c6-99bc-039a0b14b9cc",
            numeroFactura: "001-002-2532",
            esContado: false,
            totalSaldoPagado: 0,
            fechaEmision: new Date(),
            fechaVencimiento: getNextMonthDate(new Date()),
            total: 635000,
            ivaTotal: 57727,
        },
        {
            clienteId: "9a569332-0710-42c6-99bc-039a0b14b9cc",
            numeroFactura: "001-002-2533",
            esContado: false,
            totalSaldoPagado: 0,
            fechaEmision: new Date(),
            fechaVencimiento: getNextMonthDate(new Date()),
            total: 742000,
            ivaTotal: 67454,
        },
        
    ],
});