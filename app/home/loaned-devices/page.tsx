'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getHardware, updateHardware } from '@/lib/api/hardware';
// NOTE: The existence of an employee API is assumed.
// For demonstration, we will use a mock.
// import { getEmployees } from '@/lib/api/employees'; 
import HardwareNav from '@/components/hardware/HardwareNav';
import LoanModal from '@/components/loans/LoanModal';

// Mocking employee data and API since it's not provided in the context
const mockEmployees = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Peter Jones' },
];
const getEmployees = async () => Promise.resolve(mockEmployees);
// End of mock

interface HardwareItem {
    id: string;
    name: string;
    model: string;
    serialNumber: string;
    description: string;
    type?: string;
    loaned_to_employee_id?: string | null;
    loan_status?: string;
    loan_date?: string;
}

interface Employee {
    id: string;
    name: string;
}

export default function LoanedDevicesPage() {
    const [hardware, setHardware] = useState<HardwareItem[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<HardwareItem | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [hardwareData, employeesData] = await Promise.all([
                getHardware(),
                getEmployees(), // This is the assumed API call
            ]);
            setHardware(hardwareData);
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

    const handleOpenModal = (item: HardwareItem) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingItem(null);
        setIsModalOpen(false);
    };

    const handleUpdateLoan = async (data: { loaned_to_employee_id: string | null; loan_status: string }) => {
        if (!editingItem) return;

        try {
            // The backend for updateHardware should handle these partial updates
            // and potentially set the loan_date automatically.
            await updateHardware(Number(editingItem.id), {
                name: editingItem.name,
                model: editingItem.model,
                loan_date: editingItem.loan_date,
                loan_status: data.loan_status,
                loaned_to_employee_id: data.loaned_to_employee_id
            } as HardwareItem);
            await fetchData(); // Re-fetch all data to show the update
            handleCloseModal();
        } catch (err: any) {
            setError(`Failed to update loan status: ${err.message}`);
        }
    };

    const getEmployeeName = (employeeId?: string | null) => {
        if (!employeeId) return <span className="text-gray-500">N/A</span>;
        const employee = employees.find(e => e.id === employeeId);
        if (!employee) return <span className="text-red-500">Unknown Employee</span>;
        // Assuming an employee detail page exists at /home/employees/[id]
        return (
            <Link href={`/home/employees/${employee.id}`} className="text-blue-600 hover:underline">
                {employee.name}
            </Link>
        );
    };

    if (loading) return <div className="text-center py-4">Loading loaned devices...</div>;
    if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;

    return (
        <div className="max-w-6xl mx-auto mt-8">
            <HardwareNav />
            <h1 className="text-3xl font-bold mb-6">Loaned Devices Management</h1>
            {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>}

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded shadow">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-2 px-4 border-b text-left">Device</th>
                            <th className="py-2 px-4 border-b text-left">Loaned To</th>
                            <th className="py-2 px-4 border-b text-left">Loan Status</th>
                            <th className="py-2 px-4 border-b text-left">Loan Date</th>
                            <th className="py-2 px-4 border-b text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hardware.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b">
                                    <Link href={`/home/hardware/item/${item.id}`} className="font-semibold text-blue-600 hover:underline">{item.name}</Link>
                                    <span className="text-gray-500 text-sm block">{item.model} ({item.serialNumber})</span>
                                </td>
                                <td className="py-2 px-4 border-b">{getEmployeeName(item.loaned_to_employee_id)}</td>
                                <td className="py-2 px-4 border-b">{item.loan_status || 'Available'}</td>
                                <td className="py-2 px-4 border-b">{item.loan_date ? new Date(item.loan_date).toLocaleDateString() : 'N/A'}</td>
                                <td className="py-2 px-4 border-b text-center">
                                    <button className="bg-yellow-500 text-white px-3 py-1 rounded" onClick={() => handleOpenModal(item)}>Manage Loan</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editingItem && (
                <LoanModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleUpdateLoan} item={editingItem} employees={employees} />
            )}
        </div>
    );
}
