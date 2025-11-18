"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Search, Filter, X, SlidersHorizontal } from "lucide-react"
import { usePOS } from "@/context/POSContext"

interface SearchFilterProps {
    onSearch: (query: string) => void
    onFilter: (filters: FilterOptions) => void
    searchQuery: string
    filters: FilterOptions
}

export interface FilterOptions {
    category: string
    priceRange: [number, number]
    type: 'all' | 'Veg' | 'Non Veg'
    availability: 'all' | 'available' | 'unavailable'
    sortBy: 'name' | 'price-low' | 'price-high' | 'popular'
}

const DEFAULT_FILTERS: FilterOptions = {
    category: 'all',
    priceRange: [0, 100],
    type: 'all',
    availability: 'available',
    sortBy: 'name'
}

export function SearchFilter({ onSearch, onFilter, searchQuery, filters }: SearchFilterProps) {
    const { state } = usePOS()
    const [localFilters, setLocalFilters] = useState<FilterOptions>(filters)
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

    const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
        const defaultValue = DEFAULT_FILTERS[key as keyof FilterOptions]
        return JSON.stringify(value) !== JSON.stringify(defaultValue)
    }).length

    const handleSearch = (value: string) => {
        onSearch(value)
    }

    const handleFilterChange = (key: keyof FilterOptions, value: any) => {
        const newFilters = { ...localFilters, [key]: value }
        setLocalFilters(newFilters)
        onFilter(newFilters)
    }

    const clearFilters = () => {
        setLocalFilters(DEFAULT_FILTERS)
        onFilter(DEFAULT_FILTERS)
        onSearch('')
    }

    const hasActiveFilters = activeFiltersCount > 0 || searchQuery.length > 0

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search menu items..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10"
                    />
                    {searchQuery && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                            onClick={() => handleSearch('')}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    )}
                </div>

                {/* Filter Toggle */}
                <Popover open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="relative">
                            <SlidersHorizontal className="h-4 w-4 mr-2" />
                            Filters
                            {activeFiltersCount > 0 && (
                                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                                    {activeFiltersCount}
                                </Badge>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="end">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium">Filters</h4>
                                {hasActiveFilters && (
                                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                                        Clear all
                                    </Button>
                                )}
                            </div>

                            {/* Category Filter */}
                            <div>
                                <label className="text-sm font-medium mb-2 block">Category</label>
                                <Select
                                    value={localFilters.category}
                                    onValueChange={(value) => handleFilterChange('category', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {state.categories.map(category => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Type Filter */}
                            <div>
                                <label className="text-sm font-medium mb-2 block">Food Type</label>
                                <Select
                                    value={localFilters.type}
                                    onValueChange={(value) => handleFilterChange('type', value as FilterOptions['type'])}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="Veg">Vegetarian</SelectItem>
                                        <SelectItem value="Non Veg">Non-Vegetarian</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Availability Filter */}
                            <div>
                                <label className="text-sm font-medium mb-2 block">Availability</label>
                                <Select
                                    value={localFilters.availability}
                                    onValueChange={(value) => handleFilterChange('availability', value as FilterOptions['availability'])}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Items</SelectItem>
                                        <SelectItem value="available">Available Only</SelectItem>
                                        <SelectItem value="unavailable">Unavailable Only</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Price Range */}
                            <div>
                                <label className="text-sm font-medium mb-2 block">
                                    Price Range: ${localFilters.priceRange[0]} - ${localFilters.priceRange[1]}
                                </label>
                                <Slider
                                    value={localFilters.priceRange}
                                    onValueChange={(value) => handleFilterChange('priceRange', value as [number, number])}
                                    max={100}
                                    step={1}
                                    className="mt-2"
                                />
                            </div>

                            {/* Sort By */}
                            <div>
                                <label className="text-sm font-medium mb-2 block">Sort By</label>
                                <Select
                                    value={localFilters.sortBy}
                                    onValueChange={(value) => handleFilterChange('sortBy', value as FilterOptions['sortBy'])}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="name">Name (A-Z)</SelectItem>
                                        <SelectItem value="price-low">Price (Low to High)</SelectItem>
                                        <SelectItem value="price-high">Price (High to Low)</SelectItem>
                                        <SelectItem value="popular">Most Popular</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                    {searchQuery && (
                        <Badge variant="secondary" className="gap-1">
                            Search: "{searchQuery}"
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 hover:bg-transparent"
                                onClick={() => handleSearch('')}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}

                    {filters.category !== 'all' && (
                        <Badge variant="secondary" className="gap-1">
                            {state.categories.find(c => c.id === filters.category)?.name}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 hover:bg-transparent"
                                onClick={() => handleFilterChange('category', 'all')}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}

                    {filters.type !== 'all' && (
                        <Badge variant="secondary" className="gap-1">
                            {filters.type}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 hover:bg-transparent"
                                onClick={() => handleFilterChange('type', 'all')}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}

                    {filters.availability !== 'available' && (
                        <Badge variant="secondary" className="gap-1">
                            {filters.availability}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 hover:bg-transparent"
                                onClick={() => handleFilterChange('availability', 'available')}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}

                    {(filters.priceRange[0] !== 0 || filters.priceRange[1] !== 100) && (
                        <Badge variant="secondary" className="gap-1">
                            ${filters.priceRange[0]} - ${filters.priceRange[1]}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 hover:bg-transparent"
                                onClick={() => handleFilterChange('priceRange', [0, 100])}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}
                </div>
            )}
        </div>
    )
}