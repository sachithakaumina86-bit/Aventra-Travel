import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import sriLankaScenicImg from '../../assets/images/sri_lanka_scenic_sanctuary_1794545612724.jpg';
import { PRIMARY_ADMIN_EMAIL, useAuth } from '../../context/AuthContext';
import { ImageWithFallback } from '../../components/ImageWithFallback';

export const AdminLoginPage: React.FC = () => {
  const {
    user,
    authReady,
    isAdmin,
    signingIn,
    authError,
    authNotice,
    signInWithEmail,
    signInWithGoogle,
    sendVerificationEmail,
    refreshSession,
    sendPasswordReset,
    logout,
    clearAuthError,
    clearAuthNotice,
  } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberSession, setRememberSession] = useState(true);
  const [sendingReset, setSendingReset] = useState(false);
  const [sendingVerify, setSendingVerify] = useState(false);

  useEffect(() => {
    if (authReady && user && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [authReady, user, isAdmin, navigate]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    await signInWithEmail(email, password, rememberSession);
  };

  const handleForgotPassword = async () => {
    setSendingReset(true);
    try {
      await sendPasswordReset(email);
    } finally {
      setSendingReset(false);
    }
  };

  const handleSendVerification = async () => {
    setSendingVerify(true);
    try {
      await sendVerificationEmail();
    } finally {
      setSendingVerify(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] grid grid-cols-1 lg:grid-cols-12">
      {/* Left Editorial Photography Column */}
      <div className="hidden lg:flex lg:col-span-6 relative bg-[#022C22] text-[#FAF9F5] p-10 xl:p-12 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={sriLankaScenicImg}
            alt="Sigiriya Lion Rock rising above misty Sri Lankan emerald forests and serene lotus lagoon at sunrise"
            priority
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#022C22]/90 via-[#022C22]/35 to-[#022C22]/45" />
        </div>

        {/* Top Editorial Eyebrow */}
        <div className="relative z-10 flex items-center justify-between text-[10px] uppercase tracking-[0.26em] text-[#D6B56D] font-semibold">
          <span>Ceylon Atelier • Executive Portal</span>
          <span className="text-[#FAF9F5]/80">Sri Lanka</span>
        </div>

        {/* Centered Prominent Organization Logo */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center py-8">
          <div className="bg-white/95 backdrop-blur-sm border border-[#D6B56D]/65 p-5 sm:p-6 shadow-2xl rounded-xs">
            <img
              src="/assets/aistudio/Aventra_Travel_Logo_with_Scenic_A_08eb13f5.png"
              alt="AVENTRA Travel Agency Logo"
              width={208}
              height={208}
              decoding="sync"
              className="w-44 h-44 xl:w-52 xl:h-52 object-contain"
            />
          </div>
        </div>

        {/* Bottom Editorial Caption */}
        <div className="relative z-10 space-y-3 max-w-lg">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#D6B56D] font-semibold block">
            Zero-Trust Concierge Administration
          </span>
          <h2 className="font-serif text-3xl xl:text-4xl leading-tight">
            Stewardship, Bookings & Sanctuary Curation.
          </h2>
          <p className="text-sm text-[#FAF9F5]/85 leading-relaxed">
            Manage Sri Lankan destination dossiers, tour packages, private expedition dispatches, and inbound traveler inquiries inside one protected workspace.
          </p>
        </div>
      </div>

      {/* Right Authentication Form Column */}
      <div className="lg:col-span-6 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-md w-full space-y-7 bg-white border border-[#064E3B]/12 p-8 sm:p-10 shadow-sm relative overflow-hidden">
          {/* Top Subtle Gilded Filament */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#D6B56D] via-[#064E3B] to-[#0F766E]" />

          <div className="flex items-center justify-between pt-1">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-[#7B847F] hover:text-[#064E3B] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </Link>
            <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-[#064E3B] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D6B56D]" />
              <span>Restricted Portal</span>
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="font-serif text-3xl text-[#064E3B]">Admin Atelier Sign In</h1>
            <p className="text-sm text-[#404944] leading-relaxed">
              Enter your authorized administrator email and password—or continue with a verified Google account—to unlock the AVENTRA console.
            </p>
          </div>

          {!authReady ? (
            <div className="py-8 flex items-center justify-center gap-3 text-xs text-[#7B847F]">
              <Loader2 className="w-4 h-4 animate-spin text-[#064E3B]" />
              <span>Checking session...</span>
            </div>
          ) : user && !user.emailVerified ? (
            <div className="space-y-4 bg-[#FAF9F5] border border-[#D6B56D]/50 p-5 text-xs text-[#404944]">
              <p className="font-semibold text-[#064E3B]">
                Email Verification Required — {user.email}
              </p>
              <p className="leading-relaxed">
                Your credentials succeeded, but AVENTRA&apos;s Firestore security rules require a verified email token before granting administrative access.
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

              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  disabled={sendingVerify}
                  onClick={() => void handleSendVerification()}
                  className="w-full bg-[#064E3B] hover:bg-[#022C22] text-white py-2.5 px-4 text-xs uppercase tracking-[0.16em] font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
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
                  className="w-full border border-[#064E3B] text-[#064E3B] hover:bg-[#064E3B]/5 py-2.5 px-4 text-xs uppercase tracking-[0.16em] font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {signingIn ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5" />
                  )}
                  <span>I Verified — Refresh Session</span>
                </button>

                <button
                  type="button"
                  onClick={() => void logout()}
                  className="w-full text-[#7B847F] hover:text-[#064E3B] py-1.5 text-[11px] uppercase tracking-[0.14em] cursor-pointer"
                >
                  Sign Out & Switch Account
                </button>
              </div>
            </div>
          ) : user && !isAdmin ? (
            <div className="space-y-4 bg-[#FAF9F5] border border-[#BA1A1A]/25 p-5 text-xs text-[#404944]">
              <p className="font-semibold text-[#BA1A1A]">
                Signed in as {user.email} — Not Authorized
              </p>
              <p className="leading-relaxed">
                Only verified administrators listed in Firestore <code className="bg-white px-1">/admins</code> or the primary owner (<span className="font-mono">{PRIMARY_ADMIN_EMAIL}</span>) may access the portal.
              </p>
              <p className="font-mono bg-white p-2 border border-[#064E3B]/10 break-all text-[11px] select-all">
                UID: {user.uid}
              </p>
              <button
                type="button"
                onClick={() => void logout()}
                className="w-full bg-[#064E3B] text-white py-2.5 text-xs uppercase tracking-[0.16em] font-semibold cursor-pointer"
              >
                Sign Out & Try Authorized Account
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {authError && (
                <div className="bg-[#ffdad6] text-[#93000a] p-3.5 text-xs leading-relaxed">
                  {authError}
                </div>
              )}
              {authNotice && (
                <div className="bg-[#064E3B]/10 border border-[#064E3B]/20 text-[#064E3B] p-3.5 text-xs leading-relaxed">
                  {authNotice}
                </div>
              )}

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="admin-email"
                    className="block text-[11px] uppercase tracking-[0.16em] text-[#404944] font-medium"
                  >
                    Work Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#7B847F] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="admin-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (authError) clearAuthError();
                        if (authNotice) clearAuthNotice();
                      }}
                      placeholder="sachithakaumina86@gmail.com"
                      className="w-full pl-10 pr-4 py-3 bg-[#FAF9F5] border border-[#064E3B]/15 text-sm text-[#18231F] placeholder:text-[#7B847F]/60 focus:outline-none focus:bg-white focus:border-[#064E3B] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="admin-password"
                      className="block text-[11px] uppercase tracking-[0.16em] text-[#404944] font-medium"
                    >
                      Password Phrase
                    </label>
                    <button
                      type="button"
                      disabled={sendingReset || signingIn}
                      onClick={() => void handleForgotPassword()}
                      className="text-[11px] text-[#745B1C] hover:text-[#064E3B] hover:underline underline-offset-4 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {sendingReset ? 'Sending link...' : 'Forgot Password?'}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#7B847F] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (authError) clearAuthError();
                      }}
                      placeholder="Enter your admin password"
                      className="w-full pl-10 pr-11 py-3 bg-[#FAF9F5] border border-[#064E3B]/15 text-sm text-[#18231F] placeholder:text-[#7B847F]/60 focus:outline-none focus:bg-white focus:border-[#064E3B] transition-colors"
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#7B847F] hover:text-[#064E3B] cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <label className="flex items-center gap-2.5 cursor-pointer select-none pt-0.5">
                  <input
                    type="checkbox"
                    checked={rememberSession}
                    onChange={(e) => setRememberSession(e.target.checked)}
                    className="sr-only peer"
                  />
                  <span
                    className={`w-4 h-4 border flex items-center justify-center transition-colors ${
                      rememberSession
                        ? 'bg-[#064E3B] border-[#064E3B] text-white'
                        : 'bg-[#FAF9F5] border-[#064E3B]/25'
                    }`}
                  >
                    {rememberSession && <Check className="w-3 h-3" />}
                  </span>
                  <span className="text-xs text-[#404944]">Keep signed in on this browser</span>
                </label>

                <button
                  type="submit"
                  disabled={signingIn}
                  className="w-full bg-[#064E3B] hover:bg-[#022C22] text-[#FAF9F5] py-3.5 px-5 text-xs uppercase tracking-[0.18em] font-semibold flex items-center justify-center gap-2.5 transition-colors cursor-pointer disabled:opacity-60"
                >
                  {signingIn ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Console</span>
                      <ArrowRight className="w-4 h-4 text-[#D6B56D]" />
                    </>
                  )}
                </button>
              </form>

              <div className="relative flex items-center py-1">
                <div className="flex-grow border-t border-[#064E3B]/10" />
                <span className="mx-3 text-[10px] uppercase tracking-[0.2em] text-[#7B847F]">
                  Or
                </span>
                <div className="flex-grow border-t border-[#064E3B]/10" />
              </div>

              <button
                type="button"
                disabled={signingIn}
                onClick={() => void signInWithGoogle()}
                className="w-full border border-[#064E3B]/25 bg-[#FAF9F5] hover:bg-[#F0E9DC]/60 text-[#064E3B] py-3 px-5 text-xs uppercase tracking-[0.16em] font-semibold flex items-center justify-center gap-2.5 transition-colors cursor-pointer disabled:opacity-60"
              >
                <span>Continue With Google (Verified Admin)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

