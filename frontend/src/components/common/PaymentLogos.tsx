import React from 'react';

// 1. VISA Logo SVG
export const VisaLogo: React.FC<{ className?: string }> = ({ className = 'h-5 w-auto' }) => (
  <svg className={className} viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M18.813 1.258L12.33 15.228H8.257L5.044 4.025C4.852 3.298 4.686 3.031 4.12 2.719C3.189 2.213 1.637 1.733 0.28 1.439L0.373 1.012H7.037C7.904 1.012 8.683 1.586 8.875 2.585L10.555 11.231L14.654 1.258H18.813ZM35.313 10.617C35.333 6.883 29.935 6.67 29.975 4.963C29.995 4.43 30.528 3.843 31.675 3.683C32.241 3.603 33.821 3.55 35.393 4.243L36.06 1.205C35.147 0.885 33.987 0.592 32.507 0.592C28.627 0.592 25.88 2.592 25.84 5.445C25.8 7.551 27.76 8.725 29.24 9.418C30.76 10.138 31.28 10.605 31.28 11.245C31.26 12.231 30.04 12.671 28.907 12.698C27.027 12.725 25.92 12.218 25.04 11.818L24.347 14.978C25.32 15.405 27.107 15.765 28.947 15.792C33.053 15.792 35.293 13.832 35.313 10.617ZM45.693 15.228H49.28L46.16 1.258H42.84C42.093 1.258 41.453 1.685 41.173 2.352L35.213 15.228H39.467L40.32 12.922H45.187L45.693 15.228ZM41.493 9.795L43.493 4.478L44.64 9.795H41.493ZM25.093 1.258L21.84 15.228H17.787L21.04 1.258H25.093Z"
      fill="#1A1F71"
    />
  </svg>
);

// 2. MASTERCARD Logo SVG
export const MastercardLogo: React.FC<{ className?: string }> = ({ className = 'h-5 w-auto' }) => (
  <svg className={className} viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="20" rx="3" fill="#222222" fillOpacity="0.05" />
    <circle cx="11.5" cy="10" r="7.5" fill="#EB001B" />
    <circle cx="20.5" cy="10" r="7.5" fill="#F79E1B" fillOpacity="0.9" />
    <path
      d="M16 4.706C17.652 6.096 18.706 7.925 18.706 10C18.706 12.075 17.652 13.904 16 15.294C14.348 13.904 13.294 12.075 13.294 10C13.294 7.925 14.348 6.096 16 4.706Z"
      fill="#FF5F00"
    />
  </svg>
);

// 3. VNPAY Logo SVG
export const VnPayLogo: React.FC<{ className?: string }> = ({ className = 'h-5 w-auto' }) => (
  <svg className={className} viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* VN (Blue) */}
    <path d="M4 4L11 19L18 4H13.8L11 11.5L8.2 4H4Z" fill="#005BAA" />
    <path d="M20 4H24.2L30.5 13.8V4H34.5V19H30.3L24 9.2V19H20V4Z" fill="#005BAA" />
    {/* PAY (Red) */}
    <path d="M37 4H44C46.8 4 49 5.8 49 8.5C49 11.2 46.8 13 44 13H41V19H37V4ZM41 7.2V9.8H43.8C44.8 9.8 45.4 9.2 45.4 8.5C45.4 7.8 44.8 7.2 43.8 7.2H41Z" fill="#ED1C24" />
    <path d="M54 4L49 19H53.2L54.4 15.2H59.6L60.8 19H65L60 4H54ZM55.4 12L57 6.8L58.6 12H55.4Z" fill="#ED1C24" />
    <path d="M66 4L70 12V19H74V12L78 4H73.8L72 8.5L70.2 4H66Z" fill="#ED1C24" />
  </svg>
);

