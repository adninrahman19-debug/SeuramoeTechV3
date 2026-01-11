
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  STORE_OWNER = 'STORE_OWNER',
  STAFF_ADMIN = 'STAFF_ADMIN',
  TECHNICIAN = 'TECHNICIAN',
  MARKETING = 'MARKETING',
  CUSTOMER = 'CUSTOMER'
}

export enum SubscriptionTier {
  BASIC = 'BASIC',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
  CUSTOM = 'CUSTOM'
}

export enum SubscriptionStatus {
  TRIAL = 'TRIAL',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  CANCELED = 'CANCELED',
  EXPIRED = 'EXPIRED'
}

export enum PaymentStatus {
  SUCCESS = 'SUCCESS',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  DISPUTED = 'DISPUTED'
}

export enum TransactionType {
  ORDER = 'ORDER',
  SUBSCRIPTION = 'SUBSCRIPTION',
  SERVICE_FEE = 'SERVICE_FEE',
  REFUND = 'REFUND'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUND_REQUESTED = 'REFUND_REQUESTED'
}

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  FLAGGED = 'FLAGGED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  REMOVED = 'REMOVED',
  INACTIVE = 'INACTIVE'
}

export enum SupportStatus {
  OPEN = 'OPEN',
  CHECKING = 'CHECKING',
  REPAIRING = 'REPAIRING',
  IN_PROGRESS = 'IN_PROGRESS',
  ESCALATED = 'ESCALATED',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export enum WarrantyStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SUSPICIOUS = 'SUSPICIOUS',
  IN_REPAIR = 'IN_REPAIR',
  REPLACED = 'REPLACED'
}

export interface Address {
  id: string;
  label: string; // 'Rumah', 'Kantor'
  receiverName: string;
  phone: string;
  fullAddress: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'CARD' | 'EWALLET' | 'BANK';
  provider: string;
  accountNumber: string;
  expiryDate?: string;
  isDefault: boolean;
}

export interface LoginSession {
  id: string;
  device: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface StoreConfig {
  notifications: {
    email: boolean;
    whatsapp: boolean;
    inApp: boolean;
  };
  payments: {
    manualTransfer: boolean;
    paymentGateway: boolean;
    cod: boolean;
  };
  logistics: {
    couriers: string[]; // ['JNE', 'J&T', 'Sicepat']
  };
  financials: {
    taxRate: number;
    serviceFee: number;
  };
  hours: Record<string, { open: string; close: string; isClosed: boolean }>;
  socials: {
    instagram: string;
    facebook: string;
    whatsapp: string;
  };
}

export interface WarrantyRegistration {
  id: string;
  storeId: string;
  productId: string;
  productName: string;
  customerName: string;
  customerPhone: string;
  serialNumber: string;
  purchaseDate: string;
  expiryDate: string;
  isActive: boolean;
}

export interface Review {
  id: string;
  storeId: string;
  productId?: string;
  productName?: string;
  customerName: string;
  rating: number;
  comment: string;
  reply?: string;
  status: 'active' | 'hidden';
  createdAt: string;
}

export enum AnnouncementTarget {
  GLOBAL = 'GLOBAL',
  ROLE = 'ROLE',
  STORE = 'STORE'
}

export enum AuditCategory {
  AUTH = 'AUTH',
  FINANCIAL = 'FINANCIAL',
  PERMISSION = 'PERMISSION',
  SYSTEM = 'SYSTEM',
  SECURITY = 'SECURITY'
}

export enum PromoType {
  PERCENTAGE = 'PERCENTAGE',
  NOMINAL = 'NOMINAL',
  FLASH_SALE = 'FLASH_SALE'
}

export enum PromoStatus {
  ACTIVE = 'ACTIVE',
  SCHEDULED = 'SCHEDULED',
  EXPIRED = 'EXPIRED',
  PAUSED = 'PAUSED'
}

export interface Promo {
  id: string;
  storeId: string;
  title: string;
  type: PromoType;
  value: number;
  startDate: string;
  endDate: string;
  status: PromoStatus;
  usageLimit?: number;
  currentUsage: number;
  applicableProducts: string[]; // IDs
}

export interface Coupon {
  id: string;
  storeId: string;
  code: string;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
  minPurchase: number;
  maxUsage: number;
  usedCount: number;
  expiryDate: string;
}

export interface StoreCampaign {
  id: string;
  storeId: string;
  name: string;
  bannerUrl: string;
  ctr: number; // Click-through rate
  conversions: number;
  revenueGenerated: number;
  isActive: boolean;
}

export interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  status: 'active' | 'revoked';
  createdAt: string;
  lastUsed?: string;
}

export interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive';
  secret: string;
}

export interface BackgroundJob {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'failed' | 'queued';
  progress: number;
  startedAt: string;
  duration?: string;
}

export interface SystemMetric {
  label: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  history: number[];
}

export interface PlatformConfig {
  branding: {
    name: string;
    tagline: string;
    primaryColor: string;
    logoUrl?: string;
  };
  domains: {
    enableSubdomains: boolean;
    mainDomain: string;
    reservedSubdomains: string[];
  };
  features: {
    enableRepairModule: boolean;
    enableECommerce: boolean;
    enableWarrantySystem: boolean;
    enableMultiCurrency: boolean;
  };
  maintenance: {
    isEnabled: boolean;
    message: string;
    allowedIps: string[];
  };
}

export interface IntegrationConfig {
  id: string;
  provider: string;
  category: 'payment' | 'email' | 'sms' | 'analytics';
  status: 'active' | 'inactive' | 'error';
  apiKey?: string;
  webhookUrl?: string;
  meta?: Record<string, any>;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  category: AuditCategory;
  details: string;
  ip: string;
  severity: 'INFO' | 'WARN' | 'CRITICAL';
}

