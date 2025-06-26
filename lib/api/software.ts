const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5328/api";

// Define the full interface for a Software item
export interface SoftwareItem {
  id: string;
  name: string;
  brand: string;
  version: string;
  license_key: string;
  purchase_date: string; // ISO date string (e.g., "YYYY-MM-DD")
  expiration_date: string; // ISO date string
  status: string; // e.g., 'Active', 'Expired', 'Pending Renewal', 'Unused'
  assigned_to_employee_id: string | null; // ID of the assigned employee
}

// Data structure for adding/updating software (without ID)
export type SoftwareFormData = Omit<SoftwareItem, 'id'>;

export async function getSoftware(): Promise<SoftwareItem[]> {
  const res = await fetch(`${API_BASE}/software`);
  if (!res.ok) throw new Error("Failed to fetch software");
  return res.json();
}

export async function addSoftware(data: SoftwareFormData): Promise<SoftwareItem> {
  const res = await fetch(`${API_BASE}/software`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to add software");
  }
  return res.json();
}

export async function updateSoftware(id: number, data: Partial<SoftwareFormData>): Promise<SoftwareItem> {
  const res = await fetch(`${API_BASE}/software/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to update software");
  }
  return res.json();
}

export async function deleteSoftware(id: number) {
  const res = await fetch(`${API_BASE}/software/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to delete software");
  }
  return res.json();
}