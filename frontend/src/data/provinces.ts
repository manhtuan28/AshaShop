export interface ProvinceItem {
  id: string;
  name: string;
  full_name: string;
}

export interface DistrictItem {
  id: string;
  name: string;
  full_name: string;
}

export interface WardItem {
  id: string;
  name: string;
  full_name: string;
}

// In-memory cache to prevent redundant network requests
const cache = {
  provinces: null as ProvinceItem[] | null,
  districts: new Map<string, DistrictItem[]>(),
  wards: new Map<string, WardItem[]>(),
};

export const INITIAL_PROVINCES: ProvinceItem[] = [
  { id: '01', name: 'Hà Nội', full_name: 'Thành phố Hà Nội' },
  { id: '79', name: 'Hồ Chí Minh', full_name: 'Thành phố Hồ Chí Minh' },
  { id: '25', name: 'Phú Thọ', full_name: 'Tỉnh Phú Thọ' },
  { id: '48', name: 'Đà Nẵng', full_name: 'Thành phố Đà Nẵng' },
  { id: '31', name: 'Hải Phòng', full_name: 'Thành phố Hải Phòng' },
  { id: '92', name: 'Cần Thơ', full_name: 'Thành phố Cần Thơ' },
  { id: '89', name: 'An Giang', full_name: 'Tỉnh An Giang' },
  { id: '77', name: 'Bà Rịa - Vũng Tàu', full_name: 'Tỉnh Bà Rịa - Vũng Tàu' },
  { id: '24', name: 'Bắc Giang', full_name: 'Tỉnh Bắc Giang' },
  { id: '06', name: 'Bắc Kạn', full_name: 'Tỉnh Bắc Kạn' },
  { id: '95', name: 'Bạc Liêu', full_name: 'Tỉnh Bạc Liêu' },
  { id: '27', name: 'Bắc Ninh', full_name: 'Tỉnh Bắc Ninh' },
  { id: '83', name: 'Bến Tre', full_name: 'Tỉnh Bến Tre' },
  { id: '52', name: 'Bình Định', full_name: 'Tỉnh Bình Định' },
  { id: '74', name: 'Bình Dương', full_name: 'Tỉnh Bình Dương' },
  { id: '70', name: 'Bình Phước', full_name: 'Tỉnh Bình Phước' },
  { id: '60', name: 'Bình Thuận', full_name: 'Tỉnh Bình Thuận' },
  { id: '96', name: 'Cà Mau', full_name: 'Tỉnh Cà Mau' },
  { id: '04', name: 'Cao Bằng', full_name: 'Tỉnh Cao Bằng' },
  { id: '66', name: 'Đắk Lắk', full_name: 'Tỉnh Đắk Lắk' },
  { id: '67', name: 'Đắk Nông', full_name: 'Tỉnh Đắk Nông' },
  { id: '11', name: 'Điện Biên', full_name: 'Tỉnh Điện Biên' },
  { id: '75', name: 'Đồng Nai', full_name: 'Tỉnh Đồng Nai' },
  { id: '87', name: 'Đồng Tháp', full_name: 'Tỉnh Đồng Tháp' },
  { id: '64', name: 'Gia Lai', full_name: 'Tỉnh Gia Lai' },
  { id: '02', name: 'Hà Giang', full_name: 'Tỉnh Hà Giang' },
  { id: '35', name: 'Hà Nam', full_name: 'Tỉnh Hà Nam' },
  { id: '42', name: 'Hà Tĩnh', full_name: 'Tỉnh Hà Tĩnh' },
  { id: '30', name: 'Hải Dương', full_name: 'Tỉnh Hải Dương' },
  { id: '93', name: 'Hậu Giang', full_name: 'Tỉnh Hậu Giang' },
  { id: '17', name: 'Hòa Bình', full_name: 'Tỉnh Hòa Bình' },
  { id: '33', name: 'Hưng Yên', full_name: 'Tỉnh Hưng Yên' },
  { id: '56', name: 'Khánh Hòa', full_name: 'Tỉnh Khánh Hòa' },
  { id: '91', name: 'Kiên Giang', full_name: 'Tỉnh Kiên Giang' },
  { id: '62', name: 'Kon Tum', full_name: 'Tỉnh Kon Tum' },
  { id: '12', name: 'Lai Châu', full_name: 'Tỉnh Lai Châu' },
  { id: '68', name: 'Lâm Đồng', full_name: 'Tỉnh Lâm Đồng' },
  { id: '20', name: 'Lạng Sơn', full_name: 'Tỉnh Lạng Sơn' },
  { id: '10', name: 'Lào Cai', full_name: 'Tỉnh Lào Cai' },
  { id: '80', name: 'Long An', full_name: 'Tỉnh Long An' },
  { id: '36', name: 'Nam Định', full_name: 'Tỉnh Nam Định' },
  { id: '40', name: 'Nghệ An', full_name: 'Tỉnh Nghệ An' },
  { id: '37', name: 'Ninh Bình', full_name: 'Tỉnh Ninh Bình' },
  { id: '58', name: 'Ninh Thuận', full_name: 'Tỉnh Ninh Thuận' },
  { id: '54', name: 'Phú Yên', full_name: 'Tỉnh Phú Yên' },
  { id: '44', name: 'Quảng Bình', full_name: 'Tỉnh Quảng Bình' },
  { id: '49', name: 'Quảng Nam', full_name: 'Tỉnh Quảng Nam' },
  { id: '51', name: 'Quảng Ngãi', full_name: 'Tỉnh Quảng Ngãi' },
  { id: '22', name: 'Quảng Ninh', full_name: 'Tỉnh Quảng Ninh' },
  { id: '45', name: 'Quảng Trị', full_name: 'Tỉnh Quảng Trị' },
  { id: '94', name: 'Sóc Trăng', full_name: 'Tỉnh Sóc Trăng' },
  { id: '14', name: 'Sơn La', full_name: 'Tỉnh Sơn La' },
  { id: '72', name: 'Tây Ninh', full_name: 'Tỉnh Tây Ninh' },
  { id: '34', name: 'Thái Bình', full_name: 'Tỉnh Thái Bình' },
  { id: '19', name: 'Thái Nguyên', full_name: 'Tỉnh Thái Nguyên' },
  { id: '38', name: 'Thanh Hóa', full_name: 'Tỉnh Thanh Hóa' },
  { id: '46', name: 'Thừa Thiên Huế', full_name: 'Tỉnh Thừa Thiên Huế' },
  { id: '82', name: 'Tiền Giang', full_name: 'Tỉnh Tiền Giang' },
  { id: '84', name: 'Trà Vinh', full_name: 'Tỉnh Trà Vinh' },
  { id: '08', name: 'Tuyên Quang', full_name: 'Tỉnh Tuyên Quang' },
  { id: '86', name: 'Vĩnh Long', full_name: 'Tỉnh Vĩnh Long' },
  { id: '26', name: 'Vĩnh Phúc', full_name: 'Tỉnh Vĩnh Phúc' },
  { id: '15', name: 'Yên Bái', full_name: 'Tỉnh Yên Bái' },
];

