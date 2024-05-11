import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Definición de los tipos de los props
type TransferReceiptProps = {
  tipoOperacion: string;
  dateTime: string;
  monto: number;
  numComprobante: string;
  concepto: string;
  nombreDestino: string;
  numCuentaDestino: string;
  bancoDestino: string;
  nombreOrigen: string;
  numCuentaOrigen: string;
  bancoOrigen: string;
};

function TransferReceipt({
  tipoOperacion,
  dateTime,
  monto,
  numComprobante,
  concepto,
  nombreDestino,
  numCuentaDestino,
  bancoDestino,
  nombreOrigen,
  numCuentaOrigen,
  bancoOrigen,
}: TransferReceiptProps){
  // Create styles
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      padding: 20
    },
    section: {
      width: '90%', 
      flexDirection: 'column' ,
      marginBottom: 10
    },
    view: {
      flexDirection: 'row',
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: 5 
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    subtitle: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    text: {
      fontSize: 12,
    },
    container: {
      width: '70%', 
      margin: '0 auto', 
    },
    categoria: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
      textDecoration: 'underline',
    }
  })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.container, styles.section]}>
          <Text style={styles.title}>Comprobante de Transferencia - {tipoOperacion}</Text>
          <View style={styles.section}>
            <Text style={styles.subtitle}>Fecha:</Text>
            <Text style={styles.text}>{dateTime}</Text>
          </View>
        </View>
        <View style={[styles.container, styles.section]}>
          <View style={styles.view}>
            <Text style={styles.subtitle}>Monto:</Text>
            <Text style={styles.text}>{monto}</Text>
          </View>
          <View style={styles.view}>
            <Text style={styles.subtitle}>Comprobante:</Text>
            <Text style={styles.text}>{numComprobante}</Text>
          </View>
          <View style={styles.view}>
            <Text style={styles.subtitle}>Concepto:</Text>
            <Text style={styles.text}>{concepto}</Text>
          </View>
        </View>
        <View style={[styles.container, styles.section]}>
          <Text style={[styles.subtitle, styles.categoria]}>{tipoOperacion === "Debito" ? "Destino" : "Origen"}</Text>
          <View style={styles.view}>
            <Text style={styles.subtitle}>Nombre:</Text>
            <Text style={styles.text}>{nombreDestino}</Text>
          </View>
          <View style={styles.view}>
            <Text style={styles.subtitle}>Cuenta:</Text>
            <Text style={styles.text}>{numCuentaDestino}</Text>
          </View>
          <View style={styles.view}>
            <Text style={styles.subtitle}>Banco:</Text>
            <Text style={styles.text}>{bancoDestino}</Text>
          </View>
        </View>
        <View style={[styles.container, styles.section]}>
          <Text style={[styles.subtitle, styles.categoria]}>{tipoOperacion === "Debito" ? "Origen" : "Destino"}</Text>
          <View style={styles.view}>
            <Text style={styles.subtitle}>Nombre:</Text>
            <Text style={styles.text}>{nombreOrigen}</Text>
          </View>
          <View style={styles.view}>
            <Text style={styles.subtitle}>Cuenta:</Text>
            <Text style={styles.text}>{numCuentaOrigen}</Text>
          </View>
          <View style={styles.view}>
            <Text style={styles.subtitle}>Banco:</Text>
            <Text style={styles.text}>{bancoOrigen}</Text>
          </View>
        </View>
        <View style={[styles.container, styles.section]}>
          <Text style={styles.subtitle}>Aviso:</Text>
          <Text style={styles.text}>No válido como comprobante legal</Text>
        </View>
      </Page>
    </Document>
  )
}

export default TransferReceipt;
