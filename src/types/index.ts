// ============================================================
// ENUMS (mirrors com.agroo.agroo.model.enums.*)
// ============================================================

export type Role = 'GUEST' | 'REGISTERED_USER' | 'ADMIN';

export type ActivityType =
  | 'USER_REGISTERED'
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'USER_UPDATED'
  | 'USER_DELETED'
  | 'PRODUCT_CREATED'
  | 'PRODUCT_UPDATED'
  | 'PRODUCT_DELETED'
  | 'PRODUCT_VERIFIED'
  | 'POST_CREATED'
  | 'POST_DELETED'
  | 'COMMENT_CREATED'
  | 'COMMENT_DELETED'
  | 'GROUP_CREATED'
  | 'GROUP_DELETED'
  | 'GROUP_MEMBER_ADDED'
  | 'GROUP_MEMBER_REMOVED'
  | 'PRICE_UPDATED'
  | 'ALERT_CREATED'
  | 'ALERT_DELETED'
  | 'ADMIN_ACTION';

export type AlertType = 'WEATHER' | 'PEST' | 'DISEASE' | 'SYSTEM' | 'PROMOTIONAL';

export type LikeType = 'LIKE' | 'LOVE' | 'HAHA' | 'WOW' | 'SAD' | 'ANGRY';

export type MachineStatus = 'AVAILABLE' | 'RENTED' | 'UNDER_MAINTENANCE' | 'NOT_AVAILABLE';

export type MachineType =
  | 'TRACTOR'
  | 'HARVESTER'
  | 'TILLER'
  | 'PLOW'
  | 'SPRAYER'
  | 'COMBINE'
  | 'CULTIVATOR'
  | 'SEEDER'
  | 'OTHER';

export type MemberRole = 'ADMIN' | 'MEMBER';

export type MessageType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'FILE' | 'SYSTEM';

export type OtpType = 'REGISTRATION' | 'FORGOT_PASSWORD' | 'CHANGE_PASSWORD';

export type ProductCategory =
  | 'FRESH_PRODUCE'
  | 'FERTILIZERS'
  | 'LIVESTOCK'
  | 'MACHINERY_RENTALS'
  | 'DAIRY_PRODUCTS';

export type ProductType =
  | 'VEGETABLES'
  | 'FRUITS'
  | 'SEEDLINGS'
  | 'CATTLE'
  | 'CHICKEN'
  | 'GOAT'
  | 'PIG'
  | 'BUFFALO'
  | 'OTHER_LIVESTOCK'
  | 'MILK'
  | 'CURD'
  | 'YOGURT'
  | 'CHEESE'
  | 'ORGANIC_FERTILIZER'
  | 'CHEMICAL_FERTILIZER'
  | 'COMPOST'
  | 'TRACTOR'
  | 'HARVESTER'
  | 'TILLER'
  | 'SPRAYER'
  | 'OTHER_MACHINERY';

export type SaleType = 'WHOLESALE' | 'RETAIL';

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'FRESH_PRODUCE',
  'FERTILIZERS',
  'LIVESTOCK',
  'MACHINERY_RENTALS',
  'DAIRY_PRODUCTS',
];

export const PRODUCT_TYPES: ProductType[] = [
  'VEGETABLES', 'FRUITS', 'SEEDLINGS',
  'CATTLE', 'CHICKEN', 'GOAT', 'PIG', 'BUFFALO', 'OTHER_LIVESTOCK',
  'MILK', 'CURD', 'YOGURT', 'CHEESE',
  'ORGANIC_FERTILIZER', 'CHEMICAL_FERTILIZER', 'COMPOST',
  'TRACTOR', 'HARVESTER', 'TILLER', 'SPRAYER', 'OTHER_MACHINERY',
];

export const SALE_TYPES: SaleType[] = ['WHOLESALE', 'RETAIL'];

export const MACHINE_TYPES: MachineType[] = [
  'TRACTOR', 'HARVESTER', 'TILLER', 'PLOW', 'SPRAYER', 'COMBINE', 'CULTIVATOR', 'SEEDER', 'OTHER',
];

export const MACHINE_STATUSES: MachineStatus[] = [
  'AVAILABLE', 'RENTED', 'UNDER_MAINTENANCE', 'NOT_AVAILABLE',
];

