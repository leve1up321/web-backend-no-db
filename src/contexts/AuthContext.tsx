import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'sonner';

// Types
interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  dateOfBirth?: string;
  gender?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  preferences: {
    language: string;
    currency: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  stats: {
    totalOrders: number;
    totalSpent: number;
    completedOrders: number;
    pendingOrders: number;
    cancelledOrders: number;
    totalReviews: number;
    averageRating: number;
  };
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  city?: string;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  clearError: () => void;
}

// Auth reducer
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'LOGOUT' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case 'LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API base URL
const API_BASE_URL = '/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // API helper function
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    // Check if response has content before parsing JSON
    const contentType = response.headers.get('content-type');
    let data = null;
    
    if (contentType && contentType.includes('application/json')) {
      const text = await response.text();
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (error) {
          console.error('Failed to parse JSON:', error);
          throw new Error('خطأ في تحليل استجابة الخادم');
        }
      }
    }

    if (!response.ok) {
      // Handle specific HTTP status codes
      if (response.status === 405) {
        throw new Error('خطأ في الطريقة المستخدمة - يرجى إعادة المحاولة أو التواصل مع الدعم الفني');
      } else if (response.status === 404) {
        throw new Error('الخدمة غير متوفرة حالياً - يرجى المحاولة لاحقاً');
      } else if (response.status === 500) {
        throw new Error('خطأ في الخادم - يرجى المحاولة بعد قليل');
      } else if (response.status === 400) {
        throw new Error('بيانات غير صحيحة - يرجى التحقق من المعلومات المدخلة');
      } else if (response.status === 401) {
        throw new Error('غير مصرح لك بالوصول - يرجى تسجيل الدخول مرة أخرى');
      } else if (response.status === 403) {
        throw new Error('ليس لديك صلاحية للقيام بهذا الإجراء');
      }
      
      throw new Error(data?.message || `خطأ في الخادم: ${response.status}`);
    }

    return data;
  };

  // Verify token on app load
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      try {
        const data = await apiCall('/auth/verify');
        dispatch({ type: 'SET_USER', payload: data.data.user });
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('token');
        dispatch({ type: 'SET_USER', payload: null });
      }
    };

    verifyToken();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const data = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      // Store token in localStorage
      localStorage.setItem('token', data.data.token);
      
      dispatch({ type: 'SET_USER', payload: data.data.user });
      toast.success(data.message || 'تم تسجيل الدخول بنجاح');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'فشل في تسجيل الدخول';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      
      dispatch({ type: 'SET_USER', payload: response.data.user });
      toast.success(response.message || 'تم إنشاء الحساب بنجاح');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'فشل في إنشاء الحساب';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
    toast.success('تم تسجيل الخروج بنجاح');
  };

  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    try {
      const data = await apiCall('/user/update', {
        method: 'PUT',
        body: JSON.stringify(userData),
      });

      dispatch({ type: 'UPDATE_USER', payload: data.data.user });
      toast.success(data.message || 'تم تحديث الملف الشخصي بنجاح');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'فشل في تحديث الملف الشخصي';
      toast.error(errorMessage);
      throw error;
    }
  };

  const refreshProfile = async (): Promise<void> => {
    try {
      const data = await apiCall('/user/profile');
      dispatch({ type: 'UPDATE_USER', payload: data.data.user });
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    refreshProfile,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
