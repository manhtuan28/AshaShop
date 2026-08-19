import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, Search, ChevronRight, CornerDownRight, Layers, X, Sparkles } from 'lucide-react';
import { productsApi } from '../services/api';
import { Category, Product } from '../types';
import { ProductCard } from '../components/common/ProductCard';
import { useLanguageStore } from '../store/useLanguageStore';
import { translateDynamic } from '../i18n/translator';

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentLanguage, t } = useLanguageStore();
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // Organize root & child categories
  const rootCategories = categories.filter(c => !c.parentId);
  const getSubcategories = (parentId: string) => categories.filter(c => c.parentId === parentId);
  const activeCategoryObj = categories.find(c => c.slug === currentCategory);

  // Determine active parent and its child subcategories
  const activeParentCategory = activeCategoryObj
    ? (!activeCategoryObj.parentId
        ? activeCategoryObj
        : categories.find(c => c._id === activeCategoryObj.parentId))
    : null;

  const currentSubcategories = activeParentCategory
    ? getSubcategories(activeParentCategory._id)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-poppins space-y-8 animate-fade-in">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-black transition-colors">{t('nav.home')}</Link>
        <span>/</span>
        <span className="text-black font-medium">{t('shop.allProducts')}</span>
        {activeParentCategory && (
          <>
            <span>/</span>
            <span 
              onClick={() => handleCategoryChange(activeParentCategory.slug)}
              className="text-slate-800 hover:text-exclusive-red font-semibold cursor-pointer transition-colors"
            >
              {translateDynamic(activeParentCategory.name, currentLanguage)}
            </span>
          </>
        )}
        {activeCategoryObj && activeCategoryObj.parentId && (
          <>
            <span>/</span>
            <span className="text-exclusive-red font-bold">{translateDynamic(activeCategoryObj.name, currentLanguage)}</span>
          </>
        )}
      </nav>

      {/* Dynamic Top Chips Filter Bar: When parent is selected, show its subcategories! */}
      {categories.length > 0 && (
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap pr-2 border-r border-slate-200">
            <Layers className="w-4 h-4 text-exclusive-red" />
            <span>
              {activeParentCategory 
                ? `${t('home.browseCat.badge')}: ${translateDynamic(activeParentCategory.name, currentLanguage)}`
                : t('shop.allCategories')}
            </span>
          </div>

          {/* Reset All Button */}
          <button
            onClick={() => handleCategoryChange('')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
              !currentCategory
                ? 'bg-exclusive-red text-white shadow-sm font-bold'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <span>{t('shop.allCategories')}</span>
            {currentCategory && <X className="w-3 h-3 ml-0.5 opacity-70" />}
          </button>

          {/* If a parent is active, show only its subcategories. Otherwise, show root categories */}
          {activeParentCategory ? (
            <>
              {/* Parent category button (All items in this parent) */}
              <button
                onClick={() => handleCategoryChange(activeParentCategory.slug)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  currentCategory === activeParentCategory.slug
                    ? 'bg-black text-white font-bold shadow-sm'
                    : 'bg-white text-slate-800 hover:bg-slate-200 border border-slate-200 font-semibold'
                }`}
              >
                Tất cả {translateDynamic(activeParentCategory.name, currentLanguage)}
              </button>

              {/* Subcategories under this active parent */}
              {currentSubcategories.map((sub) => {
                const isSubSelected = currentCategory === sub.slug;
                return (
                  <button
                    key={sub._id}
                    onClick={() => handleCategoryChange(sub.slug)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                      isSubSelected
                        ? 'bg-exclusive-red text-white shadow-sm font-bold'
                        : 'bg-white text-slate-700 hover:bg-red-50 hover:text-exclusive-red border border-slate-200'
                    }`}
                  >
                    <span className="text-exclusive-red">•</span>
                    <span>{translateDynamic(sub.name, currentLanguage)}</span>
                  </button>
                );
              })}
            </>
          ) : (
            /* Show Root Categories */
            rootCategories.map((cat) => {
              return (
                <button
                  key={cat._id}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                >
                  <span>{translateDynamic(cat.name, currentLanguage)}</span>
                </button>
              );
            })
          )}
        </div>
      )}

      {/* Main Shop Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Sidebar Filter */}
        <div className="lg:col-span-1 space-y-6 sticky top-24">
          <div className="border border-gray-200 rounded-2xl p-6 space-y-6 bg-white shadow-sm">
            <h3 className="font-bold text-lg text-black pb-3 border-b border-gray-200 flex items-center gap-2">
              <Filter className="w-5 h-5 text-exclusive-red" />
              <span>{t('shop.categoryFilter')}</span>
            </h3>

            {/* Hierarchical Categories list: ONLY show subcategories when parent is clicked! */}
            <div className="space-y-2">
              <button
                onClick={() => handleCategoryChange('')}
                className={`w-full text-left text-sm py-2 px-3 rounded-xl transition-colors flex items-center justify-between cursor-pointer ${
                  !currentCategory ? 'bg-exclusive-red text-white font-bold shadow' : 'text-gray-700 hover:bg-gray-100 font-medium'
                }`}
              >
                <span>{t('shop.allCategories')}</span>
                <span className="text-xs">({total})</span>
              </button>

              {rootCategories.map((cat) => {
                const subs = getSubcategories(cat._id);
                const isSelected = currentCategory === cat.slug;
                const hasActiveChild = subs.some(s => s.slug === currentCategory);
                const isExpanded = isSelected || hasActiveChild;

                return (
                  <div key={cat._id} className="space-y-1">
                    <button
                      onClick={() => handleCategoryChange(cat.slug)}
                      className={`w-full text-left text-sm py-2 px-3 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-exclusive-red text-white font-bold shadow'
                          : hasActiveChild
                          ? 'bg-red-50 text-exclusive-red font-bold border border-red-200'
                          : 'text-gray-800 hover:bg-gray-100 font-semibold'
                      }`}
                    >
                      <span className="truncate">{translateDynamic(cat.name, currentLanguage)}</span>
                      {subs.length > 0 && (
                        <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-90 text-current' : 'opacity-60'}`} />
                      )}
                    </button>

                    {/* ONLY RENDER SUBCATEGORIES IF THIS PARENT IS ACTIVE / CLICKED! */}
                    {isExpanded && subs.length > 0 && (
                      <div className="pl-3 space-y-1 border-l-2 border-exclusive-red/30 ml-3 py-1.5 animate-fade-in">
                        {subs.map((sub) => {
                          const isSubSelected = currentCategory === sub.slug;
                          return (
                            <button
                              key={sub._id}
                              onClick={() => handleCategoryChange(sub.slug)}
                              className={`w-full text-left text-xs py-1.5 px-2.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                                isSubSelected
                                  ? 'bg-exclusive-red text-white font-bold shadow-sm'
                                  : 'text-slate-600 hover:text-black hover:bg-slate-100 font-medium'
                              }`}
                            >
                              <CornerDownRight className={`w-3.5 h-3.5 ${isSubSelected ? 'text-white' : 'text-slate-400'}`} />
                              <span className="truncate">{translateDynamic(sub.name, currentLanguage)}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Price Filter Slider */}
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">{t('shop.priceFilter')}</span>
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
              <h1 className="text-2xl font-bold">
                {activeCategoryObj ? translateDynamic(activeCategoryObj.name, currentLanguage) : t('shop.allProducts')}
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                {t('shop.showing')} {products.length} {t('shop.of')} {total} {t('shop.productsFound')}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 font-medium">{t('shop.sortBy')}</span>
              <select
                value={currentSort}
                onChange={handleSortChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black bg-white"
              >
                <option value="newest">{t('shop.sort.newest')}</option>
                <option value="price_asc">{t('shop.sort.priceAsc')}</option>
                <option value="price_desc">{t('shop.sort.priceDesc')}</option>
                <option value="rating">{t('shop.sort.rating')}</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-12">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="bg-gray-200 aspect-square rounded-2xl w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl space-y-4 border border-dashed border-gray-300">
              <div className="w-16 h-16 rounded-full bg-red-50 text-exclusive-red flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">{t('shop.noProducts')}</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                {t('shop.noProductsDesc')}
              </p>
              <button
                onClick={() => handleCategoryChange('')}
                className="px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-neutral-800 transition shadow"
              >
                Xem tất cả sản phẩm
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8 border-t border-gray-200">
              {[...Array(totalPages)].map((_, i) => {
                const pageNumber = i + 1;
                const isCurrent = pageNumber === currentPage;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-exclusive-red text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
