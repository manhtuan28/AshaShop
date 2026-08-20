import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useLanguageStore } from '../../store/useLanguageStore';
import { authApi } from '../../services/api';
import { RefreshCw, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface SocialAuthButtonsProps {
  mode: 'login' | 'register';
}

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({ mode }) => {
  const { setAuth } = useAuthStore();
  const { t } = useLanguageStore();
  const navigate = useNavigate();

  const [loadingProvider, setLoadingProvider] = useState<'google' | 'facebook' | null>(null);
  const googleTokenClientRef = useRef<any>(null);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  const facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID || '';

  // 1. Load Google Identity Services SDK
  useEffect(() => {
    if (!googleClientId) return;

    const loadGoogleScript = () => {
      if (document.getElementById('google-gsi-client')) return;
      const script = document.createElement('script');
      script.id = 'google-gsi-client';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if ((window as any).google?.accounts?.oauth2) {
          googleTokenClientRef.current = (window as any).google.accounts.oauth2.initTokenClient({
            client_id: googleClientId,
            scope: 'email profile openid',
            callback: async (tokenResponse: any) => {
              if (tokenResponse && tokenResponse.access_token) {
                await processGoogleToken(tokenResponse.access_token);
              } else if (tokenResponse?.error) {
                console.error('Google OAuth error:', tokenResponse.error);
                toast.error('Đăng nhập Google thất bại hoặc bị hủy');
                setLoadingProvider(null);
              }
            },
          });
        }
      };
      document.body.appendChild(script);
    };

    loadGoogleScript();
  }, [googleClientId]);

  // 2. Load Facebook SDK
  useEffect(() => {
    if (!facebookAppId) return;

    const loadFacebookScript = () => {
      if (document.getElementById('facebook-jssdk')) return;

      (window as any).fbAsyncInit = function () {
        (window as any).FB.init({
          appId: facebookAppId,
          cookie: true,
          xfbml: true,
          version: 'v20.0',
        });
      };

      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/vi_VN/sdk.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    };

    loadFacebookScript();
  }, [facebookAppId]);

  // Process Real Google Token with Backend
  const processGoogleToken = async (token: string) => {
    try {
      setLoadingProvider('google');
      const res = await authApi.googleLogin({ token });
      if (res.data.success) {
        const { user, tokens } = res.data.data;
        setAuth(user, tokens);
        toast.success(`Xin chào, ${user.name}! Đăng nhập Google thành công.`);
        navigate(user.role === 'admin' ? '/admin' : '/');
      }
    } catch (err: any) {
      console.error('Lỗi xác thực Google backend:', err);
      toast.error(err.response?.data?.message || 'Đăng nhập Google không thành công. Vui lòng thử lại!');
    } finally {
      setLoadingProvider(null);
    }
  };

  // Process Real Facebook Access Token with Backend
  const processFacebookToken = async (accessToken: string) => {
    try {
      setLoadingProvider('facebook');
      const res = await authApi.facebookLogin({ accessToken });
      if (res.data.success) {
        const { user, tokens } = res.data.data;
        setAuth(user, tokens);
        toast.success(`Xin chào, ${user.name}! Đăng nhập Facebook thành công.`);
        navigate(user.role === 'admin' ? '/admin' : '/');
      }
    } catch (err: any) {
      console.error('Lỗi xác thực Facebook backend:', err);
      toast.error(err.response?.data?.message || 'Đăng nhập Facebook không thành công. Vui lòng thử lại!');
    } finally {
      setLoadingProvider(null);
    }
  };

  // Handle Google Auth Click
  const handleGoogleAuth = () => {
    if (!googleClientId) {
      toast.error(
        'Chưa cấu hình VITE_GOOGLE_CLIENT_ID trong file .env. Vui lòng điền Client ID từ Google Cloud Console để đăng nhập thật.',
        { duration: 5000, icon: <AlertCircle className="w-5 h-5 text-amber-500" /> }
      );
      return;
    }

    setLoadingProvider('google');

    if (googleTokenClientRef.current) {
      googleTokenClientRef.current.requestAccessToken({ prompt: 'select_account' });
    } else if ((window as any).google?.accounts?.oauth2) {
      const client = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: googleClientId,
        scope: 'email profile openid',
        callback: async (tokenResponse: any) => {
          if (tokenResponse?.access_token) {
            await processGoogleToken(tokenResponse.access_token);
          } else {
            setLoadingProvider(null);
          }
        },
      });
      googleTokenClientRef.current = client;
      client.requestAccessToken({ prompt: 'select_account' });
    } else {
      toast.error('Đang kết nối Google Services, vui lòng thử lại sau vài giây.');
      setLoadingProvider(null);
    }
  };

  // Handle Facebook Auth Click
  const handleFacebookAuth = () => {
    if (!facebookAppId) {
      toast.error(
        'Chưa cấu hình VITE_FACEBOOK_APP_ID trong file .env. Vui lòng điền App ID từ Meta Developers để đăng nhập thật.',
        { duration: 5000, icon: <AlertCircle className="w-5 h-5 text-amber-500" /> }
      );
      return;
    }

    setLoadingProvider('facebook');

    if ((window as any).FB) {
      (window as any).FB.login(
        async (response: any) => {
          if (response.authResponse?.accessToken) {
            await processFacebookToken(response.authResponse.accessToken);
          } else {
            console.warn('Facebook auth cancelled or failed:', response);
            toast.error('Đăng nhập Facebook đã bị hủy hoặc chưa hoàn tất.');
            setLoadingProvider(null);
          }
        },
        { scope: 'public_profile,email', return_scopes: true }
      );
    } else {
      toast.error('Đang tải Facebook SDK, vui lòng thử lại sau vài giây.');
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
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
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
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          )}
          <span className="truncate">{mode === 'login' ? t('auth.facebookLogin') : t('auth.facebookSignUp')}</span>
        </button>
      </div>
    </div>
  );
};