export const ALERT_TYPES: AlertType[] = ['WEATHER', 'PEST', 'DISEASE', 'SYSTEM', 'PROMOTIONAL'];

export const LIKE_TYPES: LikeType[] = ['LIKE', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY'];

// ============================================================
// GENERIC / SPRING PAGE WRAPPER
// ============================================================

export interface SortInfo {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: SortInfo;
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: SortInfo;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

// ============================================================
// AUTH DTOs
// ============================================================

export interface AuthRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  phoneNumber?: string;
  address?: string;
  district?: string;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface OtpVerificationRequest {
  email: string;
  otpCode: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otpCode: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string | null;
  refreshToken: string | null;
  username: string;
  email: string;
  role: Role;
  isVerified: boolean;
  message: string;
  success: boolean;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

// ============================================================
// USER
// ============================================================

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  fullName: string | null;
  phoneNumber: string | null;
  address: string | null;
  district: string | null;
  role: Role;
  isVerified: boolean;
  profileImageUrl: string | null;
  bio: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  phoneNumber?: string;
  address?: string;
  district?: string;
  bio?: string;
}

// Full admin-facing User entity (as returned by /api/admin/users*)
export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string | null;
  phoneNumber: string | null;
  address: string | null;
  district: string | null;
  profileImageUrl: string | null;
  bio: string | null;
  role: Role;
  isActive: boolean;
  isVerified: boolean;
  isLocked: boolean;
  failedAttempts: number;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// PRODUCT
// ============================================================

export interface ProductRequest {
  name: string;
  description?: string;
  price: number;
  quantity?: number;
  unit?: string;
  category: ProductCategory;
  productType: ProductType;
  saleType: SaleType;
  location: string;
  district?: string;
  address?: string;
  isAvailable?: boolean;
  isOrganic?: boolean;
  contactPhone?: string;
  contactWhatsapp?: string;
  harvestDate?: string;
  expiryDate?: string;
}

export interface ProductImageInfo {
  id: number;
  imageUrl: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface ProductUserInfo {
  id: number;
  username: string;
  fullName: string | null;
  phoneNumber: string | null;
  profileImageUrl: string | null;
}

export interface ProductResponse {
  id: number;
  name: string;
  description: string | null;
  price: number;
  quantity: number | null;
  unit: string | null;
  category: ProductCategory;
  productType: ProductType;
  saleType: SaleType;
  location: string;
  district: string | null;
  address: string | null;
  isAvailable: boolean;
  isOrganic: boolean;
  isVerified: boolean;
  contactPhone: string | null;
  contactWhatsapp: string | null;
  harvestDate: string | null;
  expiryDate: string | null;
  viewCount: number;
  farmer: ProductUserInfo;
  images: ProductImageInfo[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// MACHINE RENTAL
// ============================================================

export interface MachineRentalRequest {
  name: string;
  description?: string;
  machineType: MachineType;
  pricePerDay: number;
  pricePerHour?: number;
  pricePerAcre?: number;
  location: string;
  district?: string;
  contactPhone: string;
  contactWhatsapp?: string;
  status?: MachineStatus;
  yearOfManufacture?: number;
  brand?: string;
  model?: string;
  fuelType?: string;
  horsePower?: number;
  features?: string[];
}

export interface MachineImageInfo {
  id: number;
  imageUrl: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface MachineOwnerInfo {
  id: number;
  username: string;
  fullName: string | null;
  phoneNumber: string | null;
  profileImageUrl: string | null;
}

export interface MachineRentalResponse {
  id: number;
  name: string;
  description: string | null;
  machineType: MachineType;
  pricePerDay: number;
  pricePerHour: number | null;
  pricePerAcre: number | null;
  location: string;
  district: string | null;
  contactPhone: string;
  contactWhatsapp: string | null;
  isAvailable: boolean;
  status: MachineStatus;
  isVerified: boolean;
  viewCount: number;
  yearOfManufacture: number | null;
  brand: string | null;
  model: string | null;
  fuelType: string | null;
  horsePower: number | null;
  features: string[];
  owner: MachineOwnerInfo;
  images: MachineImageInfo[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// POST / COMMENT / LIKE
// ============================================================

export interface PostRequest {
  content: string;
  isPublic?: boolean;
}

export interface PostUserInfo {
  id: number;
  username: string;
  fullName: string | null;
  profileImageUrl: string | null;
}

export interface CommentUserInfo {
  id: number;
  username: string;
  fullName: string | null;
  profileImageUrl: string | null;
}

export interface CommentRequest {
  content: string;
  parentCommentId?: number;
}

export interface CommentResponse {
  id: number;
  content: string;
  user: CommentUserInfo;
  parentCommentId: number | null;
  replies: CommentResponse[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface PostResponse {
  id: number;
  content: string;
  imageUrl: string | null;
  videoUrl: string | null;
  mediaUrl: string | null;
  mediaType: 'IMAGE' | 'VIDEO' | 'NONE' | string;
  isPublic: boolean;
  viewCount: number;
  shareCount: number;
  commentCount: number;
  likeCount: number;
  userLiked: boolean;
  user: PostUserInfo;
  comments: CommentResponse[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface LikeRequest {
  likeType?: LikeType;
}

export interface LikeUserInfo {
  id: number;
  username: string;
  fullName: string | null;
}

export interface LikeResponse {
  id: number;
  likeType: LikeType;
  user: LikeUserInfo;
  createdAt: string;
}

// ============================================================
// CHAT GROUPS / MESSAGES
// ============================================================

export interface GroupRequest {
  name: string;
  description?: string;
  memberIds?: number[];
}

export interface GroupMemberRequest {
  userId?: number;
  userIds?: number[];
}

export interface ChatGroupUserInfo {
  id: number;
  username: string;
  fullName: string | null;
  profileImageUrl: string | null;
}

export interface GroupMemberResponse {
  id: number;
  role: MemberRole;
  isActive: boolean;
  user: {
    id: number;
    username: string;
    fullName: string | null;
    email: string;
    profileImageUrl: string | null;
    phoneNumber: string | null;
  };
  joinedAt: string;
}

export interface ChatMessageRequest {
  content: string;
  messageType?: MessageType;
  mediaUrl?: string;
}

export interface ChatMessageSenderInfo {
  id: number;
  username: string;
  fullName: string | null;
  profileImageUrl: string | null;
}

export interface ChatMessageResponse {
  id: number;
  content: string;
  messageType: MessageType;
  mediaUrl: string | null;
  isRead: boolean;
  sender: ChatMessageSenderInfo;
  createdAt: string;
}

export interface ChatGroupResponse {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  memberCount: number;
  createdBy: ChatGroupUserInfo;
  members: GroupMemberResponse[] | null;
  latestMessage: ChatMessageResponse | null;
  unreadCount: number;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// PRICE / ALERT (ADMIN)
// ============================================================

export interface PriceRequest {
  productName: string;
  location: string;
  price: number;
  unit?: string;
  priceDate?: string;
}

export interface PriceUserInfo {
  id: number;
  username: string;
  fullName: string | null;
}

export interface PriceResponse {
  id: number;
  productName: string;
  location: string;
  price: number;
  unit: string | null;
  priceDate: string | null;
  updatedBy: PriceUserInfo;
  createdAt: string;
  updatedAt: string;
}

export interface AlertRequest {
  title: string;
  content: string;
  alertType?: AlertType;
  location?: string;
  isUrgent?: boolean;
  expiresAt?: string;
}

export interface AlertUserInfo {
  id: number;
  username: string;
  fullName: string | null;
}

export interface AlertResponse {
  id: number;
  title: string;
  content: string;
  alertType: AlertType;
  location: string | null;
  isActive: boolean;
  isUrgent: boolean;
  createdBy: AlertUserInfo;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// ADMIN DASHBOARD / LOGS
// ============================================================

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalProducts: number;
  totalPosts: number;
  totalGroups: number;
  totalComments: number;
  totalLikes: number;
  totalAlerts: number;
  dailyActivity: Record<string, number>;
  monthlyActivity: Record<string, number>;
  categoryStats: Record<string, number>;
}

export interface ActivityLog {
  id: number;
  activityType: ActivityType;
  description?: string;
  user?: { id: number; username: string; fullName: string | null };
  createdAt: string;
  [key: string]: unknown;
}
