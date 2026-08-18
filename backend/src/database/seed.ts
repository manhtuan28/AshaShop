import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { UserRole } from '../modules/users/schemas/user.schema';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ashashop';

async function seed() {
  console.log('🔄 Đang kết nối tới MongoDB để nạp dữ liệu mẫu...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Đã kết nối MongoDB thành công!');

  const db = mongoose.connection.db;

  // Clear existing collections if desired
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

  const adminUser = await db.collection('users').insertOne({
    name: 'Quản Trị Viên AshaShop',
    email: 'admin@ashashop.com',
    password: adminPassword,
    role: UserRole.ADMIN,
    phone: '0901234567',
    address: 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const customerUser = await db.collection('users').insertOne({
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

  console.log('👤 Đã tạo 2 tài khoản mẫu:');
  console.log('   - Admin: admin@ashashop.com / admin123456');
  console.log('   - Customer: customer@ashashop.com / customer123456');

  // 2. Tạo Categories
  const categoriesData = [
    {
      name: 'Điện thoại & Tablet',
      slug: 'dien-thoai-tablet',
      description: 'Smartphone, máy tính bảng thế hệ mới chính hãng',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Laptop & Máy tính',
      slug: 'laptop-may-tinh',
      description: 'Laptop văn phòng, gaming, đồ họa cao cấp',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Thời trang & Phụ kiện',
      slug: 'thoi-trang-phu-kien',
      description: 'Quần áo thời trang, đồng hồ, phụ kiện phong cách',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Âm thanh & Phụ kiện số',
      slug: 'am-thanh-phu-kien-so',
      description: 'Tai nghe Bluetooth, loa thông minh, sạc nhanh',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const insertedCategories = await db.collection('categories').insertMany(categoriesData);
  const catIds = Object.values(insertedCategories.insertedIds);
  console.log(`📁 Đã tạo ${catIds.length} danh mục mẫu.`);

  // 3. Tạo Products
  const productsData = [
    {
      name: 'iPhone 15 Pro Max 256GB Titan Tự Nhiên',
      slug: 'iphone-15-pro-max-256gb-titan-tu-nhien',
      description: 'Thiết kế khung viền Titan chuẩn hàng không vũ trụ, chip Apple A17 Pro cực mạnh, camera 48MP zoom quang học 5x.',
      price: 29990000,
      originalPrice: 34990000,
      category: catIds[0],
      images: [
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 35,
      rating: 4.9,
      numReviews: 128,
      isFeatured: true,
      attributes: { DungLuong: '256GB', MauSac: 'Titan Tự Nhiên', BaoHanh: '12 Tháng' },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Samsung Galaxy S24 Ultra 5G 512GB',
      slug: 'samsung-galaxy-s24-ultra-5g-512gb',
      description: 'Kỷ nguyên Galaxy AI thông minh vượt trội, bút S-Pen quyền năng, camera 200MP zoom 100x sắc nét tuyệt hảo.',
      price: 27490000,
      originalPrice: 31990000,
      category: catIds[0],
      images: [
        'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 25,
      rating: 4.8,
      numReviews: 89,
      isFeatured: true,
      attributes: { DungLuong: '512GB', MauSac: 'Xám Titan', BaoHanh: '12 Tháng' },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'MacBook Pro 14 M3 Pro (18GB / 512GB SSD)',
      slug: 'macbook-pro-14-m3-pro-18gb-512gb-ssd',
      description: 'Màn hình Liquid Retina XDR 120Hz siêu đỉnh, chip M3 Pro hiệu năng đồ họa cực cao, thời lượng pin lên đến 22 giờ liên tục.',
      price: 49990000,
      originalPrice: 52990000,
      category: catIds[1],
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 15,
      rating: 5.0,
      numReviews: 45,
      isFeatured: true,
      attributes: { Chip: 'Apple M3 Pro', RAM: '18GB', SSD: '512GB' },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Laptop ASUS ROG Zephyrus G16 OLED Gaming',
      slug: 'laptop-asus-rog-zephyrus-g16-oled-gaming',
      description: 'Màn hình OLED 240Hz 2.5K chuẩn màu, chip Intel Core Ultra 9, card đồ họa RTX 4070 cân mọi tựa game AAA.',
      price: 42990000,
      originalPrice: 46990000,
      category: catIds[1],
      images: [
        'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 12,
      rating: 4.7,
      numReviews: 32,
      isFeatured: false,
      attributes: { CPU: 'Intel Core Ultra 9', VGA: 'RTX 4070', RAM: '32GB' },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Tai nghe Sony WH-1000XM5 Chống Ồn Cao Cấp',
      slug: 'tai-nghe-sony-wh-1000xm5-chong-on-cao-cap',
      description: 'Công nghệ chống ồn chủ động hàng đầu thế giới ANC, chất âm Hi-Res sắc nét, đàm thoại trong trẻo với 8 micro AI.',
      price: 6990000,
      originalPrice: 8490000,
      category: catIds[3],
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 50,
      rating: 4.9,
      numReviews: 210,
      isFeatured: true,
      attributes: { MauSac: 'Đen Huyền Bí', Pin: '30 Giờ', CongNghe: 'ANC Hi-Res' },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Apple AirPods Pro 2 USB-C MagSafe',
      slug: 'apple-airpods-pro-2-usb-c-magsafe',
      description: 'Chip H2 mang lại khả năng chống ồn gấp 2 lần, âm thanh thích ứng tự động, kháng nước bụi chuẩn IP54.',
      price: 5290000,
      originalPrice: 6190000,
      category: catIds[3],
      images: [
        'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 80,
      rating: 4.8,
      numReviews: 340,
      isFeatured: true,
      attributes: { CongSac: 'USB-C', ChucNang: 'Chống ồn thích ứng' },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Đồng hồ Thông minh Apple Watch Series 9 GPS',
      slug: 'dong-ho-thong-minh-apple-watch-series-9-gps',
      description: 'Chip S9 SiP mạnh mẽ, tính năng chạm hai lần (Double Tap) kỳ diệu, màn hình sáng gấp đôi, theo dõi sức khỏe chuyên sâu.',
      price: 9490000,
      originalPrice: 10490000,
      category: catIds[2],
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 40,
      rating: 4.8,
      numReviews: 95,
      isFeatured: true,
      attributes: { Size: '45mm', MauSac: 'Midnight' },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Áo Khoác Bomber Nam Classic Minimalist',
      slug: 'ao-khoac-bomber-nam-classic-minimalist',
      description: 'Chất liệu vải dù 2 lớp chống gió cản nước nhẹ, lót dù êm ái, form dáng ôm vừa vặn trẻ trung năng động.',
      price: 450000,
      originalPrice: 650000,
      category: catIds[2],
      images: [
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
      ],
      stock: 120,
      rating: 4.6,
      numReviews: 76,
      isFeatured: false,
      attributes: { Size: 'L / XL / XXL', MauSac: 'Xanh Rêu, Đen' },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  await db.collection('products').insertMany(productsData);
  console.log(`🎁 Đã tạo ${productsData.length} sản phẩm mẫu phong phú.`);

  console.log('🎉 Nạp dữ liệu Seeder thành công hoàn tất!');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Lỗi Seeder:', err);
  process.exit(1);
});
