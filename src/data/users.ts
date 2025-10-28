import { User } from '@/types/auth';

// Mock users data for development
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'ahmed@example.com',
    firstName: 'أحمد',
    lastName: 'محمد',
    phone: '+966501234567',
    dateOfBirth: '1990-05-15',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    loyaltyPoints: 1250,
    membershipLevel: 'gold',
    joinDate: '2023-01-15',
    lastLogin: '2024-10-28T10:30:00Z',
    preferences: {
      language: 'ar',
      currency: 'SAR',
      notifications: {
        email: true,
        sms: true,
        push: true,
      },
    },
    addresses: [
      {
        id: 'addr1',
        type: 'home',
        firstName: 'أحمد',
        lastName: 'محمد',
        address1: 'شارع الملك فهد، حي النخيل',
        address2: 'مجمع النخيل السكني، مبنى أ، شقة 205',
        city: 'الرياض',
        state: 'الرياض',
        zipCode: '12345',
        country: 'السعودية',
        phone: '+966501234567',
        isDefault: true,
      },
      {
        id: 'addr2',
        type: 'work',
        firstName: 'أحمد',
        lastName: 'محمد',
        company: 'شركة التقنية المتقدمة',
        address1: 'طريق الملك عبدالعزيز، برج الأعمال',
        address2: 'الطابق 15، مكتب 1502',
        city: 'الرياض',
        state: 'الرياض',
        zipCode: '11564',
        country: 'السعودية',
        phone: '+966112345678',
        isDefault: false,
      },
    ],
  },
  {
    id: '2',
    email: 'fatima@example.com',
    firstName: 'فاطمة',
    lastName: 'علي',
    phone: '+966509876543',
    loyaltyPoints: 750,
    membershipLevel: 'silver',
    joinDate: '2023-06-20',
    lastLogin: '2024-10-27T15:45:00Z',
    preferences: {
      language: 'ar',
      currency: 'SAR',
      notifications: {
        email: true,
        sms: false,
        push: true,
      },
    },
    addresses: [
      {
        id: 'addr3',
        type: 'home',
        firstName: 'فاطمة',
        lastName: 'علي',
        address1: 'شارع التحلية، حي الملز',
        city: 'الرياض',
        state: 'الرياض',
        zipCode: '12876',
        country: 'السعودية',
        phone: '+966509876543',
        isDefault: true,
      },
    ],
  },
  {
    id: '3',
    email: 'omar@example.com',
    firstName: 'عمر',
    lastName: 'خالد',
    phone: '+966555123456',
    loyaltyPoints: 2100,
    membershipLevel: 'platinum',
    joinDate: '2022-11-10',
    lastLogin: '2024-10-28T09:15:00Z',
    preferences: {
      language: 'ar',
      currency: 'SAR',
      notifications: {
        email: true,
        sms: true,
        push: true,
      },
    },
    addresses: [
      {
        id: 'addr4',
        type: 'home',
        firstName: 'عمر',
        lastName: 'خالد',
        address1: 'شارع الأمير محمد بن عبدالعزيز',
        address2: 'فيلا رقم 123',
        city: 'جدة',
        state: 'مكة المكرمة',
        zipCode: '21589',
        country: 'السعودية',
        phone: '+966555123456',
        isDefault: true,
      },
    ],
  },
];

// Helper functions for user management
export const findUserByEmail = (email: string): User | undefined => {
  return mockUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
};

export const findUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const validatePassword = (email: string, password: string): boolean => {
  // In a real app, this would check against hashed passwords
  // For demo purposes, we'll accept any password for existing users
  const user = findUserByEmail(email);
  return !!user && password.length >= 6;
};

export const createUser = (userData: Omit<User, 'id' | 'loyaltyPoints' | 'membershipLevel' | 'joinDate' | 'addresses'>): User => {
  const newUser: User = {
    ...userData,
    id: Date.now().toString(),
    loyaltyPoints: 0,
    membershipLevel: 'bronze',
    joinDate: new Date().toISOString(),
    addresses: [],
  };
  
  mockUsers.push(newUser);
  return newUser;
};
