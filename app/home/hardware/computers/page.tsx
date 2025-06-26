"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getHardware,
  addHardware,
  updateHardware,
  deleteHardware,
} from "@/lib/api/hardware";
import HardwareModal from "@/components/hardware/modal";
import HardwareNav from "@/components/hardware/HardwareNav";

export default function NewComputersCopyPage() {
  const router = useRouter();
  // Define a more specific interface for Hardware, assuming a 'type' field for categorization
  interface HardwareItem {
    id: string;
    name: string;
    model: string;
    serialNumber: string;
    description: string;
    type?: string; // e.g., 'computer', 'printer', 'audio_video'
  }
  const [computers, setComputers] = useState<HardwareItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingComputer, setEditingComputer] = useState<HardwareItem | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchComputers();
  }, []);

  const fetchComputers = async () => {
    try {
      setLoading(true);
      const data = await getHardware();
      // Assuming getHardware can filter by type 'computer' or returns all and we filter here
      // For now, assuming getHardware returns only computers or we handle it later
      const computerItems = data.filter(
        (item: HardwareItem) => item.type === "computer"
      );
      setComputers(computerItems);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateComputer = async (formData: {
    name: string;
    model: string;
    serialNumber: string;
    description: string;
  }) => {
    try {
      if (editingComputer) {
        // Update existing computer
        await updateHardware(Number(editingComputer.id), formData);
      } else {
        // Add new computer
        await addHardware({ ...formData, type: "computer" } as any);
      }
      fetchComputers(); // Re-fetch to update the list
      setIsModalOpen(false); // Close modal on success
      setEditingComputer(null); // Clear editing state
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteComputer = async (id: number) => {
    try {
      await deleteHardware(id);
      fetchComputers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const openAddModal = () => {
    setEditingComputer(null);
    setIsModalOpen(true);
  };

  const openEditModal = (computer: HardwareItem) => {
    setEditingComputer(computer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingComputer(null); // Clear editing state when modal is closed
  };

  if (loading)
    return <div className="text-center py-4">Loading computers...</div>;
  if (error)
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <HardwareNav />
      <h1 className="text-3xl font-bold mb-6">New Computers Copy</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={openAddModal}
      >
        Add New Computer
      </button>
      <table className="min-w-full bg-white border rounded shadow">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Model</th>
            <th className="py-2 px-4 border-b">Serial Number</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {computers.map((computer) => (
            <tr key={computer.id}>
              <td className="py-2 px-4 border-b">{computer.name}</td>
              <td className="py-2 px-4 border-b">{computer.model}</td>
              <td className="py-2 px-4 border-b">{computer.serialNumber}</td>
              <td className="py-2 px-4 border-b">{computer.description}</td>
              <td className="py-2 px-4 border-b">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                  onClick={() => openEditModal(computer)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleDeleteComputer(Number(computer.id))}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <HardwareModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleAddOrUpdateComputer}
        initialData={editingComputer || undefined}
      />
    </div>
  );
}
