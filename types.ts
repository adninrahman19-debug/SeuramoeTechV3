
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  STORE_OWNER = 'STORE_OWNER',
  STAFF_ADMIN = 'STAFF_ADMIN',
  TECHNICIAN = 'TECHNICIAN',
  MARKETING = 'MARKETING',
  CUSTOMER = 'CUSTOMER'
}

export enum SubscriptionTier {
  NONE = 'NONE',
  BASIC = 'BASIC',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE'
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  storeId?: string;
  subscriptionTier?: SubscriptionTier;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: 'Laptop' | 'Accessory' | 'Part';
  price: number;
  stock: number;
  image: string;
  storeId: string;
}

export interface ServiceTicket {
  id: string;
  customerId: string;
  customerName: string;
  deviceModel: string;
  issueDescription: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Ready for Pickup';
  technicianId?: string;
  createdAt: string;
}

export interface Store {
  id: string;
  name: string;
  ownerId: string;
  location: string;
  subscriptionTier: SubscriptionTier;
}

export interface NavItem {
  label: string;
  icon: string;
  role: UserRole[];
  path: string;
}
