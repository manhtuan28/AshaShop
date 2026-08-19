import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { settingsApi } from '../services/api';
import { translateDynamic } from '../i18n/translator';
import { LanguageCode } from '../i18n/translations';

export interface BentoCardConfig {
  title: string;
  desc: string;
  link: string;
  imageUrl: string;
}

export interface SiteConfig {
  // 1. Branding & Logo
  brandName: string;
  brandHighlight: string;
  tagline: string;
  customLogoUrl: string;
  faviconUrl: string;

  // 2. Top Header Announcement
  showTopBar: boolean;
  topBarText: string;
  topBarDiscount: number;
  topBarLink: string;
  topBarButtonText: string;

  // 3. Hero Slider Banner
  heroTag: string;
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  heroButtonLink: string;
  heroImageUrl: string;

  // 4. Flash Sales Setup
  flashSaleBadge: string;
  flashSaleTitle: string;
  flashSaleSubtitle: string;
  flashSaleDiscount: number;
  flashSaleHours: number;
  flashSaleMode: 'AUTO' | 'CUSTOM';
  flashSaleProductIds: string[];

  // 4.1 Best Sellers Setup
  bestSellingBadge: string;
  bestSellingTitle: string;
  bestSellingSubtitle: string;
  bestSellingMode: 'AUTO' | 'CUSTOM';
  bestSellingProductIds: string[];

  // 4.2 Explore Products Setup
  exploreBadge: string;
  exploreTitle: string;
  exploreSubtitle: string;
  exploreMode: 'AUTO' | 'CUSTOM';
  exploreProductIds: string[];

  // 5. Featured Fashion Promo Lookbook Banner
  promoBadge: string;
  promoTitle: string;
  promoButtonText: string;
  promoButtonLink: string;
  promoImageUrl: string;

  // 6. New Arrival Bento Grid (4 Cards)
  bento1: BentoCardConfig; // Left Full Card (Vest & Blazer)
  bento2: BentoCardConfig; // Top Right (Váy Đầm Nữ)
  bento3: BentoCardConfig; // Bottom Left (Biker & Bomber)
  bento4: BentoCardConfig; // Bottom Right (Túi Xách & Phụ Kiện)

  // 7. Service Guarantee Badges (3 Badges)
  badgeDeliveryTitle: string;
  badgeDeliveryDesc: string;
  badgeServiceTitle: string;
  badgeServiceDesc: string;
  badgeReturnTitle: string;
  badgeReturnDesc: string;

  // 8. About Us Page CMS
  aboutTitle: string;
  aboutStory1: string;
  aboutStory2: string;
  aboutImageUrl: string;

  // 9. Contact Info & Support
  hotline: string;
  supportEmail: string;
  address: string;
  workingHours: string;

  // 10. Footer & Socials
  footerDescription: string;
  footerAppDiscount: string;
  copyrightText: string;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  linkedinUrl: string;

  // 11. Bank Transfer Payment Details
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
}

