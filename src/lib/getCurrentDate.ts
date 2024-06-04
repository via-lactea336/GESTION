export const getCurrentDate = () => {
  // Crear un nuevo objeto Date para obtener la fecha y hora actual
  const now = new Date();

  // Obtener los componentes de la fecha y hora
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Los meses en JavaScript son indexados desde 0
  const year = now.getFullYear();

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  // Formatear la fecha y hora
  const formattedDate = `${day}-${month}-${year}`;
  const formattedTime = `${hours}:${minutes}`;

  // Combinar fecha y hora en un solo string
  const formattedDateTime = `${formattedDate} ${formattedTime}`;

  return formattedDateTime;
};
