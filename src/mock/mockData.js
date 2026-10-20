export const roles = [
  { role_id: 1, role_name: 'ADMIN', description: 'Quan tri toan bo he thong' },
  { role_id: 2, role_name: 'STAFF', description: 'Van hanh bep, ban va thu ngan' },
  { role_id: 3, role_name: 'CUSTOMER', description: 'Khach hang dat mon tai ban' },
]

export const users = [
  { user_id: 1, role_id: 1, role_name: 'ADMIN', username: 'admin', password: 'admin123', password_hash: 'hashed', full_name: 'Nguyen Minh An', phone: '0901000001', is_active: true, created_at: '2026-09-01T08:00:00' },
  { user_id: 2, role_id: 2, role_name: 'STAFF', username: 'staff01', password: 'staff123', password_hash: 'hashed', full_name: 'Tran Bao Chau', phone: '0901000002', is_active: true, created_at: '2026-09-04T08:30:00' },
  { user_id: 3, role_id: 2, role_name: 'STAFF', username: 'staff.floor', password: 'floor123', password_hash: 'hashed', full_name: 'Le Duc Long', phone: '0901000003', is_active: true, created_at: '2026-09-05T09:10:00' },
  { user_id: 4, role_id: 3, role_name: 'CUSTOMER', password: 'demo123', password_hash: 'hashed', username: 'customer.demo', full_name: 'Pham Ha My', phone: '0901000004', is_active: true, created_at: '2026-09-06T10:15:00' },
]

export const nodes = [
  { qr_id: 'QR-START', node_name: 'Kitchen Dock', node_type: 'START', pos_x: 1, pos_y: 1 },
  { qr_id: 'QR-A1', node_name: 'North Junction', node_type: 'INTERSECTION', pos_x: 4, pos_y: 1 },
  { qr_id: 'QR-A2', node_name: 'Center Junction', node_type: 'INTERSECTION', pos_x: 7, pos_y: 1 },
  { qr_id: 'QR-B1', node_name: 'Table Lane West', node_type: 'INTERSECTION', pos_x: 4, pos_y: 4 },
  { qr_id: 'QR-B2', node_name: 'Table Lane East', node_type: 'INTERSECTION', pos_x: 7, pos_y: 4 },
  { qr_id: 'QR-T01', node_name: 'Table 01', node_type: 'TABLE', pos_x: 2, pos_y: 6 },
  { qr_id: 'QR-T02', node_name: 'Table 02', node_type: 'TABLE', pos_x: 5, pos_y: 6 },
  { qr_id: 'QR-T03', node_name: 'Table 03', node_type: 'TABLE', pos_x: 8, pos_y: 6 },
]

export const routings = [
  { id: 1, qr_id: 'QR-START', target_table_id: 1, action: 'GO_STRAIGHT', description: 'Roi bep ra truc bac' },
  { id: 2, qr_id: 'QR-A1', target_table_id: 1, action: 'TURN_LEFT', description: 'Re trai vao ban 01' },
  { id: 3, qr_id: 'QR-A2', target_table_id: 2, action: 'TURN_RIGHT', description: 'Re phai vao ban 02' },
  { id: 4, qr_id: 'QR-B2', target_table_id: 3, action: 'GO_STRAIGHT', description: 'Tiep tuc toi ban 03' },
]

export const tables = [
  { table_id: 1, table_number: 'T01', qr_id: 'QR-T01', status: 'OCCUPIED' },
  { table_id: 2, table_number: 'T02', qr_id: 'QR-T02', status: 'EMPTY' },
  { table_id: 3, table_number: 'T03', qr_id: 'QR-T03', status: 'RESERVED' },
  { table_id: 4, table_number: 'T04', qr_id: 'QR-T04', status: 'CLEANING' },
  { table_id: 5, table_number: 'T05', qr_id: 'QR-T05', status: 'EMPTY' },
  { table_id: 6, table_number: 'T06', qr_id: 'QR-T06', status: 'OCCUPIED' },
  { table_id: 7, table_number: 'T07', qr_id: 'QR-T07', status: 'EMPTY' },
  { table_id: 8, table_number: 'T08', qr_id: 'QR-T08', status: 'RESERVED' },
]

