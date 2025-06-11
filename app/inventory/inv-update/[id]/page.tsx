"use client";
import { useEffect, useState } from "react";
import { fetchInventoryAssignments, updateInventoryAssignment } from "../../../../lib/api/inventory_api";
import { useRouter } from "next/navigation";

const InvUpdatePage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [inventoryData, setInventoryData] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getInventoryItem = async () => {
      try {
        const data = await fetchInventoryAssignments();
        const item = data.inventory_assignments.find((inv) => inv.inventory_id === parseInt(params.id));
        if (!item) {
          setError("Inventory assignment not found.");
        } else {
          setInventoryData(item);
        }
      } catch (error) {
        console.error("Error fetching inventory assignments:", error);
        setError("Failed to load inventory assignment.");
      } finally {
        setLoading(false);
      }
    };

    getInventoryItem();
  }, [params.id]);

  const handleUpdate = async () => {
    if (!inventoryData) return;

    try {
      await updateInventoryAssignment(params.id, {
        status: inventoryData.status,
        notes: inventoryData.notes,
      });
      alert("Inventory assignment updated successfully!");
      router.push("/inventory");
    } catch (error) {
      console.error("Error updating inventory assignment:", error);
      setError("Failed to update inventory assignment.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-md p-6">
      <h1 className="text-3xl font-semibold mb-4">Update Inventory Assignment</h1>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : inventoryData ? (
        <div className="grid grid-cols-2 gap-4">
          <select
            name="status"
            value={inventoryData.status}
            onChange={(e) => setInventoryData({ ...inventoryData, status: e.target.value })}
            className="border p-2"
          >
            <option value="">Select Status</option>
            {["assigned", "returned", "maintenance", "decommissioned"].map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <input
            type="text"
            name="notes"
            value={inventoryData.notes || ""}
            onChange={(e) => setInventoryData({ ...inventoryData, notes: e.target.value })}
            placeholder="Notes"
            className="border p-2 col-span-2"
          />
        </div>
      ) : (
        <p className="text-red-600">Inventory assignment not found.</p>
      )}

      {inventoryData && (
        <button
          onClick={handleUpdate}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Update Inventory Assignment
        </button>
      )}
    </div>
  );
};

export default InvUpdatePage;