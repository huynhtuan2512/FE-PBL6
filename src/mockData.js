export const tables = [
  { table_id: 'TABLE_01', table_number: 1, status: 'OCCUPIED' },
  { table_id: 'TABLE_02', table_number: 2, status: 'OCCUPIED' },
  { table_id: 'TABLE_05', table_number: 5, status: 'OCCUPIED' },
];

export const dishes = [
  {
    dish_id: 1,
    dish_name: 'Cơm Chiên Hải Sản',
    price: 65000,
    image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=85',
    category: 'Cơm',
    ai_label_id: 'dish_fried_rice',
    is_available: true,
  },
  {
    dish_id: 2,
    dish_name: 'Phở Bò Tái Nạm',
    price: 55000,
    image_url: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=900&q=85',
    category: 'Bún & Phở',
    ai_label_id: 'dish_beef_pho',
    is_available: true,
  },
  {
    dish_id: 3,
    dish_name: 'Bún Thịt Nướng',
    price: 59000,
    image_url: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=900&q=85',
    category: 'Bún & Phở',
    ai_label_id: 'dish_grilled_pork_noodle',
    is_available: true,
  },
  {
    dish_id: 4,
    dish_name: 'Gỏi Cuốn Tôm Thịt',
    price: 39000,
    image_url: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85',
    category: 'Món nhẹ',
    ai_label_id: 'dish_fresh_spring_roll',
    is_available: true,
  },
  {
    dish_id: 5,
    dish_name: 'Cơm Gà Sốt Tiêu',
    price: 62000,
    image_url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=85',
    category: 'Cơm',
    ai_label_id: 'dish_pepper_chicken_rice',
    is_available: false,
  },
  {
    dish_id: 6,
    dish_name: 'Trà Đào Cam Sả',
    price: 35000,
    image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=85',
    category: 'Đồ uống',
    ai_label_id: 'drink_peach_tea',
    is_available: true,
  },
  {
    dish_id: 7,
    dish_name: 'Khoai Tây Chiên',
    price: 29000,
    image_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=85',
    category: 'Món nhẹ',
    ai_label_id: 'dish_french_fries',
    is_available: true,
  },
  {
    dish_id: 8,
    dish_name: 'Nước Ép Dứa Bạc Hà',
    price: 42000,
    image_url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=900&q=85',
    category: 'Đồ uống',
    ai_label_id: 'drink_pineapple_mint',
    is_available: true,
  },
];

export const categories = ['Tất cả', 'Cơm', 'Bún & Phở', 'Món nhẹ', 'Đồ uống'];

export const getTableFromUrl = () => {
  const tableId = new URLSearchParams(window.location.search).get('table_id') || 'TABLE_01';
  return tables.find((table) => table.table_id === tableId) || tables[0];
};

export const formatVnd = (amount) => `${new Intl.NumberFormat('vi-VN').format(amount)}đ`;