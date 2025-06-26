'use client';

import React, { useState, useEffect, FormEvent } from 'react';
// Assuming modal.css is imported globally in app/layout.tsx
// import '../../app/styles/modal.css';

// Re-using interfaces from software.ts for consistency
import { SoftwareItem, SoftwareFormData } from '@/lib/api/software';

// Mocking employee data and API since it's not provided in the context
// In a real app, you'd fetch this from your employee API
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
// This would typically come from a dedicated employee API
const getEmployees = async (): Promise<Employee[]> => Promise.resolve(mockEmployees);
// End of mock

interface SoftwareModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: SoftwareFormData) => void;
    initialData?: SoftwareItem | null; // Can be null for adding new software
}

const SOFTWARE_STATUSES = ['Active', 'Expired', 'Pending Renewal', 'Unused', 'Decommissioned'];

export default function SoftwareModal({ isOpen, onClose, onSubmit, initialData }: SoftwareModalProps) {
    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [version, setVersion] = useState('');
    const [licenseKey, setLicenseKey] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [status, setStatus] = useState(SOFTWARE_STATUSES[0]);
    const [assignedToEmployeeId, setAssignedToEmployeeId] = useState<string | null>(null);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loadingEmployees, setLoadingEmployees] = useState(true);
    const [employeeError, setEmployeeError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEmployeesData = async () => {
            try {
                setLoadingEmployees(true);
                const data = await getEmployees();
                setEmployees(data);
            } catch (err: any) {
                setEmployeeError(err.message);
            } finally {
                setLoadingEmployees(false);
            }
        };
        fetchEmployeesData();
    }, []);

    useEffect(() => {
        if (isOpen) {
            setName(initialData?.name || '');
            setBrand(initialData?.brand || '');
            setVersion(initialData?.version || '');
            setLicenseKey(initialData?.license_key || '');
            setPurchaseDate(initialData?.purchase_date || '');
            setExpirationDate(initialData?.expiration_date || '');
            setStatus(initialData?.status || SOFTWARE_STATUSES[0]);
            setAssignedToEmployeeId(initialData?.assigned_to_employee_id || null);
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const formData: SoftwareFormData = {
            name,
            brand,
            version,
            license_key: licenseKey,
            purchase_date: purchaseDate,
            expiration_date: expirationDate,
            status,
            assigned_to_employee_id: assignedToEmployeeId,
        };
        onSubmit(formData);
    };

    if (!isOpen) return null;

    const overlayClass = isOpen ? "modal-overlay active" : "modal-overlay";

    return (
        <div className={overlayClass} onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{initialData?.id ? 'Edit Software' : 'Add Software'}</h2>
                    <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
                        &times;
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Microsoft Office"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="brand">Brand</label>
                            <input
                                type="text"
                                id="brand"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                placeholder="e.g., Microsoft"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="version">Version</label>
                            <input
                                type="text"
                                id="version"
                                value={version}
                                onChange={(e) => setVersion(e.target.value)}
                                placeholder="e.g., 2021"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="licenseKey">License Key</label>
                            <input
                                type="text"
                                id="licenseKey"
                                value={licenseKey}
                                onChange={(e) => setLicenseKey(e.target.value)}
                                placeholder="e.g., XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="purchaseDate">Purchase Date</label>
                            <input
                                type="date"
                                id="purchaseDate"
                                value={purchaseDate}
                                onChange={(e) => setPurchaseDate(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="expirationDate">Expiration Date</label>
                            <input
                                type="date"
                                id="expirationDate"
                                value={expirationDate}
                                onChange={(e) => setExpirationDate(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full p-2 border rounded"
                            >
                                {SOFTWARE_STATUSES.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="assignedToEmployee">Assigned To</label>
                            {loadingEmployees ? (
                                <p>Loading employees...</p>
                            ) : employeeError ? (
                                <p className="text-red-500">Error loading employees: {employeeError}</p>
                            ) : (
                                <select
                                    id="assignedToEmployee"
                                    value={assignedToEmployeeId || ''}
                                    onChange={(e) => setAssignedToEmployeeId(e.target.value || null)}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="">-- Unassigned --</option>
                                    {employees.map((emp) => (
                                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                            Cancel
                        </button>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            {initialData?.id ? 'Update Software' : 'Add Software'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
