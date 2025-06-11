const DEPARTMENTS_API_URL = "http://127.0.0.1:5328/api/departments";

export const fetchDepartments = async () => {
  try {
    const res = await fetch(DEPARTMENTS_API_URL);
    if (!res.ok) throw new Error("Failed to fetch departments");
    return res.json();
  } catch (error) {
    console.error("Error fetching departments:", error);
    return { departments: [] };
  }
};

export const addDepartment = async (name: string) => {
  try {
    const res = await fetch(DEPARTMENTS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }), // The backend expects "name" in the request body
    });
    if (!res.ok) throw new Error("Failed to add department");
    return res.json();
  } catch (error) {
    console.error("Error adding department:", error);
    return null;
  }
};