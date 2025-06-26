'use client';

import React, { useState, useEffect, FormEvent } from 'react';

interface HardwareItem {
    id: string;
    name: string;
    model: string;
    employee_id?: string | null;
    assignment_status?: string;
}

interface Employee {
    id:string;
    name: string;
}

interface AssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { employee_id: string | null; assignment_status: string }) => void;
    item: HardwareItem;
    employees: Employee[];
}

const ASSIGNMENT_STATUSES = ['In Stock', 'Assigned', 'In Repair', 'Decommissioned'];

export default function AssignmentModal({ isOpen, onClose, onSubmit, item, employees }: AssignmentModalProps) {
    const [employeeId, setEmployeeId] = useState<string | null>(null);
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (item) {
            setEmployeeId(item.employee_id || null);
            setStatus(item.assignment_status || 'In Stock');
        }
    }, [item]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit({
            employee_id: employeeId,
            assignment_status: status,
        });
    };

    if (!isOpen) return null;

    const overlayClass = isOpen ? "modal-overlay active" : "modal-overlay";

    return (
        <div className={overlayClass} onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Edit Assignment for {item.name}</h2>
                    <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
                        &times;
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label htmlFor="employee">Assign To</label>
                            <select id="employee" value={employeeId || ''} onChange={(e) => setEmployeeId(e.target.value || null)} className="w-full p-2 border rounded">
                                <option value="">-- Unassigned --</option>
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="status">Assignment Status</label>
                            <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-2 border rounded">
                                {ASSIGNMENT_STATUSES.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                            Cancel
                        </button>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
