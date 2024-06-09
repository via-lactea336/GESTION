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
        borderColor: '#000',
    },
    tableCell: {
        margin: 5,
        fontSize: 12,
    },
    tableHeader: {
        backgroundColor: "#D3D3D3",
        fontWeight: "bold",
    },
});

type ResumenCajaProps = {
    createdAt: Date;
    caja: number;
    cajero: string ;
    apertura: { saldoInicial: number, createdAt: Date };
    montoRegistrado: number;
    montoIngreso: number;
    montoIngresoCheque: number;
    montoIngresoTarjeta: number;
    movimientos: Array<Movimiento>;
    observaciones: string;
};

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
    observaciones
}) => (
    <Document>
        <Page size="A4" style={styles.page}>
        <View style={styles.section}>
            <Text style={styles.header}>Resumen de Caja</Text>
            <Text style={styles.text}>
            <Text style={styles.bold}>Fecha: </Text>
            {new Date(createdAt).toLocaleDateString()}
            </Text>
            <Text style={styles.text}>
            <Text style={styles.bold}>Hora: </Text>
            {new Date(createdAt).getHours()}:{new Date(createdAt).getMinutes()}
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
                <View style={[styles.tableRow, styles.tableHeader]}>
                    <Text style={[styles.tableCol, styles.tableCell]}>Caja Inicial</Text>
                    <Text style={[styles.tableCol, styles.tableCell]}>
                    {Number(apertura?.saldoInicial).toLocaleString()} Gs.
                    </Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={[styles.tableCol, styles.tableCell]}>Dinero en Caja</Text>
                    <Text style={[styles.tableCol, styles.tableCell]}>
                    {Number(montoRegistrado).toLocaleString()} Gs.
                    </Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={[styles.tableCol, styles.tableCell]}>observaciones</Text>
                    <Text style={[styles.tableCol, styles.tableCell]}>
                    {observaciones}
                    </Text>
                </View>
            </View>

            <Text style={styles.header}>Resumen de ingresos y egresos por forma de pago</Text>

            <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCol, styles.tableCell]}>Forma de Pago</Text>
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

            <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCol, styles.tableCell]}>Operacion</Text>
                <Text style={[styles.tableCol, styles.tableCell]}>Monto</Text>
                <Text style={[styles.tableCol, styles.tableCell]}>Fecha</Text>
                <Text style={[styles.tableCol, styles.tableCell]}>Hora</Text>
            </View>
            <View style={styles.tableRow}>
                <Text style={[styles.tableCol, styles.tableCell, { color: "green" }]}>
                Apertura de caja
                </Text>
                <Text style={[styles.tableCol, styles.tableCell]}>
                {Number(apertura.saldoInicial).toLocaleString()} Gs.
                </Text>
                <Text style={[styles.tableCol, styles.tableCell]}>
                {new Date(apertura.createdAt).toLocaleDateString()}
                </Text>
                <Text style={[styles.tableCol, styles.tableCell]}>
                {new Date(apertura.createdAt).getHours()}:
                {new Date(apertura.createdAt).getMinutes()}
                </Text>
            </View>
            {movimientos?.map((mov) => (
                <View style={styles.tableRow} key={mov.id}>
                <Text
                    style={[
                    styles.tableCol,
                    styles.tableCell,
                    { color: mov.esIngreso ? "green" : "red" },
                    ]}
                >
                    {mov.esIngreso ? "Ingreso" : "Egreso"}
                </Text>
                <Text style={[styles.tableCol, styles.tableCell]}>
                    {Number(mov.monto).toLocaleString()} Gs.
                </Text>
                <Text style={[styles.tableCol, styles.tableCell]}>
                    {new Date(mov.createdAt).toLocaleDateString()}
                </Text>
                <Text style={[styles.tableCol, styles.tableCell]}>
                    {new Date(mov.createdAt).getHours()}:
                    {new Date(mov.createdAt).getMinutes()}
                </Text>
                </View>
            ))}
            </View>
        </View>
        </Page>
    </Document>
);

export const generatePDF = async (props: ResumenCajaProps) => {
    const blob = await pdf(<ResumenCajaPDF {...props} />).toBlob();
    saveAs(blob, "ResumenCaja.pdf");
};

export default ResumenCajaPDF;
