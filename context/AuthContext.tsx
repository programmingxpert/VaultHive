
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { supabase } from '../services/supabase';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    let mounted = true;

    // Check active sessions and sets the user
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (mounted) {
          if (session?.user) {
            console.log('Session found:', session.user.id);
            const userData: User = {
              id: session.user.id,
              name: session.user.user_metadata.name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
              college: session.user.user_metadata.college || '',
              branch: session.user.user_metadata.branch || '',
              semester: session.user.user_metadata.semester || '',
              bio: session.user.user_metadata.bio || '',
              profilePicture: session.user.user_metadata.avatar_url || session.user.user_metadata.profilePicture || '/default_profile.jpg',
              isVerified: session.user.email_confirmed_at ? true : false,
              badges: [],
              stats: {
                resourcesShared: 0,
                downloads: 0,
                reputation: 0
              }
            };
            setState({ user: userData, isAuthenticated: true, loading: false });
          } else {
            console.log('No session found');
            setState({ user: null, isAuthenticated: false, loading: false });
          }
        }
      } catch (err) {
        console.error('Error getting session:', err);
        if (mounted) {
          setState({ user: null, isAuthenticated: false, loading: false });
        }
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.id);

      try {
        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            name: session.user.user_metadata.name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            college: session.user.user_metadata.college || '',
            branch: session.user.user_metadata.branch || '',
            semester: session.user.user_metadata.semester || '',
            bio: session.user.user_metadata.bio || '',
            profilePicture: session.user.user_metadata.avatar_url || session.user.user_metadata.profilePicture || '/default_profile.jpg',
            isVerified: session.user.email_confirmed_at ? true : false,
            badges: [],
            stats: {
              resourcesShared: 0,
              downloads: 0,
              reputation: 0
            }
          };
          if (mounted) {
            setState({ user: userData, isAuthenticated: true, loading: false });
          }
        } else {
          if (mounted) {
            setState({ user: null, isAuthenticated: false, loading: false });
          }
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        if (mounted) {
          setState({ user: null, isAuthenticated: false, loading: false });
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true }));

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Explicitly set state if session is returned, to ensure UI updates immediately
      if (data.session?.user) {
        const userData: User = {
          id: data.session.user.id,
          name: data.session.user.user_metadata.name || data.session.user.email?.split('@')[0] || 'User',
          email: data.session.user.email || '',
          college: data.session.user.user_metadata.college || '',
          branch: data.session.user.user_metadata.branch || '',
          semester: data.session.user.user_metadata.semester || '',
          bio: data.session.user.user_metadata.bio || '',
          profilePicture: data.session.user.user_metadata.avatar_url || data.session.user.user_metadata.profilePicture || '/default_profile.jpg',
          isVerified: data.session.user.email_confirmed_at ? true : false,
          badges: [],
          stats: {
            resourcesShared: 0,
            downloads: 0,
            reputation: 0
          }
        };
        setState({ user: userData, isAuthenticated: true, loading: false });
      } else {
        // Should not happen on successful login usually, but just in case
        setState(prev => ({ ...prev, loading: false }));
      }
    } catch (err) {
      setState(prev => ({ ...prev, loading: false }));
      throw err;
    }
  };

  const register = async (data: any) => {
    setState(prev => ({ ...prev, loading: true }));

    try {
      const { data: responseData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            college: data.college,
            branch: data.branch,
            semester: data.semester,
          },
        },
      });

      if (error) throw error;

      if (responseData.session?.user) {
        // Auto-login happened
        const userData: User = {
          id: responseData.session.user.id,
          name: responseData.session.user.user_metadata.name || responseData.session.user.email?.split('@')[0] || 'User',
          email: responseData.session.user.email || '',
          college: responseData.session.user.user_metadata.college || '',
          branch: responseData.session.user.user_metadata.branch || '',
          semester: responseData.session.user.user_metadata.semester || '',
          bio: responseData.session.user.user_metadata.bio || '',
          profilePicture: responseData.session.user.user_metadata.avatar_url || responseData.session.user.user_metadata.profilePicture || '/default_profile.jpg',
          isVerified: responseData.session.user.email_confirmed_at ? true : false,
          badges: [],
          stats: {
            resourcesShared: 0,
            downloads: 0,
            reputation: 0
          }
        };
        setState({ user: userData, isAuthenticated: true, loading: false });
      } else {
        // Email verification required or no session returned
        setState(prev => ({ ...prev, loading: false }));
      }
    } catch (err) {
      setState(prev => ({ ...prev, loading: false }));
      throw err;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setState({ user: null, isAuthenticated: false, loading: false });
  };

  const updateUser = async (data: Partial<User>) => {
    try {
      const { data: { user }, error } = await supabase.auth.updateUser({
        data: data
      });

      if (error) throw error;

      if (user) {
        setState(prev => {
          if (!prev.user) return prev;
          return {
            ...prev,
            user: {
              ...prev.user,
              ...data, // Optimistic update or use returned metadata
              name: user.user_metadata.name || prev.user.name,
              college: user.user_metadata.college || prev.user.college,
              branch: user.user_metadata.branch || prev.user.branch,
              semester: user.user_metadata.semester || prev.user.semester,
              bio: user.user_metadata.bio || prev.user.bio,
              profilePicture: user.user_metadata.avatar_url || prev.user.profilePicture
            }
          }
        });
      }

    } catch (err) {
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
