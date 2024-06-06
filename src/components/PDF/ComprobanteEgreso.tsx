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
});

type ComprobanteProps = {
  cajero: string;
  caja: number;
  dateTime: string;
  monto: number;
  observaciones?: string;
};

// Componente del Comprobante PDF
const ComprobantePDF: React.FC<ComprobanteProps> = ({
  cajero,
  caja,
  dateTime,
  monto,
  observaciones
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>Comprobante de Extracción</Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Caja: </Text>
          {caja}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Cajero: </Text>
          {cajero}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Fecha y Hora: </Text>
          {dateTime}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Monto: </Text>
          {monto} Gs.
        </Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Observaciones: </Text>
          {observaciones} 
        </Text>
      </View>
    </Page>
  </Document>
);

export const generatePDF = async (props: ComprobanteProps) => {
  const blob = await pdf(<ComprobantePDF {...props} />).toBlob();
  saveAs(blob, "Comprobante.pdf");
};

export default ComprobantePDF;
