import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, Mail, ArrowLeft, CheckCircle2, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';
import { authApi } from '../services/api';

export const ForgotPassword: React.FC = () => {
  const { t } = useLanguageStore();
  const navigate = useNavigate();

  // State
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle Step 1: Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await authApi.forgotPassword({ email });
      if (res.data.success) {
        setSuccessMsg(res.data.message || 'Mã xác thực OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư đến.');
        setStep(2);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 2: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setLoading(true);

    try {
      const res = await authApi.resetPassword({
        email,
        token: token.trim(),
        newPassword,
      });

      if (res.data.success) {
        setSuccessMsg('Đặt lại mật khẩu thành công! Đang chuyển hướng đến trang đăng nhập...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Mã xác thực không hợp lệ hoặc đã hết hạn.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-poppins">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[550px]">
        
        {/* Left Side: Illustration Graphic */}
        <div className="lg:col-span-7 bg-[#E2EFF2] rounded-2xl overflow-hidden flex items-center justify-center p-8 min-h-[400px] lg:min-h-[550px] relative">
          <img
            src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80"
            alt="Security & Fashion"
            className="max-h-[450px] w-full object-cover rounded-xl shadow-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent rounded-2xl flex items-end p-8">
            <div className="text-white space-y-1">
              <p className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                Bảo Mật Tài Khoản AshaShop
              </p>
              <p className="text-xs text-slate-200">
                Khôi phục quyền truy cập vào giỏ hàng và danh sách sản phẩm yêu thích của bạn một cách an toàn.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Form Container */}
        <div className="lg:col-span-5 max-w-md w-full mx-auto space-y-6">
          
          <div className="space-y-2">
            <div className="w-12 h-12 bg-red-50 text-exclusive-red rounded-2xl flex items-center justify-center mb-4 shadow-sm">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {t('auth.forgotPasswordTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {step === 1 ? t('auth.forgotPasswordSubtitle') : 'Nhập mã OTP 6 chữ số và thiết lập mật khẩu mới cho tài khoản của bạn.'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 animate-fade-in">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* STEP 1: Request Email */}
          {step === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  {t('auth.emailOrPhone')}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="example@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors pl-8"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-1 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-exclusive-red hover:bg-exclusive-red-hover text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <span>{t('auth.sendOtp')}</span>
                  )}
                </button>

                <Link
                  to="/login"
                  className="w-full py-3 text-center text-xs sm:text-sm font-semibold text-slate-600 hover:text-black flex items-center justify-center gap-1.5 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t('auth.backToLogin')}</span>
                </Link>
              </div>
            </form>
          ) : (
            /* STEP 2: Input OTP & New Password */
            <form onSubmit={handleResetPassword} className="space-y-5 animate-fade-in">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  {t('auth.otpCode')}
                </label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  placeholder="123456"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full border-b border-gray-300 py-3 text-sm font-mono text-center tracking-widest text-lg font-bold focus:outline-none focus:border-exclusive-red transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  {t('auth.newPassword')}
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  {t('auth.confirmPassword')}
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div className="space-y-3 pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-exclusive-red hover:bg-exclusive-red-hover text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Đang cập nhật...</span>
                    </>
                  ) : (
                    <span>{t('auth.resetPasswordBtn')}</span>
                  )}
                </button>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-slate-500 hover:text-black font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Đổi email khác</span>
                  </button>

                  <Link to="/login" className="text-exclusive-red hover:underline font-bold">
                    {t('auth.backToLogin')}
                  </Link>
                </div>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
