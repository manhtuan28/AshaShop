import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { UserRole } from '../modules/users/schemas/user.schema';
import { OrderStatus, PaymentMethod, PaymentStatus } from '../modules/orders/schemas/order.schema';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ashashop';

async function seed() {
  console.log('🔄 Đang kết nối tới MongoDB để khởi tạo TOÀN BỘ dữ liệu chuẩn (Full Data Seeder)...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Đã kết nối MongoDB thành công!');

  const db = mongoose.connection.db;

  // Xóa sạch dữ liệu cũ trong các collection
  await db.collection('users').deleteMany({});
  await db.collection('categories').deleteMany({});
  await db.collection('products').deleteMany({});
  await db.collection('carts').deleteMany({});
  await db.collection('orders').deleteMany({});
  await db.collection('settings').deleteMany({});

  console.log('🧹 Đã dọn dẹp sạch sẽ các collection cũ.');

  // =========================================================================
  // 1. TẠO TÀI KHOẢN NGƯỜI DÙNG & PHÂN QUYỀN (USERS)
  // =========================================================================
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('admin123456', salt);
  const userPassword = await bcrypt.hash('customer123456', salt);

  const usersData = [
    {
      name: 'Quản Trị Viên AshaShop',
      email: 'admin@ashashop.com',
      password: adminPassword,
      role: UserRole.ADMIN,
      phone: '0901234567',
      address: '111 Cầu Giấy, Quận Cầu Giấy, Hà Nội',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      authProvider: 'local',
      createdAt: new Date('2026-01-01T08:00:00Z'),
      updatedAt: new Date(),
    },
    {
      name: 'Bùi Mạnh Tuấn',
      email: 'customer@ashashop.com',
      password: userPassword,
      role: UserRole.CUSTOMER,
      phone: '0988776655',
      address: '123 Nguyễn Trãi, Phường Thanh Xuân Trung, Quận Thanh Xuân, Hà Nội',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      authProvider: 'local',
      createdAt: new Date('2026-01-10T09:30:00Z'),
      updatedAt: new Date(),
    },
    {
      name: 'Lê Thị Bảo Ngọc',
      email: 'lethibaongoc@gmail.com',
      password: userPassword,
      role: UserRole.CUSTOMER,
      phone: '0912345678',
      address: '45 Lê Duẩn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      authProvider: 'local',
      createdAt: new Date('2026-02-01T14:15:00Z'),
      updatedAt: new Date(),
    },
    {
      name: 'Trần Đức Anh',
      email: 'tranducanh@gmail.com',
      password: userPassword,
      role: UserRole.CUSTOMER,
      phone: '0933445566',
      address: '88 Trần Phú, Quận Hải Châu, TP. Đà Nẵng',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      authProvider: 'local',
      createdAt: new Date('2026-02-15T11:00:00Z'),
      updatedAt: new Date(),
    },
    {
      name: 'Hoàng Minh Trí',
      email: 'hoangminhtri@gmail.com',
      password: userPassword,
      role: UserRole.CUSTOMER,
      phone: '0977889900',
      address: '25 Nguyễn Huệ, TP. Huế, Thừa Thiên Huế',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      authProvider: 'local',
      createdAt: new Date('2026-03-01T16:45:00Z'),
      updatedAt: new Date(),
    },
  ];

  const insertedUsers = await db.collection('users').insertMany(usersData);
  const userIds = Object.values(insertedUsers.insertedIds);
  console.log(`👤 Đã tạo ${userIds.length} tài khoản người dùng chuẩn (1 Admin, 4 Khách hàng).`);

  // =========================================================================
  // 2. TẠO CÂY DANH MỤC THỜI TRANG PHÂN CẤP (CHA & CON)
  // =========================================================================
  const mainCategories = [
    {
      name: 'Thời Trang Nữ',
      slug: 'thoi-trang-nu',
      description: 'Váy đầm dạ hội, áo kiểu nữ, chân váy, set đồ nữ thanh lịch phong cách Paris & Seoul',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80',
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Thời Trang Nam',
      slug: 'thoi-trang-nam',
      description: 'Áo polo cao cấp, sơ mi công sở, áo thun basic, quần âu nam lịch lãm quý ông',
      image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=600&q=80',
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Áo Khoác & Blazer',
      slug: 'ao-khoac-blazer',
      description: 'Blazer may đo Hàn Quốc, măng tô dạ ấm áp, áo khoác biker da cá tính, bomber đường phố',
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80',
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Quần & Jeans Thời Trang',
      slug: 'quan-jeans',
      description: 'Quần jeans slimfit co giãn, quần tây baggy suông, quần kaki công sở đứng form',
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Túi Xách & Phụ Kiện',
      slug: 'tui-xach-phu-kien',
      description: 'Túi xách da thật cao cấp, thắt lưng da bò, kính râm chống UV và phụ kiện phối đồ',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Giày & Dép Thời Trang',
      slug: 'giay-dep-thoi-trang',
      description: 'Sneaker phong cách tối giản, boots da cổ lửng, giày cao gót tôn dáng quyến rũ',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const insertedMainCats = await db.collection('categories').insertMany(mainCategories);
  const mainCatIds = Object.values(insertedMainCats.insertedIds);

  const subCategoriesData = [
    // Subcategories cho Thời Trang Nữ (mainCatIds[0])
    {
      name: 'Váy Đầm Dạ Hội',
      slug: 'vay-dam-da-hoi',
      description: 'Váy đầm lụa satin dài, đầm xòe công chúa, đầm body dự tiệc sang trọng quyến rũ',
      image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80',
      parentId: String(mainCatIds[0]),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Áo Kiểu & Sơ Mi Nữ',
      slug: 'ao-kieu-so-mi-nu',
      description: 'Sơ mi lụa tơ tằm mềm mại, áo voan hoa nhí cổ nơ, áo kiểu công sở quý phái',
      image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=600&q=80',
      parentId: String(mainCatIds[0]),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Chân Váy Xếp Ly',
      slug: 'chan-vay-xep-ly',
      description: 'Chân váy chữ A, chân váy xếp ly dập nhiệt Hàn Quốc thanh lịch, tôn dáng dịu dàng',
      image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=600&q=80',
      parentId: String(mainCatIds[0]),
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    // Subcategories cho Thời Trang Nam (mainCatIds[1])
    {
      name: 'Áo Polo Nam Cotton',
      slug: 'ao-polo-nam',
      description: 'Áo polo cotton pique dệt tổ ong thoáng khí, cổ bẻ định hình co giãn thoải mái',
      image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=600&q=80',
      parentId: String(mainCatIds[1]),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Áo Sơ Mi Nam Công Sở',
      slug: 'ao-so-mi-nam-cong-so',
      description: 'Sơ mi oxford chống nhăn cao cấp, form slimfit lịch lãm chuẩn phong cách doanh nhân',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80',
      parentId: String(mainCatIds[1]),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Áo Hoodie & Nỉ Unisex',
      slug: 'ao-hoodie-ni-unisex',
      description: 'Áo nỉ bông 380gsm dày dặn đứng form, mũ trùm 2 lớp phong cách streetwear trẻ trung',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
      parentId: String(mainCatIds[1]),
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    // Subcategories cho Áo Khoác & Blazer (mainCatIds[2])
    {
      name: 'Blazer May Đo Hàn Quốc',
      slug: 'blazer-may-do-han-quoc',
      description: 'Blazer form rộng vai độn phong cách Seoul thanh lịch, vải tuyết mưa đứng form 4 mùa',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
      parentId: String(mainCatIds[2]),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Áo Khoác Biker Da',
      slug: 'ao-khoac-biker-da',
      description: 'Áo da moto PU vân mờ siêu mềm chống nổ da, khóa kéo kim loại mạ bạc sáng bóng',
      image: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=600&q=80',
      parentId: String(mainCatIds[2]),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Áo Măng Tô Dạ Dài',
      slug: 'ao-mang-to-da-dai',
      description: 'Măng tô dạ ép 2 mặt ấm áp, đai thắt eo sang trọng chuẩn phong cách quý cô mùa đông',
      image: 'https://images.unsplash.com/photo-1539533018447-63fcce667823?auto=format&fit=crop&w=600&q=80',
      parentId: String(mainCatIds[2]),
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    // Subcategories cho Quần & Jeans (mainCatIds[3])
    {
      name: 'Quần Jeans Slimfit',
      slug: 'quan-jeans-slimfit',
      description: 'Denim wash màu vintage cổ điển, pha spandex tạo độ co giãn thoải mái cả ngày dài',
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
      parentId: String(mainCatIds[3]),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Quần Tây Baggy Suông',
      slug: 'quan-tay-baggy-suong',
      description: 'Quần tây vải tuyết mưa đứng form che khuyết điểm chân cực tốt, cạp tăng đơ ẩn',
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80',
      parentId: String(mainCatIds[3]),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Quần Short Kaki Năng Động',
      slug: 'quan-short-kaki',
      description: 'Quần short vải kaki co giãn nhẹ, phù hợp dạo phố, đi biển và hoạt động ngoài trời',
      image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=600&q=80',
      parentId: String(mainCatIds[3]),
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    // Subcategories cho Túi Xách & Phụ Kiện (mainCatIds[4])
    {
      name: 'Túi Xách Da Thật',
      slug: 'tui-xach-da-that',
      description: 'Túi xách nữ da bò tự nhiên dập vân hạt tinh xảo, khóa mạ vàng 18K sang trọng',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
      parentId: String(mainCatIds[4]),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Kính Mắt & Phụ Kiện',
      slug: 'kinh-mat-phu-kien',
      description: 'Kính râm phân cực chống tia UV400, thắt lưng da bò nguyên tấm và phụ kiện thời thượng',
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80',
      parentId: String(mainCatIds[4]),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Ví Da Cầm Tay Mini',
      slug: 'vi-da-cam-tay',
      description: 'Ví da dáng gập nhỏ gọn nhiều ngăn để thẻ và tiền mặt, may viền thủ công tỉ mỉ',
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
      parentId: String(mainCatIds[4]),
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    // Subcategories cho Giày & Dép (mainCatIds[5])
    {
      name: 'Giày Sneaker Minimalist',
      slug: 'giay-sneaker-minimalist',
      description: 'Sneaker trắng tối giản bất hủ, đế đúc êm ái chống trượt, lót đệm êm chân Memory Foam',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
      parentId: String(mainCatIds[5]),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Giày Cao Gót Mũi Nhọn',
      slug: 'giay-cao-got-mui-nhon',
      description: 'Giày cao gót 7cm da bóng mũi nhọn thanh thoát, gót trụ vững vàng tôn vóc dáng',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80',
      parentId: String(mainCatIds[5]),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Boots Da Chelsea Cổ Lửng',
      slug: 'boots-da-chelsea',
      description: 'Chelsea boots da bò cổ chun co giãn dễ xỏ chân, đế cao su gai cá tính tôn dáng',
      image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=600&q=80',
      parentId: String(mainCatIds[5]),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const insertedSubCats = await db.collection('categories').insertMany(subCategoriesData);
  const subCatIds = Object.values(insertedSubCats.insertedIds);
  console.log(`📁 Đã tạo ${mainCatIds.length} danh mục gốc và ${subCatIds.length} danh mục con thời trang.`);

  // =========================================================================
  // 3. TẠO 24 SẢN PHẨM THỜI TRANG ĐA DẠNG & ĐẦY ĐỦ THUỘC TÍNH (PRODUCTS)
  // =========================================================================
  const productsData = [
    // 1. Váy Đầm Dạ Hội Lụa Satin
    {
      name: 'Đầm Nữ Dạ Hội Dáng Xòe Lụa Satin Sang Trọng',
      slug: 'dam-nu-da-hoi-dang-xoe-lua-satin-sang-trong',
      description: 'Chất liệu lụa Satin Ý cao cấp bóng nhẹ mềm mại, thiết kế chiết eo tôn vóc dáng quý phái, đính ngọc trai thủ công tinh xảo tại cổ áo.',
      price: 790000,
      originalPrice: 1150000,
      category: mainCatIds[0],
      images: [
        'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 45,
      rating: 4.9,
      numReviews: 135,
      isFeatured: true,
      attributes: { ChatLieu: 'Lụa Satin Ý', Size: 'S, M, L', MauSac: 'Đỏ Ruby, Đen Tuyển, Vàng Champagne' },
      createdAt: new Date('2026-08-01T08:00:00Z'),
      updatedAt: new Date(),
    },
    // 2. Blazer Nam Hàn Quốc
    {
      name: 'Áo Khoác Blazer Nam Form Rộng Phong Cách Hàn Quốc',
      slug: 'ao-khoac-blazer-nam-form-rong-phong-cach-han-quoc',
      description: 'Thiết kế dáng suông hiện đại trẻ trung, chất vải tuyết mưa đứng form không nhăn, lót lụa mềm mại thoáng khí 4 mùa.',
      price: 850000,
      originalPrice: 1200000,
      category: mainCatIds[2],
      images: [
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 30,
      rating: 4.8,
      numReviews: 92,
      isFeatured: true,
      attributes: { ChatLieu: 'Tuyết mưa cao cấp', Size: 'M, L, XL', MauSac: 'Xám Khói, Đen, Be' },
      createdAt: new Date('2026-08-02T08:00:00Z'),
      updatedAt: new Date(),
    },
    // 3. Polo Nam Cotton
    {
      name: 'Áo Polo Nam Classic Pique Cotton Co Giãn Cao Cấp',
      slug: 'ao-polo-nam-classic-pique-cotton-co-gian-cao-cap',
      description: 'Dệt từ 100% sợi cotton chải kỹ dệt mắt chim tổ ong, thấm hút mồ hôi vượt trội, cổ áo dệt bo định hình không xù lông.',
      price: 350000,
      originalPrice: 480000,
      category: mainCatIds[1],
      images: [
        'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1625910513413-562a98f121d5?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 120,
      rating: 4.9,
      numReviews: 240,
      isFeatured: true,
      attributes: { ChatLieu: 'Cotton Pique', Size: 'S, M, L, XL, XXL', MauSac: 'Trắng, Xanh Navy, Đen' },
      createdAt: new Date('2026-08-03T08:00:00Z'),
      updatedAt: new Date(),
    },
    // 4. Sơ Mi Nữ Tơ Tằm
    {
      name: 'Áo Sơ Mi Nữ Tay Phồng Cổ Nơ Tơ Tằm Xinh Xắn',
      slug: 'ao-so-mi-nu-tay-phong-co-no-to-tam-xinh-xan',
      description: 'Chất liệu vải tơ tằm dệt cao cấp, thiết kế tay phồng nhẹ nhàng nữ tính, cổ nơ thắt duyên dáng phối cùng chân váy công sở.',
      price: 390000,
      originalPrice: 520000,
      category: mainCatIds[0],
      images: [
        'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 60,
      rating: 4.7,
      numReviews: 78,
      isFeatured: false,
      attributes: { ChatLieu: 'Tơ dệt mềm', Size: 'S, M, L', MauSac: 'Trắng Kem, Hồng Pastel' },
      createdAt: new Date('2026-08-04T08:00:00Z'),
      updatedAt: new Date(),
    },
    // 5. Jeans Nam Slimfit
    {
      name: 'Quần Jeans Nam Slimfit Co Giãn Vintage Wash Blue',
      slug: 'quan-jeans-nam-slimfit-co-gian-vintage-wash-blue',
      description: 'Vải denim cotton 12.5oz wash màu vintage cổ điển, pha 2% spandex tạo độ co giãn thoải mái khi vận động cả ngày dài.',
      price: 490000,
      originalPrice: 650000,
      category: mainCatIds[3],
      images: [
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 80,
      rating: 4.8,
      numReviews: 164,
      isFeatured: true,
      attributes: { ChatLieu: 'Denim Cotton Spandex', Size: '29, 30, 31, 32, 34', MauSac: 'Xanh Vintage' },
      createdAt: new Date('2026-08-05T08:00:00Z'),
      updatedAt: new Date(),
    },
    // 6. Chân Váy Xếp Ly Dáng Dài
    {
      name: 'Chân Váy Nữ Xếp Ly Dáng Dài Tôn Dáng Thời Thượng',
      slug: 'chan-vay-nu-xep-ly-dang-dai-ton-dang-thoi-thuong',
      description: 'Xếp ly dập nhiệt công nghệ cao giữ nếp vĩnh viễn, cạp chun êm ái co giãn dễ phối cùng áo len, áo thun và áo sơ mi.',
      price: 320000,
      originalPrice: 450000,
      category: mainCatIds[0],
      images: [
        'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 70,
      rating: 4.8,
      numReviews: 95,
      isFeatured: false,
      attributes: { ChatLieu: 'Voan cát 2 lớp', Size: 'S, M, L', MauSac: 'Đen, Be Nude, Nâu Tây' },
      createdAt: new Date('2026-08-06T08:00:00Z'),
      updatedAt: new Date(),
    },
    // 7. Hoodie Nỉ Bông Unisex
    {
      name: 'Áo Hoodie Nỉ Bông Unisex Oversize In Chữ Aesthetic',
      slug: 'ao-hoodie-ni-bong-unisex-oversize-in-chu-aesthetic',
      description: 'Chất nỉ bông 380gsm dày dặn đứng form, mũ trùm 2 lớp có dây rút kim loại, hình in dập nổi sắc nét không bong tróc.',
      price: 420000,
      originalPrice: 580000,
      category: mainCatIds[1],
      images: [
        'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 90,
      rating: 4.9,
      numReviews: 210,
      isFeatured: true,
      attributes: { ChatLieu: 'Nỉ bông Cotton 380gsm', Size: 'M, L, XL', MauSac: 'Xám Melange, Đen, Xanh Rêu' },
      createdAt: new Date('2026-08-07T08:00:00Z'),
      updatedAt: new Date(),
    },
    // 8. Áo Khoác Da Biker Jacket
    {
      name: 'Áo Khoác Da Biker Jacket Unisex Cao Cấp',
      slug: 'ao-khoac-da-biker-jacket-unisex-cao-cap',
      description: 'Chất liệu da PU vân hạt mờ siêu mềm chống nổ da, khóa kéo YKK kim loại mạ bạc sáng bóng cá tính, phong cách rock chic đường phố.',
      price: 1290000,
      originalPrice: 1850000,
      category: mainCatIds[2],
      images: [
        'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 25,
      rating: 5.0,
      numReviews: 67,
      isFeatured: true,
      attributes: { ChatLieu: 'Da PU cao cấp', Size: 'M, L, XL', MauSac: 'Đen Tuyển' },
      createdAt: new Date('2026-08-08T08:00:00Z'),
      updatedAt: new Date(),
    },
    // 9. Váy Hoa Nhí Vintage
    {
      name: 'Váy Hoa Nhí Vintage Mùa Hè Cổ Vuông Duyên Dáng',
      slug: 'vay-hoa-nhi-vintage-mua-he-co-vuong-duyen-dang',
      description: 'Họa tiết hoa nhí phong cách Pháp lãng mạn, tay phồng bo chun và tùng váy xòe bồng bềnh, diện đi biển hoặc dạo phố cực xinh.',
      price: 380000,
      originalPrice: 500000,
      category: mainCatIds[0],
      images: [
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 50,
      rating: 4.8,
      numReviews: 112,
      isFeatured: true,
      attributes: { ChatLieu: 'Chiffon lót lụa', Size: 'S, M, L', MauSac: 'Hoa Vàng, Hoa Xanh' },
      createdAt: new Date('2026-08-09T08:00:00Z'),
      updatedAt: new Date(),
    },
    // 10. Quần Tây Nam Baggy Hàn Quốc
    {
      name: 'Quần Tây Nam Baggy Dáng Suông Hàn Quốc',
      slug: 'quan-tay-nam-baggy-dang-suong-han-quoc',
      description: 'Form quần suông nhẹ che khuyết điểm chân cực tốt, cạp có tăng đơ chun ẩn co giãn tiện lợi, phối đồ thanh lịch chuẩn soái ca.',
      price: 450000,
      originalPrice: 600000,
      category: mainCatIds[3],
      images: [
        'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 65,
      rating: 4.7,
      numReviews: 88,
      isFeatured: false,
      attributes: { ChatLieu: 'Vải Kaki Tuyết Hàn', Size: '28, 29, 30, 31, 32', MauSac: 'Đen, Xám Ghi, Be Sữa' },
      createdAt: new Date('2026-08-10T08:00:00Z'),
      updatedAt: new Date(),
    },
    // 11. Túi Xách Da Thật
    {
      name: 'Túi Xách Nữ Da Thật Quai Xách Sang Trọng Kèm Dây Đeo',
      slug: 'tui-xach-nu-da-that-quai-xach-sang-trong-kem-day-deo',
      description: 'Chất liệu da bò tự nhiên dập vân hạt tinh xảo, khóa mạ vàng 18K chống xước, nhiều ngăn tiện lợi chứa đồ cá nhân.',
      price: 680000,
      originalPrice: 950000,
      category: mainCatIds[4],
      images: [
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 35,
      rating: 4.9,
      numReviews: 142,
      isFeatured: true,
      attributes: { ChatLieu: 'Da bò cao cấp', KichThuoc: '22cm x 15cm x 8cm', MauSac: 'Nâu Cà Phê, Đen, Trắng' },
      createdAt: new Date('2026-08-11T08:00:00Z'),
      updatedAt: new Date(),
    },
    // 12. Giày Sneaker Minimalist
    {
      name: 'Giày Sneaker Unisex Da Trắng Minimalist Cổ Thấp',
      slug: 'giay-sneaker-unisex-da-trang-minimalist-co-thap',
      description: 'Thiết kế all-white bất hủ phối cùng mọi trang phục, đế cao su đúc nguyên khối êm ái chống trơn trượt, lót đệm Memory Foam.',
      price: 590000,
      originalPrice: 850000,
      category: mainCatIds[5],
      images: [
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 75,
      rating: 4.8,
      numReviews: 180,
      isFeatured: true,
      attributes: { ChatLieu: 'Da Microfiber & Đế cao su', Size: '36, 37, 38, 39, 40, 41, 42, 43', MauSac: 'Trắng Tinh Khôi' },
      createdAt: new Date('2026-08-12T08:00:00Z'),
      updatedAt: new Date(),
    },
    // 13. Sơ Mi Nam Oxford Trắng
    {
      name: 'Áo Sơ Mi Nam Oxford Dài Tay Chống Nhăn',
      slug: 'ao-so-mi-nam-oxford-dai-tay-chong-nhan',
      description: 'Sơ mi oxford dệt từ sợi cotton chải kỹ, công nghệ xử lý bề mặt chống nhăn cao cấp, form ôm vừa vặn tôn dáng vai.',
      price: 450000,
      originalPrice: 620000,
      category: mainCatIds[1],
      images: [
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 95,
      rating: 4.9,
      numReviews: 156,
      isFeatured: false,
      attributes: { ChatLieu: 'Cotton Oxford', Size: 'S, M, L, XL', MauSac: 'Trắng, Xanh Nhạt' },
      createdAt: new Date('2026-08-13T08:00:00Z'),
      updatedAt: new Date(),
    },
    // 14. Măng Tô Dạ Nữ Cao Cấp
    {
      name: 'Áo Măng Tô Nữ Dạ Dài Kèm Đai Thắt Eo Quý Phái',
      slug: 'ao-mang-to-nu-da-dai-kem-dai-that-eo-quy-phai',
      description: 'Chất dạ lông cừu ép 2 mặt siêu nhẹ mà giữ ấm tuyệt đối, cổ bẻ lớn phong cách trench coat cổ điển quý phái chuẩn Paris.',
      price: 1550000,
      originalPrice: 2200000,
      category: mainCatIds[2],
      images: [
        'https://images.unsplash.com/photo-1539533018447-63fcce667823?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 20,
      rating: 5.0,
      numReviews: 48,
      isFeatured: true,
      attributes: { ChatLieu: 'Dạ ép lông cừu', Size: 'S, M, L', MauSac: 'Nâu Camel, Đen, Be Sữa' },
      createdAt: new Date('2026-08-14T08:00:00Z'),
      updatedAt: new Date(),
    },
    // 15. Kính Râm Phân Cực UV400
    {
      name: 'Kính Râm Thời Trang Unisex Gọng Kim Loại Chống UV400',
      slug: 'kinh-ram-thoi-trang-unisex-gong-kim-loai-chong-uv400',
      description: 'Tròng kính Polarized phân cực loại bỏ ánh sáng chói, gọng hợp kim titan siêu nhẹ không gỉ, đệm mũi silicon êm ái.',
      price: 280000,
      originalPrice: 420000,
      category: mainCatIds[4],
      images: [
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 110,
      rating: 4.8,
      numReviews: 120,
      isFeatured: false,
      attributes: { ChatLieu: 'Hợp kim Titan & Tròng Polarized', MauSac: 'Gọng Vàng Tròng Đen, Gọng Bạc' },
      createdAt: new Date('2026-08-15T08:00:00Z'),
      updatedAt: new Date(),
    },
    // 16. Giày Cao Gót Mũi Nhọn Da Bóng
    {
      name: 'Giày Cao Gót Nữ 7cm Mũi Nhọn Da Bóng Tôn Dáng',
      slug: 'giay-cao-got-nu-7cm-mui-nhon-da-bong-ton-dang',
      description: 'Gót nhọn cao 7cm tạo độ cong gợi cảm cho đôi chân, lớp lót da cừu êm chân giảm áp lực khi di chuyển nhiều giờ liên tục.',
      price: 490000,
      originalPrice: 700000,
      category: mainCatIds[5],
      images: [
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 40,
      rating: 4.7,
      numReviews: 75,
      isFeatured: false,
      attributes: { ChatLieu: 'Da bóng & Đế chống trượt', Size: '35, 36, 37, 38, 39', MauSac: 'Đen, Đỏ Rượu, Nude' },
      createdAt: new Date('2026-08-16T08:00:00Z'),
      updatedAt: new Date(),
    },
    // 17. Chelsea Boots Da Bò
    {
      name: 'Giày Chelsea Boots Nam Nữ Da Bò Cổ Lửng Phong Cách',
      slug: 'giay-chelsea-boots-nam-nu-da-bo-co-lung-phong-cach',
      description: 'Chất da sáp bò chống nước bền bỉ, thun co giãn 2 bên sườn ôm khít cổ chân, đế cao su đúc khâu chỉ gầm chắc chắn.',
      price: 890000,
      originalPrice: 1350000,
      category: mainCatIds[5],
      images: [
        'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 35,
      rating: 4.9,
      numReviews: 89,
      isFeatured: true,
      attributes: { ChatLieu: 'Da bò thật nguyên tấm', Size: '38, 39, 40, 41, 42, 43', MauSac: 'Nâu Sáp, Đen Mờ' },
      createdAt: new Date('2026-08-17T08:00:00Z'),
      updatedAt: new Date(),
    },
    // 18. Quần Short Nam Kaki
    {
      name: 'Quần Short Nam Kaki Co Giãn Năng Động Mùa Hè',
      slug: 'quan-short-nam-kaki-co-gian-nang-dong-mua-he',
      description: 'Vải kaki cotton thoáng mát wash mềm, độ dài ngang đùi trẻ trung năng động, túi sau có khuy cài an toàn.',
      price: 250000,
      originalPrice: 380000,
      category: mainCatIds[3],
      images: [
        'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 85,
      rating: 4.6,
      numReviews: 64,
      isFeatured: false,
      attributes: { ChatLieu: 'Kaki Cotton', Size: '29, 30, 31, 32, 34', MauSac: 'Be, Xanh Rêu, Đen, Xanh Navy' },
      createdAt: new Date('2026-08-18T08:00:00Z'),
      updatedAt: new Date(),
    },
  ];

  const insertedProducts = await db.collection('products').insertMany(productsData);
  const productIds = Object.values(insertedProducts.insertedIds);
  console.log(`🎁 Đã tạo ${productIds.length} sản phẩm thời trang cao cấp với đầy đủ hình ảnh & thuộc tính.`);

  // =========================================================================
  // 4. TẠO DỮ LIỆU ĐƠN HÀNG MẪU (ORDERS VỚI CÁC TRẠNG THÁI KHÁC NHAU)
  // =========================================================================
  const ordersData = [
    // Đơn hàng 1: Hoàn thành (Delivered)
    {
      user: userIds[1], // customer@ashashop.com
      items: [
        {
          product: productIds[0],
          name: productsData[0].name,
          image: productsData[0].images[0],
          price: productsData[0].price,
          quantity: 1,
          selectedAttributes: { Size: 'M', MauSac: 'Đỏ Ruby' },
        },
        {
          product: productIds[2],
          name: productsData[2].name,
          image: productsData[2].images[0],
          price: productsData[2].price,
          quantity: 2,
          selectedAttributes: { Size: 'L', MauSac: 'Trắng' },
        },
      ],
      shippingAddress: {
        fullName: 'Bùi Mạnh Tuấn',
        phone: '0988776655',
        address: '123 Nguyễn Trãi',
        city: 'Hà Nội',
        note: 'Giao giờ hành chính, gọi trước 15 phút',
      },
      paymentMethod: PaymentMethod.COD,
      paymentStatus: PaymentStatus.PAID,
      orderStatus: OrderStatus.DELIVERED,
      shippingFee: 0,
      totalPrice: 1490000,
      createdAt: new Date('2026-08-10T10:00:00Z'),
      updatedAt: new Date('2026-08-12T15:30:00Z'),
    },
    // Đơn hàng 2: Đang giao hàng (Shipping)
    {
      user: userIds[1],
      items: [
        {
          product: productIds[1],
          name: productsData[1].name,
          image: productsData[1].images[0],
          price: productsData[1].price,
          quantity: 1,
          selectedAttributes: { Size: 'L', MauSac: 'Xám Khói' },
        },
        {
          product: productIds[10],
          name: productsData[10].name,
          image: productsData[10].images[0],
          price: productsData[10].price,
          quantity: 1,
          selectedAttributes: { MauSac: 'Nâu Cà Phê' },
        },
      ],
      shippingAddress: {
        fullName: 'Bùi Mạnh Tuấn',
        phone: '0988776655',
        address: '123 Nguyễn Trãi, Thanh Xuân',
        city: 'Hà Nội',
        note: 'Hàng dễ vỡ, vui lòng nhẹ tay',
      },
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      paymentStatus: PaymentStatus.PAID,
      orderStatus: OrderStatus.SHIPPING,
      shippingFee: 0,
      totalPrice: 1530000,
      createdAt: new Date('2026-08-18T09:00:00Z'),
      updatedAt: new Date('2026-08-19T08:00:00Z'),
    },
    // Đơn hàng 3: Đã xác nhận (Confirmed)
    {
      user: userIds[2], // lethibaongoc@gmail.com
      items: [
        {
          product: productIds[8],
          name: productsData[8].name,
          image: productsData[8].images[0],
          price: productsData[8].price,
          quantity: 1,
          selectedAttributes: { Size: 'M', MauSac: 'Hoa Vàng' },
        },
        {
          product: productIds[11],
          name: productsData[11].name,
          image: productsData[11].images[0],
          price: productsData[11].price,
          quantity: 1,
          selectedAttributes: { Size: '37' },
        },
      ],
      shippingAddress: {
        fullName: 'Lê Thị Bảo Ngọc',
        phone: '0912345678',
        address: '45 Lê Duẩn, Quận 1',
        city: 'TP. Hồ Chí Minh',
        note: 'Nhà mặt tiền dễ tìm',
      },
      paymentMethod: PaymentMethod.MOMO,
      paymentStatus: PaymentStatus.PAID,
      orderStatus: OrderStatus.CONFIRMED,
      shippingFee: 30000,
      totalPrice: 1000000,
      createdAt: new Date('2026-08-19T11:20:00Z'),
      updatedAt: new Date('2026-08-19T13:00:00Z'),
    },
    // Đơn hàng 4: Chờ xử lý (Pending)
    {
      user: userIds[3], // tranducanh@gmail.com
      items: [
        {
          product: productIds[7],
          name: productsData[7].name,
          image: productsData[7].images[0],
          price: productsData[7].price,
          quantity: 1,
          selectedAttributes: { Size: 'XL', MauSac: 'Đen Tuyển' },
        },
      ],
      shippingAddress: {
        fullName: 'Trần Đức Anh',
        phone: '0933445566',
        address: '88 Trần Phú, Hải Châu',
        city: 'Đà Nẵng',
        note: '',
      },
      paymentMethod: PaymentMethod.COD,
      paymentStatus: PaymentStatus.PENDING,
      orderStatus: OrderStatus.PENDING,
      shippingFee: 30000,
      totalPrice: 1320000,
      createdAt: new Date('2026-08-19T18:45:00Z'),
      updatedAt: new Date('2026-08-19T18:45:00Z'),
    },
    // Đơn hàng 5: Đã hủy (Cancelled)
    {
      user: userIds[4], // hoangminhtri@gmail.com
      items: [
        {
          product: productIds[4],
          name: productsData[4].name,
          image: productsData[4].images[0],
          price: productsData[4].price,
          quantity: 1,
          selectedAttributes: { Size: '32' },
        },
      ],
      shippingAddress: {
        fullName: 'Hoàng Minh Trí',
        phone: '0977889900',
        address: '25 Nguyễn Huệ',
        city: 'Huế',
        note: 'Đổi ý chọn mẫu khác',
      },
      paymentMethod: PaymentMethod.COD,
      paymentStatus: PaymentStatus.FAILED,
      orderStatus: OrderStatus.CANCELLED,
      shippingFee: 30000,
      totalPrice: 520000,
      createdAt: new Date('2026-08-15T14:00:00Z'),
      updatedAt: new Date('2026-08-15T16:00:00Z'),
    },
  ];

  await db.collection('orders').insertMany(ordersData);
  console.log(`🛍️ Đã tạo ${ordersData.length} đơn hàng mẫu đa dạng trạng thái (Delivered, Shipping, Confirmed, Pending, Cancelled).`);

  // =========================================================================
  // 5. TẠO GIỎ HÀNG SẴN CHO KHÁCH HÀNG (CARTS)
  // =========================================================================
  const cartData = {
    user: userIds[1], // customer@ashashop.com
    items: [
      {
        product: productIds[0],
        price: productsData[0].price,
        quantity: 1,
        selectedAttributes: { Size: 'M', MauSac: 'Đỏ Ruby' },
      },
      {
        product: productIds[11],
        price: productsData[11].price,
        quantity: 1,
        selectedAttributes: { Size: '41' },
      },
    ],
    totalPrice: productsData[0].price + productsData[11].price,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.collection('carts').insertOne(cartData);
  console.log('🛒 Đã tạo giỏ hàng mẫu cho tài khoản customer@ashashop.com');

  // =========================================================================
  // 6. TẠO CẤU HÌNH CMS STUDIO ĐẦY ĐỦ (SITE_CONFIG SETTINGS)
  // =========================================================================
  const siteConfigData = {
    key: 'site_config',
    data: {
      // 1. Thương hiệu & Logo
      brandName: 'Asha',
      brandHighlight: 'Shop',
      tagline: 'Thời Trang Cao Cấp Chuẩn Phong Cách Sống',
      customLogoUrl: '',
      faviconUrl: 'https://api.iconify.design/heroicons:sparkles-20-solid.svg?color=%23DB4444',

      // 2. Thanh thông báo TopBar
      showTopBar: true,
      topBarText: 'Siêu Sale Thời Trang Mùa Hè Giảm Đến 50% & Miễn Phí Vận Chuyển Toàn Quốc!',
      topBarDiscount: 50,
      topBarLink: '/shop',
      topBarButtonText: 'Khám Phá Ngay',

      // 3. Hero Banner Slider
      heroTag: 'Lookbook Mùa Hè 2026',
      heroTitle: 'Bộ Sưu Tập Thời Trang Đẳng Cấp & Thanh Lịch',
      heroSubtitle: 'Khám phá hơn 500+ mẫu thiết kế mới nhất với chất liệu lụa tơ tằm, tuyết mưa và dạ ép cao cấp.',
      heroButtonText: 'Mua Ngay',
      heroButtonLink: '/shop',
      heroImageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',

      // 4. Flash Sale Setup
      flashSaleBadge: 'Hôm Nay',
      flashSaleTitle: 'Flash Sale Thời Trang',
      flashSaleSubtitle: 'Giảm giá chớp nhoáng với số lượng giới hạn',
      flashSaleDiscount: 40,
      flashSaleHours: 24,
      flashSaleMode: 'AUTO',
      flashSaleProductIds: [String(productIds[0]), String(productIds[1]), String(productIds[2]), String(productIds[4])],

      // 4.1 Best Sellers
      bestSellingBadge: 'Tháng Này',
      bestSellingTitle: 'Mẫu Bán Chạy Nhất',
      bestSellingSubtitle: 'Những thiết kế được yêu thích nhất mùa thời trang',
      bestSellingMode: 'AUTO',
      bestSellingProductIds: [String(productIds[0]), String(productIds[2]), String(productIds[7]), String(productIds[11])],

      // 4.2 Explore Products
      exploreBadge: 'Sản Phẩm',
      exploreTitle: 'Khám Phá Bộ Sưu Tập',
      exploreSubtitle: 'Thời trang nam nữ đa dạng phong cách từ tối giản đến sang trọng',
      exploreMode: 'AUTO',
      exploreProductIds: [],

      // 5. Promo Banner Lookbook
      promoBadge: 'Thời Thượng',
      promoTitle: 'Nâng Tầm Phong Cách Với Trang Phục Thời Thượng',
      promoButtonText: 'Xem BST Mới',
      promoButtonLink: '/shop',
      promoImageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',

      // 6. Bento Grid (4 ô Lookbook)
      bento1: {
        title: 'Vest & Blazer May Đo',
        desc: 'Đường may tỉ mỉ, form dáng quý ông và quý cô thanh lịch',
        link: '/shop',
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      },
      bento2: {
        title: 'Váy Đầm Nữ Dạ Hội',
        desc: 'Quyến rũ, tôn dáng trong mọi bữa tiệc',
        link: '/shop',
        imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80',
      },
      bento3: {
        title: 'Biker & Bomber Jacket',
        desc: 'Cá tính mạnh mẽ phong cách đường phố',
        link: '/shop',
        imageUrl: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=600&q=80',
      },
      bento4: {
        title: 'Túi Xách & Phụ Kiện',
        desc: 'Điểm nhấn hoàn hảo cho bộ trang phục',
        link: '/shop',
        imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
      },

      // 7. 3 Cam kết dịch vụ
      badgeDeliveryTitle: 'GIAO HÀNG SIÊU TỐC',
      badgeDeliveryDesc: 'Miễn phí vận chuyển cho mọi đơn hàng từ 500k',
      badgeServiceTitle: 'HỖ TRỢ 24/7',
      badgeServiceDesc: 'Đội ngũ tư vấn size và đổi trả tận tâm',
      badgeReturnTitle: 'ĐỔI TRẢ TRONG 30 NGÀY',
      badgeReturnDesc: 'Cam kết đổi trả miễn phí nếu không vừa vặn',

      // 8. Giới thiệu About Us
      aboutTitle: 'Câu Chuyện AshaShop Fashion',
      aboutStory1: 'Được thành lập vào năm 2026, AshaShop là thương hiệu thời trang cao cấp mang phong cách hiện đại, thanh lịch và tối giản đến cho mọi khách hàng Việt Nam và quốc tế.',
      aboutStory2: 'Chúng tôi cam kết từng sản phẩm đều được may từ chất liệu cao cấp, đường may tỉ mỉ và chuẩn form dáng giúp bạn tự tin tỏa sáng.',
      aboutImageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',

      // 9. Liên hệ & Hỗ trợ
      hotline: '0901 234 567',
      supportEmail: 'support@ashashop.com',
      address: '123 Nguyễn Trãi, Thanh Xuân, Hà Nội',
      workingHours: '8:00 - 22:00 (Thứ 2 - Chủ Nhật)',

      // 10. Chân trang Footer
      footerDescription: 'AshaShop - Thương hiệu thời trang cao cấp mang phong cách hiện đại, thanh lịch và tối giản đến với bạn.',
      footerAppDiscount: 'Tiết kiệm 10% cho đơn hàng đầu tiên qua app',
      copyrightText: '© Copyright AshaShop 2026. All rights reserved.',
      facebookUrl: 'https://facebook.com',
      instagramUrl: 'https://instagram.com',
      twitterUrl: 'https://twitter.com',
      linkedinUrl: 'https://linkedin.com',

      // 11. Tài khoản ngân hàng thanh toán QR
      bankName: 'MB BANK (Ngân hàng Quân Đội)',
      bankAccountNumber: '0988776655',
      bankAccountName: 'BUI MANH TUAN',
      bankQrTemplate: 'compact',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.collection('settings').insertOne(siteConfigData);
  console.log('⚙️ Đã tạo cấu hình hệ thống CMS Studio (site_config) hoàn chỉnh.');

  console.log('================================================================');
  console.log('🎉 TOÀN BỘ DỮ LIỆU ĐÃ ĐƯỢC NẠP THÀNH CÔNG VÀO DATABASE ASHA SHOP!');
  console.log('================================================================');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Lỗi Seeder:', err);
  process.exit(1);
});
