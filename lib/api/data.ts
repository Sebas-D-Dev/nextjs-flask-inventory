const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5328/api";

export async function getData() {
  const res = await fetch(`${API_BASE}/data`);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
}

export async function addData(data: { name: string; value: string }) {
  const res = await fetch(`${API_BASE}/data`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add data");
  return res.json();
}

export async function updateData(id: number, data: { name: string; value: string }) {
  const res = await fetch(`${API_BASE}/data/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update data");
  return res.json();
}

export async function deleteData(id: number) {
  const res = await fetch(`${API_BASE}/data/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete data");
  return res.json();
}