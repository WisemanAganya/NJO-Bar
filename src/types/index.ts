export type UserRole = 'admin' | 'staff' | 'client';

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id?: string;
  clientId: string;
  clientName: string;
  eventDate: string;
  eventType: string;
  guestCount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  totalAmount: number;
  notes?: string;
  duration?: number;
  location?: string;
  isRecurring?: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  reminderSent?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  id?: string;
  name: string;
  category: 'Spirit' | 'Mixer' | 'Garnish' | 'Other';
  quantity: number;
  unit: string;
  price: number;
  lastUpdated: string;
}

export interface Course {
  id?: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  internships?: string;
  jobOpportunities?: string;
  period: string;
  createdAt: string;
  updatedAt: string;
}

export interface Cocktail {
  id?: string;
  name: string;
  category: 'Classic' | 'Signature' | 'Mocktail' | 'Seasonal';
  ingredients: string[];
  instructions: string;
  rating: number;
  ratingCount: number;
  creatorId: string;
  creatorName: string;
  imageUrl?: string;
  createdAt: string;
}

export interface Comment {
  id?: string;
  cocktailId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

export interface Like {
  id?: string;
  cocktailId: string;
  userId: string;
  createdAt: string;
}

export interface Rating {
  id?: string;
  cocktailId: string;
  userId: string;
  value: number;
  createdAt: string;
}

export interface Enrollment {
  id?: string;
  courseId: string;
  userId: string;
  userName: string;
  status: 'pending' | 'confirmed' | 'completed';
  createdAt: string;
}

export interface Product {
  id?: string;
  name: string;
  description: string;
  imageUrl: string;
  category: 'Gin' | 'Tequila' | 'Whiskey' | 'Liquors' | 'Vodka' | 'Rum' | 'Wine' | 'Beer' | 'Soft Drink' | 'Mixer' | 'Accessory' | 'Gift';
  price: number;
  stock: number;
  featured?: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id?: string;
  userId: string;
  userName: string;
  email: string;
  phone?: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid' | 'partial';
  totalAmount: number;
  lineItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PackageOption {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  guests: string;
  perks: string[];
}

// ==================== CMS TYPES ====================

export interface ContentPage {
  id?: string;
  slug: string;
  title: string;
  description?: string;
  content: Record<string, any>;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  published: boolean;
  featuredImageUrl?: string;
  authorId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImageUrl?: string;
  category?: string;
  tags?: string[];
  authorId?: string;
  published: boolean;
  publishedAt?: string;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id?: string;
  clientName: string;
  clientRole?: string;
  clientImageUrl?: string;
  content: string;
  rating?: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  leadType?: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  source?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventReminder {
  id?: string;
  bookingId: string;
  reminderType: 'email' | 'sms' | 'notification';
  scheduledFor: string;
  message: string;
  sent: boolean;
  sentAt?: string;
  createdAt: string;
}

export interface AnalyticsMetric {
  id?: string;
  date: string;
  metricName: string;
  metricValue: number;
  metricType: 'booking' | 'revenue' | 'order' | 'visitor' | 'engagement';
  createdAt: string;
}

export interface CMSSetting {
  id?: string;
  settingKey: string;
  settingValue: Record<string, any>;
  description?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PromoCode {
  id: string;
  code: string;
  description: string;
  discountPercent: number;
  active: boolean;
  expiresAt: string;
}

export interface GiftCard {
  id: string;
  code: string;
  amount: number;
  expiresAt: string;
  redeemed: boolean;
}

export interface StaffShift {
  id: string;
  staffName: string;
  role: string;
  eventDate: string;
  shiftHours: string;
  notes?: string;
}

export interface DeliveryOrder {
  id: string;
  orderId: string;
  address: string;
  city: string;
  status: 'pending' | 'dispatched' | 'delivered';
  scheduledAt: string;
}

export interface NewsletterSubscriber {
  id?: string;
  email: string;
  source: string;
  subscribedAt: string;
}