/**
 * Lấy danh sách 63 Tỉnh/Thành phố Việt Nam
 */
export async function getVietnamProvinces(): Promise<ProvinceItem[]> {
  if (cache.provinces) return cache.provinces;
  try {
    const response = await fetch('https://esgoo.net/api-tinhthanh/1/0.htm');
    if (response.ok) {
      const result = await response.json();
      if (result.error === 0 && Array.isArray(result.data)) {
        cache.provinces = result.data;
        return result.data;
      }
    }
  } catch (error) {
    console.warn('Sử dụng bộ danh sách tỉnh thành dự phòng');
  }
  return INITIAL_PROVINCES;
}

/**
 * Lấy danh sách Quận/Huyện theo Tỉnh/Thành phố
 */
export async function getVietnamDistricts(provinceId: string): Promise<DistrictItem[]> {
  if (!provinceId) return [];
  if (cache.districts.has(provinceId)) {
    return cache.districts.get(provinceId)!;
  }
  try {
    const response = await fetch(`https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`);
    if (response.ok) {
      const result = await response.json();
      if (result.error === 0 && Array.isArray(result.data)) {
        cache.districts.set(provinceId, result.data);
        return result.data;
      }
    }
  } catch (error) {
    console.warn(`Lỗi lấy danh sách quận huyện cho tỉnh #${provinceId}`);
  }
  return [];
}

/**
 * Lấy danh sách Phường/Xã theo Quận/Huyện
 */
export async function getVietnamWards(districtId: string): Promise<WardItem[]> {
  if (!districtId) return [];
  if (cache.wards.has(districtId)) {
    return cache.wards.get(districtId)!;
  }
  try {
    const response = await fetch(`https://esgoo.net/api-tinhthanh/3/${districtId}.htm`);
    if (response.ok) {
      const result = await response.json();
      if (result.error === 0 && Array.isArray(result.data)) {
        cache.wards.set(districtId, result.data);
        return result.data;
      }
    }
  } catch (error) {
    console.warn(`Lỗi lấy danh sách phường xã cho quận huyện #${districtId}`);
  }
  return [];
}
