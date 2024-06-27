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
import { movimientoDetallado } from "../cajaVentanasEmergentes/ResumenDetalle";
import { DatosExtendidosRegistroCaja } from "@/lib/definitions";

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
    backgroundColor: "#333",
    color: "#FFF",
    padding: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 14,
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
    padding: 5,
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
  innerTable: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    width: "100%",
  },
  innerTableHeader: {
    backgroundColor: "#D3D3D3",
    fontWeight: "bold",
    textAlign: "center",
  },
  innerTableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  innerTableCell: {
    padding: 5,
    width: "50%",
    textAlign: "center",
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
  movimientos: movimientoDetallado[];
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
}) => {
  const movimientosIngreso = movimientos.filter((mov) => mov.esIngreso);
  const movimientosEgreso = movimientos.filter((mov) => !mov.esIngreso);

  return (
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
            <Text style={styles.bold}>N° de Caja: </Text>
            {caja}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Cajero: </Text>
            {cajero}
          </Text>
          <View style={styles.table}>
            <View style={[styles.tableRow]}>
              <Text style={[styles.tableCol, styles.tableHeader]}>
                Caja Inicial
              </Text>
              <Text style={[styles.tableCol, styles.tableHeader]}>
                {Number(apertura?.saldoInicial).toLocaleString()} Gs.
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCol, styles.tableHeader]}>
                Dinero Registrado
              </Text>
              <Text style={[styles.tableCol, styles.tableHeader]}>
                {Number(montoRegistrado).toLocaleString()} Gs.
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCol, styles.tableHeader]}>
                Observaciones
              </Text>
              <Text style={[styles.tableCol, styles.tableHeader]}>
                {observaciones}
              </Text>
            </View>
          </View>

          <Text style={styles.header}>
            Resumen de ingresos por forma de pago
          </Text>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCol, styles.tableHeader]}>
                Forma de Pago
              </Text>
              <Text style={[styles.tableCol, styles.tableHeader]}>Ingreso</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCol, styles.tableHeader]}>
                Efectivo
              </Text>
              <Text style={[styles.tableCol, styles.tableHeader]}>
                {Number(montoIngreso).toLocaleString()} Gs.
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCol, styles.tableHeader]}>Cheque</Text>
              <Text style={[styles.tableCol, styles.tableHeader]}>
                {Number(montoIngresoCheque).toLocaleString()} Gs.
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCol, styles.tableHeader]}>
                Tarjetas
              </Text>
              <Text style={[styles.tableCol, styles.tableHeader]}>
                {Number(montoIngresoTarjeta).toLocaleString()} Gs.
              </Text>
            </View>
          </View>
        </View>
      </Page>

      {movimientosIngreso.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.header}>Movimientos de Ingreso</Text>
            {movimientosIngreso.map((mov) => (
              <View style={styles.movimientoSection} key={mov.id}>
                <View style={styles.movimientoDetails}>
                  <View>
                    <Text style={[styles.detalle, styles.textContainer]}>
                      Monto total de la operación:{" "}
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
                    <View style={styles.innerTable}>
                      <Text style={styles.innerTableHeader}>
                        Detalles de Factura
                      </Text>
                      <View style={styles.innerTableRow}>
                        <Text style={styles.innerTableCell}>
                          Tipo de factura:{" "}
                          {mov.factura?.esContado ? "Contado" : "Crédito"}
                        </Text>
                        <Text style={styles.innerTableCell}>
                          Número de Factura: {mov.factura?.numeroFactura}
                        </Text>
                      </View>
                      <View style={styles.innerTableRow}>
                        <Text style={styles.innerTableCell}>
                          Fecha de emisión de la factura:{" "}
                          {mov.factura?.createdAt
                            ? formatDate(mov.factura.createdAt)
                            : ""}
                        </Text>
                        <Text style={styles.innerTableCell}>
                          Monto total a pagar:{" "}
                          {Number(mov.factura?.total).toLocaleString("es-PY")}{" "}
                          Gs.
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                {mov.esIngreso && mov.movimientoDetalles?.length > 0 && (
                  <View>
                    <Text style={[styles.detalle, styles.textContainer]}>
                      Detalles Operación
                    </Text>
                    {mov.movimientoDetalles.map((detalle, index) => (
                      <View
                        key={index}
                        style={[
                          styles.tableRow,
                          { borderBottom: "1px solid #000" },
                        ]}
                      >
                        <Text style={styles.tableCol}>N°{index + 1}</Text>
                        <Text style={styles.tableCol}>
                          Método de pago: {detalle.metodoPago}
                        </Text>
                        <Text style={styles.tableCol}>
                          Monto Parcial:{" "}
                          {Number(detalle.monto).toLocaleString()} Gs.
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        </Page>
      )}

      {movimientosEgreso.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.header}>Movimientos de Egreso</Text>
            {movimientosEgreso.map((mov) => (
              <View style={styles.movimientoSection} key={mov.id}>
                <View style={styles.movimientoDetails}>
                  <View>
                    <Text style={[styles.detalle, styles.textContainer]}>
                      Monto total de la operación:{" "}
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
                  </View>
                </View>
              </View>
            ))}
          </View>
        </Page>
      )}
    </Document>
  );
};

export const generatePDF = async (props: ResumenCajaProps) => {
  const blob = await pdf(<ResumenCajaPDF {...props} />).toBlob();
  saveAs(blob, "ResumenCaja.pdf");
};

export default ResumenCajaPDF;
