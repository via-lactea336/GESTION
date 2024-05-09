# Tesorería y Bancos 💰🏦

Este proyecto desarrollado con TypeScript, Tailwind, Next.js, Prisma y PostgreSQL aborda la gestión y control de las cuentas bancarias de una empresa, así como el registro y seguimiento de los movimientos financieros asociados. A continuación, se detallan los requerimientos funcionales que cubre el módulo de Tesorería y Bancos:

## Requerimientos Funcionales

1. **Gestión de Cuentas Bancarias:**
   - Definición de bancos y cuentas bancarias de la empresa en el sistema financiero nacional. Las cuentas pueden ser cuentas corrientes o cuentas de ahorro.

2. **Registro de Pagos a Proveedores:**
   - Los pagos realizados mediante cheques generarán un movimiento bancario de débito asociado a la cuenta bancaria correspondiente. El cheque quedará con estado emitido y afectará el saldo de la cuenta bancaria.
   - Los pagos a proveedores mediante transferencias bancarias también generarán un movimiento bancario de débito asociado a la cuenta bancaria correspondiente, afectando el saldo y el saldo disponible.

3. **Otros Movimientos Bancarios:**
   - Se deben registrar otros movimientos bancarios, tanto de crédito como de débito, como costos por emisión de chequeras, intereses pagados, multas por deficiencia en firma, depósitos, entre otros. Estos movimientos afectarán el saldo y el saldo disponible de la cuenta bancaria.

4. **Conciliación Bancaria:**
   - Se realizará una conciliación bancaria para controlar los cheques emitidos y registrar la fecha de pago de cada uno de ellos. Una vez actualizada la fecha de pago del cheque, se descontará del saldo disponible de la cuenta bancaria.

5. **Registro de Depósitos Bancarios:**
   - Se registrarán los depósitos bancarios que pueden corresponder a efectivo, cheques del mismo banco y cheques de otros bancos. Estos depósitos afectarán el saldo y el saldo disponible de la cuenta bancaria. Los cheques de otros bancos afectarán el saldo una vez confirmada la operación por el Banco, pasadas las 48 horas hábiles. En caso de rechazo del cheque, se registrará un movimiento para revertir el saldo por el rechazo.

## Configuración del Proyecto

1. **Clonar el Repositorio:**
   ```bash
   git clone https://github.com/via-lactea336/GESTION.git

2. **Instalar las Dependencias:**
   ```bash
   pnpm install

3. **Configurar las Variables de Entorno:**
    - Crear un archivo `.env.local` en la raíz del proyecto con las siguientes variables de entorno:
      ```env
      DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/tesoreria"
      ```
    - Reemplazar `usuario` y `contraseña` por las credenciales de acceso a la base de datos PostgreSQL.

4. **Ejecutar las Migraciones de la Base de Datos:**
    ```bash
    pnpm prisma migrate dev

5. **Iniciar el Servidor de Desarrollo:**
    ```bash
    pnpm dev

## Capturas de Pantalla

![Imagen de la aplicación web](captura.png)


## Licencia
Este proyecto se encuentra bajo la licencia MIT.