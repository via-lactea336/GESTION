export const formatNumber = (value: string) => {
  // Elimina todos los puntos de la cadena
  const cleanedValue = value.replace(/\./g, "");

  // Aplica el formato con separadores de miles utilizando puntos
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
