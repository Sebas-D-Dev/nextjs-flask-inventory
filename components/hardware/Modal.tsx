"use client";

import React, { useEffect, useState, FormEvent } from 'react';

// Modal component for adding/editing in the hardware page and sub-pages

// Define a more specific type for the form data
interface HardwareFormData {
  name: string;
  model: string;
  serialNumber: string;
  description: string;
}

// Define a type for the initial data, which might include an ID
interface HardwareData extends HardwareFormData {
  id?: string | number;
}

interface HardwareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: HardwareFormData) => void;
  initialData?: HardwareData;
}

export default function HardwareModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = {
    name: '',
    model: '',
    serialNumber: '',
    description: ''
  },
}: HardwareModalProps) {
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [description, setDescription] = useState('');

  // Update form fields when initialData changes (e.g., when opening for edit)
  useEffect(() => {
    if (isOpen) {
      setName(initialData.name || '');
      setModel(initialData.model || '');
      setSerialNumber(initialData.serialNumber || '');
      setDescription(initialData.description || '');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ name, model, serialNumber, description });
  };

  if (!isOpen) return null;

  const overlayClass = isOpen ? "modal-overlay active" : "modal-overlay";

  return (
    <div className={overlayClass} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initialData.id ? 'Edit Hardware' : 'Add Hardware'}</h2>
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
                placeholder="e.g., MacBook Pro 16"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="model">Model</label>
              <input
                type="text"
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g., A2485"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="serialNumber">Serial Number</label>
              <input
                type="text"
                id="serialNumber"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="e.g., C02G80R4Q05D"
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Any relevant details"
                rows={3}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              {initialData.id ? 'Update Hardware' : 'Add Hardware'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
