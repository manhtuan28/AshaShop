import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { productsApi } from '../services/api';
import { Category, Product } from '../types';
import { ProductCard } from '../components/common/ProductCard';

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filters state from URL query
  const search = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const isFeatured = searchParams.get('isFeatured') === 'true';

  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  // Load categories once
  useEffect(() => {
    productsApi.getCategories().then((res) => {
      setCategories(res.data.data || []);
    });
  }, []);

  // Fetch products whenever params change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: any = { page, limit: 12, sort };
        if (search) params.search = search;
        if (selectedCategory) params.category = selectedCategory;
        if (searchParams.get('minPrice')) params.minPrice = searchParams.get('minPrice');
        if (searchParams.get('maxPrice')) params.maxPrice = searchParams.get('maxPrice');
        if (isFeatured) params.isFeatured = true;

        const res = await productsApi.getAll(params);
        setProducts(res.data.data.items || []);
        setTotalPages(res.data.data.pagination.totalPages || 1);
        setTotalItems(res.data.data.pagination.total || 0);
      } catch (error) {
        console.error('Lỗi tải sản phẩm:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams, page, sort, search, selectedCategory, isFeatured]);

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // Reset to page 1 on filter
    setSearchParams(newParams);
  };

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (minPrice) newParams.set('minPrice', minPrice);
    else newParams.delete('minPrice');

    if (maxPrice) newParams.set('maxPrice', maxPrice);
    else newParams.delete('maxPrice');

    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb / Title */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Tất Cả Sản Phẩm
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Hiển thị {totalItems} sản phẩm chất lượng cao
          </p>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-gray-600 flex items-center gap-1.5 flex-shrink-0">
            <ArrowUpDown className="w-4 h-4 text-emerald-600" /> Sắp xếp:
          </label>
          <select
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="newest">Mới nhất</option>
            <option value="price_asc">Giá: Thấp đến Cao</option>
            <option value="price_desc">Giá: Cao đến Thấp</option>
            <option value="rating">Đánh giá cao nhất</option>
          </select>
        </div>
      </div>

      {/* Active Search Tag */}
      {search && (
        <div className="mb-6 flex items-center gap-2 bg-emerald-50 text-emerald-800 px-4 py-2 rounded-xl text-sm font-medium w-fit">
          <span>Kết quả tìm kiếm cho: <strong>"{search}"</strong></span>
          <button onClick={() => updateParam('search', '')} className="hover:text-emerald-950">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm uppercase tracking-wide">
                <Filter className="w-4 h-4 text-emerald-600" /> Bộ Lọc
              </h3>
              {(selectedCategory || search || searchParams.get('minPrice') || searchParams.get('maxPrice')) && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-semibold text-red-600 hover:underline"
                >
                  Xóa lọc
                </button>
              )}
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Danh mục
              </h4>
              <div className="space-y-1.5">
                <button
                  onClick={() => updateParam('category', '')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition ${
                    !selectedCategory
                      ? 'bg-emerald-50 text-emerald-700 font-bold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Tất cả danh mục
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => updateParam('category', cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition ${
                      selectedCategory === cat.slug
                        ? 'bg-emerald-50 text-emerald-700 font-bold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="border-t border-gray-100 pt-5">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Khoảng giá (VNĐ)
              </h4>
              <form onSubmit={handlePriceApply} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Từ"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="number"
                    placeholder="Đến"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
                >
                  Áp dụng giá
                </button>
              </form>
            </div>
          </div>
        </aside>

        {/* Products Grid Area */}
        <div className="lg:col-span-3 space-y-8">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-2xl h-80 border border-gray-100" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 space-y-4">
              <SlidersHorizontal className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="text-lg font-bold text-gray-800">Không tìm thấy sản phẩm nào</h3>
              <p className="text-sm text-gray-500">
                Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl text-sm hover:bg-emerald-700 transition"
              >
                Xem tất cả sản phẩm
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                disabled={page <= 1}
                onClick={() => updateParam('page', (page - 1).toString())}
                className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
              >
                Trước
              </button>
              {[...Array(totalPages)].map((_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => updateParam('page', p.toString())}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition ${
                      page === p
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                        : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                disabled={page >= totalPages}
                onClick={() => updateParam('page', (page + 1).toString())}
                className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
