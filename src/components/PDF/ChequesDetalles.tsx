import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import { ChequeDetails, UserWithName } from "@/lib/definitions";
import { obtenerCookie } from "@/lib/obtenerCookie";
import { getCurrentDate } from "@/lib/getCurrentDate";

// Define styles for the PDF document
const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  section: {
    marginBottom: 10,
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#d3d3d3",
    textAlign: "center",
  },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    textAlign: "center",
  },
  tableCellHeader: {
    margin: 5,
    fontSize: 12,
    fontWeight: "bold",
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
  },

  view: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    marginTop: 5,
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
});

const detalleCheques = ({
  cheques,
  cuenta,
}: {
  cheques: ChequeDetails[];
  cuenta: any;
}) => {
  const user: UserWithName = obtenerCookie("user");
  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text>Detalles de Cheques</Text>
        </View>
        <View style={styles.view}>
          <View style={styles.section}>
            <Text style={styles.subtitle}>Generado por:</Text>
            <Text style={styles.text}>{user.name}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.subtitle}>Fecha de Genaración:</Text>
            <Text style={styles.text}>{getCurrentDate()}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text>Cuenta: {cuenta.numeroCuenta}</Text>
          <Text>Saldo: {Number(cuenta.saldo).toLocaleString('es-ES')}</Text>
          <Text>Saldo Disponible: {Number(cuenta.saldoDisponible).toLocaleString('es-ES')}</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Operacion</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Fecha</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Banco</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Estado</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Monto</Text>
            </View>
          </View>
          {cheques.map((cheque, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{cheque.operacionId}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {new Date(cheque.fechaEmision).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {cheque.bancoCheque.nombre}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{cheque.estado}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{Number(cheque.monto).toLocaleString('es-ES')}</Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default detalleCheques;
