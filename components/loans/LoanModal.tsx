'use client';

import React, { useState, useEffect, FormEvent } from 'react';

interface HardwareItem {
    id: string;
    name: string;
    model: string;
    loaned_to_employee_id?: string | null;
    loan_status?: string;
}

interface Employee {
    id:string;
    name: string;
}

interface LoanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { loaned_to_employee_id: string | null; loan_status: string }) => void;
    item: HardwareItem;
    employees: Employee[];
}

const LOAN_STATUSES = ['Available', 'Loaned Out', 'In Repair', 'Returned to Stock'];

export default function LoanModal({ isOpen, onClose, onSubmit, item, employees }: LoanModalProps) {
    const [employeeId, setEmployeeId] = useState<string | null>(null);
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (item) {
            setEmployeeId(item.loaned_to_employee_id || null);
            setStatus(item.loan_status || 'Available');
        }
    }, [item]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit({
            loaned_to_employee_id: status === 'Loaned Out' ? employeeId : null,
            loan_status: status,
        });
    };

    if (!isOpen) return null;

    const overlayClass = isOpen ? "modal-overlay active" : "modal-overlay";

    return (
        <div className={overlayClass} onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Manage Loan for {item.name}</h2>
                    <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
                        &times;
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label htmlFor="status">Loan Status</label>
                            <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-2 border rounded">
                                {LOAN_STATUSES.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        {status === 'Loaned Out' && (
                            <div className="form-group">
                                <label htmlFor="employee">Loan To</label>
                                <select id="employee" value={employeeId || ''} onChange={(e) => setEmployeeId(e.target.value || null)} className="w-full p-2 border rounded">
                                    <option value="">-- Select Employee --</option>
                                    {employees.map(emp => (
                                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                            Cancel
                        </button>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Update Loan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
