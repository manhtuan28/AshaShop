import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { authApi } from '../services/api';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setAuth } = useAuthStore();
  const { t } = useLanguageStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authApi.register({ name, email, password, phone });
      if (res.data.success) {
        const { user, tokens } = res.data.data;
        setAuth(user, tokens);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
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

        {/* Right Side: Register Form */}
        <div className="lg:col-span-5 max-w-md w-full mx-auto space-y-6">
          
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-black tracking-wide">
              {t('auth.registerTitle')}
            </h1>
            <p className="text-sm text-gray-600">{t('auth.enterDetails')}</p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-1">
              <input
                type="text"
                required
                placeholder={t('auth.name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <div className="space-y-1">
              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <div className="space-y-1">
              <input
                type="tel"
                placeholder={t('checkout.phone')}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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

            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-exclusive-red hover:bg-exclusive-red-hover text-white font-medium text-sm rounded transition-colors disabled:opacity-50"
              >
                {loading ? '...' : t('auth.createAccountBtn')}
              </button>

              <button
                type="button"
                className="w-full py-3.5 border border-gray-300 hover:bg-gray-50 text-black font-medium text-sm rounded transition-colors flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>{t('auth.googleSignUp')}</span>
              </button>
            </div>

          </form>

          <div className="text-center text-sm text-gray-600">
            {t('auth.hasAccount')}{' '}
            <Link to="/login" className="font-semibold text-black hover:text-exclusive-red underline underline-offset-2 ml-1">
              {t('auth.logInLink')}
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
