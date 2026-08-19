import { LanguageCode } from './translations';
import { Product, Category } from '../types';

// Comprehensive Multilingual Lexicon for Automatic Dynamic Translation
const DICTIONARY: Record<string, Record<LanguageCode, string>> = {
  // Common Brand & Header
  'Siêu Sale Thời Trang Mùa Hè Giảm Đến 50% & Miễn Phí Vận Chuyển Toàn Quốc!': {
    vi: 'Siêu Sale Thời Trang Mùa Hè Giảm Đến 50% & Miễn Phí Vận Chuyển Toàn Quốc!',
    en: 'Summer Fashion Mega Sale - Up to 50% OFF & Free Nationwide Delivery!',
    zh: '夏季时尚大促销 - 最高享 50% 折扣 & 全国免运费！',
    ko: '여름 패션 메가 세일 - 최대 50% 할인 및 전국 무료 배송!',
    ja: 'サマーファッション メガセール - 最大50%OFF＆全国送料無料！',
  },
  'Mua Ngay': {
    vi: 'Mua Ngay',
    en: 'Shop Now',
    zh: '立即抢购',
    ko: '지금 구매하기',
    ja: '今すぐ購入',
  },
  'Mua Ngay!': {
    vi: 'Mua Ngay!',
    en: 'Buy Now!',
    zh: '立即购买！',
    ko: '지금 구매!',
    ja: '今すぐ購入！',
  },
  'Khám Phá BST Mới': {
    vi: 'Khám Phá BST Mới',
    en: 'Explore New Collection',
    zh: '探索最新系列',
    ko: '신규 컬렉션 탐색',
    ja: '新作コレクションを見る',
  },
  'Thời Trang Thiết Kế & Quần Áo Cao Cấp': {
    vi: 'Thời Trang Thiết Kế & Quần Áo Cao Cấp',
    en: 'Designer Fashion & Premium Apparel',
    zh: '设计师时尚与高端服饰',
    ko: '디자이너 패션 및 프리미엄 의류',
    ja: 'デザイナーズファッション＆上質アパレル',
  },

  // Hero & Flash Sales
  'Bộ Sưu Tập Thời Trang\nMùa Hè Giảm 10%': {
    vi: 'Bộ Sưu Tập Thời Trang\nMùa Hè Giảm 10%',
    en: 'Summer Fashion Collection\nUp to 10% OFF Voucher',
    zh: '夏季时尚服饰系列\n立享 10% 优惠券',
    ko: '여름 패션 컬렉션\n최대 10% 할인 바우처',
    ja: 'サマーファッション コレクション\n10%OFFクーポン配布中',
  },
  'Xu Hướng Phong Cách Tối Giản & Thanh Lịch': {
    vi: 'Xu Hướng Phong Cách Tối Giản & Thanh Lịch',
    en: 'Minimalist & Elegant Style Trends',
    zh: '极简与优雅风格趋势',
    ko: '미니멀 & 우아한 스타일 트렌드',
    ja: 'ミニマル＆エレガントなスタイル トレンド',
  },
  'Flash Sale Thời Trang': {
    vi: 'Flash Sale Thời Trang',
    en: 'Fashion Flash Sale',
    zh: '限时时尚秒杀',
    ko: '패션 플래시 세일',
    ja: 'ファッション フラッシュセール',
  },
  'Nâng Tầm Phong Cách\nThời Trang Đỉnh Cao': {
    vi: 'Nâng Tầm Phong Cách\nThời Trang Đỉnh Cao',
    en: 'Elevate Your Style\nPeak Fashion Aesthetics',
    zh: '提升个人风格\n巅峰时尚美学',
    ko: '스타일을 한 단계 업그레이드\n최고의 패션 미학',
    ja: 'スタイルを格上げ\n最高峰のファッション美学',
  },

  // Bento Cards
  'Vest & Blazer Nam May Đo': {
    vi: 'Vest & Blazer Nam May Đo',
    en: 'Tailored Men’s Suits & Blazers',
    zh: '定制男士西装与西服外套',
    ko: '맞춤형 남성 수트 및 블레이저',
    ja: 'オーダーメイド メンズスーツ＆ブレザー',
  },
  'Form dáng chuẩn mực sang trọng tôn vinh đẳng cấp phái mạnh.': {
    vi: 'Form dáng chuẩn mực sang trọng tôn vinh đẳng cấp phái mạnh.',
    en: 'Impeccable tailored cut celebrating masculine sophistication.',
    zh: '尊贵标准剪裁，彰显男士非凡品位。',
    ko: '남성의 품격을 높여주는 완벽한 맞춤 실루엣.',
    ja: '男性の気品を引き立てる、端正なテーラード仕立て。',
  },
  'Bộ Sưu Tập Nữ Xu Hướng': {
    vi: 'Bộ Sưu Tập Nữ Xu Hướng',
    en: 'Trending Women’s Collection',
    zh: '热门女士时尚系列',
    ko: '트렌디 여성 컬렉션',
    ja: 'トレンド レディースコレクション',
  },
  'Váy đầm dạ hội và set đồ tôn dáng quyến rũ.': {
    vi: 'Váy đầm dạ hội và set đồ tôn dáng quyến rũ.',
    en: 'Evening gowns and glamorous silhouette outfits.',
    zh: '迷人晚礼服与修身优雅套装。',
    ko: '매력적인 실루엣의 이브닝 드레스 및 세트 의류.',
    ja: '美しいシルエットのイブニングドレス＆セットアップ。',
  },
  'Áo Khoác Biker & Bomber': {
    vi: 'Áo Khoác Biker & Bomber',
    en: 'Biker & Bomber Jackets',
    zh: '机车皮衣与飞行员夹克',
    ko: '바이커 & 봄버 자켓',
    ja: 'バイカー＆ボンバージャケット',
  },
  'Chất da cao cấp phong cách streetwear cá tính.': {
    vi: 'Chất da cao cấp phong cách streetwear cá tính.',
    en: 'Premium leather with bold streetwear attitude.',
    zh: '优质皮革打造个性街头潮流风尚。',
    ko: '프리미엄 가죽 소재의 개성 넘치는 스트리트웨어 스타일.',
    ja: '上質なレザーで仕上げた個性派ストリートウェア。',
  },
  'Túi Xách & Phụ Kiện Da': {
    vi: 'Túi Xách & Phụ Kiện Da',
    en: 'Leather Handbags & Accessories',
    zh: '真皮手袋与精品配饰',
    ko: '가죽 핸드백 및 패션 액세서리',
    ja: 'レザーハンドバッグ＆アクセサリー',
  },
  'Da bò tự nhiên cao cấp tạo điểm nhấn ấn tượng.': {
    vi: 'Da bò tự nhiên cao cấp tạo điểm nhấn ấn tượng.',
    en: 'Natural genuine cowhide creating a striking statement.',
    zh: '天然头层牛皮打造非凡点睛之作。',
    ko: '천연 소가죽으로 완성한 감각적인 포인트 아이템.',
    ja: '天然本革が放つ、印象的なアクセントピース。',
  },

  // Service Badges
  'GIAO HÀNG SIÊU TỐC & MIỄN PHÍ': {
    vi: 'GIAO HÀNG SIÊU TỐC & MIỄN PHÍ',
    en: 'FREE & EXPRESS DELIVERY',
    zh: '全场免费极速配送',
    ko: '초고속 무료 배송',
    ja: '送料無料＆スピード配送',
  },
  'Miễn phí vận chuyển cho mọi đơn hàng từ 500.000đ': {
    vi: 'Miễn phí vận chuyển cho mọi đơn hàng từ 500.000đ',
    en: 'Free shipping on all orders over $25 or 500,000 VND',
    zh: '全场订单满额即享免费配送',
    ko: '500,000동 이상 모든 주문 무료 배송',
    ja: '一定金額以上のご注文で全国送料無料',
  },
  'TƯ VẤN SIZE CHUẨN 24/7': {
    vi: 'TƯ VẤN SIZE CHUẨN 24/7',
    en: '24/7 STYLIST SIZE ADVISORY',
    zh: '24/7 全天候尺码造型咨询',
    ko: '24/7 맞춤 사이즈 상담 지원',
    ja: '24/7 スタイリストによるサイズ相談',
  },
  'Đội ngũ stylist hỗ trợ chọn size và phối đồ chu đáo 24/7': {
    vi: 'Đội ngũ stylist hỗ trợ chọn size và phối đồ chu đáo 24/7',
    en: 'Professional stylists helping with sizing & styling 24/7',
    zh: '专业造型顾问全天候为您挑选尺码与搭配方案',
    ko: '전문 스타일리스트가 24시간 사이즈 및 코디를 친절히 안내합니다',
    ja: '専属スタイリストが24時間サイズ選びとコーディネートをサポート',
  },
  'ĐỔI TRẢ MIỄN PHÍ 30 NGÀY': {
    vi: 'ĐỔI TRẢ MIỄN PHÍ 30 NGÀY',
    en: '30 DAYS FREE EXCHANGE',
    zh: '30 天内免费退换货',
    ko: '30일 무료 교환 및 반품',
    ja: '30日間 無料返品・サイズ交換',
  },
  'Thử đồ tại nhà, đổi size miễn phí trong 30 ngày': {
    vi: 'Thử đồ tại nhà, đổi size miễn phí trong 30 ngày',
    en: 'Try at home with hassle-free 30-day size exchange',
    zh: '在家试穿无忧，30天内免费更换合适尺码',
    ko: '집에서 편하게 착용해보고 30일 이내 무료 사이즈 교환',
    ja: 'ご自宅で試着可能、30日以内なら無料でサイズ交換対応',
  },

  // About Stories
  'Câu Chuyện AshaShop Fashion': {
    vi: 'Câu Chuyện AshaShop Fashion',
    en: 'The AshaShop Fashion Story',
    zh: 'AshaShop 品牌故事',
    ko: 'AshaShop 브랜드 스토리',
    ja: 'AshaShop ブランドストーリー',
  },
  'Được thành lập vào năm 2026, AshaShop là thương hiệu thời trang cao cấp mang phong cách hiện đại, thanh lịch và tối giản đến cho mọi khách hàng.': {
    vi: 'Được thành lập vào năm 2026, AshaShop là thương hiệu thời trang cao cấp mang phong cách hiện đại, thanh lịch và tối giản đến cho mọi khách hàng.',
    en: 'Founded in 2026, AshaShop is a premium fashion brand dedicated to modern, sophisticated, and minimalist aesthetics for all clients.',
    zh: '创立于2026年，AshaShop 是一个致力于为所有顾客呈现现代、优雅与极简美学的高端时尚品牌。',
    ko: '2026년에 설립된 AshaShop은 모던하고 세련되며 미니멀한 스타일을 선보이는 프리미엄 패션 브랜드입니다.',
    ja: '2026年に設立されたAshaShopは、洗練された現代的なミニマリズムをお届けする上質なファッションブランドです。',
  },
  'Chúng tôi cam kết từng sản phẩm đều được may từ chất liệu cao cấp, đường may tỉ mỉ và chuẩn form dáng giúp bạn tự tin tỏa sáng.': {
    vi: 'Chúng tôi cam kết từng sản phẩm đều được may từ chất liệu cao cấp, đường may tỉ mỉ và chuẩn form dáng giúp bạn tự tin tỏa sáng.',
    en: 'We promise every garment is crafted with premium textiles, meticulous tailoring, and flattering silhouettes to empower your confidence.',
    zh: '我们承诺每件服饰均精选上乘面料，匠心缝制与标准版型，助您时刻自信绽放。',
    ko: '최고급 원단과 정교한 바느질, 완벽한 핏으로 고객님의 당당한 아름다움을 완성합니다.',
    ja: '厳選された高級素材と丁寧な仕立てで、あなたの日常を自信と輝きで満たします。',
  },

  // Categories
  'Thời Trang Nữ': {
    vi: 'Thời Trang Nữ',
    en: "Women's Fashion",
    zh: '女装时尚',
    ko: '여성 패션',
    ja: 'レディースファッション',
  },
  'Thời Trang Nam': {
    vi: 'Thời Trang Nam',
    en: "Men's Fashion",
    zh: '男装时尚',
    ko: '남성 패션',
    ja: 'メンズファッション',
  },
  'Áo Khoác & Blazer': {
    vi: 'Áo Khoác & Blazer',
    en: 'Jackets & Blazers',
    zh: '外套与西装',
    ko: '자켓 및 블레이저',
    ja: 'ジャケット＆ブレザー',
  },
  'Quần & Jeans Thời Trang': {
    vi: 'Quần & Jeans Thời Trang',
    en: 'Pants & Jeans',
    zh: '裤装与牛仔',
    ko: '팬츠 및 청바지',
    ja: 'パンツ＆ジーンズ',
  },
  'Túi Xách & Phụ Kiện': {
    vi: 'Túi Xách & Phụ Kiện',
    en: 'Bags & Accessories',
    zh: '包袋与配饰',
    ko: '가방 및 액세서리',
    ja: 'バッグ＆アクセサリー',
  },
  'Giày & Dép Thời Trang': {
    vi: 'Giày & Dép Thời Trang',
    en: 'Shoes & Footwear',
    zh: '鞋履与鞋包',
    ko: '신발 및 풋웨어',
    ja: 'シューズ＆フットウェア',
  },
  'Váy Đầm Dạ Hội': {
    vi: 'Váy Đầm Dạ Hội',
    en: 'Evening & Gala Dresses',
    zh: '晚宴礼服',
    ko: '이브닝 드레스',
    ja: 'イブニングドレス',
  },
  'Áo Kiểu & Sơ Mi Nữ': {
    vi: 'Áo Kiểu & Sơ Mi Nữ',
    en: "Women's Blouses & Shirts",
    zh: '女士衬衫与女装上衣',
    ko: '여성 블라우스 및 셔츠',
    ja: 'レディースブラウス＆シャツ',
  },
  'Áo Polo Nam': {
    vi: 'Áo Polo Nam',
    en: "Men's Polo Shirts",
    zh: '男士保罗衫',
    ko: '남성 폴로 셔츠',
    ja: 'メンズポロシャツ',
  },
  'Blazer May Đo Hàn Quốc': {
    vi: 'Blazer May Đo Hàn Quốc',
    en: 'Korean Style Tailored Blazer',
    zh: '韩版定制西服外套',
    ko: '한국 스타일 테일러드 블레이저',
    ja: '韓国風テーラードブレザー',
  },

  // Products
  'Đầm Nữ Dạ Hội Dáng Xòe Lụa Satin Sang Trọng': {
    vi: 'Đầm Nữ Dạ Hội Dáng Xòe Lụa Satin Sang Trọng',
    en: 'Luxury Satin Silk Flared Evening Gown',
    zh: '奢华真丝缎面大摆晚礼服长裙',
    ko: '럭셔리 사틴 실크 플레어 이브닝 드레스',
    ja: '上質サテンシルク フレアロングイブニングドレス',
  },
  'Áo Blazer Nam Form Rộng Phong Cách Hàn Quốc': {
    vi: 'Áo Blazer Nam Form Rộng Phong Cách Hàn Quốc',
    en: 'Korean Relaxed Fit Men’s Blazer',
    zh: '韩版宽松休闲男士西服外套',
    ko: '한국 스타일 루즈핏 남성 블레이저',
    ja: '韓国風ルーズフィット メンズブレザー',
  },
  'Áo Sơ Mi Lụa Tơ Tằm Cổ Đức Thanh Lịch': {
    vi: 'Áo Sơ Mi Lụa Tơ Tằm Cổ Đức Thanh Lịch',
    en: 'Elegant Mulberry Silk Button-Down Shirt',
    zh: '优雅桑蚕丝翻领长袖真丝衬衫',
    ko: '우아한 천연 실크 버튼다운 셔츠',
    ja: 'エレガント 天然シルクボタンダウンシャツ',
  },
  'Áo Polo Nam Cotton Pique Thêu Logo Tinh Tế': {
    vi: 'Áo Polo Nam Cotton Pique Thêu Logo Tinh Tế',
    en: 'Embroidered Premium Pique Cotton Polo Shirt',
    zh: '精致刺绣纯棉珠地网眼男士Polo衫',
    ko: '자수 로고 프리미엄 피케 코튼 폴로 셔츠',
    ja: '刺繍入り プレミアム鹿の子コットンポロシャツ',
  },
  'Quần Jeans Nữ Ống Suông Lưng Cao Retro': {
    vi: 'Quần Jeans Nữ Ống Suông Lưng Cao Retro',
    en: 'Vintage High-Waisted Wide Leg Women’s Jeans',
    zh: '复古高腰宽松直筒女士牛仔裤',
    ko: '빈티지 하이웨이스트 와이드핏 여성 청바지',
    ja: 'レトロ ハイウエスト ワイドレッグデニム',
  },
  'Quần Tây Nam Dáng Baggy Xếp Ly Cao Cấp': {
    vi: 'Quần Tây Nam Dáng Baggy Xếp Ly Cao Cấp',
    en: 'Premium Pleated Baggy Trousers for Men',
    zh: '高档褶皱宽松锥形男士西裤',
    ko: '프리미엄 플리츠 배기 남성 슬랙스',
    ja: '上質プリーツ バギースラックス',
  },
  'Áo Khoác Da Biker Unisex Khóa Kéo Bạc': {
    vi: 'Áo Khoác Da Biker Unisex Khóa Kéo Bạc',
    en: 'Unisex Leather Biker Jacket with Silver Zippers',
    zh: '中性风银色金属拉链机车皮衣外套',
    ko: '실버 지퍼 유니섹스 바이커 가죽 자켓',
    ja: 'シルバーZIP ユニセックス 本革ライダース',
  },
  'Áo Khoác Bomber Chần Bông Streetwear': {
    vi: 'Áo Khoác Bomber Chần Bông Streetwear',
    en: 'Quilted Streetwear Oversized Bomber Jacket',
    zh: '美式街头绗缝加厚保暖飞行员夹克',
    ko: '스트리트웨어 퀼팅 오버사이즈 봄버 자켓',
    ja: '中綿キルティング ストリート ボンバージャケット',
  },
  'Chân Váy Xếp Ly Dáng Dài Tông Pastel': {
    vi: 'Chân Váy Xếp Ly Dáng Dài Tông Pastel',
    en: 'Pastel Tone High-Waist Pleated Midi Skirt',
    zh: '柔美马卡龙色系高腰百褶长裙',
    ko: '파스텔 톤 하이웨이스트 플리츠 롱스커트',
    ja: 'パステルトーン プリーツロングスカート',
  },
  'Set Đồ Nữ Tweed Áo Khoác Lửng Kèm Chân Váy': {
    vi: 'Set Đồ Nữ Tweed Áo Khoác Lửng Kèm Chân Váy',
    en: 'Luxury Tweed Cropped Jacket & Skirt Two-Piece Set',
    zh: '小香风粗花呢短款外套配半身裙两件套',
    ko: '고급 트위드 크롭 자켓 & 스커트 투피스 세트',
    ja: '高級ツイード ショートジャケット＆スカート セットアップ',
  },
  'Túi Xách Nữ Da Thật Quai Xách Sang Trọng Kèm Dây Đeo': {
    vi: 'Túi Xách Nữ Da Thật Quai Xách Sang Trọng Kèm Dây Đeo',
    en: 'Genuine Cowhide Leather Structured Tote Handbag',
    zh: '头层牛皮高级手提包配可拆卸斜挎肩带',
    ko: '천연 소가죽 토트백 & 크로스 스트랩 세트',
    ja: '天然牛革 高級ハンドバッグ 2WAYショルダーストラップ付',
  },
  // ================= ADMIN & CMS VOCABULARY =================
  'Tổng Quan Hoạt Động Cửa Hàng': {
    vi: 'Tổng Quan Hoạt Động Cửa Hàng',
    en: 'Store Operations Overview',
    zh: '店铺运营总览',
    ko: '매장 운영 개요',
    ja: '店舗運営概要',
  },
  'Theo dõi doanh thu bán hàng, trạng thái đơn hàng và kiểm soát hoạt động kinh doanh AshaShop Fashion': {
    vi: 'Theo dõi doanh thu bán hàng, trạng thái đơn hàng và kiểm soát hoạt động kinh doanh AshaShop Fashion',
    en: 'Track sales revenue, order statuses, and control AshaShop Fashion business operations',
    zh: '跟踪销售收入、订单状态并掌控 AshaShop Fashion 商业运营',
    ko: '매출, 주문 상태를 모니터링하고 AshaShop Fashion 비즈니스 운영을 총괄합니다',
    ja: '売上高、注文状況を追跡し、AshaShop Fashionのビジネス運営を一元管理します',
  },
  'Quản Lý Sản Phẩm': {
    vi: 'Quản Lý Sản Phẩm',
    en: 'Product Management',
    zh: '商品管理',
    ko: '상품 관리',
    ja: '商品管理',
  },
  'Tổng Doanh Thu': {
    vi: 'Tổng Doanh Thu',
    en: 'Total Revenue',
    zh: '总营业额',
    ko: '총 매출',
    ja: '総売上高',
  },
  'Tổng Đơn Hàng': {
    vi: 'Tổng Đơn Hàng',
    en: 'Total Orders',
    zh: '订单总数',
    ko: '총 주문 수',
    ja: '総注文数',
  },
  'Chờ Xử Lý': {
    vi: 'Chờ Xử Lý',
    en: 'Pending Processing',
    zh: '待处理',
    ko: '처리 대기 중',
    ja: '処理待ち',
  },
  'Đã Giao Thành Công': {
    vi: 'Đã Giao Thành Công',
    en: 'Delivered Successfully',
    zh: '已成功送达',
    ko: '배송 완료',
    ja: '配達完了',
  },
  'Tổng Số Sản Phẩm': {
    vi: 'Tổng Số Sản Phẩm',
    en: 'Total Products',
    zh: '商品总数',
    ko: '총 상품 수',
    ja: '総商品数',
  },
  'Đơn Hàng Gần Đây': {
    vi: 'Đơn Hàng Gần Đây',
    en: 'Recent Orders',
    zh: '最新订单',
    ko: '최근 주문 내역',
    ja: '最近の注文',
  },
  'Xem Tất Cả Đơn Hàng': {
    vi: 'Xem Tất Cả Đơn Hàng',
    en: 'View All Orders',
    zh: '查看所有订单',
    ko: '모든 주문 보기',
    ja: 'すべての注文を見る',
  },
  'Mã Đơn': {
    vi: 'Mã Đơn',
    en: 'Order ID',
    zh: '订单号',
    ko: '주문 번호',
    ja: '注文ID',
  },
  'Khách Hàng': {
    vi: 'Khách Hàng',
    en: 'Customer',
    zh: '客户',
    ko: '고객',
    ja: 'お客様',
  },
  'Ngày Đặt': {
    vi: 'Ngày Đặt',
    en: 'Order Date',
    zh: '下单日期',
    ko: '주문 일자',
    ja: '注文日',
  },
  'Tổng Tiền': {
    vi: 'Tổng Tiền',
    en: 'Total Amount',
    zh: '总金额',
    ko: '총 금액',
    ja: '合計金額',
  },
  'Trạng Thái': {
    vi: 'Trạng Thái',
    en: 'Status',
    zh: '状态',
    ko: '상태',
    ja: 'ステータス',
  },
  'Thao Tác': {
    vi: 'Thao Tác',
    en: 'Actions',
    zh: '操作',
    ko: '작업',
    ja: '操作',
  },
  'Quản Lý Danh Mục': {
    vi: 'Quản Lý Danh Mục',
    en: 'Category Management',
    zh: '分类管理',
    ko: '카테고리 관리',
    ja: 'カテゴリー管理',
  },
  'Thêm Danh Mục Mới': {
    vi: 'Thêm Danh Mục Mới',
    en: 'Add New Category',
    zh: '添加新分类',
    ko: '새 카테고리 추가',
    ja: '新しいカテゴリーを追加',
  },
  'Thêm Sản Phẩm Mới': {
    vi: 'Thêm Sản Phẩm Mới',
    en: 'Add New Product',
    zh: '添加新商品',
    ko: '새 상품 추가',
    ja: '新しい商品を追加',
  },
  'Chỉnh Sửa Sản Phẩm': {
    vi: 'Chỉnh Sửa Sản Phẩm',
    en: 'Edit Product',
    zh: '编辑商品',
    ko: '상품 수정',
    ja: '商品を編集',
  },
  'Quản Lý Đơn Hàng': {
    vi: 'Quản Lý Đơn Hàng',
    en: 'Order Management',
    zh: '订单管理',
    ko: '주문 관리',
    ja: '注文管理',
  },
  'Quản Lý Người Dùng & Phân Quyền': {
    vi: 'Quản Lý Người Dùng & Phân Quyền',
    en: 'User Management & Permissions',
    zh: '用户管理与权限分配',
    ko: '사용자 관리 및 권한 설정',
    ja: 'ユーザー管理および権限設定',
  },
  'Khối Sản Phẩm Trang Chủ': {
    vi: 'Khối Sản Phẩm Trang Chủ',
    en: 'Homepage Product Sections',
    zh: '首页商品板块',
    ko: '홈페이지 상품 섹션',
    ja: 'ホームページ商品セクション',
  },
  'admin.nav.cms.sections': {
    vi: 'Khối Sản Phẩm Trang Chủ',
    en: 'Homepage Product Sections',
    zh: '首页商品板块',
    ko: '홈페이지 상품 섹션',
    ja: 'ホームページ商品セクション',
  },
  'Quản lý tài khoản khách hàng, phân quyền Quản Trị Viên (Admin) và bảo mật hệ thống CSDL': {
    vi: 'Quản lý tài khoản khách hàng, phân quyền Quản Trị Viên (Admin) và bảo mật hệ thống CSDL',
    en: 'Manage customer accounts, configure Admin roles, and secure the database system',
    zh: '管理客户账户、配置管理员角色并保障数据库系统安全',
    ko: '고객 계정 관리, 관리자(Admin) 권한 설정 및 데이터베이스 시스템 보안 유지',
    ja: '顧客アカウントの管理、管理者権限の設定、データベースシステムのセキュリティ保護',
  },
  'Thêm Tài Khoản Mới': {
    vi: 'Thêm Tài Khoản Mới',
    en: 'Add New Account',
    zh: '添加新账户',
    ko: '새 계정 추가',
    ja: '新しいアカウントを追加',
  },
  'Tổng Tài Khoản': {
    vi: 'Tổng Tài Khoản',
    en: 'Total Accounts',
    zh: '账户总数',
    ko: '총 계정 수',
    ja: '総アカウント数',
  },
  'Quản Trị Viên (Admin)': {
    vi: 'Quản Trị Viên (Admin)',
    en: 'Administrators (Admin)',
    zh: '管理员 (Admin)',
    ko: '관리자 (Admin)',
    ja: '管理者 (Admin)',
  },
  'Khách Hàng (Customer)': {
    vi: 'Khách Hàng (Customer)',
    en: 'Customers (Customer)',
    zh: '普通客户 (Customer)',
    ko: '일반 고객 (Customer)',
    ja: '一般顧客 (Customer)',
  },
  'Quản Trị Viên': {
    vi: 'Quản Trị Viên',
    en: 'Administrator',
    zh: '管理员',
    ko: '관리자',
    ja: '管理者',
  },
  'Email Liên Hệ': {
    vi: 'Email Liên Hệ',
    en: 'Contact Email',
    zh: '联系邮箱',
    ko: '연락처 이메일',
    ja: '連絡先メール',
  },
  'Số Điện Thoại': {
    vi: 'Số Điện Thoại',
    en: 'Phone Number',
    zh: '联系电话',
    ko: '전화번호',
    ja: '電話番号',
  },
  'Địa Chỉ': {
    vi: 'Địa Chỉ',
    en: 'Address',
    zh: '地址',
    ko: '주소',
    ja: '住所',
  },
  'Vai Trò & Quyền': {
    vi: 'Vai Trò & Quyền',
    en: 'Role & Permissions',
    zh: '角色与权限',
    ko: '역할 및 권한',
    ja: '役割と権限',
  },
  'Quản Lý Mã Giảm Giá': {
    vi: 'Quản Lý Mã Giảm Giá',
    en: 'Coupon Management',
    zh: '优惠券管理',
    ko: '할인 쿠폰 관리',
    ja: 'クーポン管理',
  },
  'Quản Lý Banner': {
    vi: 'Quản Lý Banner',
    en: 'Banner Management',
    zh: '横幅海报管理',
    ko: '배너 관리',
    ja: 'バナー管理',
  },
  'Cài Đặt Hệ Thống': {
    vi: 'Cài Đặt Hệ Thống',
    en: 'System Settings',
    zh: '系统设置',
    ko: '시스템 설정',
    ja: 'システム設定',
  },
  'Cấu Hình Thương Hiệu & Logo': {
    vi: 'Cấu Hình Thương Hiệu & Logo',
    en: 'Brand & Logo Configuration',
    zh: '品牌标识与 Logo 设置',
    ko: '브랜드 및 로고 설정',
    ja: 'ブランド＆ロゴ設定',
  },
  'Thanh Thông Báo Header (Top Bar)': {
    vi: 'Thanh Thông Báo Header (Top Bar)',
    en: 'Header Notification Bar (Top Bar)',
    zh: '顶部通知栏设置 (Top Bar)',
    ko: '상단 알림 바 설정 (Top Bar)',
    ja: 'トップ通知バー設定 (Top Bar)',
  },
  'Hero Lookbook & Flash Sale': {
    vi: 'Hero Lookbook & Flash Sale',
    en: 'Hero Lookbook & Flash Sale Banner',
    zh: '主视觉 Lookbook 与限时秒杀',
    ko: '메인 룩북 & 플래시 세일',
    ja: 'メイン ルックブック＆フラッシュセール',
  },
  'Lookbook 4 Ô (Bento Grid)': {
    vi: 'Lookbook 4 Ô (Bento Grid)',
    en: '4-Grid Lookbook (Bento Grid)',
    zh: '四格特色 Lookbook (Bento Grid)',
    ko: '4분할 룩북 (Bento Grid)',
    ja: '4分割ルックブック (Bento Grid)',
  },
  'Cam Kết & Chứng Nhận Dịch Vụ': {
    vi: 'Cam Kết & Chứng Nhận Dịch Vụ',
    en: 'Service Commitments & Badges',
    zh: '服务承诺与官方认证',
    ko: '서비스 보증 및 배지',
    ja: 'サービス保証＆認証バッジ',
  },
  'Trang Giới Thiệu (About Us)': {
    vi: 'Trang Giới Thiệu (About Us)',
    en: 'About Us Page CMS',
    zh: '关于我们页面设置 (About Us)',
    ko: '회사 소개 페이지 설정 (About Us)',
    ja: '企業概要ページ設定 (About Us)',
  },
  'Chân Trang & Mạng Xã Hội': {
    vi: 'Chân Trang & Mạng Xã Hội',
    en: 'Footer & Social Media Links',
    zh: '页脚与社交媒体设置',
    ko: '푸터 및 소셜 미디어 설정',
    ja: 'フッター＆ソーシャルメディア設定',
  },
  'Thông Tin Chuyển Khoản Ngân Hàng': {
    vi: 'Thông Tin Chuyển Khoản Ngân Hàng',
    en: 'Bank Transfer Details',
    zh: '银行转账账户信息',
    ko: '계좌 이체 결제 정보',
    ja: '銀行振込情報',
  },
  'Lưu Thay Đổi': {
    vi: 'Lưu Thay Đổi',
    en: 'Save Changes',
    zh: '保存更改',
    ko: '변경사항 저장',
    ja: '変更を保存',
  },
  'Đang lưu...': {
    vi: 'Đang lưu...',
    en: 'Saving...',
    zh: '保存中...',
    ko: '저장 중...',
    ja: '保存中...',
  },
  'Thêm Mới': {
    vi: 'Thêm Mới',
    en: 'Add New',
    zh: '新增',
    ko: '새로 추가',
    ja: '新規追加',
  },
  'Tìm kiếm...': {
    vi: 'Tìm kiếm...',
    en: 'Search...',
    zh: '搜索...',
    ko: '검색...',
    ja: '検索...',
  },
  'Đang tải dữ liệu...': {
    vi: 'Đang tải dữ liệu...',
    en: 'Loading data...',
    zh: '数据加载中...',
    ko: '데이터 로딩 중...',
    ja: 'データを読み込み中...',
  },
};

