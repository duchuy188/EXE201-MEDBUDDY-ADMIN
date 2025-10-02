// ...existing code...
export interface User {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    password?: string;
    // Role is currently the literal 'relative' per the example; if you have other roles,
    // change this to a union like: 'relative' | 'admin' | 'user'
    role: 'relative' | 'patient' | 'admin';
    dateOfBirth?: string;

    // Additional fields from API response
    avatar?: string;
    isBlocked?: boolean;
    blockedAt?: string | null;
    blockedBy?: {
        _id: string;
        fullName: string;
        email: string;
    } 

    createdAt?: string;
    updatedAt?: string;
}


// API Response types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

// Authentication types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    user: {
        id: string;
        email: string;
        name?: string;
        role?: string;
    };
}

export interface RefreshTokenRequest {
    refresh_token: string;
}

export interface RefreshTokenResponse {
    access_token: string;
    refresh_token: string;
}


export type UserWithoutPassword = Omit<User, 'password'>;