import { ApiResponseData } from "@/lib/definitions";

export default async function eliminarProducto({ id, deleteFromDB }: { id: string, deleteFromDB: boolean }) {
  const server_url = process.env.URL;
  const url = server_url || "";
  try {
    const response = await fetch(`${url}/api/producto/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
      body: JSON.stringify({ deleteFromDB }),
    });
    const data: ApiResponseData = await response.json();
    return data;
  } catch (err) {
    if (err instanceof Error) return err.message;
  }
}
