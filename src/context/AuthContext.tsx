import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';
import { AdminUser } from '../types/aventra';

export const PRIMARY_ADMIN_EMAIL = 'sachithakaumina86@gmail.com';

interface AuthContextValue {
  user: User | null;
  authReady: boolean;
  isAdmin: boolean;
  isBootstrappedOwner: boolean;
  adminProfile: AdminUser | null;
  authError: string | null;
  signingIn: boolean;
  signInWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBootstrappedOwner, setIsBootstrappedOwner] = useState(false);
  const [adminProfile, setAdminProfile] = useState<AdminUser | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setIsAdmin(false);
        setIsBootstrappedOwner(false);
        setAdminProfile(null);
        setAuthReady(true);
        return;
      }

      const emailVerified = firebaseUser.emailVerified;
      const ownerMatch =
        emailVerified &&
        firebaseUser.email?.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase();

      if (ownerMatch) {
        setIsBootstrappedOwner(true);
        setIsAdmin(true);
        setAdminProfile({
          id: firebaseUser.uid,
          email: firebaseUser.email || PRIMARY_ADMIN_EMAIL,
          name: firebaseUser.displayName || 'AVENTRA Primary Admin',
          role: 'super_admin',
        });
        setAuthReady(true);
        return;
      }

      if (emailVerified) {
        try {
          const adminDoc = await getDoc(doc(db, 'admins', firebaseUser.uid));
          if (adminDoc.exists()) {
            const data = adminDoc.data();
            setIsBootstrappedOwner(false);
            setIsAdmin(true);
            setAdminProfile({
              id: firebaseUser.uid,
              email: String(data.email || firebaseUser.email || ''),
              name: String(data.name || firebaseUser.displayName || 'Concierge Admin'),
              role: data.role === 'super_admin' ? 'super_admin' : 'concierge_admin',
            });
            setAuthReady(true);
            return;
          }
        } catch (err) {
          console.warn('Admin role lookup rejected or unavailable:', err);
        }
      }

      setIsBootstrappedOwner(false);
      setIsAdmin(false);
      setAdminProfile(null);
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<boolean> => {
    setAuthError(null);
    setSigningIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Google sign-in could not be completed. Please try again.';
      setAuthError(message);
      return false;
    } finally {
      setSigningIn(false);
    }
  };

  const logout = async () => {
    setAuthError(null);
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authReady,
        isAdmin,
        isBootstrappedOwner,
        adminProfile,
        authError,
        signingIn,
        signInWithGoogle,
        logout,
        clearAuthError: () => setAuthError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
