'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { SearchFilters } from '@/components/search-filters';
import { StoreResultCard } from '@/components/store-result-card';
import { SearchPagination } from '@/components/search-pagination';
import { MapToggle } from '@/components/map-toggle';
import { NoResultsState } from '@/components/no-results-state';
import { MapPlaceholder } from '@/components/map-placeholder';

const RESULTS_PER_PAGE = 6;

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const specialtyParam = searchParams.get('specialty') || '';

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [maxDistance, setMaxDistance] = useState(25);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(
    specialtyParam ? [specialtyParam] : []
  );
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [openNow, setOpenNow] = useState(false);
  const [sortBy, setSortBy] = useState('distance');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMapView, setIsMapView] = useState(false);

useEffect(() => {
    async function fetchStores() {
      setLoading(true);
      setCurrentPage(1);

      if (!query && !specialtyParam) {
        setResults([]);
        setLoading(false);
        return;
      }

      let dbQuery = supabase
        .from('stores')
        .select(`
          id,
          name,
          phone,
          website,
          description,
          specialty_tags,
          services,
          city,
          state,
          address,
          zip,
          lat,
          lng,
          rating,
          review_count,
          is_verified,
          is_claimed,
          hours
        `)
        .limit(100);

      if (query) {
        dbQuery = dbQuery.or(
          `city.ilike.%${query}%,state.ilike.%${query}%,zip.ilike.%${query}%`
        );
      }

      const { data, error } = await dbQuery;

      if (error) {
        console.error('Store fetch error:', error);
        setResults([]);
        setLoading(false);
        return;
      }

      const normalized: any[] = (data || [])
        .filter((s: any) => s.id && s.name)
        .map((store: any) => ({
          id: store.id,
          name: store.name,
          city: store.city,
          state: store.state,
          address: store.address,
          zip: store.zip,
          latitude: store.lat,
          longitude: store.lng,
          phone: store.phone,
          website_url: store.website,
          description: store.description,
          specialty_tags: store.specialty_tags || [],
          services: store.services || [],
          hours: store.hours,
          isVerified: store.is_verified || false,
          isOpen: null,
          rating: store.rating || 4.5,
          reviewCount: store.review_count || 0,
          distance: 0,
        }));

      setResults(normalized);
      setLoading(false);
    }

    fetchStores();
  }, [query, specialtyParam]);  

  // Placeholder — hours parsing can be added once hours format is confirmed
  const isStoreOpen = (_hours: any) => null;

  // Filter results client-side
  let filteredResults = results.filter((store) => {
    if (openNow && !isStoreOpen(store.hours)) return false;
    if (selectedSpecialties.length > 0) {
      const tags = store.specialty_tags || [];
      const hasSpecialty = selectedSpecialties.some((s) =>
        tags.some((t: string) => t.toLowerCase().includes(s.toLowerCase()))
      );
      if (!hasSpecialty) return false;
    }
    return true;
  });

  // Sort
  if (sortBy === 'rating') {
    filteredResults.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'verified') {
    filteredResults.sort((a, b) => (a.isVerified === b.isVerified ? 0 : a.isVerified ? -1 : 1));
  }

  // Pagination
  const totalPages = Math.ceil(filteredResults.length / RESULTS_PER_PAGE);
  const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
  const paginatedResults = filteredResults.slice(startIndex, startIndex + RESULTS_PER_PAGE);

  const handleViewStore = (id: string) => {
    router.push(`/store/${id}`);
  };

  if (isMapView) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <button onClick={() => setIsMapView(false)} className="mb-4 text-primary hover:underline">
            ← Back to List
          </button>
          <MapPlaceholder />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          {loading ? (
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Searching for <span className="text-primary">{query || 'stores'}...</span>
            </h1>
          ) : (
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {filteredResults.length} fish store{filteredResults.length !== 1 ? 's' : ''} near{' '}
              <span className="text-primary">{query || 'you'}</span>
            </h1>
          )}
          <p className="text-muted-foreground">
            {loading ? 'Loading results...' : `Showing ${filteredResults.length} results`}
          </p>
        </div>

        {/* Map Toggle */}
        <div className="mb-6">
          <MapToggle isMapView={isMapView} onToggle={() => setIsMapView(!isMapView)} />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-card rounded-lg p-6 border">
              <h2 className="text-lg font-bold mb-6">Filters</h2>
              <SearchFilters
                maxDistance={maxDistance}
                onDistanceChange={setMaxDistance}
                selectedSpecialties={selectedSpecialties}
                onSpecialtiesChange={setSelectedSpecialties}
                selectedServices={selectedServices}
                onServicesChange={setSelectedServices}
                openNow={openNow}
                onOpenNowChange={setOpenNow}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 space-y-4">
            {loading ? (
              <div className="text-center py-16 text-muted-foreground">
                <div className="text-4xl mb-4">🐠</div>
                <p>Finding fish stores near {query}...</p>
              </div>
            ) : paginatedResults.length === 0 ? (
              <NoResultsState query={query} distance={maxDistance} />
            ) : (
              <>
                {paginatedResults.map((store) => (
                  <StoreResultCard
                    key={store.id}
                    id={store.id}
                    name={store.name}
                    distance={store.distance}
                    city={store.city}
                    state={store.state}
                    specialties={store.specialty_tags || []}
                    rating={store.rating}
                    reviewCount={store.reviewCount}
                    isOpen={store.isOpen ?? true}
                    hours={'Hours not listed'}
                    description={store.description || 'No description available.'}
                    isVerified={store.isVerified}
                    onViewStore={handleViewStore}
                  />
                ))}
                {totalPages > 1 && (
                  <SearchPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPreviousPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    onNextPage={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}