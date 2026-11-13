import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Loader2, LogOut, Mail, RefreshCw, ShieldAlert } from 'lucide-react';
import { PRIMARY_ADMIN_EMAIL, useAuth } from '../context/AuthContext';

export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    user,
    authReady,
    isAdmin,
    signingIn,
    authError,
    authNotice,
    sendVerificationEmail,
    refreshSession,
    logout,
  } = useAuth();
  const [sendingVerify, setSendingVerify] = useState(false);

  if (!authReady) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-7 h-7 animate-spin text-[#064E3B] mb-3" />
        <p className="text-xs uppercase tracking-[0.2em] text-[#7B847F]">
          Verifying AVENTRA Atelier Credentials...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!user.emailVerified) {
    const handleVerifyClick = async () => {
      setSendingVerify(true);
      try {
        await sendVerificationEmail();
      } finally {
        setSendingVerify(false);
      }
    };

    return (
      <div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white border border-[#D6B56D]/40 p-8 sm:p-10 shadow-sm space-y-5">
          <div className="flex items-center gap-3 text-[#064E3B]">
            <Mail className="w-6 h-6 text-[#D6B56D] shrink-0" />
            <h1 className="font-serif text-2xl text-[#18231F]">Verify Administrator Email</h1>
          </div>
          <p className="text-sm text-[#404944] leading-relaxed">
            You are signed in as <strong className="text-[#18231F]">{user.email}</strong>, which is not yet verified. AVENTRA&apos;s Firestore security rules require a verified email token before unlocking concierge data.
          </p>

          {authError && (
            <div className="bg-[#ffdad6] text-[#93000a] p-3 text-xs leading-relaxed">
              {authError}
            </div>
          )}
          {authNotice && (
            <div className="bg-[#064E3B]/10 border border-[#064E3B]/20 text-[#064E3B] p-3 text-xs leading-relaxed">
              {authNotice}
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="button"
              disabled={sendingVerify}
              onClick={() => void handleVerifyClick()}
              className="inline-flex items-center gap-2 bg-[#064E3B] text-[#FAF9F5] px-5 py-2.5 text-xs uppercase tracking-[0.15em] font-semibold cursor-pointer disabled:opacity-60"
            >
              {sendingVerify ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Mail className="w-3.5 h-3.5 text-[#D6B56D]" />
              )}
              <span>Send Verification Email</span>
            </button>
            <button
              type="button"
              disabled={signingIn}
              onClick={() => void refreshSession()}
              className="inline-flex items-center gap-2 border border-[#064E3B] text-[#064E3B] px-5 py-2.5 text-xs uppercase tracking-[0.15em] font-semibold cursor-pointer disabled:opacity-60"
            >
              {signingIn ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
              <span>I Verified — Refresh Access</span>
            </button>
            <button
              type="button"
              onClick={() => void logout()}
              className="inline-flex items-center gap-2 border border-[#064E3B]/20 text-[#7B847F] hover:text-[#064E3B] px-4 py-2.5 text-xs uppercase tracking-[0.15em] font-semibold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white border border-[#064E3B]/15 p-8 sm:p-10 shadow-sm space-y-5">
          <div className="flex items-center gap-3 text-[#BA1A1A]">
            <ShieldAlert className="w-6 h-6 shrink-0" />
            <h1 className="font-serif text-2xl text-[#18231F]">Administrative Access Required</h1>
          </div>
          <p className="text-sm text-[#404944] leading-relaxed">
            You are signed in as <strong className="text-[#18231F]">{user.email}</strong>, which does not currently hold AVENTRA administrator permissions.
          </p>
          <div className="bg-[#FAF9F5] border border-[#064E3B]/10 p-4 text-xs text-[#404944] space-y-1.5">
            <p className="font-semibold text-[#064E3B] uppercase tracking-wider">Authorization Setup</p>
            <p>
              Sign in with the primary owner account (<span className="font-mono">{PRIMARY_ADMIN_EMAIL}</span>), or ask the primary owner to register your UID below under <strong>Admin Profile & Team</strong> or in Firestore <span className="font-mono">/admins/{'{uid}'}</span>:
            </p>
            <p className="font-mono bg-white p-2 border border-[#064E3B]/10 text-[11px] select-all break-all">
              UID: {user.uid}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => void logout()}
              className="inline-flex items-center gap-2 bg-[#064E3B] text-[#FAF9F5] px-5 py-2.5 text-xs uppercase tracking-[0.15em] font-semibold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out & Switch Account
            </button>
            <Link
              to="/"
              className="inline-flex items-center border border-[#064E3B]/20 text-[#064E3B] px-5 py-2.5 text-xs uppercase tracking-[0.15em] font-semibold"
            >
              Return to Public Site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
