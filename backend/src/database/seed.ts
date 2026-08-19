import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { UserRole } from '../modules/users/schemas/user.schema';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ashashop';

async function seed() {
  console.log('🔄 Đang kết nối tới MongoDB để nạp dữ liệu Thời Trang...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Đã kết nối MongoDB thành công!');

  const db = mongoose.connection.db;

  // Clear existing collections
  await db.collection('users').deleteMany({});
  await db.collection('categories').deleteMany({});
  await db.collection('products').deleteMany({});
  await db.collection('carts').deleteMany({});
  await db.collection('orders').deleteMany({});

  console.log('🧹 Đã dọn dẹp dữ liệu cũ');

  // 1. Tạo Users
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('admin123456', salt);
  const userPassword = await bcrypt.hash('customer123456', salt);

  await db.collection('users').insertOne({
    name: 'Quản Trị Viên AshaShop',
    email: 'admin@ashashop.com',
    password: adminPassword,
    role: UserRole.ADMIN,
    phone: '0901234567',
    address: '111 Cầu Giấy, Hà Nội',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await db.collection('users').insertOne({
    name: 'Nguyễn Văn Khách Hàng',
    email: 'customer@ashashop.com',
    password: userPassword,
    role: UserRole.CUSTOMER,
    phone: '0988776655',
    address: '123 Nguyễn Trãi, Thanh Xuân, Hà Nội',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log('👤 Đã tạo 2 tài khoản mẫu (Admin & Customer)');

  // 2. Tạo Danh Mục Gốc & Danh Mục Con Thời Trang Chuẩn
  const categoriesData = [
    {
      name: 'Thời Trang Nữ',
      slug: 'thoi-trang-nu',
      description: 'Váy đầm dạ hội, áo kiểu nữ, chân váy, set đồ nữ thanh lịch',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80',
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Thời Trang Nam',
      slug: 'thoi-trang-nam',
      description: 'Áo polo, áo sơ mi nam, quần âu, áo thun nam cao cấp',
      image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=600&q=80',
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Áo Khoác & Blazer',
      slug: 'ao-khoac-blazer',
      description: 'Blazer dáng rộng, măng tô, áo khoác biker da, bomber streetwear',
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80',
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Quần & Jeans Thời Trang',
      slug: 'quan-jeans',
      description: 'Quần jeans ống suông, quần tây công sở, baggy thời thượng',
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Túi Xách & Phụ Kiện',
      slug: 'tui-xach-phu-kien',
      description: 'Túi da cao cấp, thắt lưng, kính râm và phụ kiện phối đồ',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Giày & Dép Thời Trang',
      slug: 'giay-dep-thoi-trang',
      description: 'Sneaker phong cách, boots da cổ lửng, giày cao gót tôn dáng',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const insertedCategories = await db.collection('categories').insertMany(categoriesData);
  const catIds = Object.values(insertedCategories.insertedIds);

  // Thêm đầy đủ các danh mục con (Subcategories) cho tất cả nhóm
  const subCategoriesData = [
    // 1. Nữ
    {
      name: 'Váy Đầm Dạ Hội',
      slug: 'vay-dam-da-hoi',
      description: 'Váy đầm dài, đầm xòe công chúa, đầm body dự tiệc sang trọng',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
      parentId: String(catIds[0]),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Áo Kiểu & Sơ Mi Nữ',
      slug: 'ao-kieu-so-mi-nu',
      description: 'Sơ mi lụa tơ tằm, áo voan hoa nhí, áo kiểu công sở',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      parentId: String(catIds[0]),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Chân Váy Xếp Ly',
      slug: 'chan-vay-xep-ly',
      description: 'Chân váy chữ A, xếp ly Hàn Quốc thanh lịch',
      image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=600&q=80',
      parentId: String(catIds[0]),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // 2. Nam
    {
      name: 'Áo Polo Nam Cotton',
      slug: 'ao-polo-nam',
      description: 'Áo polo cotton pique thoáng khí co giãn thoải mái',
      image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=600&q=80',
      parentId: String(catIds[1]),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Áo Sơ Mi Nam Công Sở',
      slug: 'ao-so-mi-nam-cong-so',
      description: 'Sơ mi oxford chống nhăn cao cấp',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80',
      parentId: String(catIds[1]),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // 3. Áo Khoác & Blazer
    {
      name: 'Blazer May Đo Hàn Quốc',
      slug: 'blazer-may-do-han-quoc',
      description: 'Blazer form rộng phong cách Seoul thanh lịch',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
      parentId: String(catIds[2]),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Áo Khoác Biker Da',
      slug: 'ao-khoac-biker-da',
      description: 'Áo da moto phong cách cá tính',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80',
      parentId: String(catIds[2]),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // 4. Quần & Jeans
    {
      name: 'Quần Jeans Slimfit',
      slug: 'quan-jeans-slimfit',
      description: 'Jeans co giãn tôn dáng thoải mái',
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
      parentId: String(catIds[3]),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Quần Tây Baggy Suông',
      slug: 'quan-tay-baggy-suong',
      description: 'Quần âu vải tuyết mưa đứng form',
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80',
      parentId: String(catIds[3]),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // 5. Túi Xách & Phụ Kiện
    {
      name: 'Túi Xách Da Thật',
      slug: 'tui-xach-da-that',
      description: 'Túi đeo chéo da bò dập vân tinh xảo',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
      parentId: String(catIds[4]),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // 6. Giày & Dép
    {
      name: 'Giày Sneaker Minimalist',
      slug: 'giay-sneaker-minimalist',
      description: 'Giày sneaker trắng êm ái phong cách tối giản',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
      parentId: String(catIds[5]),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  const insertedSubCategories = await db.collection('categories').insertMany(subCategoriesData);
  const subCatIds = Object.values(insertedSubCategories.insertedIds);
  console.log(`📁 Đã tạo ${catIds.length} danh mục gốc và ${subCatIds.length} danh mục con thời trang.`);

  // 3. Tạo 12 Sản Phẩm Thời Trang Phong Cách Tuyệt Đẹp
  const productsData = [
    {
      name: 'Đầm Nữ Dạ Hội Dáng Xòe Lụa Satin Sang Trọng',
      slug: 'dam-nu-da-hoi-dang-xoe-lua-satin-sang-trong',
      description: 'Chất liệu lụa Satin cao cấp bóng nhẹ mềm mại, thiết kế chiết eo tôn dáng quý phái, phù hợp tiệc tối và sự kiện sang trọng.',
      price: 790000,
      originalPrice: 1150000,
      category: catIds[0],
      images: [
        'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 45,
      rating: 4.9,
      numReviews: 135,
      isFeatured: true,
      attributes: { ChatLieu: 'Lụa Satin Ý', Size: 'S, M, L', MauSac: 'Đỏ Ruby, Đen Tuyển' },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Áo Khoác Blazer Nam Form Rộng Phong Cách Hàn Quốc',
      slug: 'ao-khoac-blazer-nam-form-rong-phong-cach-han-quoc',
      description: 'Thiết kế dáng suông hiện đại trẻ trung, chất vải tuyết mưa đứng form không nhăn, lót lụa mềm mại thoáng khí 4 mùa.',
      price: 850000,
      originalPrice: 1200000,
      category: catIds[2],
      images: [
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 30,
      rating: 4.8,
      numReviews: 92,
      isFeatured: true,
      attributes: { ChatLieu: 'Tuyết mưa cao cấp', Size: 'M, L, XL', MauSac: 'Xám Khói, Đen, Be' },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Áo Polo Nam Classic Pique Cotton Co Giãn Cao Cấp',
      slug: 'ao-polo-nam-classic-pique-cotton-co-gian-cao-cap',
      description: 'Dệt từ 100% sợi cotton chải kỹ dệt mắt chim tổ ong, thấm hút mồ hôi vượt trội, cổ áo dệt bo dệt định hình không xù lông.',
      price: 350000,
      originalPrice: 480000,
      category: catIds[1],
      images: [
        'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1625910513413-562a98f121d5?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 120,
      rating: 4.9,
      numReviews: 240,
      isFeatured: true,
      attributes: { ChatLieu: 'Cotton Pique', Size: 'S, M, L, XL, XXL', MauSac: 'Trắng, Xanh Navy, Đen' },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Áo Sơ Mi Nữ Tay Phồng Cổ Nơ Tơ Tằm Xinh Xắn',
      slug: 'ao-so-mi-nu-tay-phong-co-no-to-tam-xinh-xan',
      description: 'Chất liệu vải tơ tằm dệt cao cấp, thiết kế tay phồng nhẹ nhàng nữ tính, cổ nơ thắt duyên dáng phối cùng chân váy công sở.',
      price: 390000,
      originalPrice: 520000,
      category: catIds[0],
      images: [
        'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 60,
      rating: 4.7,
      numReviews: 78,
      isFeatured: false,
      attributes: { ChatLieu: 'Tơ dệt mềm', Size: 'FreeSize / S, M', MauSac: 'Trắng Kem, Hồng Pastel' },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Quần Jeans Nam Slimfit Co Giãn Vintage Wash Blue',
      slug: 'quan-jeans-nam-slimfit-co-gian-vintage-wash-blue',
      description: 'Vải denim cotton 12.5oz wash màu vintage cổ điển, pha 2% spandex tạo độ co giãn thoải mái khi vận động cả ngày dài.',
      price: 490000,
      originalPrice: 650000,
      category: catIds[3],
      images: [
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 80,
      rating: 4.8,
      numReviews: 164,
      isFeatured: true,
      attributes: { ChatLieu: 'Denim Cotton Spandex', Size: '29, 30, 31, 32, 34', MauSac: 'Xanh Vintage' },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Chân Váy Nữ Xếp Ly Dáng Dài Tôn Dáng Thời Thượng',
      slug: 'chan-vay-nu-xep-ly-dang-dai-ton-dang-thoi-thuong',
      description: 'Xếp ly dập nhiệt công nghệ cao giữ nếp vĩnh viễn, cạp chun êm ái co giãn dễ phối cùng áo len, áo thun và áo sơ mi.',
      price: 320000,
      originalPrice: 450000,
      category: catIds[0],
      images: [
        'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 70,
      rating: 4.8,
      numReviews: 95,
      isFeatured: false,
      attributes: { ChatLieu: 'Voan cát 2 lớp', Size: 'S, M, L', MauSac: 'Đen, Be Nude, Nâu Tây' },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Áo Hoodie Nỉ Bông Unisex Oversize In Chữ Aesthetic',
      slug: 'ao-hoodie-ni-bong-unisex-oversize-in-chu-aesthetic',
      description: 'Chất nỉ bông 380gsm dày dặn đứng form, mũ trùm 2 lớp có dây rút kim loại, hình in dập nổi sắc nét không bong tróc.',
      price: 420000,
      originalPrice: 580000,
      category: catIds[1],
      images: [
        'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 90,
      rating: 4.9,
      numReviews: 210,
      isFeatured: true,
      attributes: { ChatLieu: 'Nỉ bông Cotton 380gsm', Size: 'M, L, XL', MauSac: 'Xám Melange, Đen, Xanh Rêu' },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Áo Khoác Da Biker Jacket Unisex Cao Cấp',
      slug: 'ao-khoac-da-biker-jacket-unisex-cao-cap',
      description: 'Chất liệu da PU vân hạt mờ siêu mềm chống nổ da, khóa kéo YKK kim loại mạ bạc sáng bóng cá tính, phong cách rock chic đường phố.',
      price: 1290000,
      originalPrice: 1850000,
      category: catIds[2],
      images: [
        'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 25,
      rating: 5.0,
      numReviews: 67,
      isFeatured: true,
      attributes: { ChatLieu: 'Da PU cao cấp', Size: 'M, L, XL', MauSac: 'Đen Tuyển' },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Váy Hoa Nhí Vintage Mùa Hè Cổ Vuông Duyên Dáng',
      slug: 'vay-hoa-nhi-vintage-mua-he-co-vuong-duyen-dang',
      description: 'Họa tiết hoa nhí phong cách Pháp lãng mạn, tay phồng bo chun và tùng váy xòe bồng bềnh, diện đi biển hoặc dạo phố cực xinh.',
      price: 380000,
      originalPrice: 500000,
      category: catIds[0],
      images: [
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 50,
      rating: 4.8,
      numReviews: 112,
      isFeatured: true,
      attributes: { ChatLieu: 'Chiffon lót lụa', Size: 'S, M, L', MauSac: 'Hoa Vàng, Hoa Xanh' },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Quần Tây Nam Baggy Dáng Suông Hàn Quốc',
      slug: 'quan-tay-nam-baggy-dang-suong-han-quoc',
      description: 'Form quần suông nhẹ che khuyết điểm chân cực tốt, cạp có tăng đơ chun ẩn co giãn tiện lợi, phối đồ thanh lịch chuẩn soái ca.',
      price: 450000,
      originalPrice: 600000,
      category: catIds[3],
      images: [
        'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 65,
      rating: 4.7,
      numReviews: 88,
      isFeatured: false,
      attributes: { ChatLieu: 'Vải Kaki Tuyết Hàn', Size: '28, 29, 30, 31, 32', MauSac: 'Đen, Xám Ghi, Be Sữa' },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Túi Xách Nữ Da Thật Quai Xách Sang Trọng Kèm Dây Đeo',
      slug: 'tui-xach-nu-da-that-quai-xach-sang-trong-kem-day-deo',
      description: 'Chất liệu da bò tự nhiên dập vân hạt tinh xảo, khóa mạ vàng 18K chống xước, nhiều ngăn tiện lợi chứa đồ cá nhân.',
      price: 680000,
      originalPrice: 950000,
      category: catIds[4],
      images: [
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 35,
      rating: 4.9,
      numReviews: 142,
      isFeatured: true,
      attributes: { ChatLieu: 'Da bò cao cấp', KichThuoc: '22cm x 15cm x 8cm', MauSac: 'Nâu Cà Phê, Đen, Trắng' },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Giày Sneaker Unisex Da Trắng Minimalist Cổ Thấp',
      slug: 'giay-sneaker-unisex-da-trang-minimalist-co-thap',
      description: 'Thiết kế all-white bất hủ phối cùng mọi trang phục, đế cao su đúc nguyên khối êm ái chống trơn trượt, lót đệm Memory Foam.',
      price: 590000,
      originalPrice: 850000,
      category: catIds[5],
      images: [
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 75,
      rating: 4.8,
      numReviews: 180,
      isFeatured: true,
      attributes: { ChatLieu: 'Da Microfiber & Đế cao su', Size: '36, 37, 38, 39, 40, 41, 42, 43', MauSac: 'Trắng Tinh Khôi' },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  await db.collection('products').insertMany(productsData);
  console.log(`🎁 Đã tạo ${productsData.length} sản phẩm thời trang mẫu cao cấp.`);

  console.log('🎉 Nạp dữ liệu Thời Trang Seeder thành công hoàn tất!');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Lỗi Seeder:', err);
  process.exit(1);
});
