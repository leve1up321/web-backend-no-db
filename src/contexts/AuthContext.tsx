import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthContextType, AuthState, LoginCredentials, RegisterData, User, Address } from '@/types/auth';
import { findUserByEmail, validatePassword, createUser, findUserById } from '@/data/users';
import { toast } from 'sonner';

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          // Verify user still exists in our mock data
          const currentUser = findUserById(user.id);
          if (currentUser) {
            dispatch({ type: 'SET_USER', payload: currentUser });
          } else {
            localStorage.removeItem('user');
            dispatch({ type: 'SET_USER', payload: null });
          }
        } else {
          dispatch({ type: 'SET_USER', payload: null });
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem('user');
        dispatch({ type: 'SET_USER', payload: null });
      }
    };

    loadUser();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user = findUserByEmail(credentials.email);
      if (!user) {
        throw new Error('البريد الإلكتروني غير مسجل');
      }

      if (!validatePassword(credentials.email, credentials.password)) {
        throw new Error('كلمة المرور غير صحيحة');
      }

      // Update last login
      const updatedUser = { ...user, lastLogin: new Date().toISOString() };
      
      // Store in localStorage if remember me is checked
      if (credentials.rememberMe) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      dispatch({ type: 'SET_USER', payload: updatedUser });
      toast.success(`مرحباً بك ${user.firstName}! تم تسجيل الدخول بنجاح`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'حدث خطأ أثناء تسجيل الدخول';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check if user already exists
      const existingUser = findUserByEmail(data.email);
      if (existingUser) {
        throw new Error('البريد الإلكتروني مسجل مسبقاً');
      }

      // Validate password confirmation
      if (data.password !== data.confirmPassword) {
        throw new Error('كلمة المرور وتأكيد كلمة المرور غير متطابقتين');
      }

      // Create new user
      const newUser = createUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        preferences: {
          language: 'ar',
          currency: 'SAR',
          notifications: {
            email: data.subscribeNewsletter || false,
            sms: false,
            push: true,
          },
        },
      });

      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(newUser));

      dispatch({ type: 'SET_USER', payload: newUser });
      toast.success(`مرحباً بك ${newUser.firstName}! تم إنشاء حسابك بنجاح`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'حدث خطأ أثناء إنشاء الحساب';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = (): void => {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
    toast.success('تم تسجيل الخروج بنجاح');
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    if (!state.user) return;

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const updatedUser = { ...state.user, ...data };
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      dispatch({ type: 'UPDATE_USER', payload: data });
      toast.success('تم تحديث الملف الشخصي بنجاح');
    } catch (error) {
      const errorMessage = 'حدث خطأ أثناء تحديث الملف الشخصي';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addAddress = async (address: Omit<Address, 'id'>): Promise<void> => {
    if (!state.user) return;

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const newAddress: Address = {
        ...address,
        id: Date.now().toString(),
      };

      const updatedAddresses = [...state.user.addresses, newAddress];
      const updatedUser = { ...state.user, addresses: updatedAddresses };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      dispatch({ type: 'UPDATE_USER', payload: { addresses: updatedAddresses } });
      toast.success('تم إضافة العنوان بنجاح');
    } catch (error) {
      toast.error('حدث خطأ أثناء إضافة العنوان');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateAddress = async (id: string, addressData: Partial<Address>): Promise<void> => {
    if (!state.user) return;

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const updatedAddresses = state.user.addresses.map(addr =>
        addr.id === id ? { ...addr, ...addressData } : addr
      );

      const updatedUser = { ...state.user, addresses: updatedAddresses };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      dispatch({ type: 'UPDATE_USER', payload: { addresses: updatedAddresses } });
      toast.success('تم تحديث العنوان بنجاح');
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث العنوان');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteAddress = async (id: string): Promise<void> => {
    if (!state.user) return;

    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const updatedAddresses = state.user.addresses.filter(addr => addr.id !== id);
      const updatedUser = { ...state.user, addresses: updatedAddresses };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      dispatch({ type: 'UPDATE_USER', payload: { addresses: updatedAddresses } });
      toast.success('تم حذف العنوان بنجاح');
    } catch (error) {
      toast.error('حدث خطأ أثناء حذف العنوان');
      throw error;
    }
  };

  const setDefaultAddress = async (id: string): Promise<void> => {
    if (!state.user) return;

    try {
      const updatedAddresses = state.user.addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id,
      }));

      const updatedUser = { ...state.user, addresses: updatedAddresses };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      dispatch({ type: 'UPDATE_USER', payload: { addresses: updatedAddresses } });
      toast.success('تم تعيين العنوان الافتراضي بنجاح');
    } catch (error) {
      toast.error('حدث خطأ أثناء تعيين العنوان الافتراضي');
      throw error;
    }
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
