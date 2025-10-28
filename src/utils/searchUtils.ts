import { Product } from '@/data/products';
import { SearchFilters, SearchSuggestion } from '@/types/search';

// Search utility functions
export const searchProducts = (products: Product[], filters: SearchFilters) => {
  let filteredProducts = [...products];

  // Text search
  if (filters.query.trim()) {
    const query = filters.query.toLowerCase().trim();
    filteredProducts = filteredProducts.filter(product => 
      product.title.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.features.some(feature => feature.toLowerCase().includes(query)) ||
      product.tags?.some(tag => tag.toLowerCase().includes(query)) ||
      product.brand?.toLowerCase().includes(query)
    );
  }

  // Category filter
  if (filters.category && filters.category !== 'all') {
    filteredProducts = filteredProducts.filter(product => 
      product.category === filters.category
    );
  }

  // Price range filter
  if (filters.minPrice > 0 || filters.maxPrice < 10000) {
    filteredProducts = filteredProducts.filter(product => 
      product.price >= filters.minPrice && product.price <= filters.maxPrice
    );
  }

  // Rating filter
  if (filters.rating > 0) {
    filteredProducts = filteredProducts.filter(product => 
      product.rating >= filters.rating
    );
  }

  // Brand filter
  if (filters.brand && filters.brand !== 'all') {
    filteredProducts = filteredProducts.filter(product => 
      product.brand === filters.brand
    );
  }

  // Stock filter
  if (filters.inStock) {
    filteredProducts = filteredProducts.filter(product => 
      product.inStock !== false
    );
  }

  // Sort products
  filteredProducts = sortProducts(filteredProducts, filters.sortBy);

  return filteredProducts;
};

export const sortProducts = (products: Product[], sortBy: SearchFilters['sortBy']) => {
  const sorted = [...products];

  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'newest':
      return sorted.sort((a, b) => {
        const dateA = new Date(a.createdAt || '2024-01-01').getTime();
        const dateB = new Date(b.createdAt || '2024-01-01').getTime();
        return dateB - dateA;
      });
    case 'popular':
      return sorted.sort((a, b) => (b.popularity || b.purchaseCount) - (a.popularity || a.purchaseCount));
    case 'relevance':
    default:
      return sorted; // Keep original order for relevance
  }
};

export const generateSuggestions = (products: Product[], query: string): SearchSuggestion[] => {
  if (!query.trim()) return [];

  const suggestions: SearchSuggestion[] = [];
  const queryLower = query.toLowerCase();
  const seen = new Set<string>();

  // Product suggestions
  products.forEach(product => {
    if (product.title.toLowerCase().includes(queryLower) && !seen.has(product.title)) {
      suggestions.push({
        id: `product-${product.id}`,
        text: product.title,
        type: 'product'
      });
      seen.add(product.title);
    }
  });

  // Category suggestions
  const categories = [...new Set(products.map(p => p.category))];
  categories.forEach(category => {
    if (category.toLowerCase().includes(queryLower) && !seen.has(category)) {
      const count = products.filter(p => p.category === category).length;
      suggestions.push({
        id: `category-${category}`,
        text: category,
        type: 'category',
        count
      });
      seen.add(category);
    }
  });

  // Brand suggestions
  const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];
  brands.forEach(brand => {
    if (brand && brand.toLowerCase().includes(queryLower) && !seen.has(brand)) {
      const count = products.filter(p => p.brand === brand).length;
      suggestions.push({
        id: `brand-${brand}`,
        text: brand,
        type: 'brand',
        count
      });
      seen.add(brand);
    }
  });

  return suggestions.slice(0, 8); // Limit to 8 suggestions
};

export const getUniqueCategories = (products: Product[]) => {
  return [...new Set(products.map(p => p.category))].sort();
};

export const getUniqueBrands = (products: Product[]) => {
  return [...new Set(products.map(p => p.brand).filter(Boolean))].sort();
};

export const getPriceRange = (products: Product[]) => {
  const prices = products.map(p => p.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
};

export const getFilterCounts = (products: Product[], filters: SearchFilters) => {
  const categories: Record<string, number> = {};
  const brands: Record<string, number> = {};
  const ratings: Record<number, number> = {};

  // Apply all filters except the one we're counting
  const baseFiltered = searchProducts(products, { ...filters, category: 'all', brand: 'all', rating: 0 });

  baseFiltered.forEach(product => {
    // Count categories
    categories[product.category] = (categories[product.category] || 0) + 1;

    // Count brands
    if (product.brand) {
      brands[product.brand] = (brands[product.brand] || 0) + 1;
    }

    // Count ratings
    const ratingFloor = Math.floor(product.rating);
    ratings[ratingFloor] = (ratings[ratingFloor] || 0) + 1;
  });

  return { categories, brands, ratings };
};

// Debounce function for search input
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
