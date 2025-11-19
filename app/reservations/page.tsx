"use client"

import React from "react"
import { SidebarNav } from "../../components/sidebar-nav"
import { Header } from "../../components/header"
import { Footer } from "../../components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReservationsPage() {
    return (
        <div className="min-h-screen md:flex">
            <aside className="w-72 hidden md:block">
                <SidebarNav />
            </aside>

            <main className="flex-1 p-6">
                <Header />

                <Card>
                    <CardHeader>
                        <CardTitle>Reservations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Reservations and bookings will be managed here.</p>
                    </CardContent>
                </Card>

                <Footer />
            </main>
        </div>
    )
}
