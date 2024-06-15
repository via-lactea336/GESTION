import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { Movimiento } from "@prisma/client";
import { movimientoDetallado } from "../cajaVentanasEmergentes/ResumenDetalle";

// Definir los estilos
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
  },
  bold: {
    fontWeight: "bold",
  },
  table: {
    display: "flex",
    width: "auto",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    width: "50%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableCell: {
    margin: 5,
    padding: 5,
    fontSize: 12,
  },
  tableHeader: {
    backgroundColor: "#D3D3D3",
    fontWeight: "bold",
  },
  movimientoSection: {
    backgroundColor: "#f8f8f8",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  movimientoHeader: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  movimientoDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  detalle: {
    marginBottom: 5,
    flexWrap: "wrap",
  },
  textContainer: {
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
});

type ResumenCajaProps = {
  createdAt: Date;
  caja: number;
  cajero: string;
  apertura: { saldoInicial: number; createdAt: Date };
  montoRegistrado: number;
  montoIngreso: number;
  montoIngresoCheque: number;
  montoIngresoTarjeta: number;
  movimientos: Array<movimientoDetallado>;
  observaciones: string;
};

const formatDate = (date: Date) => new Date(date).toLocaleDateString();
const formatTime = (date: Date) =>
  new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// Componente del Resumen de Caja PDF
const ResumenCajaPDF: React.FC<ResumenCajaProps> = ({
  createdAt,
  caja,
  cajero,
  apertura,
  montoRegistrado,
  montoIngreso,
  montoIngresoCheque,
  montoIngresoTarjeta,
  movimientos,
  observaciones,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>Resumen de Caja</Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Fecha: </Text>
          {formatDate(createdAt)}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Hora: </Text>
          {formatTime(createdAt)}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Caja: </Text>
          {caja}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Cajero: </Text>
          {cajero}
        </Text>
        <View style={styles.table}>
          <View style={[styles.tableRow]}>
            <Text style={[styles.tableCol, styles.tableCell]}>
              Caja Inicial
            </Text>
            <Text style={[styles.tableCol, styles.tableCell]}>
              {Number(apertura?.saldoInicial).toLocaleString()} Gs.
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCol, styles.tableCell]}>
              Dinero en Caja
            </Text>
            <Text style={[styles.tableCol, styles.tableCell]}>
              {Number(montoRegistrado).toLocaleString()} Gs.
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCol, styles.tableCell]}>
              Observaciones
            </Text>
            <Text style={[styles.tableCol, styles.tableCell]}>
              {observaciones}
            </Text>
          </View>
        </View>

        <Text style={styles.header}>
          Resumen de ingresos y egresos por forma de pago
        </Text>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCol, styles.tableCell]}>
              Forma de Pago
            </Text>
            <Text style={[styles.tableCol, styles.tableCell]}>Ingreso</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCol, styles.tableCell]}>Efectivo</Text>
            <Text style={[styles.tableCol, styles.tableCell]}>
              {Number(montoIngreso).toLocaleString()} Gs.
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCol, styles.tableCell]}>Cheque</Text>
            <Text style={[styles.tableCol, styles.tableCell]}>
              {Number(montoIngresoCheque).toLocaleString()} Gs.
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCol, styles.tableCell]}>Tarjetas</Text>
            <Text style={[styles.tableCol, styles.tableCell]}>
              {Number(montoIngresoTarjeta).toLocaleString()} Gs.
            </Text>
          </View>
        </View>
        <Text style={styles.header}>Movimientos</Text>

        {movimientos?.map((mov) => (
          <View style={styles.movimientoSection} key={mov.id}>
            <Text style={styles.movimientoHeader}>
              {mov.esIngreso ? "Operacion de Ingreso" : "Operacion de Egreso"}
            </Text>
            <View style={styles.movimientoDetails}>
              <View>
                <Text style={[styles.detalle, styles.textContainer]}>
                  Monto total de la operacion:{" "}
                  {Number(mov.monto).toLocaleString("es-PY")} Gs.
                </Text>
                <Text style={[styles.detalle, styles.textContainer]}>
                  Fecha: {formatDate(mov.createdAt)}
                </Text>
                <Text style={[styles.detalle, styles.textContainer]}>
                  Hora: {formatTime(mov.createdAt)}
                </Text>
              </View>
              <View>
                {mov.esIngreso ? (
                  <>
                    <Text style={[styles.detalle, styles.textContainer]}>
                      Detalles de Factura
                    </Text>
                    <Text style={[styles.detalle, styles.textContainer]}>
                      Tipo de factura:{" "}
                      {mov.factura?.esContado ? "Contado" : "Credito"}
                    </Text>
                    <Text style={[styles.detalle, styles.textContainer]}>
                      Numero de Factura: {mov.factura?.numeroFactura}
                    </Text>
                    <Text style={[styles.detalle, styles.textContainer]}>
                      Fecha de emision de la factura:{" "}
                      {mov.factura?.createdAt
                        ? formatDate(mov.factura.createdAt)
                        : ""}
                    </Text>
                    <Text style={[styles.detalle, styles.textContainer]}>
                      Monto total a pagar:{" "}
                      {Number(mov.factura?.total).toLocaleString("es-PY")} Gs.
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={[styles.detalle, styles.textContainer]}>
                      Encargado: {mov.comprobante?.user?.nombre}{" "}
                      {mov.comprobante?.user?.apellido}
                    </Text>
                    <Text style={[styles.detalle, styles.textContainer]}>
                      RUC: {mov.comprobante?.user?.docIdentidad}
                    </Text>
                    <Text style={[styles.detalle, styles.textContainer]}>
                      Observaciones: {mov.comprobante?.concepto}
                    </Text>
                  </>
                )}
              </View>
            </View>
            {mov.esIngreso && mov.movimientoDetalles?.length > 0 && (
              <View>
                <Text style={[styles.detalle, styles.textContainer]}>
                  Detalles Operacion
                </Text>
                {mov.movimientoDetalles.map((detalle, index) => (
                  <View
                    key={index}
                    style={[
                      styles.tableRow,
                      { borderBottom: "1px solid #000" },
                    ]}
                  >
                    <Text style={styles.tableCell}>N°{index + 1}</Text>
                    <Text style={styles.tableCell}>
                      Metodo de pago: {detalle.metodoPago}
                    </Text>
                    <Text style={styles.tableCell}>
                      Monto Parcial: {Number(detalle.monto).toLocaleString()}{" "}
                      Gs.
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export const generatePDF = async (props: ResumenCajaProps) => {
  const blob = await pdf(<ResumenCajaPDF {...props} />).toBlob();
  saveAs(blob, "ResumenCaja.pdf");
};

export default ResumenCajaPDF;
