'use client';

import { useState } from 'react';
import { SlidersHorizontal, X, ChevronLeft } from 'lucide-react';
import { SERVICES, CITIES } from '@/lib/data';
import { ServiceType, DogSize } from '@/lib/types';
import { cn } from '@/lib/utils';

const DOG_SIZES: { id: DogSize; label: string }[] = [
  { id: 'tiny', label: 'זעיר (עד 5 ק"ג)' },
  { id: 'small', label: 'קטן (5-10 ק"ג)' },
  { id: 'medium', label: 'בינוני (10-25 ק"ג)' },
  { id: 'large', label: 'גדול (25-45 ק"ג)' },
  { id: 'giant', label: 'ענק (45+ ק"ג)' },
];

interface FilterBarProps {
  selectedService: ServiceType | '';
  selectedCity: string;
  selectedSizes: DogSize[];
  verifiedOnly: boolean;
  sortBy: 'relevance' | 'rating' | 'price';
  onServiceChange: (s: ServiceType | '') => void;
  onCityChange: (c: string) => void;
  onSizesChange: (sizes: DogSize[]) => void;
  onVerifiedChange: (v: boolean) => void;
  onSortChange: (s: 'relevance' | 'rating' | 'price') => void;
  onClear: () => void;
}

export default function FilterBar({
  selectedService,
  selectedCity,
  selectedSizes,
  verifiedOnly,
  sortBy,
  onServiceChange,
  onCityChange,
  onSizesChange,
  onVerifiedChange,
  onSortChange,
  onClear,
}: FilterBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false);

  const toggleSize = (size: DogSize) => {
    if (selectedSizes.includes(size)) {
      onSizesChange(selectedSizes.filter((s) => s !== size));
    } else {
      onSizesChange([...selectedSizes, size]);
    }
  };

  const hasFilters =
    selectedService || selectedCity || selectedSizes.length > 0 || verifiedOnly;

  const FilterContent = () => (
    <div className="flex flex-wrap items-center gap-3">
      {/* Service Filter */}
      <select
        value={selectedService}
        onChange={(e) => onServiceChange(e.target.value as ServiceType | '')}
        className="px-4 py-2.5 rounded-xl border border-[#E8E8E6] bg-white text-sm font-medium text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#2D7D5A] appearance-none cursor-pointer"
      >
        <option value="">כל השירותים</option>
        {SERVICES.map((s) => (
          <option key={s.id} value={s.id}>
            {s.icon} {s.label}
          </option>
        ))}
      </select>

      {/* City Filter */}
      <select
        value={selectedCity}
        onChange={(e) => onCityChange(e.target.value)}
        className="px-4 py-2.5 rounded-xl border border-[#E8E8E6] bg-white text-sm font-medium text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#2D7D5A] appearance-none cursor-pointer"
      >
        <option value="">כל הערים</option>
        {CITIES.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>

      {/* Dog Size Dropdown */}
      <div className="relative">
        <button
          onClick={() => setSizeDropdownOpen(!sizeDropdownOpen)}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors',
            selectedSizes.length > 0
              ? 'border-[#2D7D5A] bg-[#E8F5EE] text-[#2D7D5A]'
              : 'border-[#E8E8E6] bg-white text-[#1A1A1A]'
          )}
        >
          גודל כלב {selectedSizes.length > 0 && `(${selectedSizes.length})`}
          <ChevronLeft className="w-4 h-4 rotate-[-90deg]" />
        </button>
        {sizeDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setSizeDropdownOpen(false)}
            />
            <div className="absolute top-full mt-2 right-0 bg-white rounded-2xl shadow-lg border border-[#E8E8E6] p-3 z-20 min-w-52">
              {DOG_SIZES.map((size) => (
                <label
                  key={size.id}
                  className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-[#F5F5F3] cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedSizes.includes(size.id)}
                    onChange={() => toggleSize(size.id)}
                    className="w-4 h-4 rounded accent-[#2D7D5A]"
                  />
                  <span className="text-sm text-[#1A1A1A]">{size.label}</span>
                </label>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Verified Only */}
      <label className="flex items-center gap-2 cursor-pointer">
        <div
          onClick={() => onVerifiedChange(!verifiedOnly)}
          className={cn(
            'w-11 h-6 rounded-full transition-colors relative cursor-pointer',
            verifiedOnly ? 'bg-[#2D7D5A]' : 'bg-gray-200'
          )}
        >
          <div
            className={cn(
              'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200',
              verifiedOnly ? 'translate-x-0.5' : 'translate-x-5'
            )}
          />
        </div>
        <span className="text-sm font-medium text-[#1A1A1A]">נבדקו ידנית</span>
      </label>

      {/* Sort */}
      <div className="flex items-center gap-1 mr-auto">
        <span className="text-sm text-[#6B7280] ml-2">מיין:</span>
        {[
          { id: 'relevance' as const, label: 'רלוונטיות' },
          { id: 'rating' as const, label: 'דירוג' },
          { id: 'price' as const, label: 'מחיר' },
        ].map((s) => (
          <button
            key={s.id}
            onClick={() => onSortChange(s.id)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              sortBy === s.id
                ? 'bg-[#2D7D5A] text-white'
                : 'text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F5F5F3]'
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={onClear}
          className="flex items-center gap-1 text-sm text-[#6B7280] hover:text-[#FF7854] transition-colors"
        >
          <X className="w-4 h-4" />
          נקה סינונים
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-white border-b border-[#E8E8E6] sticky top-16 z-40">
      {/* Desktop */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <FilterContent />
      </div>

      {/* Mobile toggle */}
      <div className="md:hidden px-4 py-3">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium w-full justify-center transition-colors',
            mobileOpen || hasFilters
              ? 'border-[#2D7D5A] bg-[#E8F5EE] text-[#2D7D5A]'
              : 'border-[#E8E8E6] bg-white text-[#1A1A1A]'
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          סינון ומיון
          {hasFilters && (
            <span className="w-5 h-5 rounded-full bg-[#2D7D5A] text-white text-xs flex items-center justify-center">
              !
            </span>
          )}
        </button>

        {mobileOpen && (
          <div className="mt-3 flex flex-col gap-3">
            <FilterContent />
          </div>
        )}
      </div>
    </div>
  );
}