export interface SecurityPolicy {
  mfaRequired: boolean;
  minPasswordLength: number;
  sessionTimeoutMinutes: number;
  maxLoginAttempts: number;
  ipFilteringEnabled: boolean;
}

export interface IpRule {
  id: string;
  ip: string;
  type: 'WHITELIST' | 'BLACKLIST';
  reason: string;
  addedBy: string;
  createdAt: string;
}

export interface ActiveSession {
  id: string;
  userId: string;
  userName: string;
  device: string;
  ip: string;
  location: string;
  lastActive: string;
}

export interface PerformanceRank {
  id: string;
  name: string;
  location?: string;
  score: number;
  totalSales: number;
  ticketResolutionRate: number;
  trend: 'up' | 'down' | 'stable';
}

export interface StaffMetric {
  id: string;
  name: string;
  storeName: string;
  ticketsResolved: number;
  avgResolutionTime: string;
  satisfaction: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetType: AnnouncementTarget;
  targetValue?: string;
  priority: 'NORMAL' | 'HIGH' | 'CRITICAL';
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface NotificationChannel {
  id: 'email' | 'whatsapp' | 'push' | 'inapp';
  name: string;
  isEnabled: boolean;
  provider: string;
  status: 'operational' | 'degraded' | 'offline';
}

export interface SupportTicket {
  id: string;
  storeId: string;
  storeName: string;
  customerName: string;
  customerPhone?: string;
  deviceModel: string;
  issueDescription: string;
  status: SupportStatus;
  technicianId?: string;
  technicianName?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  createdAt: string;
  slaDeadline: string;
  estimatedCost?: number;
  actualCost?: number;
  customerEmail?: string;
  // Documentation Fields
  technicalNotes?: string;
  beforeImage?: string;
  afterImage?: string;
}

export interface WarrantyClaim {
  id: string;
  ticketId: string;
  storeName: string;
  customerName: string;
  imei: string;
  claimReason: string;
  status: WarrantyStatus;
  abuseRiskScore: number;
  createdAt: string;
  // Technical Inspection Fields
  technicalAnalysis?: string;
  isManufacturerFault?: boolean;
  isHumanErrorDetected?: boolean;
  inspectionNotes?: string;
  recommendation?: string;
  inspectedAt?: string;
  inspectedBy?: string;
}

export interface CustomerComplaint {
  id: string;
  storeId: string;
  storeName: string;
  customerName: string;
  subject: string;
  message: string;
  severity: 'CRITICAL' | 'MAJOR' | 'MINOR';
  isResolved: boolean;
  status: SupportStatus;
  response?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  storeId: string;
  storeName: string;
  name: string;
  price: number;
  promoPrice?: number;
  category: string;
  status: ProductStatus;
  thumbnail: string;
  images: string[];
  description: string;
  isSponsored: boolean;
  sku: string;
  barcode: string;
  stock: number;
  lowStockThreshold: number;
}

export interface StockHistory {
  id: string;
  productId: string;
  productName: string;
  type: 'IN' | 'OUT' | 'ADJUST';
  quantity: number;
  reason: string;
  timestamp: string;
  user: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface Order {
  id: string;
  storeId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  shippingResi?: string;
  createdAt: string;
}

export interface GlobalCampaign {
  id: string;
  title: string;
  discountRate: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  bannerImage?: string;
}

export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
  position: 'top' | 'middle' | 'sidebar';
  isActive: boolean;
}

export interface Transaction {
  id: string;
  storeId?: string;
  storeName?: string;
  userId: string;
  userName: string;
  amount: number;
  platformFee: number;
  netAmount: number;
  type: TransactionType;
  status: PaymentStatus;
  paymentMethod: string;
  timestamp: string;
  description: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'system' | 'store' | 'billing' | 'customer';
}

export interface RoleConfig {
  role: UserRole;
  permissions: string[];
  color: string;
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  storeId?: string;
  subscriptionTier?: SubscriptionTier;
  isSubscriptionActive?: boolean;
  subscriptionStatus?: SubscriptionStatus;
  email: string;
  phone?: string;
  status: 'active' | 'suspended' | 'pending' | 'banned';
  lastLogin?: string;
  lastIp?: string;
  device?: string;
  accountManager?: string;
  performanceScore?: number;
  createdAt?: string;
  subscriptionExpiry?: string;
  autoRenew?: boolean;
  isVerified?: boolean;
  addresses?: Address[];
  paymentMethods?: PaymentMethod[];
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: SubscriptionTier;
  priceMonthly: number;
  priceYearly: number;
  limits: {
    stores: number;
    staff: number;
    products: number;
    tickets: number;
  };
  features: {
    branding: boolean;
    advancedAnalytics: boolean;
    reportingDepth: 'daily' | 'weekly' | 'monthly' | 'yearly';
  };
  description: string;
}

export interface RevenueConfig {
  platformCommission: number; 
  taxRate: number; 
  revenueSplit: {
    platform: number;
    referral?: number;
  };
}

export interface Invoice {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  status: 'paid' | 'unpaid' | 'overdue';
  date: string;
  planName: string;
}

export interface Store {
  id: string;
  ownerId: string;
  name: string;
  location: string;
  contact: string;
  status: 'active' | 'suspended';
  productLimit: number;
  staffLimit: number;
  createdAt: string;
  totalSales?: number;
  violationCount?: number;
  isFeatured?: boolean;
  config?: StoreConfig;
}

export interface NavItem {
  label: string;
  path: string;
  icon: any;
  roles: UserRole[];
}
