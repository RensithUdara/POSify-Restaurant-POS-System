import type { Metadata } from 'next'
import './globals.css'
import { POSProvider } from "@/context/POSContext"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: 'POSify - Restaurant POS System',
  description: 'Complete Restaurant Point of Sale System',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <POSProvider>
            {children}
            <Toaster />
          </POSProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
