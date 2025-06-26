'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { getData, addData, updateData, deleteData } from '@/lib/api/data';

type DataItem = {
    id: number;
    name: string;
    value: string;
};

type ApiError = {
    message: string;
};

export default function DataPage() {
    const router = useRouter();
    const [data, setData] = React.useState<DataItem[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<ApiError | null>(null);

    React.useEffect(() => {
        getData()
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch((error: ApiError) => {
                setError(error);
                setLoading(false);
            });
    }, []);

    const handleAdd = (newItem: Omit<DataItem, 'id'>) => { // Fix: Changed type to Omit<DataItem, 'id'>
        addData(newItem)
            .then((createdItem: DataItem) => {
                setData((prev) => [...prev, createdItem]);
            })
            .catch((error: ApiError) => {
                setError(error);
            });
    };

    const handleUpdate = (id: number, updatedFields: { name: string; value: string }) => {
        updateData(id, updatedFields)
            .then((updatedItem: DataItem) => {
                setData((prev) =>
                    prev.map((item) => (item.id === id ? updatedItem : item))
                );
            })
            .catch((error: ApiError) => {
                setError(error);
            });
    };

    const handleDelete = (id: number) => {
        deleteData(id)
            .then(() => {
                setData((prev) => prev.filter((item) => item.id !== id));
            })
            .catch((error: ApiError) => {
                setError(error);
            });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="max-w-2xl mx-auto mt-8"> 
            <h1 className="text-3xl font-bold mb-6">Data</h1>
            <button // Fix: Changed type to Omit<DataItem, 'id'>
                onClick={() => handleAdd({ name: 'New Item', value: '' })}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
                Add New Item
            </button>
            <table className="min-w-full bg-white border rounded shadow">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            <td className="py-2 px-4 border-b">{item.id}</td>
                            <td className="py-2 px-4 border-b">{item.name}</td>
                            <td className="py-2 px-4 border-b">
                                <button
                                    onClick={() => handleUpdate(item.id, { name: 'Updated Item', value: '' })}
                                    className="px-2 py-1 bg-yellow-500 text-white rounded mr-2"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="px-2 py-1 bg-red-500 text-white rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}