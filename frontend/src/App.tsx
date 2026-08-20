import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/layout/Layout';
import { AdminLayout } from './components/admin/AdminLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { OrderHistory } from './pages/OrderHistory';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Wishlist } from './pages/Wishlist';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfUse } from './pages/TermsOfUse';
import { FAQ } from './pages/FAQ';
import { ForgotPassword } from './pages/ForgotPassword';
import { MyReviews } from './pages/MyReviews';
import { PaymentResult } from './pages/PaymentResult';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminCoupons } from './pages/admin/AdminCoupons';

import { AdminCMSBranding } from './pages/admin/cms/AdminCMSBranding';
import { AdminCMSTopbar } from './pages/admin/cms/AdminCMSTopbar';
import { AdminCMSProductSections } from './pages/admin/cms/AdminCMSProductSections';
import { AdminCMSHero } from './pages/admin/cms/AdminCMSHero';
import { AdminCMSBento } from './pages/admin/cms/AdminCMSBento';
import { AdminCMSBadges } from './pages/admin/cms/AdminCMSBadges';
import { AdminCMSAbout } from './pages/admin/cms/AdminCMSAbout';
import { AdminCMSFooter } from './pages/admin/cms/AdminCMSFooter';
import { AdminCMSBanking } from './pages/admin/cms/AdminCMSBanking';

import { ScrollToTop } from './components/common/ScrollToTop';
import { useAuthStore } from './store/useAuthStore';
import { useSiteConfigStore } from './store/useSiteConfigStore';

export const App: React.FC = () => {
  const { checkAuth } = useAuthStore();
  const { fetchConfigFromApi } = useSiteConfigStore();

  useEffect(() => {
    checkAuth();
    fetchConfigFromApi();
  }, [checkAuth, fetchConfigFromApi]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        {/* Public & Customer Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/:slug" element={<ProductDetail />} />
          <Route path="products/:slug" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsOfUse />} />
          <Route path="terms-of-use" element={<TermsOfUse />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ForgotPassword />} />
          <Route path="payment/result" element={<PaymentResult />} />
          <Route path="payment/vnpay-return" element={<PaymentResult />} />
          <Route path="payment/momo-return" element={<PaymentResult />} />
          <Route path="payment/paypal-return" element={<PaymentResult />} />

          {/* User Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="checkout" element={<Checkout />} />
            <Route path="order-success/:id" element={<OrderSuccess />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="cancellations" element={<OrderHistory defaultTab="CANCELLED" />} />
            <Route path="my-reviews" element={<MyReviews />} />
            <Route path="reviews" element={<MyReviews />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Admin Protected Routes */}
        <Route path="/admin" element={<ProtectedRoute requireAdmin={true} />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            
            {/* Modular CMS Routes */}
            <Route path="cms" element={<Navigate to="/admin/cms/branding" replace />} />
            <Route path="cms/branding" element={<AdminCMSBranding />} />
            <Route path="cms/topbar" element={<AdminCMSTopbar />} />
            <Route path="cms/sections" element={<AdminCMSProductSections />} />
            <Route path="cms/hero" element={<AdminCMSHero />} />
            <Route path="cms/bento" element={<AdminCMSBento />} />
            <Route path="cms/badges" element={<AdminCMSBadges />} />
            <Route path="cms/about" element={<AdminCMSAbout />} />
            <Route path="cms/footer" element={<AdminCMSFooter />} />
            <Route path="cms/banking" element={<AdminCMSBanking />} />

            {/* Commerce & System Routes */}
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="banners" element={<Navigate to="/admin/cms/hero" replace />} />
            <Route path="settings" element={<Navigate to="/admin/cms/branding" replace />} />
          </Route>
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
