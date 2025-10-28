export interface SearchFilters {
  query: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  rating: number;
  brand: string;
  inStock: boolean;
  sortBy: 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'popular';
}

export interface SearchResult {
  products: any[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  filters: SearchFilters;
}

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'product' | 'category' | 'brand';
  count?: number;
}

export interface SearchContextType {
  searchResults: SearchResult | null;
  isSearching: boolean;
  searchHistory: string[];
  suggestions: SearchSuggestion[];
  filters: SearchFilters;
  search: (query: string, filters?: Partial<SearchFilters>) => Promise<void>;
  updateFilters: (filters: Partial<SearchFilters>) => void;
  clearSearch: () => void;
  addToHistory: (query: string) => void;
  clearHistory: () => void;
  getSuggestions: (query: string) => SearchSuggestion[];
}

export interface PriceRange {
  min: number;
  max: number;
  label: string;
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}
