"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Employee = {
  employee_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
};

const DepartmentDetailPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [deptName, setDeptName] = useState("");

  useEffect(() => {
    const fetchEmployeesByDepartment = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5328/api/departments/${params.id}/employees`);
        if (!res.ok) throw new Error("Failed to fetch employees by department.");
        const data = await res.json();
        setEmployees(data.employees || []);
        setDeptName(data.department_name || "");
      } catch (err) {
        console.error("Error loading department employees:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeesByDepartment();
  }, [params.id]);

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6">
      <h1 className="text-3xl font-semibold mb-6">
        {deptName ? `${deptName} Department` : "Department"} — Employees
      </h1>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : employees.length === 0 ? (
        <p className="text-gray-500">No employees found for this department.</p>
      ) : (
        <ul className="space-y-2">
          {employees.map((emp) => (
            <li key={emp.employee_id} className="border p-4 rounded-md shadow-sm">
              <p><strong>Name:</strong> {emp.first_name} {emp.last_name}</p>
              <p><strong>Email:</strong> {emp.email}</p>
              <p><strong>Phone:</strong> {emp.phone || "—"}</p>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={() => router.back()}
        className="mt-6 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
      >
        Go Back
      </button>
    </div>
  );
};

export default DepartmentDetailPage;