export const dishes = [
  { dish_id: 1, dish_name: 'Com tam suon bi cha', price: 59000, image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600', ai_label_id: 'food_001', is_available: true },
  { dish_id: 2, dish_name: 'Pho bo tai nam', price: 65000, image_url: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600', ai_label_id: 'food_002', is_available: true },
  { dish_id: 3, dish_name: 'Ga ran mat ong', price: 89000, image_url: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600', ai_label_id: 'food_003', is_available: true },
  { dish_id: 4, dish_name: 'Mi xao bo rau cai', price: 72000, image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600', ai_label_id: 'food_004', is_available: false },
  { dish_id: 5, dish_name: 'Goi cuon tom thit', price: 45000, image_url: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=600', ai_label_id: 'food_005', is_available: true },
  { dish_id: 6, dish_name: 'Ca phe sua da', price: 32000, image_url: 'https://images.unsplash.com/photo-1511081692775-05d0f180a065?w=600', ai_label_id: 'drink_001', is_available: true },
  { dish_id: 7, dish_name: 'Tra dao cam sa', price: 38000, image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600', ai_label_id: 'drink_002', is_available: true },
  { dish_id: 8, dish_name: 'Banh flan caramel', price: 29000, image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600', ai_label_id: 'dessert_001', is_available: true },
  { dish_id: 9, dish_name: 'Lau thai hai san', price: 249000, image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600', ai_label_id: 'food_006', is_available: true },
  { dish_id: 10, dish_name: 'Rau cau dua non', price: 25000, image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600', ai_label_id: 'dessert_002', is_available: true },
]

export const orders = [
  { order_id: 1042, table_id: 1, created_by_user_id: 3, total_amount: 246000, order_status: 'DELIVERING', created_at: '2026-09-24T14:23:00' },
  { order_id: 1041, table_id: 6, created_by_user_id: 2, total_amount: 154000, order_status: 'PROCESSING', created_at: '2026-09-24T14:21:00' },
  { order_id: 1040, table_id: 3, created_by_user_id: 3, total_amount: 92000, order_status: 'PENDING', created_at: '2026-09-24T14:18:00' },
  { order_id: 1039, table_id: 2, created_by_user_id: 2, total_amount: 318000, order_status: 'COMPLETED', created_at: '2026-09-24T13:56:00' },
]

export const order_details = [
  { detail_id: 1, order_id: 1042, dish_id: 9, quantity: 1, served_status: 'READY' },
  { detail_id: 2, order_id: 1042, dish_id: 6, quantity: 1, served_status: 'READY' },
  { detail_id: 3, order_id: 1041, dish_id: 1, quantity: 2, served_status: 'COOKING' },
  { detail_id: 4, order_id: 1041, dish_id: 5, quantity: 1, served_status: 'PENDING' },
  { detail_id: 5, order_id: 1040, dish_id: 2, quantity: 1, served_status: 'PENDING' },
  { detail_id: 6, order_id: 1040, dish_id: 7, quantity: 1, served_status: 'PENDING' },
]

export const robot_status = {
  id: 1, current_qr_id: 'QR-B2', current_order_id: 1042, robot_state: 'DELIVERING', obstacle_detected: true, battery_percent: 68, updated_at: '2026-09-24T14:25:32',
}

export const robot_travel_logs = [
  { log_id: 1, order_id: 1042, qr_id: 'QR-START', action_taken: 'GO_STRAIGHT', step_order: 1, created_at: '2026-09-24T14:23:12' },
  { log_id: 2, order_id: 1042, qr_id: 'QR-A1', action_taken: 'TURN_RIGHT', step_order: 2, created_at: '2026-09-24T14:23:30' },
  { log_id: 3, order_id: 1042, qr_id: 'QR-B2', action_taken: 'GO_STRAIGHT', step_order: 3, created_at: '2026-09-24T14:24:16' },
]

export const inventory = [
  { id: 1, name: 'Suon heo', unit: 'kg', stock: 8.4, minimum: 10, cost: 125000 },
  { id: 2, name: 'Banh pho', unit: 'kg', stock: 24, minimum: 8, cost: 42000 },
  { id: 3, name: 'Tom su', unit: 'kg', stock: 4.2, minimum: 5, cost: 215000 },
  { id: 4, name: 'Ca phe hat', unit: 'kg', stock: 12, minimum: 4, cost: 280000 },
]

export const formatVND = (amount) => `${new Intl.NumberFormat('vi-VN').format(amount)}đ`
