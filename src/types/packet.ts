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

export default Package;
