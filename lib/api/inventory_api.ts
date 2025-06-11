const API_URL = "http://127.0.0.1:5328/api/inventory_assignments"; // Updated endpoint

export const fetchInventoryAssignments = async () => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch inventory assignments");
    return res.json();
  } catch (error) {
    console.error("Error fetching inventory assignments:", error);
    return { inventory_assignments: [] };
  }
};

export const addInventoryAssignment = async (data: { device_id: number; employee_id: number; status: string; notes?: string }) => {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to add inventory assignment");
    return res.json();
  } catch (error) {
    console.error("Error adding inventory assignment:", error);
    return null;
  }
};

export const updateInventoryAssignment = async (inventory_id: number, data: { status: string; notes?: string }) => {
  try {
    const res = await fetch(`${API_URL}/${inventory_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update inventory assignment");
    return res.json();
  } catch (error) {
    console.error("Error updating inventory assignment:", error);
    return null;
  }
};

export const deleteInventoryAssignment = async (inventory_id: number) => {
  try {
    const res = await fetch(`${API_URL}/${inventory_id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete inventory assignment");
    return res.json();
  } catch (error) {
    console.error("Error deleting inventory assignment:", error);
    return null;
  }
};