export const initialSiteConfig: SiteConfig = {
  // 1. Branding & Logo
  brandName: 'Asha',
  brandHighlight: 'Shop',
  tagline: 'Thời Trang Thiết Kế & Quần Áo Cao Cấp',
  customLogoUrl: '',
  faviconUrl: '/favicon.svg',

  // 2. Top Header Announcement
  showTopBar: true,
  topBarText: 'Siêu Sale Thời Trang Mùa Hè Giảm Đến 50% & Miễn Phí Vận Chuyển Toàn Quốc!',
  topBarDiscount: 50,
  topBarLink: '/shop',
  topBarButtonText: 'Mua Ngay',

  // 3. Hero Slider Banner
  heroTag: 'Summer Haute Couture 2026',
  heroTitle: 'Bộ Sưu Tập Thời Trang\nMùa Hè Giảm 10%',
  heroSubtitle: 'Xu Hướng Phong Cách Tối Giản & Thanh Lịch',
  heroButtonText: 'Khám Phá BST Mới',
  heroButtonLink: '/shop',
  heroImageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',

  // 4. Flash Sales Setup
  flashSaleBadge: 'Hôm Nay',
  flashSaleTitle: 'Flash Sale Thời Trang',
  flashSaleSubtitle: 'Giảm giá sốc có giới hạn thời gian',
  flashSaleDiscount: 35,
  flashSaleHours: 24,
  flashSaleMode: 'AUTO',
  flashSaleProductIds: [],

  // 4.1 Best Sellers Setup
  bestSellingBadge: 'Tháng Này',
  bestSellingTitle: 'Mẫu Bán Chạy Nhất',
  bestSellingSubtitle: 'Những thiết kế được yêu thích nhất',
  bestSellingMode: 'AUTO',
  bestSellingProductIds: [],

  // 4.2 Explore Products Setup
  exploreBadge: 'Sản Phẩm Của Chúng Tôi',
  exploreTitle: 'Khám Phá Thời Trang',
  exploreSubtitle: 'Cập nhật những mẫu mới nhất',
  exploreMode: 'AUTO',
  exploreProductIds: [],

  // 5. Featured Fashion Promo Lookbook Banner
  promoBadge: 'Bộ Sưu Tập Nổi Bật',
  promoTitle: 'Nâng Tầm Phong Cách\nThời Trang Đỉnh Cao',
  promoButtonText: 'Mua Ngay!',
  promoButtonLink: '/shop?category=ao-khoac-blazer',
  promoImageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',

  // 6. New Arrival Bento Grid (4 Cards)
  bento1: {
    title: 'Vest & Blazer Nam May Đo',
    desc: 'Form dáng chuẩn mực sang trọng tôn vinh đẳng cấp phái mạnh.',
    link: '/shop?category=ao-khoac-blazer',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
  },
  bento2: {
    title: 'Bộ Sưu Tập Nữ Xu Hướng',
    desc: 'Váy đầm dạ hội và set đồ tôn dáng quyến rũ.',
    link: '/shop?category=thoi-trang-nu',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
  },
  bento3: {
    title: 'Áo Khoác Biker & Bomber',
    desc: 'Chất da cao cấp phong cách streetwear cá tính.',
    link: '/shop?category=ao-khoac-blazer',
    imageUrl: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=600&q=80',
  },
  bento4: {
    title: 'Túi Xách & Phụ Kiện Da',
    desc: 'Da bò tự nhiên cao cấp tạo điểm nhấn ấn tượng.',
    link: '/shop?category=tui-xach-phu-kien',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
  },

  // 7. Service Guarantee Badges (3 Badges)
  badgeDeliveryTitle: 'GIAO HÀNG SIÊU TỐC & MIỄN PHÍ',
  badgeDeliveryDesc: 'Miễn phí vận chuyển cho mọi đơn hàng từ 500.000đ',
  badgeServiceTitle: 'TƯ VẤN SIZE CHUẨN 24/7',
  badgeServiceDesc: 'Đội ngũ stylist hỗ trợ chọn size và phối đồ chu đáo 24/7',
  badgeReturnTitle: 'ĐỔI TRẢ MIỄN PHÍ 30 NGÀY',
  badgeReturnDesc: 'Thử đồ tại nhà, đổi size miễn phí trong 30 ngày',

  // 8. About Us Page CMS
  aboutTitle: 'Câu Chuyện AshaShop Fashion',
  aboutStory1: 'Được thành lập vào năm 2026, AshaShop là thương hiệu thời trang cao cấp mang phong cách hiện đại, thanh lịch và tối giản đến cho mọi khách hàng.',
  aboutStory2: 'Chúng tôi cam kết từng sản phẩm đều được may từ chất liệu cao cấp, đường may tỉ mỉ và chuẩn form dáng giúp bạn tự tin tỏa sáng.',
  aboutImageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',

  // 9. Contact Info & Support
  hotline: '+84 987 654 321',
  supportEmail: 'support@ashashop.com',
  address: '111 Cầu Giấy, Quận Cầu Giấy, Hà Nội, Việt Nam',
  workingHours: '24/7 (Thứ 2 - Chủ Nhật)',

  // 10. Footer & Socials
  footerDescription: 'Thương hiệu thời trang & phụ kiện cao cấp, tôn vinh phong cách sống thanh lịch và hiện đại.',
  footerAppDiscount: 'Tặng ngay 50.000đ cho đơn hàng đầu tiên qua App',
  copyrightText: '© Bản quyền thuộc về AshaShop Fashion 2026. Đã đăng ký bản quyền.',
  facebookUrl: 'https://facebook.com/ashashop',
  instagramUrl: 'https://instagram.com/ashashop',
  twitterUrl: 'https://twitter.com/ashashop',
  linkedinUrl: 'https://linkedin.com/company/ashashop',

  // 11. Bank Transfer Payment Details
  bankName: 'Techcombank - Chi nhánh Hà Nội',
  bankAccountNumber: '19036888888888',
  bankAccountName: 'CONG TY TNHH THUONG MAI ASHASHOP',
};

interface SiteConfigState {
  config: SiteConfig;
  fetchConfigFromApi: () => Promise<void>;
  updateConfig: (newConfig: Partial<SiteConfig>) => Promise<void>;
  resetConfig: () => Promise<void>;
  getLocalizedConfig: (lang: LanguageCode) => SiteConfig;
}

