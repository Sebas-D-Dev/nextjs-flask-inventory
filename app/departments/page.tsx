"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchDepartments, addDepartment } from "../../lib/api/department_api";

type Department = {
  department_id: number;
  name: string;
};

const DepartmentsPage = () => {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [newDepartment, setNewDepartment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const data = await fetchDepartments();
        setDepartments(data.departments || []);
      } catch (err) {
        console.error("Error fetching departments:", err);
        setDepartments([]);
      }
    };

    loadDepartments();
  }, []);

  const handleAddDepartment = async () => {
    if (!newDepartment.trim()) {
      setError("Department name cannot be empty.");
      return;
    }

    try {
      const data = await addDepartment(newDepartment);
      if (!data || !data.department) throw new Error("Invalid response");
      setDepartments((prev) => [...prev, data.department]);
      setNewDepartment("");
      setError("");
    } catch (err) {
      console.error("Error adding department:", err);
      setError("Failed to add department.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-md p-6">
      <h1 className="text-3xl font-semibold mb-4">Departments</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="New Department Name"
          value={newDepartment}
          onChange={(e) => setNewDepartment(e.target.value)}
          className="border p-2 flex-grow"
        />
        <button
          onClick={handleAddDepartment}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          Add Department
        </button>
      </div>

      <ul className="space-y-2">
        {departments.length > 0 ? (
          departments.map((dept) => (
            <li key={dept.department_id} className="border p-3 rounded-md flex justify-between">
              <span>{dept.name}</span>
              <button
                onClick={() => router.push(`/departments/${dept.department_id}`)}
                className="text-blue-600 hover:underline"
              >
                View Employees
              </button>
            </li>
          ))
        ) : (
          <p className="text-gray-600">No departments found.</p>
        )}
      </ul>
    </div>
  );
};

export default DepartmentsPage;