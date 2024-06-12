import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { CuentaBancaria } from "@prisma/client";
import { OperacionAndTipoOperacion } from "@/lib/definitions";
import { getCurrentDate } from "@/lib/getCurrentDate";
// Definición de los tipos de los props
type TransferReceiptProps = {
  operaciones: OperacionAndTipoOperacion[];
  cuenta: CuentaBancaria;
  userName: string;
};

const formatDate = (dateString: Date) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const formattedDate = `${day < 10 ? "0" + day : day}-${
    month < 10 ? "0" + month : month
  }-${year}`;
  return formattedDate;
};

function DetalleCuentaReceipt({
  operaciones,
  cuenta,
  userName,
}: TransferReceiptProps) {
  // Create styles
  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#ffffff",
      padding: 20,
    },
    section: {
      width: "90%",
      flexDirection: "column",
      marginBottom: 10,
    },
    view: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 5,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
    },
    subtitle: {
      fontSize: 16,
      fontWeight: "bold",
    },
    text: {
      fontSize: 12,
    },
    container: {
      width: "70%",
      margin: "0 auto",
    },
    categoria: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 5,
      textDecoration: "underline",
    },
    table: {
      display: "flex",
      width: "auto",
      borderStyle: "solid",
      borderWidth: 1,
      borderRightWidth: 0,
      borderBottomWidth: 0,
    },
    tableRow: {
      flexDirection: "row",
    },
    tableCol: {
      width: "20%",
      borderStyle: "solid",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableCell: {
      margin: 5,
      fontSize: 10,
    },
    tableHeader: {
      fontSize: 12,
      fontWeight: "bold",
    },
    credit: {
      color: "green",
    },
    debit: {
      color: "red",
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.container, styles.section]}>
          <Text style={styles.title}>Movimientos Detalle Cuenta</Text>
          <View style={styles.view}>
            <View>
              <View style={styles.section}>
                <Text style={styles.subtitle}>Tipo de Cuenta:</Text>
                <Text style={styles.text}>
                  {cuenta.esCuentaAhorro
                    ? "Cuenta de ahorros"
                    : "Cuenta Corriente"}
                </Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.subtitle}>Número de Cuenta:</Text>
                <Text style={styles.text}>{cuenta.numeroCuenta}</Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.subtitle}>Generado por:</Text>
                <Text style={styles.text}>{userName}</Text>
              </View>
            </View>
            <View>
              <View style={styles.section}>
                <Text style={styles.subtitle}>Saldo Disponible:</Text>
                <Text style={styles.text}>{Number(cuenta.saldo).toLocaleString('es-ES')}</Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.subtitle}>Saldo Retenido:</Text>
                <Text style={styles.text}>
                  {Number(cuenta.saldoDisponible).toLocaleString('es-ES')}
                </Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.subtitle}>Fecha de Genaración:</Text>
                <Text style={styles.text}>{getCurrentDate()}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.container, styles.section]}>
          <Text style={styles.categoria}>Operaciones</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={[styles.tableCell, styles.tableHeader]}>
                  Operación
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={[styles.tableCell, styles.tableHeader]}>
                  Fecha
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={[styles.tableCell, styles.tableHeader]}>
                  Banco Origen
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={[styles.tableCell, styles.tableHeader]}>
                  Involucrado
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={[styles.tableCell, styles.tableHeader]}>
                  Concepto
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={[styles.tableCell, styles.tableHeader]}>
                  Monto
                </Text>
              </View>
            </View>
            {operaciones.map((operacion, index) => (
              <View style={styles.tableRow} key={index}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {operacion.tipoOperacion.esDebito ? "Debito" : "Credito"}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {formatDate(operacion.fechaOperacion)}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {operacion.bancoInvolucrado}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {operacion.nombreInvolucrado}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{operacion.concepto}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text
                    style={[
                      styles.tableCell,
                      operacion.tipoOperacion.esDebito
                        ? styles.debit
                        : styles.credit,
                    ]}
                  >
                    {operacion.tipoOperacion.esDebito
                      ? `- ${Number(operacion.monto).toLocaleString('es-ES')} Gs.`
                      : `+ ${Number(operacion.monto).toLocaleString('es-ES')} Gs.`}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default DetalleCuentaReceipt;
