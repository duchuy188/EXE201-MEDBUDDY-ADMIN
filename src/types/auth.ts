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

export type UserWithoutPassword = Omit<User, 'password'>;