export const useSiteConfigStore = create<SiteConfigState>()(
  persist(
    (set, get) => ({
      config: initialSiteConfig,

      fetchConfigFromApi: async () => {
        try {
          const res = await settingsApi.getSettings();
          if (res.data?.success && res.data.data && Object.keys(res.data.data).length > 0) {
            set((state) => ({
              config: { ...state.config, ...res.data.data },
            }));
          }
        } catch (err) {
          console.warn('Không thể đồng bộ cài đặt từ backend API, sử dụng cache local.', err);
        }
      },

      updateConfig: async (newConfig) => {
        const merged = { ...get().config, ...newConfig };
        set({ config: merged });
        try {
          await settingsApi.updateSettings(merged);
        } catch (err) {
          console.warn('Lưu vào backend API thất bại, đã lưu vào cache local.', err);
        }
      },

      resetConfig: async () => {
        set({ config: initialSiteConfig });
        try {
          await settingsApi.updateSettings(initialSiteConfig);
        } catch (err) {
          console.warn('Reset backend API thất bại:', err);
        }
      },

      getLocalizedConfig: (lang: LanguageCode): SiteConfig => {
        const cfg = get().config;
        if (lang === 'vi') return cfg;

        return {
          ...cfg,
          tagline: translateDynamic(cfg.tagline, lang),
          topBarText: translateDynamic(cfg.topBarText, lang),
          topBarButtonText: translateDynamic(cfg.topBarButtonText, lang),
          heroTag: translateDynamic(cfg.heroTag, lang),
          heroTitle: translateDynamic(cfg.heroTitle, lang),
          heroSubtitle: translateDynamic(cfg.heroSubtitle, lang),
          heroButtonText: translateDynamic(cfg.heroButtonText, lang),
          flashSaleBadge: translateDynamic(cfg.flashSaleBadge || 'Hôm Nay', lang),
          flashSaleTitle: translateDynamic(cfg.flashSaleTitle, lang),
          flashSaleSubtitle: translateDynamic(cfg.flashSaleSubtitle || '', lang),
          bestSellingBadge: translateDynamic(cfg.bestSellingBadge || 'Tháng Này', lang),
          bestSellingTitle: translateDynamic(cfg.bestSellingTitle || 'Mẫu Bán Chạy Nhất', lang),
          bestSellingSubtitle: translateDynamic(cfg.bestSellingSubtitle || '', lang),
          exploreBadge: translateDynamic(cfg.exploreBadge || 'Sản Phẩm Của Chúng Tôi', lang),
          exploreTitle: translateDynamic(cfg.exploreTitle || 'Khám Phá Thời Trang', lang),
          exploreSubtitle: translateDynamic(cfg.exploreSubtitle || '', lang),
          promoBadge: translateDynamic(cfg.promoBadge, lang),
          promoTitle: translateDynamic(cfg.promoTitle, lang),
          promoButtonText: translateDynamic(cfg.promoButtonText, lang),
          bento1: {
            ...cfg.bento1,
            title: translateDynamic(cfg.bento1.title, lang),
            desc: translateDynamic(cfg.bento1.desc, lang),
          },
          bento2: {
            ...cfg.bento2,
            title: translateDynamic(cfg.bento2.title, lang),
            desc: translateDynamic(cfg.bento2.desc, lang),
          },
          bento3: {
            ...cfg.bento3,
            title: translateDynamic(cfg.bento3.title, lang),
            desc: translateDynamic(cfg.bento3.desc, lang),
          },
          bento4: {
            ...cfg.bento4,
            title: translateDynamic(cfg.bento4.title, lang),
            desc: translateDynamic(cfg.bento4.desc, lang),
          },
          badgeDeliveryTitle: translateDynamic(cfg.badgeDeliveryTitle, lang),
          badgeDeliveryDesc: translateDynamic(cfg.badgeDeliveryDesc, lang),
          badgeServiceTitle: translateDynamic(cfg.badgeServiceTitle, lang),
          badgeServiceDesc: translateDynamic(cfg.badgeServiceDesc, lang),
          badgeReturnTitle: translateDynamic(cfg.badgeReturnTitle, lang),
          badgeReturnDesc: translateDynamic(cfg.badgeReturnDesc, lang),
          aboutTitle: translateDynamic(cfg.aboutTitle, lang),
          aboutStory1: translateDynamic(cfg.aboutStory1, lang),
          aboutStory2: translateDynamic(cfg.aboutStory2, lang),
          footerDescription: translateDynamic(cfg.footerDescription, lang),
          footerAppDiscount: translateDynamic(cfg.footerAppDiscount, lang),
          copyrightText: translateDynamic(cfg.copyrightText, lang),
        };
      },
    }),
    {
      name: 'ashashop_site_cms_config',
    },
  ),
);

