import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  User,
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
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
  authNotice: string | null;
  signingIn: boolean;
  signInWithEmail: (
    email: string,
    password: string,
    rememberSession?: boolean
  ) => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  sendVerificationEmail: () => Promise<boolean>;
  refreshSession: () => Promise<boolean>;
  sendPasswordReset: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearAuthError: () => void;
  clearAuthNotice: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function mapFirebaseAuthError(err: unknown): string {
  const code =
    typeof err === 'object' && err !== null && 'code' in err
      ? String((err as { code?: unknown }).code)
      : '';

  switch (code) {
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is not yet enabled in Firebase Console for this project. Open Firebase Console → Authentication → Sign-in method → enable Email/Password, then add your admin user under Users.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid admin email or password. Confirm the account exists in Firebase Console → Authentication → Users and re-enter your credentials.';
    case 'auth/invalid-email':
      return 'Please enter a valid administrator email address.';
    case 'auth/user-disabled':
      return 'This administrator account has been disabled in Firebase Authentication.';
    case 'auth/too-many-requests':
      return 'Too many consecutive attempts. Please wait a few moments before trying again or send a password reset email.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in popup was closed before completion.';
    case 'auth/network-request-failed':
      return 'Network error while reaching Firebase Authentication. Check your connection and retry.';
    default:
      return err instanceof Error
        ? err.message
        : 'Authentication could not be completed. Please try again.';
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBootstrappedOwner, setIsBootstrappedOwner] = useState(false);
  const [adminProfile, setAdminProfile] = useState<AdminUser | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  const evaluateAdminAccess = useCallback(async (firebaseUser: User | null): Promise<boolean> => {
    setUser(firebaseUser);
    if (!firebaseUser) {
      setIsAdmin(false);
      setIsBootstrappedOwner(false);
      setAdminProfile(null);
      setAuthReady(true);
      return false;
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
      return true;
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
          return true;
        }
      } catch (err) {
        console.warn('Admin role lookup rejected or unavailable:', err);
      }
    }

    setIsBootstrappedOwner(false);
    setIsAdmin(false);
    setAdminProfile(null);
    setAuthReady(true);
    return false;
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      await evaluateAdminAccess(firebaseUser);
    });

    return () => unsubscribe();
  }, [evaluateAdminAccess]);

  const signInWithEmail = async (
    email: string,
    password: string,
    rememberSession = true
  ): Promise<boolean> => {
    setAuthError(null);
    setAuthNotice(null);
    setSigningIn(true);
    try {
      try {
        await setPersistence(
          auth,
          rememberSession ? browserLocalPersistence : browserSessionPersistence
        );
      } catch {
        // Ignore storage persistence restrictions in embedded iframe environments
      }
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      await evaluateAdminAccess(credential.user);
      return true;
    } catch (err: unknown) {
      setAuthError(mapFirebaseAuthError(err));
      return false;
    } finally {
      setSigningIn(false);
    }
  };

  const signInWithGoogle = async (): Promise<boolean> => {
    setAuthError(null);
    setAuthNotice(null);
    setSigningIn(true);
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      await evaluateAdminAccess(credential.user);
      return true;
    } catch (err: unknown) {
      setAuthError(mapFirebaseAuthError(err));
      return false;
    } finally {
      setSigningIn(false);
    }
  };

  const handleSendVerificationEmail = async (): Promise<boolean> => {
    setAuthError(null);
    setAuthNotice(null);
    if (!auth.currentUser) {
      setAuthError('No active session found. Sign in first to send a verification email.');
      return false;
    }
    try {
      await sendEmailVerification(auth.currentUser);
      setAuthNotice(
        `Verification link dispatched to ${auth.currentUser.email}. Open the link in your inbox, then click "I Verified — Refresh Session".`
      );
      return true;
    } catch (err: unknown) {
      setAuthError(mapFirebaseAuthError(err));
      return false;
    }
  };

  const refreshSession = async (): Promise<boolean> => {
    setAuthError(null);
    setAuthNotice(null);
    if (!auth.currentUser) return false;
    setSigningIn(true);
    try {
      await auth.currentUser.reload();
      // Force-refresh ID token so Firestore security rules see updated email_verified claims
      await auth.currentUser.getIdToken(true);
      const granted = await evaluateAdminAccess(auth.currentUser);
      if (!auth.currentUser.emailVerified) {
        setAuthNotice('Email is still marked unverified. Confirm the verification link in your inbox and retry.');
      } else if (!granted) {
        setAuthNotice('Email verified! Complete UID authorization in Firestore /admins if you are not using the primary owner email.');
      }
      return granted;
    } catch (err: unknown) {
      setAuthError(mapFirebaseAuthError(err));
      return false;
    } finally {
      setSigningIn(false);
    }
  };

  const sendPasswordReset = async (email: string): Promise<boolean> => {
    setAuthError(null);
    setAuthNotice(null);
    const trimmed = email.trim();
    if (!trimmed) {
      setAuthError('Enter your admin email address first to receive a password reset link.');
      return false;
    }
    try {
      await sendPasswordResetEmail(auth, trimmed);
      setAuthNotice(`Password reset instructions sent to ${trimmed} (if an Email/Password account exists).`);
      return true;
    } catch (err: unknown) {
      setAuthError(mapFirebaseAuthError(err));
      return false;
    }
  };

  const logout = async () => {
    setAuthError(null);
    setAuthNotice(null);
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
        authNotice,
        signingIn,
        signInWithEmail,
        signInWithGoogle,
        sendVerificationEmail: handleSendVerificationEmail,
        refreshSession,
        sendPasswordReset,
        logout,
        clearAuthError: () => setAuthError(null),
        clearAuthNotice: () => setAuthNotice(null),
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
