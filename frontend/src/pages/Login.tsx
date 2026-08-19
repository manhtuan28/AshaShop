import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { authApi } from '../services/api';
import { SocialAuthButtons } from '../components/common/SocialAuthButtons';

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-poppins">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[550px]">
        
        {/* Left Side: Shopping Illustration Graphic */}
        <div className="lg:col-span-7 bg-[#CBE4E8] rounded-2xl overflow-hidden flex items-center justify-center p-8 min-h-[400px] lg:min-h-[550px]">
          <img
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80"
            alt="Shopping with Exclusive"
            className="max-h-[450px] w-full object-cover rounded-xl shadow-lg"
          />
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-5 max-w-md w-full mx-auto space-y-6">
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-black tracking-wide">
              {t('auth.loginTitle')}
            </h1>
            <p className="text-sm text-gray-600">{t('auth.enterDetails')}</p>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium animate-fade-in">
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
                className="px-10 py-3.5 bg-exclusive-red hover:bg-exclusive-red-hover text-white font-bold text-sm rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? '...' : t('auth.logInBtn')}
              </button>

              <Link to="/forgot-password" className="text-sm text-exclusive-red hover:underline font-semibold">
                {t('auth.forgotPassword')}
              </Link>
            </div>

          </form>

          {/* Social Auth (Google / Facebook) */}
          <SocialAuthButtons mode="login" />

          <div className="text-center text-sm text-gray-600 pt-4 border-t border-gray-100">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="font-bold text-black hover:text-exclusive-red underline underline-offset-2 ml-1">
              {t('auth.signUpLink')}
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
