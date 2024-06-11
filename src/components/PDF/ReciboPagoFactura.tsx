'use client'
import React, {useEffect, useState} from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Decimal } from '@prisma/client/runtime/library';
import { Cliente } from '@prisma/client';
import obtenerCliente from '@/lib/moduloCaja/cliente/obtenerCliente';
import { obtenerCookie } from "@/lib/obtenerCookie";
import { Cajero } from '@/lib/definitions';
import { Caja } from "@prisma/client";
import { Toaster, toast } from "sonner";

// Estilos para el documento PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 12,
  },
  boldText: {
    fontSize: 12,
    fontWeight: 'bold',
    display: 'flex',
    marginVertical: 5,
  },
  borde: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    margin: 5,
  },
  bordeInfo: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    margin: 5,
    width: '50%',
  },
  fila:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bordeTitulo:{
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    margin: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    width: '50%',
  },
  descripcion:{
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 5,
    display: 'flex',
  }
});

type TransferReceiptProps = {
  id: string;
  fechaEmision: Date;
  clienteId: string;
  facturaId: string;
  totalPagado: Decimal;
  createdAt: Date;  
};

const TransferReceipt: React.FC<TransferReceiptProps> = ({
  id,
  fechaEmision,
  clienteId,
  facturaId,
  totalPagado,
  createdAt
}) => {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const cajero: Cajero = obtenerCookie("cajero");
  const caja: Caja = obtenerCookie("caja");

  useEffect(() => {    
    fetchCliente();
  }, []);

  const fetchCliente = async () => {
    try {
      const response = await obtenerCliente(clienteId);
      if (response === undefined || typeof response === "string") {
        throw new Error(response || "Error al obtener cliente");
      }
      if (response.error) {
        throw new Error(response.error);
      }
      if (response.success && response.data) {   
        console.log(response.data)
        setCliente(response.data);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Recibo de Dinero</Text>

        <View style={styles.fila}>
          <View style={styles.bordeTitulo} wrap>
            <Text style={styles.boldText}>ACME</Text>
            <Text style={styles.descripcion}>Sistemas de Caja y bancos para Ferretería.</Text>
            <Text style={styles.descripcion}>Tel. 3216465321 - ferreteria@gmail.com</Text>
          </View>
          <View style={styles.bordeInfo} wrap>
            <Text style={styles.descripcion}>Ruc. 800364525-8</Text>
            <Text style={styles.descripcion}>Recibo de Dinero y/o valores N°</Text>
            <Text style={styles.descripcion}>{id}</Text>
            <Text style={styles.descripcion}>Gs {Number(totalPagado).toLocaleString("es-PY")}</Text>
          </View>
        </View>
        
        <View style={styles.borde}>
          <Text style={styles.boldText}>Recibí de: <Text style={styles.text}>{cliente?.nombre}</Text></Text>
          <Text style={styles.boldText}>Fecha: <Text style={styles.text}>{new Date(fechaEmision).toISOString().split("T")[0].split("-").reverse().join("/")}</Text></Text>
          <Text style={styles.boldText}>RUC: <Text style={styles.text}>{cliente?.docIdentidad}</Text></Text>
          <Text style={styles.boldText}>La cantidad de GUARANIES: <Text style={styles.text}>{Number(totalPagado).toLocaleString("es-PY")}</Text></Text>
          <Text style={styles.boldText}>Cancelación de Comprobante: <Text style={styles.text}>{facturaId}</Text></Text>
        </View>
        <View style={styles.borde}>
          <Text style={styles.boldText}>Firma: _______________________________</Text>
          <Text style={styles.boldText}>Cajero: {cajero?.nombre} - Caja: N°{caja?.numero}</Text>
        </View>
        <View style={styles.borde}>
          <Text style={styles.text}>Gracias por su pago.</Text>
        </View>
      </Page>
    </Document>
  );
};

export default TransferReceipt;