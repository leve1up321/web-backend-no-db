import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { SearchContextType, SearchFilters, SearchResult, SearchSuggestion } from '@/types/search';
import { products } from '@/data/products';
import { searchProducts, generateSuggestions } from '@/utils/searchUtils';

// Search reducer
type SearchAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_RESULTS'; payload: SearchResult }
  | { type: 'SET_FILTERS'; payload: Partial<SearchFilters> }
  | { type: 'SET_SUGGESTIONS'; payload: SearchSuggestion[] }
  | { type: 'ADD_TO_HISTORY'; payload: string }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'CLEAR_SEARCH' };

interface SearchState {
  searchResults: SearchResult | null;
  isSearching: boolean;
  searchHistory: string[];
  suggestions: SearchSuggestion[];
  filters: SearchFilters;
}

const defaultFilters: SearchFilters = {
  query: '',
  category: 'all',
  minPrice: 0,
  maxPrice: 10000,
  rating: 0,
  brand: 'all',
  inStock: false,
  sortBy: 'relevance',
};

const initialState: SearchState = {
  searchResults: null,
  isSearching: false,
  searchHistory: [],
  suggestions: [],
  filters: defaultFilters,
};

const searchReducer = (state: SearchState, action: SearchAction): SearchState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isSearching: action.payload };
    case 'SET_RESULTS':
      return { ...state, searchResults: action.payload, isSearching: false };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'SET_SUGGESTIONS':
      return { ...state, suggestions: action.payload };
    case 'ADD_TO_HISTORY':
      const newHistory = [action.payload, ...state.searchHistory.filter(h => h !== action.payload)].slice(0, 10);
      return { ...state, searchHistory: newHistory };
    case 'CLEAR_HISTORY':
      return { ...state, searchHistory: [] };
    case 'CLEAR_SEARCH':
      return { ...state, searchResults: null, filters: defaultFilters, suggestions: [] };
    default:
      return state;
  }
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(searchReducer, initialState);

  // Load search history from localStorage on mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('searchHistory');
      if (storedHistory) {
        const history = JSON.parse(storedHistory);
        history.forEach((query: string) => {
          dispatch({ type: 'ADD_TO_HISTORY', payload: query });
        });
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  }, []);

  // Save search history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('searchHistory', JSON.stringify(state.searchHistory));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }, [state.searchHistory]);

  const search = async (query: string, filters?: Partial<SearchFilters>): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });

    // Update filters if provided
    const updatedFilters = { ...state.filters, query, ...filters };
    dispatch({ type: 'SET_FILTERS', payload: updatedFilters });

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Perform search
      const filteredProducts = searchProducts(products, updatedFilters);
      
      const result: SearchResult = {
        products: filteredProducts,
        totalCount: filteredProducts.length,
        currentPage: 1,
        totalPages: Math.ceil(filteredProducts.length / 12), // 12 products per page
        filters: updatedFilters,
      };

      dispatch({ type: 'SET_RESULTS', payload: result });

      // Add to history if it's a text search
      if (query.trim()) {
        dispatch({ type: 'ADD_TO_HISTORY', payload: query.trim() });
      }
    } catch (error) {
      console.error('Search error:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateFilters = (filters: Partial<SearchFilters>): void => {
    const updatedFilters = { ...state.filters, ...filters };
    dispatch({ type: 'SET_FILTERS', payload: filters });

    // Re-run search with updated filters
    if (state.searchResults) {
      search(updatedFilters.query, updatedFilters);
    }
  };

  const clearSearch = (): void => {
    dispatch({ type: 'CLEAR_SEARCH' });
  };

  const addToHistory = (query: string): void => {
    if (query.trim()) {
      dispatch({ type: 'ADD_TO_HISTORY', payload: query.trim() });
    }
  };

  const clearHistory = (): void => {
    dispatch({ type: 'CLEAR_HISTORY' });
    localStorage.removeItem('searchHistory');
  };

  const getSuggestions = (query: string): SearchSuggestion[] => {
    const suggestions = generateSuggestions(products, query);
    dispatch({ type: 'SET_SUGGESTIONS', payload: suggestions });
    return suggestions;
  };

  const value: SearchContextType = {
    ...state,
    search,
    updateFilters,
    clearSearch,
    addToHistory,
    clearHistory,
    getSuggestions,
  };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
