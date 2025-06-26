import './styles/globals.css';
import './styles/modal.css';
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'IT Inventory Management',
  keywords: ['IT', 'Inventory', 'Management', 'Devices', 'Employees', 'Departments'],
  description: 'A simple IT inventory management system to track devices, employees, and departments.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}