import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
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
      <div className="grid grid-cols-2 gap-6 text-center lg:grid-cols-4">
        <Link href="/dashboard" className="group rounded-lg border px-6 py-4 hover:bg-gray-200 transition">
          <h2 className="text-2xl font-semibold text-white group-hover:text-black transition-colors">Dashboard →</h2>
          <p className="text-sm text-white mt-2 group-hover:text-black transition-colors">System overview</p>
        </Link>

        <Link href="/departments" className="group rounded-lg border px-6 py-4 hover:bg-gray-200 transition">
          <h2 className="text-2xl font-semibold text-white group-hover:text-black transition-colors">Departments →</h2>
          <p className="text-sm text-white mt-2 group-hover:text-black transition-colors">Manage department records</p>
        </Link>

        <Link href="/employees" className="group rounded-lg border px-6 py-4 hover:bg-gray-200 transition">
          <h2 className="text-2xl font-semibold text-white group-hover:text-black transition-colors">Employees →</h2>
          <p className="text-sm text-white mt-2 group-hover:text-black transition-colors">Assign and track employees</p>
        </Link>

        <Link href="/devices" className="group rounded-lg border px-6 py-4 hover:bg-gray-200 transition">
          <h2 className="text-2xl font-semibold text-white group-hover:text-black transition-colors">Devices →</h2>
          <p className="text-sm text-white mt-2 group-hover:text-black transition-colors">Monitor available devices</p>
        </Link>

        <Link href="/inventory" className="group rounded-lg border px-6 py-4 hover:bg-gray-200 transition">
          <h2 className="text-2xl font-semibold text-white group-hover:text-black transition-colors">Inventory →</h2>
          <p className="text-sm text-white mt-2 group-hover:text-black transition-colors">View assigned inventory</p>
        </Link>

        <Link href="/inventory" className="group rounded-lg border px-6 py-4 hover:bg-gray-200 transition">
          <h2 className="text-2xl font-semibold text-white group-hover:text-black transition-colors">Export →</h2>
          <p className="text-sm text-white mt-2 group-hover:text-black transition-colors">Export inventory data</p>
        </Link>
      </div>
    </main>
  );
}