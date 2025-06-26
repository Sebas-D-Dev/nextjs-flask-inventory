'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSoftware, addSoftware, updateSoftware, deleteSoftware, SoftwareItem, SoftwareFormData } from '@/lib/api/software';
import SoftwareModal from '@/components/software/SoftwareModal';
import HardwareNav from '@/components/hardware/HardwareNav'; // Re-using HardwareNav for general inventory navigation

// Mocking employee data and API since it's not provided in the context
const mockEmployees = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Peter Jones' },
    { id: '4', name: 'Alice Johnson' },
    { id: '5', name: 'Bob Williams' },
];
interface Employee {
    id: string;
    name: string;
}
const getEmployees = async (): Promise<Employee[]> => Promise.resolve(mockEmployees);
// End of mock

export default function SoftwarePage() {
    const [softwareItems, setSoftwareItems] = useState<SoftwareItem[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSoftware, setEditingSoftware] = useState<SoftwareItem | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [softwareData, employeesData] = await Promise.all([
                getSoftware(),
                getEmployees(),
            ]);
            setSoftwareItems(softwareData);
            setEmployees(employeesData);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddOrUpdateSoftware = async (formData: SoftwareFormData) => {
        try {
            if (editingSoftware) {
                // Update existing software
                await updateSoftware(Number(editingSoftware.id), formData);
            } else {
                // Add new software
                await addSoftware(formData);
            }
            await fetchData(); // Re-fetch all data to show the update
            setIsModalOpen(false); // Close modal on success
            setEditingSoftware(null); // Clear editing state
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDeleteSoftware = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this software entry?')) {
            try {
                await deleteSoftware(id);
                await fetchData(); // Re-fetch all data to show the update
            } catch (err: any) {
                setError(err.message);
            }
        }
    };

    const openAddModal = () => {
        setEditingSoftware(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item: SoftwareItem) => {
        setEditingSoftware(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingSoftware(null);
    };

    const getEmployeeName = (employeeId: string | null) => {
        if (!employeeId) return <span className="text-gray-500">Unassigned</span>;
        const employee = employees.find(e => e.id === employeeId);
        if (!employee) return <span className="text-red-500">Unknown Employee</span>;
        // Assuming an employee detail page exists at /home/employees/[id]
        return (
            <Link href={`/home/employees/${employee.id}`} className="text-blue-600 hover:underline">
                {employee.name}
            </Link>
        );
    };

    if (loading) return <div className="text-center py-4">Loading software inventory...</div>;
    if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;

    return (
        <div className="max-w-6xl mx-auto mt-8">
            <HardwareNav /> {/* Using HardwareNav for general inventory navigation */}
            <h1 className="text-3xl font-bold mb-6">Software Inventory</h1>
            {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>}

            <button
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                onClick={openAddModal}
            >
                Add New Software
            </button>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded shadow">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-2 px-4 border-b text-left">Name</th>
                            <th className="py-2 px-4 border-b text-left">Brand</th>
                            <th className="py-2 px-4 border-b">Version</th>
                            <th className="py-2 px-4 border-b">License Key</th>
                            <th className="py-2 px-4 border-b">Purchase Date</th>
                            <th className="py-2 px-4 border-b">Expiration Date</th>
                            <th className="py-2 px-4 border-b">Status</th>
                            <th className="py-2 px-4 border-b">Assigned To</th>
                            <th className="py-2 px-4 border-b text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {softwareItems.length > 0 ? (
                            softwareItems.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b">{item.name}</td>
                                    <td className="py-2 px-4 border-b">{item.brand}</td>
                                    <td className="py-2 px-4 border-b">{item.version}</td>
                                    <td className="py-2 px-4 border-b">{item.license_key || 'N/A'}</td>
                                    <td className="py-2 px-4 border-b">{item.purchase_date || 'N/A'}</td>
                                    <td className="py-2 px-4 border-b">{item.expiration_date || 'N/A'}</td>
                                    <td className="py-2 px-4 border-b">{item.status}</td>
                                    <td className="py-2 px-4 border-b">{getEmployeeName(item.assigned_to_employee_id)}</td>
                                    <td className="py-2 px-4 border-b text-center">
                                        <button className="bg-yellow-500 text-white px-3 py-1 rounded mr-2" onClick={() => openEditModal(item)}>Edit</button>
                                        <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDeleteSoftware(Number(item.id))}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={9} className="text-center py-4 text-gray-500">No software entries found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <SoftwareModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onSubmit={handleAddOrUpdateSoftware}
                    initialData={editingSoftware}
                />
            )}
        </div>
    );
}
