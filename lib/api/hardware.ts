const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5328/api";

export async function getHardware() {
  const res = await fetch(`${API_BASE}/hardware`);
  if (!res.ok) throw new Error("Failed to fetch hardware");
  return res.json();
}

export async function addHardware(data: { name: string; model: string }) {
  const res = await fetch(`${API_BASE}/hardware`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add hardware");
  return res.json();
}

export async function updateHardware(id: number, data: { name?: string; model?: string }) {
  const res = await fetch(`${API_BASE}/hardware/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update hardware");
  return res.json();
}

export async function deleteHardware(id: number) {
  const res = await fetch(`${API_BASE}/hardware/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete hardware");
  return res.json();
}