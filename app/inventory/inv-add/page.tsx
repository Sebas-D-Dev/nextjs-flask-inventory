"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addInventoryAssignment } from "../../../lib/api/inventory_api";

const InvAddPage = () => {
    const router = useRouter();

    const [employeeOptions, setEmployeeOptions] = useState<{ id: number; name: string }[]>([]);
    const [loadingEmployees, setLoadingEmployees] = useState(true);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await fetch("http://127.0.0.1:5328/api/employees");
                const data = await res.json();
                setEmployeeOptions(data.employees || []);
            } catch (err) {
                console.error("Failed to fetch employees:", err);
                setEmployeeOptions([]);
            } finally {
                setLoadingEmployees(false);
            }
        };

        fetchEmployees();
    }, []);

    const deviceTypes = ["Laptop", "Desktop", "Tablet", "Printer", "Other"];
    const statusOptions = ["assigned", "returned", "maintenance", "decommissioned"];

    const [formData, setFormData] = useState({
        device_id: "",
        employee_id: "",
        assigned_date: "",
        status: "",
        notes: "",
    });

    const [error, setError] = useState("");
    const [existingInventory, setExistingInventory] = useState<{ device_id: number }[]>([]);
    const [loadingInventory, setLoadingInventory] = useState(true);

    // Fetch inventory assignments on mount
    useEffect(() => {
        const fetchInventoryAssignments = async () => {
            try {
                const res = await fetch("http://127.0.0.1:5328/api/inventory_assignments");
                if (!res.ok) throw new Error("Failed to fetch inventory assignments");
                const data = await res.json();
                setExistingInventory(data.inventory_assignments || []);
            } catch (err) {
                setExistingInventory([]);
            } finally {
                setLoadingInventory(false);
            }
        };
        fetchInventoryAssignments();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const { device_id, employee_id, status } = formData;

        if (!device_id || !employee_id || !status) {
            setError("Please fill in all required fields.");
            return;
        }

        // Uniqueness check
        if (existingInventory.some((item) => String(item.device_id) === device_id)) {
            setError("Device ID must be unique.");
            return;
        }

        try {
            await addInventoryAssignment({
                ...formData,
                device_id: Number(device_id),
                employee_id: Number(employee_id),
            });
            router.push("/inventory");
        } catch (err) {
            setError("Failed to add inventory assignment. Please try again.");
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-md p-6">
            <h1 className="text-3xl font-semibold mb-4">Add Inventory Assignment</h1>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            <div className="grid grid-cols-2 gap-4">
                <input
                    type="text"
                    name="device_id"
                    placeholder="Device ID"
                    value={formData.device_id}
                    onChange={handleChange}
                    className="border p-2"
                />

                <select
                    name="employee_id"
                    value={formData.employee_id}
                    onChange={handleChange}
                    className="border p-2"
                    disabled={loadingEmployees}
                >
                    <option value="">{loadingEmployees ? "Loading employees..." : "Select Employee"}</option>
                    {employeeOptions.map((emp) => (
                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                </select>

                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="border p-2"
                >
                    <option value="">Select Status</option>
                    {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>

                <input
                    type="date"
                    name="assigned_date"
                    value={formData.assigned_date}
                    onChange={handleChange}
                    className="border p-2"
                />

                <input
                    type="text"
                    name="notes"
                    placeholder="Notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="border p-2 col-span-2"
                />
            </div>

            <button
                onClick={handleSubmit}
                className="mt-6 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                disabled={loadingInventory}
            >
                {loadingInventory ? "Loading..." : "Add Inventory Assignment"}
            </button>
        </div>
    );
};

export default InvAddPage;