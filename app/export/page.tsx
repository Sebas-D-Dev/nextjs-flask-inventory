"use client";
import { useEffect, useState } from "react";
import { fetchInventory } from "../../lib/api/inventory_api";

const ExportPage = () => {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const getInventory = async () => {
      try {
        const data = await fetchInventory();
        setInventory(data.inventory);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };

    getInventory();
  }, []);

  // Export data as CSV format
  const exportToCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Device Name,Assigned To,Status,Notes"].join(",") +
      "\n" +
      inventory
        .map((item) => `${item.device_name},${item.employee_name},${item.status},${item.notes || "-"}`)
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inventory_export.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6">
      <h1 className="text-3xl font-semibold mb-4">Export Inventory</h1>
      <p className="text-gray-700">Download the inventory data in CSV format.</p>
      <button
        onClick={exportToCSV}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Export to CSV
      </button>
    </div>
  );
};

export default ExportPage;