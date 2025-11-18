"use client"

import { Search, Share2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"

export function Header() {
  const isMobile = useMobile()

  return (
    <div className="bg-white p-4 flex items-center gap-4 border-b">
      {!isMobile && (
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input type="text" placeholder="Search Product here..." className="pl-10 w-full" />
        </div>
      )}

      {isMobile && (
        <div className="flex-1 flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>
          <span className="font-semibold">Table 4</span>
          <span className="text-gray-500 text-sm">Floyd Miles</span>
        </div>
      )}

      {!isMobile && (
        <div className="flex items-center gap-2">
          <span className="font-semibold">Table 4</span>
          <span className="text-gray-500 text-sm">Floyd Miles</span>
        </div>
      )}

      <Button variant="ghost" size="icon">
        <Share2 className="h-5 w-5" />
      </Button>
    </div>
  )
}