/**
 * Intelligent Multi-language Translator for any text string
 */
export function translateDynamic(text: string | undefined | null, lang: LanguageCode): string {
  if (!text) return '';
  if (lang === 'vi') return text; // Default base language

  // 1. Direct dictionary match
  const trimmed = text.trim();
  if (DICTIONARY[trimmed] && DICTIONARY[trimmed][lang]) {
    return DICTIONARY[trimmed][lang];
  }

  // 2. Substring matching for composite titles
  for (const [key, mapping] of Object.entries(DICTIONARY)) {
    if (trimmed.includes(key) && mapping[lang]) {
      return mapping[lang];
    }
  }

  // 3. Fashion Domain Rule Replacements
  let result = trimmed;
  const replacements: Record<string, Record<LanguageCode, string>> = {
    'Thời trang': { vi: 'Thời trang', en: 'Fashion', zh: '时尚', ko: '패션', ja: 'ファッション' },
    'Áo sơ mi': { vi: 'Áo sơ mi', en: 'Shirt', zh: '衬衫', ko: '셔츠', ja: 'シャツ' },
    'Áo khoác': { vi: 'Áo khoác', en: 'Jacket', zh: '外套', ko: '자켓', ja: 'ジャケット' },
    'Váy đầm': { vi: 'Váy đầm', en: 'Dress', zh: '连衣裙', ko: '드레스', ja: 'ワンピース' },
    'Quần': { vi: 'Quần', en: 'Pants', zh: '裤子', ko: '바지', ja: 'パンツ' },
    'Túi xách': { vi: 'Túi xách', en: 'Handbag', zh: '手袋', ko: '핸드백', ja: 'ハンドバッグ' },
    'Giày': { vi: 'Giày', en: 'Shoes', zh: '鞋子', ko: '신발', ja: 'シューズ' },
    'Cao cấp': { vi: 'Cao cấp', en: 'Premium', zh: '高端', ko: '프리미엄', ja: 'プレミアム' },
    'Sang trọng': { vi: 'Sang trọng', en: 'Luxury', zh: '奢华', ko: '럭셔리', ja: 'ラグジュアリー' },
    'Thanh lịch': { vi: 'Thanh lịch', en: 'Elegant', zh: '优雅', ko: '우아한', ja: 'エレガント' },
    'Bộ sưu tập': { vi: 'Bộ sưu tập', en: 'Collection', zh: '系列', ko: '컬렉션', ja: 'コレクション' },
  };

  for (const [term, map] of Object.entries(replacements)) {
    if (result.toLowerCase().includes(term.toLowerCase())) {
      // If contains key term, map appropriately
      return map[lang] || result;
    }
  }

  return result;
}

/**
 * Automatically localize a Product object
 */
export function translateProduct(product: Product, lang: LanguageCode): Product {
  if (!product || lang === 'vi') return product;

  return {
    ...product,
    name: translateDynamic(product.name, lang),
    description: translateDynamic(product.description, lang),
    category: typeof product.category === 'object' && product.category
      ? translateCategory(product.category as Category, lang)
      : product.category,
  };
}

/**
 * Automatically localize a Category object
 */
export function translateCategory(category: Category, lang: LanguageCode): Category {
  if (!category || lang === 'vi') return category;

  return {
    ...category,
    name: translateDynamic(category.name, lang),
    description: translateDynamic(category.description, lang),
    subcategories: category.subcategories?.map(sub => translateCategory(sub, lang)),
  };
}
