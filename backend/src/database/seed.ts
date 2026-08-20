import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { UserRole } from '../modules/users/schemas/user.schema';
import { OrderStatus, PaymentMethod, PaymentStatus } from '../modules/orders/schemas/order.schema';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ashashop';

async function seed() {
  console.log('🔄 Đang kết nối tới MongoDB để nạp ĐẦY ĐỦ sản phẩm cho TẤT CẢ các danh mục cha & con...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Đã kết nối MongoDB thành công!');

  const db = mongoose.connection.db;

  // Xóa sạch dữ liệu cũ
  await db.collection('users').deleteMany({});
  await db.collection('categories').deleteMany({});
  await db.collection('products').deleteMany({});
  await db.collection('carts').deleteMany({});
  await db.collection('orders').deleteMany({});
  await db.collection('reviews').deleteMany({});
  await db.collection('settings').deleteMany({});

  console.log('🧹 Đã dọn dẹp các collection cũ.');

  // =========================================================================
  // 1. TẠO TÀI KHOẢN NGƯỜI DÙNG
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
  console.log(`👤 Đã tạo ${userIds.length} tài khoản người dùng.`);

  // =========================================================================
  // 2. TẠO DANH MỤC GỐC (6 PARENT CATEGORIES)
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

  // =========================================================================
  // 3. TẠO 18 DANH MỤC CON (SUBCATEGORIES)
  // =========================================================================
  const subCategoriesData = [
    // 1. Nữ (mainCatIds[0])
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

    // 2. Nam (mainCatIds[1])
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

    // 3. Áo Khoác & Blazer (mainCatIds[2])
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

    // 4. Quần & Jeans (mainCatIds[3])
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

    // 5. Túi Xách & Phụ Kiện (mainCatIds[4])
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

    // 6. Giày & Dép (mainCatIds[5])
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
  console.log(`📁 Đã tạo ${mainCatIds.length} danh mục gốc và ${subCatIds.length} danh mục con.`);

  // =========================================================================
  // 4. TẠO 54 SẢN PHẨM PHỦ ĐỀU TOÀN BỘ 18 DANH MỤC CON (3 SẢN PHẨM / DANH MỤC CON)
  // =========================================================================
  const productsData = [
    // --- 1. Váy Đầm Dạ Hội (subCatIds[0]) ---
    {
      name: 'Đầm Nữ Dạ Hội Dáng Xòe Lụa Satin Sang Trọng',
      slug: 'dam-nu-da-hoi-dang-xoe-lua-satin-sang-trong',
      description: 'Chất liệu lụa Satin Ý cao cấp bóng nhẹ mềm mại, thiết kế chiết eo tôn vóc dáng quý phái, đính ngọc trai thủ công tinh xảo tại cổ áo.',
      price: 790000,
      originalPrice: 1150000,
      category: subCatIds[0],
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
    {
      name: 'Đầm Dạ Hội Cúp Ngực Xẻ Tà Quyến Rũ Ánh Kim',
      slug: 'dam-da-hoi-cup-nguc-xe-ta-quyen-ru-anh-kim',
      description: 'Vải kim tuyến ánh sao bắt sáng tuyệt đẹp, đường xẻ tà cao khoe trọn đôi chân thon thả, có mút ngực định hình cao cấp.',
      price: 950000,
      originalPrice: 1390000,
      category: subCatIds[0],
      images: [
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 25,
      rating: 5.0,
      numReviews: 88,
      isFeatured: true,
      attributes: { ChatLieu: 'Kim tuyến ánh sao & Lụa', Size: 'S, M', MauSac: 'Bạc Ánh Kim, Vàng Gold' },
      createdAt: new Date('2026-08-02T08:00:00Z'),
      updatedAt: new Date(),
    },
    {
      name: 'Đầm Ren Dạ Hội Dáng Dài Đuôi Cá Quý Tộc',
      slug: 'dam-ren-da-hoi-dang-dai-duoi-ca-quy-toc',
      description: 'Ren thêu nổi hoa văn hoàng gia Pháp 3 lớp, dáng đuôi cá ôm trọn 3 vòng chuẩn form thảm đỏ sự kiện.',
      price: 1250000,
      originalPrice: 1800000,
      category: subCatIds[0],
      images: [
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 20,
      rating: 4.8,
      numReviews: 54,
      isFeatured: false,
      attributes: { ChatLieu: 'Ren chỉ Pháp cao cấp', Size: 'S, M, L', MauSac: 'Trắng Ngà, Đen Dạ Yến' },
      createdAt: new Date('2026-08-03T08:00:00Z'),
      updatedAt: new Date(),
    },

    // --- 2. Áo Kiểu & Sơ Mi Nữ (subCatIds[1]) ---
    {
      name: 'Áo Sơ Mi Nữ Tay Phồng Cổ Nơ Tơ Tằm Xinh Xắn',
      slug: 'ao-so-mi-nu-tay-phong-co-no-to-tam-xinh-xan',
      description: 'Chất liệu vải tơ tằm dệt cao cấp, thiết kế tay phồng nhẹ nhàng nữ tính, cổ nơ thắt duyên dáng phối cùng chân váy công sở.',
      price: 390000,
      originalPrice: 520000,
      category: subCatIds[1],
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
    {
      name: 'Áo Kiểu Voan Hoa Nhí Cổ V Xếp Ly Phong Cách Pháp',
      slug: 'ao-kieu-voan-hoa-nhi-co-v-xep-ly-phong-cach-phap',
      description: 'Họa tiết hoa nhí vintage dịu dàng, cổ tim thanh thoát tôn xương quai xanh quyến rũ, chất voan tơ 2 lớp không sợ lộ.',
      price: 340000,
      originalPrice: 460000,
      category: subCatIds[1],
      images: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 75,
      rating: 4.8,
      numReviews: 92,
      isFeatured: true,
      attributes: { ChatLieu: 'Voan tơ lụa', Size: 'FreeSize, M, L', MauSac: 'Hoa Xanh Pastel, Hoa Vàng Kem' },
      createdAt: new Date('2026-08-05T08:00:00Z'),
      updatedAt: new Date(),
    },
    {
      name: 'Áo Sơ Mi Lụa Cổ Đức Thêu Họa Tiết Monogram',
      slug: 'ao-so-mi-lua-co-duc-theu-hoa-tiet-monogram',
      description: 'Lụa satin mượt mà mát lạnh, cổ đức truyền thống lịch lãm thêu họa tiết monogram sang trọng ở vạt áo.',
      price: 420000,
      originalPrice: 580000,
      category: subCatIds[1],
      images: [
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 50,
      rating: 4.9,
      numReviews: 110,
      isFeatured: false,
      attributes: { ChatLieu: 'Lụa Mulberry', Size: 'S, M, L, XL', MauSac: 'Trắng Tinh Khôi, Xanh Navy' },
      createdAt: new Date('2026-08-06T08:00:00Z'),
      updatedAt: new Date(),
    },

    // --- 3. Chân Váy Xếp Ly (subCatIds[2]) ---
    {
      name: 'Chân Váy Nữ Xếp Ly Dáng Dài Tôn Dáng Thời Thượng',
      slug: 'chan-vay-nu-xep-ly-dang-dai-ton-dang-thoi-thuong',
      description: 'Xếp ly dập nhiệt công nghệ cao giữ nếp vĩnh viễn, cạp chun êm ái co giãn dễ phối cùng áo len, áo thun và áo sơ mi.',
      price: 320000,
      originalPrice: 450000,
      category: subCatIds[2],
      images: [
        'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 70,
      rating: 4.8,
      numReviews: 95,
      isFeatured: false,
      attributes: { ChatLieu: 'Voan cát 2 lớp', Size: 'S, M, L', MauSac: 'Đen, Be Nude, Nâu Tây' },
      createdAt: new Date('2026-08-07T08:00:00Z'),
      updatedAt: new Date(),
    },
    {
      name: 'Chân Váy Chữ A Xếp Ly Ngắn Học Đường Tennis Skirt',
      slug: 'chan-vay-chu-a-xep-ly-ngan-hoc-duong-tennis-skirt',
      description: 'Chân váy xếp ly ngắn dáng xòe trẻ trung năng động có quần bảo hộ bên trong, chất vải tuyết mưa đứng nếp.',
      price: 260000,
      originalPrice: 350000,
      category: subCatIds[2],
      images: [
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 90,
      rating: 4.9,
      numReviews: 180,
      isFeatured: true,
      attributes: { ChatLieu: 'Tuyết mưa dày dặn', Size: 'XS, S, M, L', MauSac: 'Trắng, Đen, Xám Ghi' },
      createdAt: new Date('2026-08-08T08:00:00Z'),
      updatedAt: new Date(),
    },
    {
      name: 'Chân Váy Dạ Tweed Xếp Ly Xòe Cúc Mạ Vàng',
      slug: 'chan-vay-da-tweed-xep-ly-xoe-cuc-ma-vang',
      description: 'Dạ tweed dệt ánh kim sang chảnh tiểu thư, đính hàng cúc kim loại mạ vàng sang trọng, phối cùng blazer cực đỉnh.',
      price: 450000,
      originalPrice: 620000,
      category: subCatIds[2],
      images: [
        'https://images.unsplash.com/photo-1539533018447-63fcce667823?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 40,
      rating: 4.9,
      numReviews: 64,
      isFeatured: false,
      attributes: { ChatLieu: 'Dạ Tweed cao cấp', Size: 'S, M, L', MauSac: 'Hồng Pastel, Đen Kim Tuyến' },
      createdAt: new Date('2026-08-09T08:00:00Z'),
      updatedAt: new Date(),
    },

    // --- 4. Áo Polo Nam Cotton (subCatIds[3]) ---
    {
      name: 'Áo Polo Nam Classic Pique Cotton Co Giãn Cao Cấp',
      slug: 'ao-polo-nam-classic-pique-cotton-co-gian-cao-cap',
      description: 'Dệt từ 100% sợi cotton chải kỹ dệt mắt chim tổ ong, thấm hút mồ hôi vượt trội, cổ áo dệt bo định hình không xù lông.',
      price: 350000,
      originalPrice: 480000,
      category: subCatIds[3],
      images: [
        'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1625910513413-562a98f121d5?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 120,
      rating: 4.9,
      numReviews: 240,
      isFeatured: true,
      attributes: { ChatLieu: 'Cotton Pique', Size: 'S, M, L, XL, XXL', MauSac: 'Trắng, Xanh Navy, Đen' },
      createdAt: new Date('2026-08-10T08:00:00Z'),
      updatedAt: new Date(),
    },
    {
      name: 'Áo Polo Nam Bo Cổ Dệt Họa Tiết Kẻ Viền Thể Thao',
      slug: 'ao-polo-nam-bo-co-det-hoa-tiet-ke-vien-the-thao',
      description: 'Vải cotton lạnh co giãn 4 chiều mềm mịn mát mẻ, cổ dệt viền sọc thể thao nam tính phong độ.',
      price: 380000,
      originalPrice: 500000,
      category: subCatIds[3],
      images: [
        'https://images.unsplash.com/photo-1625910513413-562a98f121d5?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 85,
      rating: 4.8,
      numReviews: 130,
      isFeatured: false,
      attributes: { ChatLieu: 'Cotton Lạnh 4 Chiều', Size: 'M, L, XL, XXL', MauSac: 'Xám Xi Măng, Xanh Đen' },
      createdAt: new Date('2026-08-11T08:00:00Z'),
      updatedAt: new Date(),
    },
    {
      name: 'Áo Polo Nam Cổ Khóa Zip Kim Loại Hiện Đại',
      slug: 'ao-polo-nam-co-khoa-zip-kim-loai-hien-dai',
      description: 'Thiết kế khóa kéo zipper mạ bạc thay thế cúc bấm cổ điển, form ôm vai ngực tôn dáng gymer mạnh mẽ.',
      price: 390000,
      originalPrice: 520000,
      category: subCatIds[3],
      images: [
        'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 65,
      rating: 4.7,
      numReviews: 86,
      isFeatured: true,
      attributes: { ChatLieu: 'Thun cá sấu Spandex', Size: 'S, M, L, XL', MauSac: 'Đen Huyền Bí, Be Nâu' },
      createdAt: new Date('2026-08-12T08:00:00Z'),
      updatedAt: new Date(),
    },

    // --- 5. Áo Sơ Mi Nam Công Sở (subCatIds[4]) ---
    {
      name: 'Áo Sơ Mi Nam Oxford Dài Tay Chống Nhăn',
      slug: 'ao-so-mi-nam-oxford-dai-tay-chong-nhan',
      description: 'Sơ mi oxford dệt từ sợi cotton chải kỹ, công nghệ xử lý bề mặt chống nhăn cao cấp, form ôm vừa vặn tôn dáng vai.',
      price: 450000,
      originalPrice: 620000,
      category: subCatIds[4],
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
    {
      name: 'Áo Sơ Mi Nam Vải Sợi Tre Bamboo Kháng Khuẩn Thoáng Khí',
      slug: 'ao-so-mi-nam-vai-soi-tre-bamboo-khang-khuan-thoang-khi',
      description: 'Chất liệu sợi tre Bamboo tự nhiên khử mùi kháng khuẩn 99%, bề mặt bóng mịn tự nhiên tạo cảm giác mát lạnh.',
      price: 520000,
      originalPrice: 750000,
      category: subCatIds[4],
      images: [
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 60,
      rating: 5.0,
      numReviews: 140,
      isFeatured: true,
      attributes: { ChatLieu: 'Sợi tre Bamboo 100%', Size: 'M, L, XL, XXL', MauSac: 'Trắng Sữa, Xanh Pastel' },
      createdAt: new Date('2026-08-14T08:00:00Z'),
      updatedAt: new Date(),
    },
    {
      name: 'Áo Sơ Mi Nam Kẻ Sọc Nhỏ Slimfit Doanh Nhân',
      slug: 'ao-so-mi-nam-ke-soc-nho-slimfit-doanh-nhan',
      description: 'Họa tiết sọc nhỏ kẻ thanh lịch, dáng slimfit chiết eo nhẹ tôn hình thể cân đối của phái mạnh.',
      price: 480000,
      originalPrice: 650000,
      category: subCatIds[4],
      images: [
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 55,
      rating: 4.8,
      numReviews: 98,
      isFeatured: false,
      attributes: { ChatLieu: 'Cotton Silk chống nhăn', Size: 'S, M, L, XL', MauSac: 'Kẻ Sọc Xanh, Kẻ Sọc Xám' },
      createdAt: new Date('2026-08-15T08:00:00Z'),
      updatedAt: new Date(),
    },

    // --- 6. Áo Hoodie & Nỉ Unisex (subCatIds[5]) ---
    {
      name: 'Áo Hoodie Nỉ Bông Unisex Oversize In Chữ Aesthetic',
      slug: 'ao-hoodie-ni-bong-unisex-oversize-in-chu-aesthetic',
      description: 'Chất nỉ bông 380gsm dày dặn đứng form, mũ trùm 2 lớp có dây rút kim loại, hình in dập nổi sắc nét không bong tróc.',
      price: 420000,
      originalPrice: 580000,
      category: subCatIds[5],
      images: [
        'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 90,
      rating: 4.9,
      numReviews: 210,
      isFeatured: true,
      attributes: { ChatLieu: 'Nỉ bông Cotton 380gsm', Size: 'M, L, XL', MauSac: 'Xám Melange, Đen, Xanh Rêu' },
      createdAt: new Date('2026-08-16T08:00:00Z'),
      updatedAt: new Date(),
    },
    {
      name: 'Áo Sweatshirt Nỉ Chân Cua Cổ Tròn Minimalist',
      slug: 'ao-sweatshirt-ni-chan-cua-co-tron-minimalist',
      description: 'Vải nỉ chân cua thoáng khí dệt dày 320gsm, bo gấu và cổ tay thun co giãn không xơ dão.',
      price: 360000,
      originalPrice: 480000,
      category: subCatIds[5],
      images: [
        'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 110,
      rating: 4.8,
      numReviews: 125,
      isFeatured: false,
      attributes: { ChatLieu: 'Nỉ chân cua Cotton', Size: 'S, M, L, XL', MauSac: 'Kem Nude, Đen, Nâu Mocha' },
      createdAt: new Date('2026-08-17T08:00:00Z'),
      updatedAt: new Date(),
    },
    {
      name: 'Áo Hoodie Zip Khóa Kéo Hai Chiều Form Rộng Streetwear',
      slug: 'ao-hoodie-zip-khoa-keo-hai-chieu-form-rong-streetwear',
      description: 'Khóa kéo kim loại hai chiều cao cấp tạo nhiều kiểu mặc biến tấu, túi kangaroo rộng rãi giữ ấm đôi tay.',
      price: 460000,
      originalPrice: 620000,
      category: subCatIds[5],
      images: [
        'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 70,
      rating: 4.9,
      numReviews: 160,
      isFeatured: true,
      attributes: { ChatLieu: 'Nỉ nỉ dệt kim', Size: 'M, L, XL, XXL', MauSac: 'Xám Tiêu, Đen Nhám' },
      createdAt: new Date('2026-08-18T08:00:00Z'),
      updatedAt: new Date(),
    },

    // --- 7. Blazer May Đo Hàn Quốc (subCatIds[6]) ---
    {
      name: 'Áo Khoác Blazer Nam Form Rộng Phong Cách Hàn Quốc',
      slug: 'ao-khoac-blazer-nam-form-rong-phong-cach-han-quoc',
      description: 'Thiết kế dáng suông hiện đại trẻ trung, chất vải tuyết mưa đứng form không nhăn, lót lụa mềm mại thoáng khí 4 mùa.',
      price: 850000,
      originalPrice: 1200000,
      category: subCatIds[6],
      images: [
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 30,
      rating: 4.8,
      numReviews: 92,
      isFeatured: true,
      attributes: { ChatLieu: 'Tuyết mưa cao cấp', Size: 'M, L, XL', MauSac: 'Xám Khói, Đen, Be' },
      createdAt: new Date('2026-08-01T08:00:00Z'),
      updatedAt: new Date(),
    },
    {
      name: 'Áo Blazer Nữ Chiết Eo Cúc Kim Loại Tiểu Thư',
      slug: 'ao-blazer-nu-chiet-eo-cuc-kim-loai-tieu-thu',
      description: 'Đường chiết eo tạo thắt đáy lưng ong thanh tú, cổ vest vuông cách tân kiêu kỳ cùng cúc vàng sang trọng.',
      price: 780000,
      originalPrice: 1100000,
      category: subCatIds[6],
      images: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 45,
      rating: 4.9,
      numReviews: 115,
      isFeatured: true,
      attributes: { ChatLieu: 'Vải Kaki Hàn lót lụa', Size: 'S, M, L', MauSac: 'Trắng Sữa, Đen, Hồng Đất' },
      createdAt: new Date('2026-08-02T08:00:00Z'),
      updatedAt: new Date(),
    },
    {
      name: 'Set Blazer Kẻ Caro Nam Nữ Unisex Vintage Classic',
      slug: 'set-blazer-ke-caro-nam-nu-unisex-vintage-classic',
      description: 'Họa tiết Houndstooth kẻ nanh sói quý tộc Anh Quốc, vai có đệm mỏng đứng dáng khi chụp lookbook.',
      price: 890000,
      originalPrice: 1250000,
      category: subCatIds[6],
      images: [
        'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 35,
      rating: 4.8,
      numReviews: 76,
      isFeatured: false,
      attributes: { ChatLieu: 'Dạ dệt kẻ Houndstooth', Size: 'M, L, XL', MauSac: 'Nâu Kẻ, Xám Kẻ' },
      createdAt: new Date('2026-08-03T08:00:00Z'),
      updatedAt: new Date(),
    },

    // --- 8. Áo Khoác Biker Da (subCatIds[7]) ---
    {
      name: 'Áo Khoác Da Biker Jacket Unisex Cao Cấp',
      slug: 'ao-khoac-da-biker-jacket-unisex-cao-cap',
      description: 'Chất liệu da PU vân hạt mờ siêu mềm chống nổ da, khóa kéo YKK kim loại mạ bạc sáng bóng cá tính, phong cách rock chic đường phố.',
      price: 1290000,
      originalPrice: 1850000,
      category: subCatIds[7],
      images: [
        'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 25,
      rating: 5.0,
      numReviews: 67,
      isFeatured: true,
      attributes: { ChatLieu: 'Da PU cao cấp', Size: 'M, L, XL', MauSac: 'Đen Tuyển' },
      createdAt: new Date('2026-08-04T08:00:00Z'),
      updatedAt: new Date(),
    },
    {
      name: 'Áo Khoác Da Bomber Cổ Bo Thun Thể Thao Nam',
      slug: 'ao-khoac-da-bomber-co-bo-thun-the-thao-nam',
      description: 'Dáng bomber thể thao năng động, chất da bò dập mềm không cứng ngắc, lót dù trần bông siêu nhẹ giữ ấm tốt.',
      price: 1190000,
      originalPrice: 1650000,
      category: subCatIds[7],
      images: [
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 30,
      rating: 4.8,
      numReviews: 52,
      isFeatured: false,
      attributes: { ChatLieu: 'Da cừu nhân tạo siêu êm', Size: 'M, L, XL, XXL', MauSac: 'Nâu Cà Phê, Đen Nhám' },
      createdAt: new Date('2026-08-05T08:00:00Z'),
      updatedAt: new Date(),
    },
    {
      name: 'Áo Khoác Da Lộn Nữ Lót Lông Cừu Mùa Đông',
      slug: 'ao-khoac-da-lon-nu-lot-long-cuu-mua-dong',
      description: 'Da lộn da bò mềm mại phối lót lông cừu trắng ấm áp, cổ bẻ lớn lót lông dày chống gió lạnh vùng cao.',
      price: 1350000,
      originalPrice: 1950000,
      category: subCatIds[7],
      images: [
        'https://images.unsplash.com/photo-1539533018447-63fcce667823?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 20,
      rating: 4.9,
      numReviews: 44,
      isFeatured: true,
      attributes: { ChatLieu: 'Da lộn & Lông cừu', Size: 'S, M, L', MauSac: 'Nâu Da Bò, Đen Khói' },
      createdAt: new Date('2026-08-06T08:00:00Z'),
      updatedAt: new Date(),
    },

    // --- 9. Áo Măng Tô Dạ Dài (subCatIds[8]) ---
    {
      name: 'Áo Măng Tô Nữ Dạ Dài Kèm Đai Thắt Eo Quý Phái',
      slug: 'ao-mang-to-nu-da-dai-kem-dai-that-eo-quy-phai',
      description: 'Chất dạ lông cừu ép 2 mặt siêu nhẹ mà giữ ấm tuyệt đối, cổ bẻ lớn phong cách trench coat cổ điển quý phái chuẩn Paris.',
      price: 1550000,
      originalPrice: 2200000,
      category: subCatIds[8],
      images: [
        'https://images.unsplash.com/photo-1539533018447-63fcce667823?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 20,
      rating: 5.0,
      numReviews: 48,
      isFeatured: true,
      attributes: { ChatLieu: 'Dạ ép lông cừu', Size: 'S, M, L', MauSac: 'Nâu Camel, Đen, Be Sữa' },
      createdAt: new Date('2026-08-07T08:00:00Z'),
      updatedAt: new Date(),
    },
    {
      name: 'Áo Măng Tô Nam Dáng Dài Khuy Kép Doanh Nhân',
      slug: 'ao-mang-to-nam-dang-dai-khuy-kep-doanh-nhan',
      description: 'Độ dài qua gối lịch lãm chuẩn tài tử điện ảnh, chất dạ cashmere dày dặn không bai dão.',
      price: 1750000,
      originalPrice: 2500000,
      category: subCatIds[8],
      images: [
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 18,
      rating: 4.9,
      numReviews: 39,
      isFeatured: false,
      attributes: { ChatLieu: 'Dạ Cashmere cao cấp', Size: 'M, L, XL, XXL', MauSac: 'Đen Tuyển, Xám Than' },
      createdAt: new Date('2026-08-08T08:00:00Z'),
      updatedAt: new Date(),
    },
    {
      name: 'Áo Trench Coat Chống Thấm Nước Cổ Điển Khóa Belt',
      slug: 'ao-trench-coat-chong-tham-nuoc-co-dien-khoa-belt',
      description: 'Vải cotton gabardine chống thấm nước nhẹ và cản gió tuyệt hảo, thiết kế iconic bất hủ trường tồn theo thời gian.',
      price: 1450000,
      originalPrice: 2100000,
      category: subCatIds[8],
      images: [
        'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 25,
      rating: 4.8,
      numReviews: 60,
      isFeatured: true,
      attributes: { ChatLieu: 'Cotton Gabardine chống thấm', Size: 'S, M, L', MauSac: 'Vàng Khaki, Be Sáng' },
      createdAt: new Date('2026-08-09T08:00:00Z'),
      updatedAt: new Date(),
    },

    // --- 10. Quần Jeans Slimfit (subCatIds[9]) ---
    {
      name: 'Quần Jeans Nam Slimfit Co Giãn Vintage Wash Blue',
      slug: 'quan-jeans-nam-slimfit-co-gian-vintage-wash-blue',
      description: 'Vải denim cotton 12.5oz wash màu vintage cổ điển, pha 2% spandex tạo độ co giãn thoải mái khi vận động cả ngày dài.',
      price: 490000,
      originalPrice: 650000,
      category: subCatIds[9],
      images: [
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 80,
      rating: 4.8,
      numReviews: 164,
      isFeatured: true,
      attributes: { ChatLieu: 'Denim Cotton Spandex', Size: '29, 30, 31, 32, 34', MauSac: 'Xanh Vintage' },
      createdAt: new Date('2026-08-10T08:00:00Z'),
      updatedAt: new Date(),
    },
    {
      name: 'Quần Jeans Nữ Ống Loe Cạp Cao Hack Dáng',
      slug: 'quan-jeans-nu-ong-loe-cap-cao-hack-dang',
      description: 'Thiết kế cạp cao ôm sát hông đùi và xòe nhẹ phần bắp chân giúp kéo dài đôi chân cực kỳ hiệu quả.',
      price: 460000,
      originalPrice: 620000,
      category: subCatIds[9],
      images: [
        'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 70,
      rating: 4.9,
      numReviews: 195,
      isFeatured: true,
      attributes: { ChatLieu: 'Denim co giãn tốt', Size: '26, 27, 28, 29, 30', MauSac: 'Xanh Đậm, Đen Khói' },
      createdAt: new Date('2026-08-11T08:00:00Z'),
      updatedAt: new Date(),
    },
    {
      name: 'Quần Jeans Nam Rách Gối Cá Tính Streetwear',
      slug: 'quan-jeans-nam-rach-goi-ca-tinh-streetwear',
      description: 'Vết rách cào xước thủ công tỉ mỉ, wash xám tro bụi bặm phong trần đậm chất hiphop đường phố.',
      price: 520000,
      originalPrice: 700000,
      category: subCatIds[9],
      images: [
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 55,
      rating: 4.7,
      numReviews: 88,
      isFeatured: false,
      attributes: { ChatLieu: 'Denim dày dặn', Size: '29, 30, 31, 32, 33', MauSac: 'Xám Tro, Xanh Nhạt' },
      createdAt: new Date('2026-08-12T08:00:00Z'),
      updatedAt: new Date(),
    },

    // --- 11. Quần Tây Baggy Suông (subCatIds[10]) ---
    {
      name: 'Quần Tây Nam Baggy Dáng Suông Hàn Quốc',
      slug: 'quan-tay-nam-baggy-dang-suong-han-quoc',
      description: 'Form quần suông nhẹ che khuyết điểm chân cực tốt, cạp có tăng đơ chun ẩn co giãn tiện lợi, phối đồ thanh lịch chuẩn soái ca.',
      price: 450000,
      originalPrice: 600000,
      category: subCatIds[10],
      images: [
        'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 65,
      rating: 4.7,
      numReviews: 88,
      isFeatured: false,
      attributes: { ChatLieu: 'Vải Kaki Tuyết Hàn', Size: '28, 29, 30, 31, 32', MauSac: 'Đen, Xám Ghi, Be Sữa' },
      createdAt: new Date('2026-08-13T08:00:00Z'),
      updatedAt: new Date(),
    },
    {
      name: 'Quần Tây Nữ Ống Rộng Cạp Cao Xếp Ly Công Sở',
      slug: 'quan-tay-nu-ong-rong-cap-cao-xep-ly-cong-so',
      description: 'Ống suông rộng bay bổng bước đi uyển chuyển, vải tuyết mưa mềm mượt không bám lông không nhăn.',
      price: 390000,
      originalPrice: 550000,
      category: subCatIds[10],
      images: [
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 80,
      rating: 4.9,
      numReviews: 145,
      isFeatured: true,
      attributes: { ChatLieu: 'Tuyết mưa lụa loại 1', Size: 'S, M, L, XL', MauSac: 'Đen, Nâu Tây, Be Kem' },
      createdAt: new Date('2026-08-14T08:00:00Z'),
      updatedAt: new Date(),
    },
    {
      name: 'Quần Kaki Chino Nam Dáng Slim Tối Giản',
      slug: 'quan-kaki-chino-nam-dang-slim-toi-gian',
      description: 'Chất vải chino dệt chéo 100% cotton chải kỹ, đường may giấu chỉ tinh tế phù hợp cả đi làm và đi chơi.',
      price: 420000,
      originalPrice: 580000,
      category: subCatIds[10],
      images: [
        'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 75,
      rating: 4.8,
      numReviews: 99,
      isFeatured: false,
      attributes: { ChatLieu: 'Cotton Chino', Size: '29, 30, 31, 32, 34', MauSac: 'Xanh Navy, Nâu Bò, Xanh Rêu' },
      createdAt: new Date('2026-08-15T08:00:00Z'),
      updatedAt: new Date(),
    },

    // --- 12. Quần Short Kaki Năng Động (subCatIds[11]) ---
    {
      name: 'Quần Short Nam Kaki Co Giãn Năng Động Mùa Hè',
      slug: 'quan-short-nam-kaki-co-gian-nang-dong-mua-he',
      description: 'Vải kaki cotton thoáng mát wash mềm, độ dài ngang đùi trẻ trung năng động, túi sau có khuy cài an toàn.',
      price: 250000,
      originalPrice: 380000,
      category: subCatIds[11],
      images: [
        'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 85,
      rating: 4.6,
      numReviews: 64,
      isFeatured: false,
      attributes: { ChatLieu: 'Kaki Cotton', Size: '29, 30, 31, 32, 34', MauSac: 'Be, Xanh Rêu, Đen, Xanh Navy' },
      createdAt: new Date('2026-08-16T08:00:00Z'),
      updatedAt: new Date(),
    },
    {
      name: 'Quần Short Nữ Lưng Cao Vải Đũi Mát Mẻ Dạo Phố',
      slug: 'quan-short-nu-lung-cao-vai-dui-mat-me-dao-pho',
      description: 'Đũi tơ xước tự nhiên mềm nhẹ siêu thoáng mát cho ngày hè oi bức, cạp chun sau co giãn thoải mái.',
      price: 220000,
      originalPrice: 320000,
      category: subCatIds[11],
      images: [
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 95,
      rating: 4.8,
      numReviews: 110,
      isFeatured: true,
      attributes: { ChatLieu: 'Đũi tơ tự nhiên', Size: 'S, M, L', MauSac: 'Trắng Ngà, Nâu Đất, Xanh Mint' },
      createdAt: new Date('2026-08-17T08:00:00Z'),
      updatedAt: new Date(),
    },
    {
      name: 'Quần Short Dù Thể Thao 2 Lớp Chống Nước Nam',
      slug: 'quan-short-du-the-thao-2-lop-chong-nuoc-nam',
      description: 'Chất vải dù chống nước nhẹ, lớp lót thun co giãn ôm đùi hỗ trợ chạy bộ tập gym không bị ma sát.',
      price: 280000,
      originalPrice: 400000,
      category: subCatIds[11],
      images: [
        'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 80,
      rating: 4.7,
      numReviews: 73,
      isFeatured: false,
      attributes: { ChatLieu: 'Vải dù thể thao & Thun Spandex', Size: 'M, L, XL, XXL', MauSac: 'Đen, Xám Đậm' },
      createdAt: new Date('2026-08-18T08:00:00Z'),
      updatedAt: new Date(),
    },

    // --- 13. Túi Xách Da Thật (subCatIds[12]) ---
    {
      name: 'Túi Xách Nữ Da Thật Quai Xách Sang Trọng Kèm Dây Đeo',
      slug: 'tui-xach-nu-da-that-quai-xach-sang-trong-kem-day-deo',
      description: 'Chất liệu da bò tự nhiên dập vân hạt tinh xảo, khóa mạ vàng 18K chống xước, nhiều ngăn tiện lợi chứa đồ cá nhân.',
      price: 680000,
      originalPrice: 950000,
      category: subCatIds[12],
      images: [
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 35,
      rating: 4.9,
      numReviews: 142,
      isFeatured: true,
      attributes: { ChatLieu: 'Da bò cao cấp', KichThuoc: '22cm x 15cm x 8cm', MauSac: 'Nâu Cà Phê, Đen, Trắng' },
      createdAt: new Date('2026-08-01T08:00:00Z'),
      updatedAt: new Date(),
    },
    {
      name: 'Túi Đeo Chéo Nữ Dáng Hộp Khóa Bấm Vintage',
      slug: 'tui-deo-cheo-nu-dang-hop-khoa-bam-vintage',
      description: 'Thiết kế dáng hộp cứng cáp giữ form tuyệt đối, dây đeo da bản rộng phối kim loại sang chảnh.',
      price: 580000,
      originalPrice: 820000,
      category: subCatIds[12],
      images: [
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 45,
      rating: 4.8,
      numReviews: 96,
      isFeatured: false,
      attributes: { ChatLieu: 'Da PU vân cá sấu', KichThuoc: '19cm x 13cm x 7cm', MauSac: 'Đỏ Mận, Đen, Xanh Rêu' },
      createdAt: new Date('2026-08-02T08:00:00Z'),
      updatedAt: new Date(),
    },
    {
      name: 'Túi Tote Da Cỡ Lớn Đựng Laptop Đi Làm Cho Nữ',
      slug: 'tui-tote-da-co-lon-dung-laptop-di-lam-cho-nu',
      description: 'Sức chứa rộng rãi vừa vặn laptop 14 inch và tài liệu A4, quai đeo vai trợ lực êm ái cho nàng công sở.',
      price: 750000,
      originalPrice: 1050000,
      category: subCatIds[12],
      images: [
        'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 50,
      rating: 4.9,
      numReviews: 128,
      isFeatured: true,
      attributes: { ChatLieu: 'Da nhân tạo phủ Nano chống xước', KichThuoc: '36cm x 28cm x 12cm', MauSac: 'Đen, Nâu Tây, Be' },
      createdAt: new Date('2026-08-03T08:00:00Z'),
      updatedAt: new Date(),
    },

    // --- 14. Kính Mắt & Phụ Kiện (subCatIds[13]) ---
    {
      name: 'Kính Râm Thời Trang Unisex Gọng Kim Loại Chống UV400',
      slug: 'kinh-ram-thoi-trang-unisex-gong-kim-loai-chong-uv400',
      description: 'Tròng kính Polarized phân cực loại bỏ ánh sáng chói, gọng hợp kim titan siêu nhẹ không gỉ, đệm mũi silicon êm ái.',
      price: 280000,
      originalPrice: 420000,
      category: subCatIds[13],
      images: [
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 110,
      rating: 4.8,
      numReviews: 120,
      isFeatured: false,
      attributes: { ChatLieu: 'Hợp kim Titan & Tròng Polarized', MauSac: 'Gọng Vàng Tròng Đen, Gọng Bạc' },
      createdAt: new Date('2026-08-04T08:00:00Z'),
      updatedAt: new Date(),
    },
    {
      name: 'Thắt Lưng Nam Da Bò Khóa Tự Động Cao Cấp',
      slug: 'that-lung-nam-da-bo-khoa-tu-dong-cao-cap',
      description: 'Da bò nguyên tấm 2 lớp chống nứt gãy, đầu khóa hợp kim không gỉ công nghệ bấm răng cưa tự động tiện lợi.',
      price: 320000,
      originalPrice: 480000,
      category: subCatIds[13],
      images: [
        'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 90,
      rating: 4.9,
      numReviews: 175,
      isFeatured: true,
      attributes: { ChatLieu: 'Da bò thật 100%', DoDai: '120cm', MauSac: 'Đen, Nâu Đậm' },
      createdAt: new Date('2026-08-05T08:00:00Z'),
      updatedAt: new Date(),
    },
    {
      name: 'Mũ Nồi Beret Nữ Vải Dạ Phong Cách Tiểu Thư Paris',
      slug: 'mu-noi-beret-nu-vai-da-phong-cach-tieu-thu-paris',
      description: 'Chất dạ len mềm mại đứng form nón, tạo điểm nhấn chụp ảnh sống ảo và giữ ấm đầu mùa thu đông.',
      price: 180000,
      originalPrice: 260000,
      category: subCatIds[13],
      images: [
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 65,
      rating: 4.7,
      numReviews: 58,
      isFeatured: false,
      attributes: { ChatLieu: 'Dạ len cao cấp', MauSac: 'Đen, Đỏ Rượu, Be, Nâu' },
      createdAt: new Date('2026-08-06T08:00:00Z'),
      updatedAt: new Date(),
    },

    // --- 15. Ví Da Cầm Tay Mini (subCatIds[14]) ---
    {
      name: 'Ví Da Nam Dáng Ngang Da Bò Sáp Nhiều Ngăn',
      slug: 'vi-da-nam-dang-ngang-da-bo-sap-nhieu-ngan',
      description: 'Ví gấp dáng ngang nhỏ gọn, đựng vừa thẻ CCCD và tiền mặt không bị cộm túi quần, đường chỉ sáp khâu tay chắc chắn.',
      price: 290000,
      originalPrice: 420000,
      category: subCatIds[14],
      images: [
        'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 80,
      rating: 4.8,
      numReviews: 112,
      isFeatured: false,
      attributes: { ChatLieu: 'Da bò sáp Crazy Horse', MauSac: 'Nâu Cổ Điển, Đen' },
      createdAt: new Date('2026-08-07T08:00:00Z'),
      updatedAt: new Date(),
    },
    {
      name: 'Ví Cầm Tay Nữ Dáng Dài Khóa Kéo Đính Nơ',
      slug: 'vi-cam-tay-nu-dang-dai-khoa-keo-dinh-no',
      description: 'Ví dài cầm tay đi tiệc sang chảnh, ngăn trong có khóa kéo đựng vừa điện thoại smartphone cỡ lớn và tiền mặt.',
      price: 340000,
      originalPrice: 490000,
      category: subCatIds[14],
      images: [
        'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 60,
      rating: 4.9,
      numReviews: 87,
      isFeatured: true,
      attributes: { ChatLieu: 'Da PU dập vân xước', KichThuoc: '20cm x 10cm x 2.5cm', MauSac: 'Hồng Nude, Đen, Xanh Pastel' },
      createdAt: new Date('2026-08-08T08:00:00Z'),
      updatedAt: new Date(),
    },
    {
      name: 'Ví Đựng Thẻ Card Holder Da Thật Siêu Mỏng',
      slug: 'vi-dung-the-card-holder-da-that-sieu-mong',
      description: 'Chỉ mỏng 0.5cm, có 6 khe để thẻ và 1 ngăn giữa để tiền gấp, giải pháp tối ưu cho phong cách thanh toán không tiền mặt.',
      price: 190000,
      originalPrice: 280000,
      category: subCatIds[14],
      images: [
        'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 120,
      rating: 4.8,
      numReviews: 140,
      isFeatured: false,
      attributes: { ChatLieu: 'Da bò Nappa', MauSac: 'Xanh Navy, Đen, Nâu Bò' },
      createdAt: new Date('2026-08-09T08:00:00Z'),
      updatedAt: new Date(),
    },

    // --- 16. Giày Sneaker Minimalist (subCatIds[15]) ---
    {
      name: 'Giày Sneaker Unisex Da Trắng Minimalist Cổ Thấp',
      slug: 'giay-sneaker-unisex-da-trang-minimalist-co-thap',
      description: 'Thiết kế all-white bất hủ phối cùng mọi trang phục, đế cao su đúc nguyên khối êm ái chống trơn trượt, lót đệm Memory Foam.',
      price: 590000,
      originalPrice: 850000,
      category: subCatIds[15],
      images: [
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 75,
      rating: 4.8,
      numReviews: 180,
      isFeatured: true,
      attributes: { ChatLieu: 'Da Microfiber & Đế cao su', Size: '36, 37, 38, 39, 40, 41, 42, 43', MauSac: 'Trắng Tinh Khôi' },
      createdAt: new Date('2026-08-10T08:00:00Z'),
      updatedAt: new Date(),
    },
    {
      name: 'Giày Thể Thao Chunky Sneaker Đế Cao Hack Chiều Cao 5cm',
      slug: 'giay-the-thao-chunky-sneaker-de-cao-hack-chieu-cao-5cm',
      description: 'Đế đệm khí 5cm tôn dáng cực đỉnh, phối màu pastel năng động thời thượng thu hút mọi ánh nhìn.',
      price: 650000,
      originalPrice: 920000,
      category: subCatIds[15],
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 60,
      rating: 4.9,
      numReviews: 154,
      isFeatured: true,
      attributes: { ChatLieu: 'Vải dệt Mesh & Da PU', Size: '36, 37, 38, 39, 40', MauSac: 'Trắng Phối Xám, Be Pastel' },
      createdAt: new Date('2026-08-11T08:00:00Z'),
      updatedAt: new Date(),
    },
    {
      name: 'Giày Lười Loafer Nam Da Bóng Khóa Kim Loại Chuẩn Quý Ông',
      slug: 'giay-luoi-loafer-nam-da-bong-khoa-kim-loai-chuan-quy-ong',
      description: 'Chất da bóng bẩy sang trọng, đế phíp khâu chỉ tỉ mỉ gõ vang từng bước đi lịch lãm của doanh nhân.',
      price: 790000,
      originalPrice: 1150000,
      category: subCatIds[15],
      images: [
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 45,
      rating: 4.8,
      numReviews: 92,
      isFeatured: false,
      attributes: { ChatLieu: 'Da bóng phủ Nano', Size: '39, 40, 41, 42, 43', MauSac: 'Đen Bóng, Nâu Rượu Vang' },
      createdAt: new Date('2026-08-12T08:00:00Z'),
      updatedAt: new Date(),
    },

    // --- 17. Giày Cao Gót Mũi Nhọn (subCatIds[16]) ---
    {
      name: 'Giày Cao Gót Nữ 7cm Mũi Nhọn Da Bóng Tôn Dáng',
      slug: 'giay-cao-got-nu-7cm-mui-nhon-da-bong-ton-dang',
      description: 'Gót nhọn cao 7cm tạo độ cong gợi cảm cho đôi chân, lớp lót da cừu êm chân giảm áp lực khi di chuyển nhiều giờ liên tục.',
      price: 490000,
      originalPrice: 700000,
      category: subCatIds[16],
      images: [
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 40,
      rating: 4.7,
      numReviews: 75,
      isFeatured: false,
      attributes: { ChatLieu: 'Da bóng & Đế chống trượt', Size: '35, 36, 37, 38, 39', MauSac: 'Đen, Đỏ Rượu, Nude' },
      createdAt: new Date('2026-08-13T08:00:00Z'),
      updatedAt: new Date(),
    },
    {
      name: 'Giày Cao Gót Quai Mảnh Đính Đá Ánh Sao Dự Tiệc',
      slug: 'giay-cao-got-quai-manh-dinh-da-anh-sao-du-tiec',
      description: 'Quai sandal quấn cổ chân đính pha lê Swarovski lấp lánh, gót cao 9cm quyến rũ hút mắt thảm đỏ.',
      price: 580000,
      originalPrice: 820000,
      category: subCatIds[16],
      images: [
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 35,
      rating: 4.9,
      numReviews: 110,
      isFeatured: true,
      attributes: { ChatLieu: 'Satin & Pha lê Swarovski', Size: '35, 36, 37, 38, 39', MauSac: 'Bạc Ánh Sao, Vàng Champagne' },
      createdAt: new Date('2026-08-14T08:00:00Z'),
      updatedAt: new Date(),
    },
    {
      name: 'Giày Mary Jane Gót Vuông 5cm Tiểu Thư Vintage',
      slug: 'giay-mary-jane-got-vuong-5cm-tieu-thu-vintage',
      description: 'Thiết kế Mary Jane kinh điển với quai cài ngang cổ chân, gót vuông 5cm cực kỳ vững chân không lo trượt ngã.',
      price: 430000,
      originalPrice: 600000,
      category: subCatIds[16],
      images: [
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 65,
      rating: 4.8,
      numReviews: 89,
      isFeatured: false,
      attributes: { ChatLieu: 'Da bóng mờ', Size: '35, 36, 37, 38, 39, 40', MauSac: 'Đen, Nâu Cacao, Đỏ Burgundy' },
      createdAt: new Date('2026-08-15T08:00:00Z'),
      updatedAt: new Date(),
    },

    // --- 18. Boots Da Chelsea Cổ Lửng (subCatIds[17]) ---
    {
      name: 'Giày Chelsea Boots Nam Nữ Da Bò Cổ Lửng Phong Cách',
      slug: 'giay-chelsea-boots-nam-nu-da-bo-co-lung-phong-cach',
      description: 'Chất da sáp bò chống nước bền bỉ, thun co giãn 2 bên sườn ôm khít cổ chân, đế cao su đúc khâu chỉ gầm chắc chắn.',
      price: 890000,
      originalPrice: 1350000,
      category: subCatIds[17],
      images: [
        'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 35,
      rating: 4.9,
      numReviews: 89,
      isFeatured: true,
      attributes: { ChatLieu: 'Da bò thật nguyên tấm', Size: '38, 39, 40, 41, 42, 43', MauSac: 'Nâu Sáp, Đen Mờ' },
      createdAt: new Date('2026-08-16T08:00:00Z'),
      updatedAt: new Date(),
    },
    {
      name: 'Boots Nữ Cổ Cao Qua Gối Da Co Giãn Tôn Dáng',
      slug: 'boots-nu-co-cao-qua-goi-da-co-gian-ton-dang',
      description: 'Ôm sát bắp chân thon gọn, gót vuông 6cm dễ di chuyển kết hợp cùng áo len giấu quần hoặc đầm ngắn mùa đông.',
      price: 980000,
      originalPrice: 1450000,
      category: subCatIds[17],
      images: [
        'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 25,
      rating: 5.0,
      numReviews: 76,
      isFeatured: true,
      attributes: { ChatLieu: 'Da lộn Stretch co giãn', Size: '35, 36, 37, 38, 39', MauSac: 'Đen Tuyển, Nâu Da Bò' },
      createdAt: new Date('2026-08-17T08:00:00Z'),
      updatedAt: new Date(),
    },
    {
      name: 'Boots Nam Buộc Dây Combat Boots Đế Hầm Hố',
      slug: 'boots-nam-buoc-day-combat-boots-de-ham-ho',
      description: 'Phong cách quân đội mạnh mẽ nam tính, đế gai chống trơn trượt có khóa kéo hông mở nhanh tiện lợi.',
      price: 850000,
      originalPrice: 1250000,
      category: subCatIds[17],
      images: [
        'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 40,
      rating: 4.8,
      numReviews: 65,
      isFeatured: false,
      attributes: { ChatLieu: 'Da PU dày & Đế đúc cao su', Size: '39, 40, 41, 42, 43, 44', MauSac: 'Đen Nhám' },
      createdAt: new Date('2026-08-18T08:00:00Z'),
      updatedAt: new Date(),
    },
  ];

  const insertedProducts = await db.collection('products').insertMany(productsData);
  const productIds = Object.values(insertedProducts.insertedIds);
  console.log(`🎁 Đã tạo ${productIds.length} sản phẩm thời trang (3 sản phẩm cho MỖI danh mục con).`);

  // =========================================================================
  // 5. TẠO ĐƠN HÀNG MẪU
  // =========================================================================
  const ordersData = [
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
          product: productIds[9],
          name: productsData[9].name,
          image: productsData[9].images[0],
          price: productsData[9].price,
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
    {
      user: userIds[1],
      items: [
        {
          product: productIds[18],
          name: productsData[18].name,
          image: productsData[18].images[0],
          price: productsData[18].price,
          quantity: 1,
          selectedAttributes: { Size: 'L', MauSac: 'Xám Khói' },
        },
        {
          product: productIds[36],
          name: productsData[36].name,
          image: productsData[36].images[0],
          price: productsData[36].price,
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
    {
      user: userIds[2], // lethibaongoc@gmail.com
      items: [
        {
          product: productIds[4],
          name: productsData[4].name,
          image: productsData[4].images[0],
          price: productsData[4].price,
          quantity: 1,
          selectedAttributes: { Size: 'M' },
        },
        {
          product: productIds[45],
          name: productsData[45].name,
          image: productsData[45].images[0],
          price: productsData[45].price,
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
      totalPrice: 960000,
      createdAt: new Date('2026-08-19T11:20:00Z'),
      updatedAt: new Date('2026-08-19T13:00:00Z'),
    },
  ];

  await db.collection('orders').insertMany(ordersData);
  console.log(`🛍️ Đã tạo ${ordersData.length} đơn hàng mẫu.`);

  // =========================================================================
  // 6. TẠO GIỎ HÀNG SẴN CHO KHÁCH HÀNG
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
        product: productIds[45],
        price: productsData[45].price,
        quantity: 1,
        selectedAttributes: { Size: '41' },
      },
    ],
    totalPrice: productsData[0].price + productsData[45].price,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.collection('carts').insertOne(cartData);
  console.log('🛒 Đã tạo giỏ hàng mẫu.');

  // =========================================================================
  // 6.1 TẠO ĐÁNH GIÁ MẪU CHO SẢN PHẨM (REVIEWS)
  // =========================================================================
  const sampleReviews = [
    {
      user: userIds[1], // customer@ashashop.com
      product: productIds[0], // Đầm Dạ Hội Lụa Satin
      rating: 5,
      comment: 'Váy đầm dạ hội này đẹp xuất sắc ngoài mong đợi! Chất lụa satin Ý bóng nhẹ cực kỳ sang chảnh, mặc đi tiệc cưới ai cũng khen. Form may chuẩn đét luôn shop ơi!',
      images: [
        'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
      ],
      selectedAttributes: { Size: 'M', MauSac: 'Đỏ Ruby' },
      createdAt: new Date('2026-08-13T10:00:00Z'),
      updatedAt: new Date(),
    },
    {
      user: userIds[2], // lethibaongoc@gmail.com
      product: productIds[0],
      rating: 5,
      comment: 'Đường kim mũi chỉ rất đều và chắc chắn, đính ngọc trai ở cổ rất tỉ mỉ. 10/10 điểm cho AshaShop!',
      images: [],
      selectedAttributes: { Size: 'S', MauSac: 'Vàng Champagne' },
      createdAt: new Date('2026-08-14T14:30:00Z'),
      updatedAt: new Date(),
    },
    {
      user: userIds[3], // tranducanh@gmail.com
      product: productIds[18], // Blazer Nam Form Rộng
      rating: 5,
      comment: 'Áo blazer form Hàn Quốc mặc rất tôn dáng, vai có đệm mỏng nên lên đồ rất sang. Vải tuyết mưa không hề bị nhăn sau khi giặt.',
      images: [
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
      ],
      selectedAttributes: { Size: 'L', MauSac: 'Xám Khói' },
      createdAt: new Date('2026-08-15T09:15:00Z'),
      updatedAt: new Date(),
    },
    {
      user: userIds[4], // hoangminhtri@gmail.com
      product: productIds[27], // Quần Jeans Slimfit Vintage
      rating: 4,
      comment: 'Chất denim co giãn thoải mái, màu wash vintage đẹp chuẩn ảnh mẫu. Giao hàng 2 ngày là nhận được.',
      images: [],
      selectedAttributes: { Size: '31', MauSac: 'Xanh Vintage' },
      createdAt: new Date('2026-08-16T16:00:00Z'),
      updatedAt: new Date(),
    },
    {
      user: userIds[2],
      product: productIds[36], // Túi Xách Nữ Da Thật
      rating: 5,
      comment: 'Túi da bò thật cầm chắc tay, khóa mạ vàng sáng bóng không tì vết. Đóng gói hộp rất sang trọng có thể làm quà tặng.',
      images: [
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
      ],
      selectedAttributes: { MauSac: 'Nâu Cà Phê' },
      createdAt: new Date('2026-08-17T11:45:00Z'),
      updatedAt: new Date(),
    },
  ];

  await db.collection('reviews').insertMany(sampleReviews);
  console.log(`⭐ Đã tạo ${sampleReviews.length} đánh giá sao & bình luận mẫu cho sản phẩm.`);

  // =========================================================================
  // 7. TẠO CẤU HÌNH CMS STUDIO ĐẦY ĐỦ
  // =========================================================================
  const siteConfigData = {
    key: 'site_config',
    data: {
      brandName: 'Asha',
      brandHighlight: 'Shop',
      tagline: 'Thời Trang Cao Cấp Chuẩn Phong Cách Sống',
      customLogoUrl: '',
      faviconUrl: 'https://api.iconify.design/heroicons:sparkles-20-solid.svg?color=%23DB4444',

      showTopBar: true,
      topBarText: 'Siêu Sale Thời Trang Mùa Hè Giảm Đến 50% & Miễn Phí Vận Chuyển Toàn Quốc!',
      topBarDiscount: 50,
      topBarLink: '/shop',
      topBarButtonText: 'Khám Phá Ngay',

      heroTag: 'Lookbook Mùa Hè 2026',
      heroTitle: 'Bộ Sưu Tập Thời Trang Đẳng Cấp & Thanh Lịch',
      heroSubtitle: 'Khám phá hơn 500+ mẫu thiết kế mới nhất với chất liệu lụa tơ tằm, tuyết mưa và dạ ép cao cấp.',
      heroButtonText: 'Mua Ngay',
      heroButtonLink: '/shop',
      heroImageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',

      flashSaleBadge: 'Hôm Nay',
      flashSaleTitle: 'Flash Sale Thời Trang',
      flashSaleSubtitle: 'Giảm giá chớp nhoáng với số lượng giới hạn',
      flashSaleDiscount: 40,
      flashSaleHours: 24,
      flashSaleMode: 'AUTO',
      flashSaleProductIds: [String(productIds[0]), String(productIds[9]), String(productIds[18]), String(productIds[27])],

      bestSellingBadge: 'Tháng Này',
      bestSellingTitle: 'Mẫu Bán Chạy Nhất',
      bestSellingSubtitle: 'Những thiết kế được yêu thích nhất mùa thời trang',
      bestSellingMode: 'AUTO',
      bestSellingProductIds: [String(productIds[0]), String(productIds[9]), String(productIds[21]), String(productIds[45])],

      exploreBadge: 'Sản Phẩm',
      exploreTitle: 'Khám Phá Bộ Sưu Tập',
      exploreSubtitle: 'Thời trang nam nữ đa dạng phong cách từ tối giản đến sang trọng',
      exploreMode: 'AUTO',
      exploreProductIds: [],

      promoBadge: 'Thời Thượng',
      promoTitle: 'Nâng Tầm Phong Cách Với Trang Phục Thời Thượng',
      promoButtonText: 'Xem BST Mới',
      promoButtonLink: '/shop',
      promoImageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',

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

      badgeDeliveryTitle: 'GIAO HÀNG SIÊU TỐC',
      badgeDeliveryDesc: 'Miễn phí vận chuyển cho mọi đơn hàng từ 500k',
      badgeServiceTitle: 'HỖ TRỢ 24/7',
      badgeServiceDesc: 'Đội ngũ tư vấn size và đổi trả tận tâm',
      badgeReturnTitle: 'ĐỔI TRẢ TRONG 30 NGÀY',
      badgeReturnDesc: 'Cam kết đổi trả miễn phí nếu không vừa vặn',

      aboutTitle: 'Câu Chuyện AshaShop Fashion',
      aboutStory1: 'Được thành lập vào năm 2026, AshaShop là thương hiệu thời trang cao cấp mang phong cách hiện đại, thanh lịch và tối giản đến cho mọi khách hàng Việt Nam và quốc tế.',
      aboutStory2: 'Chúng tôi cam kết từng sản phẩm đều được may từ chất liệu cao cấp, đường may tỉ mỉ và chuẩn form dáng giúp bạn tự tin tỏa sáng.',
      aboutImageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',

      hotline: '0901 234 567',
      supportEmail: 'support@ashashop.com',
      address: '123 Nguyễn Trãi, Thanh Xuân, Hà Nội',
      workingHours: '8:00 - 22:00 (Thứ 2 - Chủ Nhật)',

      footerDescription: 'AshaShop - Thương hiệu thời trang cao cấp mang phong cách hiện đại, thanh lịch và tối giản đến với bạn.',
      footerAppDiscount: 'Tiết kiệm 10% cho đơn hàng đầu tiên qua app',
      copyrightText: '© Copyright AshaShop 2026. All rights reserved.',
      facebookUrl: 'https://facebook.com',
      instagramUrl: 'https://instagram.com',
      twitterUrl: 'https://twitter.com',
      linkedinUrl: 'https://linkedin.com',

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
  console.log(`🎉 NẠP THÀNH CÔNG ${productsData.length} SẢN PHẨM PHỦ KÍN 100% CÁC DANH MỤC!`);
  console.log('================================================================');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Lỗi Seeder:', err);
  process.exit(1);
});
