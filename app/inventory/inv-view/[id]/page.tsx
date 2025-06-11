"use client";
import { useEffect, useState } from "react";
import { fetchInventoryAssignments } from "../../../../lib/api/inventory_api";
import { useRouter } from "next/navigation";

type InventoryAssignment = {
  inventory_id: number;
  device_name: string;
  employee_name: string;
  device_type: string;
  hardware_description: string;
  assigned_date: string;
  status: string;
  notes?: string;
};

const InvViewPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [inventoryData, setInventoryData] = useState<InventoryAssignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getInventoryAssignment = async () => {
      try {
        const data = await fetchInventoryAssignments();
        const item = data.inventory_assignments.find((inv) => inv.inventory_id === parseInt(params.id));
        if (!item) {
          setError("Inventory assignment not found.");
        } else {
          setInventoryData(item);
        }
      } catch (err) {
        console.error("Error fetching inventory assignments:", err);
        setError("Failed to load inventory assignment.");
      } finally {
        setLoading(false);
      }
    };

    getInventoryAssignment();
  }, [params.id]);

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-md p-6">
      <h1 className="text-3xl font-semibold mb-4">View Inventory Assignment</h1>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : inventoryData ? (
        <div className="space-y-4">
          <p><strong>Inventory ID:</strong> {inventoryData.inventory_id}</p>
          <p><strong>Device Name:</strong> {inventoryData.device_name}</p>
          <p><strong>Assigned To:</strong> {inventoryData.employee_name}</p>
          <p><strong>Device Type:</strong> {inventoryData.device_type}</p>
          <p><strong>Hardware Description:</strong> {inventoryData.hardware_description}</p>
          <p><strong>Assigned Date:</strong> {inventoryData.assigned_date}</p>
          <p><strong>Status:</strong> {inventoryData.status}</p>
          <p><strong>Notes:</strong> {inventoryData.notes || "—"}</p>
          
          <button
            onClick={() => router.push(`/inventory/inv-update/${inventoryData.inventory_id}`)}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Update Inventory Assignment
          </button>
        </div>
      ) : (
        <p className="text-red-600">Inventory assignment not found.</p>
      )}
    </div>
  );
};

export default InvViewPage;