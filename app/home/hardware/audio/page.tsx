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

export default function AudioPage() {
  const router = useRouter();
  // Define a more specific interface for Hardware, assuming a 'type' field for categorization
  interface HardwareItem {
    id: string;
    name: string;
    model: string;
    serialNumber: string;
    description: string;
    type?: string;
  }
  const [audioItems, setAudioItems] = useState<HardwareItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<HardwareItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAudioItems();
  }, []);

  const fetchAudioItems = async () => {
    try {
      setLoading(true);
      const data = await getHardware();
      // Filter for items specifically identified as 'audio_video'
      const avItems = data.filter(
        (item: HardwareItem) => item.type === "audio_video"
      );
      setAudioItems(avItems);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateAudioItem = async (formData: {
    name: string;
    model: string;
    serialNumber: string;
    description: string;
  }) => {
    try {
      if (editingItem) {
        // Update existing item
        await updateHardware(Number(editingItem.id), formData);
      } else {
        // Add new item, explicitly setting the type
        await addHardware({ ...formData, type: "audio_video" } as any);
      }
      fetchAudioItems(); // Re-fetch to update the list
      setIsModalOpen(false); // Close modal on success
      setEditingItem(null); // Clear editing state
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteAudioItem = async (id: number) => {
    try {
      await deleteHardware(id);
      fetchAudioItems();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: HardwareItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  if (loading)
    return (
      <div className="text-center py-4">Loading audio/video equipment...</div>
    );
  if (error)
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <HardwareNav />
      <h1 className="text-3xl font-bold mb-6">Audio/Video Equipment</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={openAddModal}
      >
        Add New A/V Equipment
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
          {audioItems.map((item) => (
            <tr key={item.id}>
              <td className="py-2 px-4 border-b">{item.name}</td>
              <td className="py-2 px-4 border-b">{item.model}</td>
              <td className="py-2 px-4 border-b">{item.serialNumber}</td>
              <td className="py-2 px-4 border-b">{item.description}</td>
              <td className="py-2 px-4 border-b">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                  onClick={() => openEditModal(item)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleDeleteAudioItem(Number(item.id))}
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
        onSubmit={handleAddOrUpdateAudioItem}
        initialData={editingItem || undefined}
      />
    </div>
  );
}
