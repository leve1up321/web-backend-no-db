import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSearch } from '@/contexts/SearchContext';
import { debounce } from '@/utils/searchUtils';

interface SearchBarProps {
  placeholder?: string;
  showSuggestions?: boolean;
  onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "ابحث عن المنتجات...",
  showSuggestions = true,
  onSearch
}) => {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const { search, searchHistory, suggestions, getSuggestions, clearHistory } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced suggestion fetching
  const debouncedGetSuggestions = debounce((q: string) => {
    if (q.trim()) {
      getSuggestions(q);
    }
  }, 300);

  useEffect(() => {
    if (showSuggestions && query.trim()) {
      debouncedGetSuggestions(query);
    }
  }, [query, showSuggestions]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      search(searchQuery.trim());
      setShowDropdown(false);
      onSearch?.(searchQuery.trim());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleHistoryClick = (historyItem: string) => {
    setQuery(historyItem);
    handleSearch(historyItem);
  };

  const clearQuery = () => {
    setQuery('');
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'category':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'brand':
        return <Badge variant="outline" className="h-4 w-4 text-green-500" />;
      default:
        return <Search className="h-4 w-4 text-gray-400" />;
    }
  };

  const getSuggestionTypeLabel = (type: string) => {
    switch (type) {
      case 'category': return 'فئة';
      case 'brand': return 'علامة تجارية';
      case 'product': return 'منتج';
      default: return '';
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            className="pr-10 pl-10 h-12 text-lg"
          />
          {query && (
            <button
              type="button"
              onClick={clearQuery}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* Search Dropdown */}
      {showDropdown && showSuggestions && (
        <Card 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto"
        >
          <CardContent className="p-0">
            {/* Search History */}
            {searchHistory.length > 0 && !query.trim() && (
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-700 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    عمليات البحث الأخيرة
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearHistory}
                    className="text-xs"
                  >
                    مسح الكل
                  </Button>
                </div>
                <div className="space-y-1">
                  {searchHistory.slice(0, 5).map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleHistoryClick(item)}
                      className="w-full text-right p-2 hover:bg-gray-50 rounded-md text-sm text-gray-600 flex items-center"
                    >
                      <Clock className="h-3 w-3 mr-2 text-gray-400" />
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {query.trim() && suggestions.length > 0 && (
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">اقتراحات البحث</h4>
                <div className="space-y-1">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion.text)}
                      className="w-full text-right p-2 hover:bg-gray-50 rounded-md text-sm flex items-center justify-between group"
                    >
                      <div className="flex items-center">
                        {getSuggestionIcon(suggestion.type)}
                        <span className="mr-2">{suggestion.text}</span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        {suggestion.count && (
                          <span className="text-xs text-gray-400">
                            {suggestion.count}
                          </span>
                        )}
                        <Badge variant="secondary" className="text-xs">
                          {getSuggestionTypeLabel(suggestion.type)}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No results */}
            {query.trim() && suggestions.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">لا توجد اقتراحات لـ "{query}"</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSearch(query)}
                  className="mt-2"
                >
                  البحث عن "{query}"
                </Button>
              </div>
            )}

            {/* Popular searches when no query */}
            {!query.trim() && searchHistory.length === 0 && (
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  عمليات بحث شائعة
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['كتب رقمية', 'تطوير الذات', 'ريادة الأعمال', 'التسويق الرقمي'].map((term) => (
                    <Badge
                      key={term}
                      variant="secondary"
                      className="cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSuggestionClick(term)}
                    >
                      {term}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchBar;
