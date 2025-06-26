'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getHardware, deleteHardware } from '@/lib/api/hardware';
import HardwareNav from '@/components/hardware/HardwareNav';

interface HardwareItem {
    id: string;
    name: string;
    model: string;
    serialNumber: string;
    description: string;
    type?: string;
    assignment_status?: string;
}

export default function PendingRemovalsPage() {
    const [pendingItems, setPendingItems] = useState<HardwareItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPendingItems = async () => {
        try {
            setLoading(true);
            const allHardware = await getHardware();
            // This assumes a status like 'Pending Removal' is set on items to be deleted.
            const itemsForRemoval = allHardware.filter(
                (item: HardwareItem) => item.assignment_status === 'Pending Removal'
            );
            setPendingItems(itemsForRemoval);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingItems();
    }, []);

    const handleApproveRemoval = async (id: number) => {
        // This assumes an admin check has happened before this page is accessible.
        if (window.confirm('Are you sure you want to permanently delete this item? This action cannot be undone.')) {
            try {
                await deleteHardware(id);
                // Refresh the list after deletion
                await fetchPendingItems();
            } catch (err: any) {
                setError(`Failed to delete item: ${err.message}`);
            }
        }
    };

    if (loading) return <div className="text-center py-4">Loading items pending removal...</div>;
    if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;

    return (
        <div className="max-w-6xl mx-auto mt-8">
            <HardwareNav />
            <h1 className="text-3xl font-bold mb-6">Pending Removals</h1>
            <p className="mb-6 text-gray-600">These items are marked for deletion. Approving removal will permanently delete them from the database.</p>
            {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>}

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded shadow">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-2 px-4 border-b text-left">Device</th>
                            <th className="py-2 px-4 border-b text-left">Type</th>
                            <th className="py-2 px-4 border-b text-left">Serial Number</th>
                            <th className="py-2 px-4 border-b text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingItems.length > 0 ? (
                            pendingItems.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b">
                                        <span className="font-semibold">{item.name}</span>
                                        <span className="text-gray-500 text-sm block">{item.model}</span>
                                    </td>
                                    <td className="py-2 px-4 border-b">{item.type || 'N/A'}</td>
                                    <td className="py-2 px-4 border-b">{item.serialNumber}</td>
                                    <td className="py-2 px-4 border-b text-center">
                                        <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700" onClick={() => handleApproveRemoval(Number(item.id))}>Approve Removal</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={4} className="text-center py-4 text-gray-500">No items are pending removal.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
