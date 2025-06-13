import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <nav className="flex flex-wrap justify-between items-center p-4 bg-blue-600 text-white">
          <Link href="/home" className="text-lg font-semibold">Home</Link>
          <div className="flex flex-wrap items-center">
            <Link href="/departments" className="ml-4">Departments</Link>
            <Link href="/employees" className="ml-4">Employees</Link>
            <Link href="/hardware" className="ml-4">Hardware</Link>
            <Link href="/software" className="ml-4">Software</Link>
            <Link href="/data" className="ml-4">Data</Link>
            <Link href="/pending-removals" className="ml-4">Pending Removals</Link>
            <Link href="/loaned-devices" className="ml-4">Loaned Devices</Link>
            <Link href="/inventory-assignments" className="ml-4">Inventory Assignments</Link>
            <Link href="/export-preview" className="ml-4">Export Preview</Link>
          </div>
        </nav>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}