'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProviderCard from '@/components/search/ProviderCard';
import FilterBar from '@/components/search/FilterBar';
import { PROVIDERS } from '@/lib/data';
import { Provider, ServiceType, DogSize } from '@/lib/types';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialService = (searchParams.get('service') || '') as ServiceType | '';
  const initialCity = searchParams.get('city') || '';

  const [selectedService, setSelectedService] = useState<ServiceType | ''>(initialService);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedSizes, setSelectedSizes] = useState<DogSize[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'price'>('relevance');
  const [filtered, setFiltered] = useState<Provider[]>(PROVIDERS);

  useEffect(() => {
    let result = [...PROVIDERS];

    if (selectedService) {
      result = result.filter((p) => p.services.includes(selectedService as ServiceType));
    }
    if (selectedCity) {
      result = result.filter((p) =>
        p.city.toLowerCase().includes(selectedCity.toLowerCase())
      );
    }
    if (selectedSizes.length > 0) {
      result = result.filter((p) =>
        selectedSizes.some((size) => p.dogSizes.includes(size))
      );
    }
    if (verifiedOnly) {
      result = result.filter((p) => p.verified);
    }

    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price') {
      result.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else {
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setFiltered(result);
  }, [selectedService, selectedCity, selectedSizes, verifiedOnly, sortBy]);

  const handleClear = () => {
    setSelectedService('');
    setSelectedCity('');
    setSelectedSizes([]);
    setVerifiedOnly(false);
    setSortBy('relevance');
  };

  const serviceLabel: Record<string, string> = {
    boarding: 'דוגסיטרים', sitting: 'האוסיטינג', walking: 'דוגווקרים',
    daycare: 'פנסיון', grooming: 'טיפוח', training: 'אילוף',
    vet: 'וטרינרים', taxi: 'הסעות',
  };
  const pageTitle =
    selectedCity
      ? `${serviceLabel[selectedService] || 'ספקים'} ב${selectedCity}`
      : selectedService
      ? serviceLabel[selectedService] || selectedService
      : 'כל הספקים';

  return (
    <>
      <FilterBar
        selectedService={selectedService}
        selectedCity={selectedCity}
        selectedSizes={selectedSizes}
        verifiedOnly={verifiedOnly}
        sortBy={sortBy}
        onServiceChange={setSelectedService}
        onCityChange={setSelectedCity}
        onSizesChange={setSelectedSizes}
        onVerifiedChange={setVerifiedOnly}
        onSortChange={setSortBy}
        onClear={handleClear}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page title + count */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-[#1A1A1A]">{pageTitle}</h1>
          <p className="text-[#6B7280] mt-1">
            נמצאו{' '}
            <span className="font-bold text-[#2D7D5A]">{filtered.length}</span>{' '}
            תוצאות
          </p>
        </div>

        {/* Results or Empty */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#E8F5EE] flex items-center justify-center mb-4 mx-auto">
              <Search className="w-7 h-7 text-[#2D7D5A]" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">לא נמצאו תוצאות</h2>
            <p className="text-[#6B7280] max-w-sm mb-6">
              נסו לשנות את הסינון או לחפש בעיר אחרת. אנחנו עדיין גדלים ומוסיפים דוגסיטרים ודוגווקרים חדשים כל הזמן.
            </p>
            <button
              onClick={handleClear}
              className="px-6 py-3 bg-[#2D7D5A] text-white rounded-xl font-medium hover:bg-[#1A5C40] transition-colors"
            >
              נקה סינונים
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((provider, index) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <ProviderCard provider={provider} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default function SearchPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-16">
        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#2D7D5A] border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <SearchContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
