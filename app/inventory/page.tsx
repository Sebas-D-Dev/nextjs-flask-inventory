"use client";
import { useEffect, useState } from "react";
import { fetchInventoryAssignments, deleteInventoryAssignment } from "../../lib/api/inventory_api";
import Link from "next/link";

type InventoryAssignment = {
  inventory_id: number;
  device_id: number;
  device_name: string;
  employee_name: string;
  status: string;
  device_type?: string;
  hardware_description?: string;
  assigned_date?: string;
  notes?: string;
};

const InventoryPage = () => {
  const [inventory, setInventory] = useState<InventoryAssignment[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryAssignment | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const getInventoryAssignments = async () => {
      try {
        const data = await fetchInventoryAssignments();
        setInventory(data.inventory_assignments);
      } catch (error) {
        console.error("Error fetching inventory assignments:", error);
      }
    };

    getInventoryAssignments();
  }, []);

  const handleDeleteClick = (item: InventoryAssignment) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedItem) return;
    await deleteInventoryAssignment(selectedItem.inventory_id);
    alert("Inventory assignment deleted successfully!");
    setShowModal(false);
    setInventory((prev) => prev.filter((i) => i.inventory_id !== selectedItem.inventory_id));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6">
      <h1 className="text-3xl font-semibold mb-6">Inventory Management</h1>

      {/* Add Inventory Assignment Button */}
      <div className="mb-4">
        <Link href="/inventory/inv-add">
          <button className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
            Add New Inventory Assignment
          </button>
        </Link>
      </div>

      {/* Inventory Assignments Table */}
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 border">Inventory ID</th>
            <th className="p-3 border">Device Name</th>
            <th className="p-3 border">Assigned To</th>
            <th className="p-3 border">Status</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.length > 0 ? (
            inventory.map((item) => (
              <tr key={item.inventory_id} className="border">
                <td className="p-3 border">{item.inventory_id}</td>
                <td className="p-3 border">{item.device_name}</td>
                <td className="p-3 border">{item.employee_name}</td>
                <td className="p-3 border">{item.status}</td>
                <td className="p-3 border flex gap-2">
                  <Link href={`/inventory/inv-update/${item.inventory_id}`}>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                      Update
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(item)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                  <Link href={`/inventory/inv-view/${item.inventory_id}`}>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">
                      View
                    </button>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center p-4 text-gray-600">
                No inventory assignments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-md">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this assignment?</p>
            <div className="mt-4 border-t pt-4">
              <p><strong>Inventory ID:</strong> {selectedItem.inventory_id}</p>
              <p><strong>Device Name:</strong> {selectedItem.device_name}</p>
              <p><strong>Assigned To:</strong> {selectedItem.employee_name}</p>
              <p><strong>Device Type:</strong> {selectedItem.device_type}</p>
              <p><strong>Hardware Description:</strong> {selectedItem.hardware_description}</p>
              <p><strong>Assigned Date:</strong> {selectedItem.assigned_date}</p>
              <p><strong>Status:</strong> {selectedItem.status}</p>
              <p><strong>Notes:</strong> {selectedItem.notes || "—"}</p>
            </div>
            <div className="mt-4 flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;