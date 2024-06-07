import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const cerrarCajas = async () =>{

  const cajas = await prisma.caja.findMany({
    select: {
      id: true
    }
  });

  if(cajas.length === 0){
    console.log("No hay cajas");
    return
  }

  for(const caja of cajas){
    await fetch(`http://localhost:3000/api/caja/${caja.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        estaCerrado:true 
      }),
    })
  }
  
  console.log("Cierro todas las cajas");

}

cerrarCajas().then(() => process.exit(0))