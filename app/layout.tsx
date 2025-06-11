import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'IT Inventory Management',
  keywords: ['IT', 'Inventory', 'Management', 'Devices', 'Employees', 'Departments'],
  description: 'A simple IT inventory management system to track devices, employees, and departments.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <nav className="flex justify-between p-4 bg-blue-600 text-white">
          <Link href="/" className="text-lg font-semibold">Home</Link>
          <div>
            <Link href="/dashboard" className="ml-4">Dashboard</Link>
            <Link href="/departments" className="ml-4">Departments</Link>
            <Link href="/employees" className="ml-4">Employees</Link>
            <Link href="/devices" className="ml-4">Devices</Link>
            <Link href="/inventory" className="ml-4">Inventory</Link>
            <Link href="/export" className="ml-4">Export</Link> 
          </div>
        </nav>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}