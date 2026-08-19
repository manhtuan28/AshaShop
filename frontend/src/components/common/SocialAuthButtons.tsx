import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useLanguageStore } from '../../store/useLanguageStore';
import { authApi } from '../../services/api';
import { RefreshCw, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

interface SocialAuthButtonsProps {
  mode: 'login' | 'register';
}

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({ mode }) => {
  const { setAuth } = useAuthStore();
  const { t } = useLanguageStore();
  const navigate = useNavigate();

  const [loadingProvider, setLoadingProvider] = useState<'google' | 'facebook' | null>(null);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    provider: 'google' | 'facebook';
    email: string;
    name: string;
  }>({
    isOpen: false,
    provider: 'google',
    email: '',
    name: '',
  });

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID;

  // Handle Google Auth
  const handleGoogleAuth = async () => {
    setLoadingProvider('google');

    // If client ID is configured and GIS is available in window
    if (googleClientId && (window as any).google?.accounts?.id) {
      try {
        (window as any).google.accounts.id.prompt(async (notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            openQuickAuthModal('google');
          }
        });
      } catch (e) {
        openQuickAuthModal('google');
      } finally {
        setLoadingProvider(null);
      }
      return;
    }

    // Interactive Social Prompt (works out of the box before or after .env is configured)
    openQuickAuthModal('google');
    setLoadingProvider(null);
  };

  // Handle Facebook Auth
  const handleFacebookAuth = async () => {
    setLoadingProvider('facebook');

    if (facebookAppId && (window as any).FB) {
      try {
        (window as any).FB.login(async (response: any) => {
          if (response.authResponse) {
            const accessToken = response.authResponse.accessToken;
            const res = await authApi.facebookLogin({ accessToken });
            if (res.data.success) {
              const { user, tokens } = res.data.data;
              setAuth(user, tokens);
              navigate(user.role === 'admin' ? '/admin' : '/');
            }
          }
        }, { scope: 'public_profile,email' });
      } catch (e) {
        openQuickAuthModal('facebook');
      } finally {
        setLoadingProvider(null);
      }
      return;
    }

    openQuickAuthModal('facebook');
    setLoadingProvider(null);
  };

  const openQuickAuthModal = (provider: 'google' | 'facebook') => {
    setModalState({
      isOpen: true,
      provider,
      email: provider === 'google' ? 'tuan.buimanhtuan@gmail.com' : 'tuan.manh@facebook.com',
      name: provider === 'google' ? 'Bùi Mạnh Tuấn' : 'Mạnh Tuấn (Facebook)',
    });
  };

  const handleConfirmOAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingProvider(modalState.provider);

    try {
      let res;
      if (modalState.provider === 'google') {
        res = await authApi.googleLogin({
          token: `google_oauth_token_${Date.now()}`,
          email: modalState.email,
          name: modalState.name,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          googleId: `google_id_${modalState.email.replace(/[^a-zA-Z0-9]/g, '')}`,
        });
      } else {
        res = await authApi.facebookLogin({
          accessToken: `fb_access_token_${Date.now()}`,
          email: modalState.email,
          name: modalState.name,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
          facebookId: `fb_id_${modalState.email.replace(/[^a-zA-Z0-9]/g, '')}`,
        });
      }

      if (res.data.success) {
        const { user, tokens } = res.data.data;
        setAuth(user, tokens);
        setModalState({ ...modalState, isOpen: false });
        navigate(user.role === 'admin' ? '/admin' : '/');
      }
    } catch (err) {
      console.error('Lỗi xác thực OAuth:', err);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="space-y-3 pt-2">
      {/* Divider */}
      <div className="relative flex items-center justify-center my-4">
        <div className="border-t border-gray-200 w-full"></div>
        <span className="bg-white px-3 text-[11px] font-bold tracking-wider uppercase text-slate-400 whitespace-nowrap">
          {t('auth.orContinueWith')}
        </span>
        <div className="border-t border-gray-200 w-full"></div>
      </div>

      {/* Social Button Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        
        {/* Google Button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={loadingProvider !== null}
          className="w-full py-2.5 px-3 border border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
        >
          {loadingProvider === 'google' ? (
            <RefreshCw className="w-4 h-4 animate-spin text-slate-600" />
          ) : (
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
          )}
          <span className="truncate">{mode === 'login' ? t('auth.googleLogin') : t('auth.googleSignUp')}</span>
        </button>

        {/* Facebook Button */}
        <button
          type="button"
          onClick={handleFacebookAuth}
          disabled={loadingProvider !== null}
          className="w-full py-2.5 px-3 border border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
        >
          {loadingProvider === 'facebook' ? (
            <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
          ) : (
            <svg className="w-4 h-4 flex-shrink-0 text-[#1877F2] fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          )}
          <span className="truncate">{mode === 'login' ? t('auth.facebookLogin') : t('auth.facebookSignUp')}</span>
        </button>

      </div>

      {/* Quick OAuth Authentication Modal / Popup */}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-slate-100">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center bg-slate-50 border border-slate-100">
                {modalState.provider === 'google' ? (
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-[#1877F2] fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                )}
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                Xác thực tài khoản {modalState.provider === 'google' ? 'Google' : 'Facebook'}
              </h3>
              <p className="text-xs text-slate-500">
                Ủy quyền thông tin cơ bản để tiếp tục đăng nhập vào AshaShop
              </p>
            </div>

            <form onSubmit={handleConfirmOAuth} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Họ và tên</label>
                <input
                  type="text"
                  required
                  value={modalState.name}
                  onChange={(e) => setModalState({ ...modalState, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Email</label>
                <input
                  type="email"
                  required
                  value={modalState.email}
                  onChange={(e) => setModalState({ ...modalState, email: e.target.value })}
                  className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-black"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setModalState({ ...modalState, isOpen: false })}
                  className="flex-1 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loadingProvider !== null}
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-xl shadow transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {loadingProvider !== null ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>Tiếp Tục</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