// 4. MOMO Logo SVG
export const MomoLogo: React.FC<{ className?: string }> = ({ className = 'h-5 w-auto' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="6" fill="#A50064" />
    {/* M */}
    <path d="M4.5 16.5V7.5H6.5L8.5 12L10.5 7.5H12.5V16.5H10.8V10.2L9.2 13.8H7.8L6.2 10.2V16.5H4.5Z" fill="white" />
    {/* O */}
    <path d="M16.5 7.2C18.6 7.2 20 8.8 20 12C20 15.2 18.6 16.8 16.5 16.8C14.4 16.8 13 15.2 13 12C13 8.8 14.4 7.2 16.5 7.2ZM16.5 8.8C15.3 8.8 14.7 9.9 14.7 12C14.7 14.1 15.3 15.2 16.5 15.2C17.7 15.2 18.3 14.1 18.3 12C18.3 9.9 17.7 8.8 16.5 8.8Z" fill="white" />
  </svg>
);

// 5. ZALOPAY Logo SVG
export const ZaloPayLogo: React.FC<{ className?: string }> = ({ className = 'h-5 w-auto' }) => (
  <svg className={className} viewBox="0 0 72 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="72" height="24" rx="4" fill="#008FE5" />
    <path
      d="M10 6H17L12 14H17.5V17H9.5L14.5 9H10V6ZM20 11.5C20 9 21.8 7 24.5 7C27.2 7 29 9 29 11.5C29 14 27.2 16 24.5 16C21.8 16 20 14 20 11.5ZM26.5 11.5C26.5 10 25.6 9.2 24.5 9.2C23.4 9.2 22.5 10 22.5 11.5C22.5 13 23.4 13.8 24.5 13.8C25.6 13.8 26.5 13 26.5 11.5ZM31 6H33.5V17H31V6ZM35 6H39C41.2 6 43 7.3 43 9.5C43 11.7 41.2 13 39 13H37.5V17H35V6ZM37.5 8.2V10.8H39C39.8 10.8 40.5 10.3 40.5 9.5C40.5 8.7 39.8 8.2 39 8.2H37.5ZM45 6L48.5 17H46.2L45.5 14.5H42.5L41.8 17H39.8L43.2 6H45ZM44.8 12.3L44 9.2L43.2 12.3H44.8ZM50 6L53 12.5V17H51V12.5L48 6H50ZM57 6H65V8.5H61.8V17H59.2V8.5H57V6Z"
      fill="white"
    />
  </svg>
);

// 6. VIETQR / BANK TRANSFER Logo SVG
export const VietQrLogo: React.FC<{ className?: string }> = ({ className = 'h-5 w-auto' }) => (
  <svg className={className} viewBox="0 0 68 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="68" height="24" rx="4" fill="#003B70" />
    <path d="M6 5L10.5 17H13.5L18 5H15L12 13.5L9 5H6Z" fill="#00B0FF" />
    <path d="M20 5H22.5V17H20V5Z" fill="#00B0FF" />
    <path d="M25 5H32V7.5H27.5V10H31.5V12.5H27.5V14.5H32.2V17H25V5Z" fill="#00B0FF" />
    <path d="M34 5H42V7.5H39.5V17H36.8V7.5H34V5Z" fill="#00B0FF" />
    <path d="M44 5H52C54.2 5 56 6.8 56 9.5C56 11.2 54.8 12.8 53.2 13.5L56.5 17H53.5L50.5 13.8H46.8V17H44V5ZM46.8 7.5V11.5H51.5C52.4 11.5 53.2 10.7 53.2 9.5C53.2 8.3 52.4 7.5 51.5 7.5H46.8Z" fill="#FFC107" />
    <path d="M58 5H66C68 5 69.5 6.5 69.5 8.5C69.5 10 68.5 11.2 67.2 11.7L70.2 17H67.5L64.8 12.2H60.5V17H58V5ZM60.5 7.2V10.2H65.2C66 10.2 66.8 9.5 66.8 8.7C66.8 7.9 66 7.2 65.2 7.2H60.5Z" fill="#FFC107" />
  </svg>
);

// 7. CASH ON DELIVERY (COD) Logo SVG
export const CodLogo: React.FC<{ className?: string }> = ({ className = 'h-5 w-auto' }) => (
  <svg className={className} viewBox="0 0 64 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="24" rx="4" fill="#10B981" />
    <path
      d="M10 7H20V17H10V7ZM12 9V15H18V9H12ZM15 10.5C15.83 10.5 16.5 11.17 16.5 12C16.5 12.83 15.83 13.5 15 13.5C14.17 13.5 13.5 12.83 13.5 12C13.5 11.17 14.17 10.5 15 10.5ZM24 7H30C32.2 7 34 8.8 34 11V13C34 15.2 32.2 17 30 17H24V7ZM26.5 9.5V14.5H29.5C30.6 14.5 31.5 13.6 31.5 12.5V11.5C31.5 10.4 30.6 9.5 29.5 9.5H26.5ZM37 7H43C45.2 7 47 8.8 47 11V13C47 15.2 45.2 17 43 17H37V7ZM39.5 9.5V14.5H42.5C43.6 14.5 44.5 13.6 44.5 12.5V11.5C44.5 10.4 43.6 9.5 42.5 9.5H39.5ZM49 7H52L54.5 13.5L57 7H60L56 17H53L49 7Z"
      fill="white"
    />
  </svg>
);

// 8. JCB Logo SVG
export const JcbLogo: React.FC<{ className?: string }> = ({ className = 'h-5 w-auto' }) => (
  <svg className={className} viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="20" rx="3" fill="#FFFFFF" />
    <path d="M4 3H10C11.5 3 12.5 4 12.5 5.5V14.5C12.5 16 11.5 17 10 17H4V3Z" fill="#0060A9" />
    <path d="M13 3H19C20.5 3 21.5 4 21.5 5.5V14.5C21.5 16 20.5 17 19 17H13V3Z" fill="#EE1C25" />
    <path d="M22 3H28C29.5 3 30.5 4 30.5 5.5V14.5C30.5 16 29.5 17 28 17H22V3Z" fill="#008037" />
    <text x="6" y="13" fill="white" fontSize="9" fontWeight="bold" fontFamily="Arial">J</text>
    <text x="14.5" y="13" fill="white" fontSize="9" fontWeight="bold" fontFamily="Arial">C</text>
    <text x="23.5" y="13" fill="white" fontSize="9" fontWeight="bold" fontFamily="Arial">B</text>
  </svg>
);

// 9. APP STORE BADGE
export const AppStoreBadge: React.FC<{ className?: string }> = ({ className = 'h-8 w-auto' }) => (
  <svg className={className} viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="40" rx="6" fill="#000000" stroke="#404040" strokeWidth="1" />
    {/* Apple Logo */}
    <path
      d="M20.2 19.4c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.8-3.5.8-.7 0-1.8-.8-3-.8-1.5 0-3 1-3.8 2.3-1.6 2.8-.4 7 1.2 9.2.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3.1-.7 1.4 0 1.8.7 3.1.7 1.2 0 2-.1 2.8-1.2.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.7-1-2.7-4.6zM18.1 12.3c.6-.8 1.1-1.9.9-3-.9.1-2.1.6-2.7 1.4-.6.7-1.1 1.8-.9 2.9 1.1.1 2.1-.5 2.7-1.3z"
      fill="white"
    />
    <text x="32" y="14" fill="#A0A0A0" fontSize="7" fontFamily="sans-serif">Tải trên</text>
    <text x="32" y="27" fill="#FFFFFF" fontSize="12" fontWeight="bold" fontFamily="sans-serif">App Store</text>
  </svg>
);

// 10. GOOGLE PLAY BADGE
export const GooglePlayBadge: React.FC<{ className?: string }> = ({ className = 'h-8 w-auto' }) => (
  <svg className={className} viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="40" rx="6" fill="#000000" stroke="#404040" strokeWidth="1" />
    {/* Play Triangle */}
    <path d="M12 9.5v21l11-10.5L12 9.5z" fill="#00E676" />
    <path d="M12 9.5l11 10.5 3.5-3.5L14 8c-.6-.4-1.4-.4-2 1.5z" fill="#00B0FF" />
    <path d="M12 30.5c.6 1.9 1.4 1.9 2 1.5l12.5-8.5-3.5-3.5-11 10.5z" fill="#FF3D00" />
    <path d="M26.5 23.5l3-2c1.3-.9 1.3-2.1 0-3l-3-2-3.5 3.5 3.5 3.5z" fill="#FFC400" />
    <text x="34" y="14" fill="#A0A0A0" fontSize="7" fontFamily="sans-serif">KHÁM PHÁ TRÊN</text>
    <text x="34" y="27" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Google Play</text>
  </svg>
);
