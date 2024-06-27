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
    backgroundColor: "#ffffff",
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    border: "1px solid #e4e4e4",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    color: "#333333",
    borderBottom: "2px solid #e4e4e4",
    paddingBottom: 10,
  },
  text: {
    fontSize: 14,
    marginBottom: 10,
    color: "#333333",
  },
  bold: {
    fontWeight: "bold",
    color: "#555555",
  },
  footer: {
    fontSize: 12,
    marginTop: 20,
    textAlign: "center",
    color: "#888888",
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
}) => {
  // Formatear el monto
  const montoFormateado = monto.toLocaleString("es-PY");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>Comprobante de Extracción</Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Caja N°: </Text>
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
            {montoFormateado} Gs. 
          </Text>
          {observaciones && (
            <Text style={styles.text}>
              <Text style={styles.bold}>Observaciones: </Text>
              {observaciones} 
            </Text>
          )}
        </View>
        <Text style={styles.footer}> No válido como comprobante legal</Text>
      </Page>
    </Document>
  );
};

export const generatePDF = async (props: ComprobanteProps) => {
  const blob = await pdf(<ComprobantePDF {...props} />).toBlob();
  saveAs(blob, "ComprobanteEgreso.pdf");
};

export default ComprobantePDF;