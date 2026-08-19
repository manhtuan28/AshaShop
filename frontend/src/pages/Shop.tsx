import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, ChevronRight } from 'lucide-react';
import { productsApi } from '../services/api';
import { Category, Product } from '../types';
import { ProductCard } from '../components/common/ProductCard';

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filters state
  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const currentSort = searchParams.get('sort') || 'newest';
  const [priceRange, setPriceRange] = useState<number>(50000000);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await productsApi.getCategories();
        setCategories(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params: any = {
          page: currentPage,
          limit: 12,
          sort: currentSort,
        };
        if (currentCategory) params.category = currentCategory;
        if (currentSearch) params.search = currentSearch;
        if (priceRange) params.maxPrice = priceRange;

        const res = await productsApi.getAll(params);
        if (res.data.success) {
          setProducts(res.data.data.items);
          setTotal(res.data.data.pagination.total);
          setTotalPages(res.data.data.pagination.totalPages);
        }
      } catch (err) {
        console.error('Lỗi tải sản phẩm:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentCategory, currentSearch, currentPage, currentSort, priceRange]);

  const handleCategoryChange = (slug: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug === currentCategory) {
      newParams.delete('category');
    } else {
      newParams.set('category', slug);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', e.target.value);
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-poppins space-y-8">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-black transition-colors">Home</Link>
        <span>/</span>
        <span className="text-black font-medium">Explore All Products</span>
      </nav>

      {/* Main Shop Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar Filter */}
        <div className="lg:col-span-1 space-y-6">
          <div className="border border-gray-200 rounded p-6 space-y-6">
            <h3 className="font-bold text-lg text-black pb-3 border-b border-gray-200 flex items-center gap-2">
              <Filter className="w-5 h-5 text-exclusive-red" />
              <span>Category Filter</span>
            </h3>

            {/* Categories list */}
            <div className="space-y-3">
              <button
                onClick={() => handleCategoryChange('')}
                className={`w-full text-left text-sm py-1.5 px-3 rounded transition-colors flex items-center justify-between ${
                  !currentCategory ? 'bg-exclusive-red text-white font-semibold' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>All Categories</span>
                <span>({total})</span>
              </button>

              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`w-full text-left text-sm py-1.5 px-3 rounded transition-colors flex items-center justify-between ${
                    currentCategory === cat.slug ? 'bg-exclusive-red text-white font-semibold' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </button>
              ))}
            </div>

            {/* Price Filter Slider */}
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">Price Filter</span>
                <span className="text-xs font-bold text-exclusive-red">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceRange)}
                </span>
              </div>
              <input
                type="range"
                min="500000"
                max="60000000"
                step="500000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-exclusive-red cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Products Catalog */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Header Controls: Count & Sort */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
            <div>
              <h1 className="text-2xl font-bold">All Products</h1>
              <p className="text-xs text-gray-500 mt-1">Showing {products.length} of {total} products found</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 font-medium">Sort by:</span>
              <select
                value={currentSort}
                onChange={handleSortChange}
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black bg-white"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse space-y-3">
                  <div className="bg-gray-200 aspect-square rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-exclusive-bg rounded p-8">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-bold text-lg text-black">No products found</h3>
              <p className="text-sm text-gray-500 mt-1">Try clearing filters or changing search keywords.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                const isActive = pageNumber === currentPage;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`w-10 h-10 rounded font-medium text-sm transition-colors ${
                      isActive ? 'bg-exclusive-red text-white' : 'bg-exclusive-bg text-black hover:bg-gray-200'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
