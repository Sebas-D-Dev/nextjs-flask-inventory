import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12">
      {/* Logo and Title */}
      <Image
        src="/home-icon.png"
        alt="Inventory Logo"
        width={180}
        height={36}
        priority
      />
      <h1 className="text-4xl text-white font-bold mb-6">IT Inventory Management</h1>
      <p className="text-lg text-white mb-6">
        Easily track and manage company devices, departments, and employees.
      </p>

      {/* Main Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center w-full max-w-4xl">
        <Link href="/departments" className="group rounded-lg border px-6 py-4 hover:bg-gray-200 transition">
          <h2 className="text-2xl font-semibold text-white group-hover:text-black transition-colors">Departments</h2>
          <p className="text-sm text-white mt-2 group-hover:text-black transition-colors">Manage department records</p>
        </Link>
        <Link href="/employees" className="group rounded-lg border px-6 py-4 hover:bg-gray-200 transition">
          <h2 className="text-2xl font-semibold text-white group-hover:text-black transition-colors">Employees</h2>
          <p className="text-sm text-white mt-2 group-hover:text-black transition-colors">Assign and track employees</p>
        </Link>
        <Link href="/loaned-devices" className="group rounded-lg border px-6 py-4 hover:bg-gray-200 transition">
          <h2 className="text-2xl font-semibold text-white group-hover:text-black transition-colors">Loaned Devices</h2>
          <p className="text-sm text-white mt-2 group-hover:text-black transition-colors">Monitor available devices</p>
        </Link>
        <Link href="/pending-removals" className="group rounded-lg border px-6 py-4 hover:bg-gray-200 transition">
          <h2 className="text-2xl font-semibold text-white group-hover:text-black transition-colors">Pending Removals</h2>
          <p className="text-sm text-white mt-2 group-hover:text-black transition-colors">Manage audio/video equipment</p>
        </Link>
        <Link href="/hardware" className="group rounded-lg border px-6 py-4 hover:bg-gray-200 transition">
          <h2 className="text-2xl font-semibold text-white group-hover:text-black transition-colors">Hardware</h2>
          <p className="text-sm text-white mt-2 group-hover:text-black transition-colors">Manage hardware inventory</p>
        </Link>
        <Link href="/software" className="group rounded-lg border px-6 py-4 hover:bg-gray-200 transition">
          <h2 className="text-2xl font-semibold text-white group-hover:text-black transition-colors">Software</h2>
          <p className="text-sm text-white mt-2 group-hover:text-black transition-colors">Manage software licenses</p>
        </Link>
        <Link href="/data" className="group rounded-lg border px-6 py-4 hover:bg-gray-200 transition">
          <h2 className="text-2xl font-semibold text-white group-hover:text-black transition-colors">Data</h2>
          <p className="text-sm text-white mt-2 group-hover:text-black transition-colors">Manage data assets</p>
        </Link>
        <Link href="/inventory-assignments" className="group rounded-lg border px-6 py-4 hover:bg-gray-200 transition">
          <h2 className="text-2xl font-semibold text-white group-hover:text-black transition-colors">Inventory Assignments</h2>
          <p className="text-sm text-white mt-2 group-hover:text-black transition-colors">View assigned inventory</p>
        </Link>
        <Link href="/export-preview" className="group rounded-lg border px-6 py-4 hover:bg-gray-200 transition col-span-full">
          <h2 className="text-2xl font-semibold text-white group-hover:text-black transition-colors">Export Preview</h2>
          <p className="text-sm text-white mt-2 group-hover:text-black transition-colors">
            Preview and export a filtered CSV with select hardware (computers, printers, audio/video, devices)
          </p>
        </Link>
      </div>
    </main>
  );
}