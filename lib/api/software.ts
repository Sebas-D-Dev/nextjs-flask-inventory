const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5328/api";

export async function getSoftware() {
  const res = await fetch(`${API_BASE}/software`);
  if (!res.ok) throw new Error("Failed to fetch software");
  return res.json();
}

export async function addSoftware(data: { name: string; version: string }) {
  const res = await fetch(`${API_BASE}/software`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add software");
  return res.json();
}

export async function updateSoftware(id: number, data: { name: string; version: string }) {
  const res = await fetch(`${API_BASE}/software/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update software");
  return res.json();
}

export async function deleteSoftware(id: number) {
  const res = await fetch(`${API_BASE}/software/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete software");
  return res.json();
}