"use client"

import { SidebarNav } from "../../components/sidebar-nav"
import { Header } from "../../components/header"
import { Footer } from "../../components/footer"
import { TableManagement } from "../../components/table-management"

export default function TablesPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-auto p-6">
          <TableManagement />
        </div>
        <Footer />
      </div>
    </div>
  )
}