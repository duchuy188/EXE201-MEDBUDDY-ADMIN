/**
 * Package (Gói dịch vụ) types
 * Example shape:
 * {
 *   "name": "GÓI HAP DÙNG THỬ",
 *   "price": 0,
 *   "duration": 7,
 *   "unit": "day",
 *   "features": ["string"]
 * }
 */

export interface Package {
	_id: string;
	name: string;
	description?: string;
	price: number;
	// duration value paired with `unit` (e.g. 7 days)
	duration: number;
	// common units: 'day' | 'week' | 'month' | 'year'
	unit: 'day' | 'week' | 'month' | 'year' | string;
	features: string[];
	createdAt?: string;
	updatedAt?: string;
}

export interface CreatePackageDTO {
	name: string;
	description?: string;
	price: number;
	duration: number;
	unit: Package['unit'];
	features: string[];
}

export type UpdatePackageDTO = Partial<CreatePackageDTO>;

// Package History types based on API response
export interface PackageHistoryItem {
  orderCode: number;
  package: {
    _id: string;
    name: string;
    price: number;
    duration: number;
    unit: string;
    features: string[];
  };
  amount: number;
  paidAt: string;
  formattedPaidAt: string;
  status: 'PAID' | 'PENDING' | 'CANCELLED' | string;
}

export interface PackageHistoryResponse {
  message: string;
  data: PackageHistoryItem[];
}

// Active Package types based on API response
export interface ActivePackageData {
  package: {
    _id: string;
    name: string;
    price: number;
    duration: number;
    unit: string;
    features: string[];
  };
  startDate: string;
  endDate: string;
  features: string[];
  isActive: boolean;
  daysRemaining: number;
}

export interface ActivePackageResponse {
  message: string;
  hasActivePackage: boolean;
  data?: ActivePackageData;
}
export interface PackageStatsItem {
  id: string;
  packageName: string;
  activeUsers: number;
}

export interface PackageStatsResponse {
  message: string;
  data: PackageStatsItem[];
}

// Check feature response type based on API docs
export interface CheckFeatureResponse {
  message: string;
  hasAccess: boolean;
  feature: string;
}

// User Package Details response type for admin endpoint
export interface UserPackageDetailsUser {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
}

export interface UserPackageDetailsActivePackage {
  packageId: any; // Can be object or string depending on populated data
  startDate: string;
  endDate: string;
  features: string[];
  isActive: boolean;
}

export interface UserPackageDetailsData {
  user: UserPackageDetailsUser;
  activePackage: UserPackageDetailsActivePackage;
  daysRemaining: number;
}

export interface UserPackageDetailsResponse {
  message: string;
  data: UserPackageDetailsData;
}
export default Package;
