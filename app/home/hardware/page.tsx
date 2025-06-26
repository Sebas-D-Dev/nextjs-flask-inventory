'use client';

import { useRouter } from 'next/navigation';
import { getHardware, addHardware, updateHardware, deleteHardware } from '@/lib/api/hardware';
import { useState, useEffect } from 'react';
import HardwareModal from '@/components/hardware/Modal';
import HardwareNav from '@/components/hardware/HardwareNav';

// Define the Hardware interface to match the API response and modal expectations
interface Hardware { id: string; name: string; model: string; serialNumber: string; description: string; }


export default function HardwarePage() {
  const router = useRouter();
  const [hardware, setHardware] = useState<Hardware[]>([]);
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [description, setDescription] = useState('');
  const [selectedHardware, setSelectedHardware] = useState<Hardware | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHardware, setEditingHardware] = useState<Hardware | null>(null);


  useEffect(() => {
    setLoading(true);
    getHardware()
      .then((data) => {
        setHardware(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const fetchHardware = async () => {
    try {
      setLoading(true);
      const data = await getHardware();
      setHardware(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateHardware = async (formData: { name: string; model: string; serialNumber: string; description: string }) => {
    try {
      if (editingHardware) {
        // Update existing hardware
        const updatedHardware = await updateHardware(Number(editingHardware.id), formData);
        setHardware((prev) =>
          prev.map((hw) => (hw.id === String(updatedHardware.id) ? updatedHardware : hw))
        );
      } else {
        // Add new hardware
        const createdHardware = await addHardware(formData);
        setHardware((prev) => [...prev, createdHardware]);
      }
      setIsModalOpen(false); // Close modal on success
      setEditingHardware(null); // Clear editing state
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteHardware(id);
      setHardware((prev) => prev.filter((hw) => hw.id !== String(id)));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const openAddModal = () => {
    setEditingHardware(null); // Clear any previous editing data
    setIsModalOpen(true);
  };

  const openEditModal = (hw: Hardware) => {
    setEditingHardware(hw);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingHardware(null); // Clear editing state when modal is closed
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <HardwareNav />
      <h1 className="text-3xl font-bold mb-6">Hardware Inventory</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={openAddModal}
      >
        Add New Hardware
      </button>

      {loading ? (
        <p>Loading hardware...</p>
      ) : (
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
            {hardware.map((hw) => (
              <tr key={hw.id}>
                <td className="py-2 px-4 border-b">{hw.name}</td>
                <td className="py-2 px-4 border-b">{hw.model}</td>
                <td className="py-2 px-4 border-b">{hw.serialNumber}</td>
                <td className="py-2 px-4 border-b">{hw.description}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                    onClick={() => openEditModal(hw)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(Number(hw.id))}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <HardwareModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleAddOrUpdateHardware}
        initialData={editingHardware || { name: '', model: '', serialNumber: '', description: '' }}
      />
    </div>
  );
}