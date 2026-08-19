import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { authApi } from '../services/api';
import { ShieldCheck, UserCheck } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setAuth } = useAuthStore();
  const { t } = useLanguageStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authApi.login({ email, password });
      if (res.data.success) {
        const { user, tokens } = res.data.data;
        setAuth(user, tokens);
        navigate(user.role === 'admin' ? '/admin' : from, { replace: true });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role: 'admin' | 'customer') => {
    if (role === 'admin') {
      setEmail('admin@ashashop.com');
      setPassword('admin123456');
    } else {
      setEmail('customer@ashashop.com');
      setPassword('customer123456');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-poppins">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[550px]">
        
        {/* Left Side: Shopping Illustration Graphic */}
        <div className="lg:col-span-7 bg-[#CBE4E8] rounded overflow-hidden flex items-center justify-center p-8 min-h-[400px] lg:min-h-[550px]">
          <img
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80"
            alt="Shopping with Exclusive"
            className="max-h-[450px] w-full object-cover rounded shadow-lg"
          />
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-5 max-w-md w-full mx-auto space-y-6">
          
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-black tracking-wide">
              {t('auth.loginTitle')}
            </h1>
            <p className="text-sm text-gray-600">{t('auth.enterDetails')}</p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-1">
              <input
                type="email"
                required
                placeholder={t('auth.emailOrPhone')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <div className="space-y-1">
              <input
                type="password"
                required
                placeholder={t('auth.password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-10 py-3 bg-exclusive-red hover:bg-exclusive-red-hover text-white font-medium text-sm rounded transition-colors disabled:opacity-50"
              >
                {loading ? '...' : t('auth.logInBtn')}
              </button>

              <a href="#" className="text-sm text-exclusive-red hover:underline font-medium">
                {t('auth.forgotPassword')}
              </a>
            </div>

          </form>



          {/* Quick Demo Login Buttons */}
          <div className="pt-2 border-t border-gray-100 space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Đăng nhập nhanh mẫu (Demo)</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="py-2 px-3 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Admin Demo</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('customer')}
                className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer border border-slate-200"
              >
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>Khách Hàng</span>
              </button>
            </div>
          </div>

          <div className="text-center text-sm text-gray-600">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="font-semibold text-black hover:text-exclusive-red underline underline-offset-2 ml-1">
              {t('auth.signUpLink')}
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
