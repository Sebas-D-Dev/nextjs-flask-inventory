"use client";
import { useEffect, useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5328/api";

type Department = {
  id: number;
  name: string;
  description: string;
};

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/departments`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch departments");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data.departments)) {
          setDepartments(data.departments);
        } else if (Array.isArray(data)) {
          setDepartments(data);
        } else {
          setDepartments([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6">Departments</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Description</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept, idx) => (
              <tr key={dept.id ?? `dept-${idx}`}>
                <td className="py-2 px-4 border-b">{dept.id}</td>
                <td className="py-2 px-4 border-b">{dept.name}</td>
                <td className="py-2 px-4 border-b">{dept.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
