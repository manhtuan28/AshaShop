import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Star,
  MessageSquare,
  Clock,
  CheckCircle,
  Package,
  ArrowRight,
  Upload,
  X,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { reviewsApi } from '../services/api';
import { PurchasedProductItem, Review } from '../types';
import { useAuthStore } from '../store/useAuthStore';
import { useLanguageStore } from '../store/useLanguageStore';

export const MyReviews: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { t } = useLanguageStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'pending' | 'reviewed'>('pending');
  const [loading, setLoading] = useState<boolean>(true);
  const [pendingItems, setPendingItems] = useState<PurchasedProductItem[]>([]);
  const [reviewedItems, setReviewedItems] = useState<PurchasedProductItem[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<PurchasedProductItem | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [imageUrlInput, setImageUrlInput] = useState<string>('');
  const [feedbackImages, setFeedbackImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string>('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchPurchasedProducts();
  }, [isAuthenticated]);

  const fetchPurchasedProducts = async () => {
    try {
      setLoading(true);
      const res = await reviewsApi.getPurchasedProducts();
      if (res.data.success) {
        setPendingItems(res.data.data.pending || []);
        setReviewedItems(res.data.data.reviewed || []);
      }
    } catch (err) {
      console.error('Lỗi tải danh sách sản phẩm đánh giá:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReviewModal = (item: PurchasedProductItem) => {
    setSelectedItem(item);
    if (item.review) {
      setRating(item.review.rating || 5);
      setComment(item.review.comment || '');
      setFeedbackImages(item.review.images || []);
    } else {
      setRating(5);
      setComment('');
      setFeedbackImages([]);
    }
    setImageUrlInput('');
    setIsModalOpen(true);
  };

  const handleAddImage = () => {
    if (!imageUrlInput.trim()) return;
    if (feedbackImages.length >= 4) {
      alert('Chỉ được thêm tối đa 4 hình ảnh!');
      return;
    }
    setFeedbackImages([...feedbackImages, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setFeedbackImages(feedbackImages.filter((_, i) => i !== index));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    if (!comment.trim()) {
      alert('Vui lòng nhập nội dung đánh giá!');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        productId: typeof selectedItem.productId === 'object' ? (selectedItem.productId as any)._id : selectedItem.productId,
        orderId: selectedItem.orderId,
        rating,
        comment: comment.trim(),
        images: feedbackImages,
        selectedAttributes: selectedItem.selectedAttributes,
      };

      const res = await reviewsApi.create(payload);
      if (res.data.success) {
        setSuccessToast(selectedItem.isReviewed ? 'Cập nhật đánh giá thành công!' : 'Cảm ơn bạn đã gửi đánh giá sản phẩm!');
        setTimeout(() => setSuccessToast(''), 3500);
        setIsModalOpen(false);
        await fetchPurchasedProducts();
      }
    } catch (err) {
      console.error('Lỗi gửi đánh giá:', err);
      alert('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại!');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getRatingEmotion = (stars: number) => {
    switch (stars) {
      case 1:
        return { label: 'Rất không hài lòng', emoji: '😡', color: 'text-red-500' };
      case 2:
        return { label: 'Không hài lòng', emoji: '🙁', color: 'text-orange-500' };
      case 3:
        return { label: 'Bình thường', emoji: '😐', color: 'text-amber-500' };
      case 4:
        return { label: 'Hài lòng', emoji: '😊', color: 'text-blue-500' };
      case 5:
      default:
        return { label: 'Tuyệt vời, cực kỳ ưng ý!', emoji: '🤩', color: 'text-emerald-600' };
    }
  };

  const quickReviewTags = [
    'Chất vải đẹp, dày dặn',
    'Giao hàng siêu nhanh',
    'Đúng như hình ảnh mô tả',
    'Form dáng chuẩn đẹp',
    'Đóng gói cẩn thận',
    'Tư vấn nhiệt tình 10/10',
  ];

  return (
    <div className="min-h-screen bg-gray-50/60 py-8 md:py-12 font-poppins">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-black transition-colors">Trang Chủ</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/orders" className="hover:text-black transition-colors">Đơn Hàng</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-black font-semibold">Đánh Giá Của Tôi</span>
        </div>

        {/* Page Header */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-exclusive-red/10 text-exclusive-red flex items-center justify-center">
                <Star className="w-5 h-5 fill-current" />
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                Đánh Giá Sản Phẩm
              </h1>
            </div>
            <p className="text-sm text-gray-500 max-w-xl leading-relaxed">
              Chia sẻ cảm nhận thực tế về chất liệu, form dáng và chất lượng giao hàng để nhận xu tích lũy và giúp cộng đồng mua sắm tự tin hơn.
            </p>
          </div>

          {/* User Quick Stats */}
          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="text-center px-3 border-r border-gray-200">
              <span className="block text-2xl font-bold text-exclusive-red">{pendingItems.length}</span>
              <span className="text-xs text-gray-500 font-medium">Chờ đánh giá</span>
            </div>
            <div className="text-center px-3">
              <span className="block text-2xl font-bold text-emerald-600">{reviewedItems.length}</span>
              <span className="text-xs text-gray-500 font-medium">Đã nhận xét</span>
            </div>
          </div>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="fixed bottom-8 right-8 z-50 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
            <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
            <span className="font-medium text-sm">{successToast}</span>
          </div>
        )}

        {/* Tabs Switcher */}
        <div className="flex items-center gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('pending')}
            className={`pb-4 px-4 font-semibold text-sm sm:text-base transition-all relative flex items-center gap-2 ${
              activeTab === 'pending'
                ? 'text-exclusive-red font-bold'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Chờ Đánh Giá</span>
            {pendingItems.length > 0 && (
              <span className="ml-1.5 px-2 py-0.5 text-xs bg-exclusive-red text-white font-bold rounded-full">
                {pendingItems.length}
              </span>
            )}
            {activeTab === 'pending' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-exclusive-red rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('reviewed')}
            className={`pb-4 px-4 font-semibold text-sm sm:text-base transition-all relative flex items-center gap-2 ${
              activeTab === 'reviewed'
                ? 'text-exclusive-red font-bold'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Đã Đánh Giá</span>
            {reviewedItems.length > 0 && (
              <span className="ml-1.5 px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 font-bold rounded-full">
                {reviewedItems.length}
              </span>
            )}
            {activeTab === 'reviewed' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-exclusive-red rounded-full" />
            )}
          </button>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse flex gap-6">
                <div className="w-24 h-24 bg-gray-200 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-8 bg-gray-200 rounded w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : activeTab === 'pending' ? (
          /* TAB 1: CHỜ ĐÁNH GIÁ */
          pendingItems.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100 space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Bạn đã đánh giá hết tất cả sản phẩm!</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Cảm ơn bạn đã đóng góp những phản hồi quý giá cho AshaShop. Hãy tiếp tục khám phá thêm các bộ sưu tập mới nhé!
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-black hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Tiếp tục mua sắm</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingItems.map((item, idx) => (
                <div
                  key={`${item.orderId}_${idx}`}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4 sm:gap-6 flex-1">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-gray-100 flex-shrink-0"
                    />
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-md flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Đã nhận hàng
                        </span>
                        <span className="text-xs text-gray-400">
                          Ngày mua: {formatDate(item.orderCreatedAt)}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-2">
                        {item.name}
                      </h4>
                      {item.selectedAttributes && Object.keys(item.selectedAttributes).length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-0.5">
                          {Object.entries(item.selectedAttributes).map(([k, v]) => (
                            <span key={k} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                              {k}: {String(v)}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-sm font-semibold text-exclusive-red">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenReviewModal(item)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-exclusive-red hover:bg-exclusive-red-hover text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Star className="w-4 h-4 fill-current" />
                    <span>Viết Đánh Giá</span>
                  </button>
                </div>
              ))}
            </div>
          )
        ) : (
          /* TAB 2: ĐÃ ĐÁNH GIÁ */
          reviewedItems.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100 space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Chưa có đánh giá nào</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Bạn chưa viết đánh giá nào. Hãy đánh giá các sản phẩm bạn đã mua để chia sẻ trải nghiệm nhé!
              </p>
              <button
                onClick={() => setActiveTab('pending')}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-black hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                <span>Xem sản phẩm chờ đánh giá</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {reviewedItems.map((item, idx) => {
                const review = item.review;
                return (
                  <div
                    key={`${item.orderId}_${idx}`}
                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4"
                  >
                    {/* Header Product Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-xl border border-gray-100 flex-shrink-0"
                        />
                        <div className="space-y-1">
                          <h4 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1">
                            {item.name}
                          </h4>
                          {item.selectedAttributes && Object.keys(item.selectedAttributes).length > 0 && (
                            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                              {Object.entries(item.selectedAttributes).map(([k, v]) => (
                                <span key={k} className="bg-gray-100 px-2 py-0.5 rounded">
                                  {k}: {String(v)}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenReviewModal(item)}
                        className="text-xs font-semibold text-exclusive-red hover:underline self-end sm:self-center"
                      >
                        Chỉnh sửa đánh giá
                      </button>
                    </div>

                    {/* Review Rating & Content */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= (review?.rating || 5) ? 'fill-current' : 'text-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-gray-700">
                          {getRatingEmotion(review?.rating || 5).label}
                        </span>
                        <span className="text-xs text-gray-400 ml-auto">
                          {formatDate(review?.createdAt)}
                        </span>
                      </div>

                      <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line bg-gray-50/70 p-4 rounded-xl border border-gray-100">
                        {review?.comment}
                      </p>

                      {/* Attached Photos */}
                      {review?.images && review.images.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {review.images.map((img, imgIdx) => (
                            <a
                              key={imgIdx}
                              href={img}
                              target="_blank"
                              rel="noreferrer"
                              className="group relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 shadow-sm"
                            >
                              <img
                                src={img}
                                alt="Feedback"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                              />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

      </div>

      {/* REVIEW MODAL */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-gray-900">
                {selectedItem.isReviewed ? 'Chỉnh Sửa Đánh Giá' : 'Đánh Giá Sản Phẩm'}
              </h3>
              <p className="text-xs text-gray-500">
                Cảm ơn bạn đã chia sẻ trải nghiệm thực tế cùng AshaShop
              </p>
            </div>

            {/* Product Snapshot */}
            <div className="flex items-center gap-4 p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-14 h-14 object-cover rounded-xl flex-shrink-0"
              />
              <div className="space-y-0.5 overflow-hidden">
                <h4 className="font-bold text-gray-900 text-sm truncate">{selectedItem.name}</h4>
                <p className="text-xs text-exclusive-red font-semibold">{formatCurrency(selectedItem.price)}</p>
              </div>
            </div>

            {/* Rating Stars Selector */}
            <div className="text-center space-y-3 py-2">
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 text-gray-300 hover:scale-125 transition-transform duration-150 focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoverRating || rating)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-gray-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="text-sm font-bold flex items-center justify-center gap-2">
                <span className="text-xl">{getRatingEmotion(hoverRating || rating).emoji}</span>
                <span className={getRatingEmotion(hoverRating || rating).color}>
                  {getRatingEmotion(hoverRating || rating).label}
                </span>
              </div>
            </div>

            {/* Quick Chips Suggestion */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600 block">Gợi ý nhận xét nhanh:</label>
              <div className="flex flex-wrap gap-1.5">
                {quickReviewTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      if (!comment.includes(tag)) {
                        setComment(comment ? `${comment}, ${tag}` : tag);
                      }
                    }}
                    className="text-xs bg-gray-100 hover:bg-exclusive-red hover:text-white text-gray-700 px-3 py-1 rounded-full transition-colors font-medium"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Review Comment Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700">Nội dung nhận xét:</label>
                <span className="text-xs text-gray-400">{comment.length}/500</span>
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value.slice(0, 500))}
                rows={4}
                required
                placeholder="Hãy chia sẻ chi tiết về chất liệu vải, độ ôm form, cảm nhận khi mặc và dịch vụ giao hàng..."
                className="w-full text-sm p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-exclusive-red/20 focus:border-exclusive-red transition-all"
              />
            </div>

            {/* Feedback Images Upload */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 block">Thêm ảnh feedback (Tùy chọn, tối đa 4 ảnh):</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="Dán đường dẫn link ảnh (URL Unsplash, Cloudinary...)"
                  className="flex-1 text-xs px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-exclusive-red"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-xl hover:bg-black transition-colors"
                >
                  Thêm ảnh
                </button>
              </div>

              {/* Preview Added Images */}
              {feedbackImages.length > 0 && (
                <div className="flex gap-3 pt-2">
                  {feedbackImages.map((url, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 group">
                      <img src={url} alt="Feedback" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute top-1 right-1 bg-black/70 text-white p-0.5 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-xl transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmitReview}
                className="flex-1 py-3 px-4 bg-exclusive-red hover:bg-exclusive-red-hover disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-colors shadow-md shadow-exclusive-red/20 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{selectedItem.isReviewed ? 'Cập Nhật Đánh Giá' : 'Gửi Đánh Giá'}</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
