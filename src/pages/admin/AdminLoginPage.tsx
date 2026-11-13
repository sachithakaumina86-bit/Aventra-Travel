import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { STITCH_IMAGES } from '../../data/initialSeedData';
import { PRIMARY_ADMIN_EMAIL, useAuth } from '../../context/AuthContext';
import { ImageWithFallback } from '../../components/ImageWithFallback';

export const AdminLoginPage: React.FC = () => {
  const { user, authReady, isAdmin, signingIn, authError, signInWithGoogle, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authReady && user && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [authReady, user, isAdmin, navigate]);

  return (
    <div className="min-h-screen bg-[#FAF9F5] grid grid-cols-1 lg:grid-cols-12">
      {/* Left Editorial Photography Column */}
      <div className="hidden lg:flex lg:col-span-6 relative bg-[#022C22] text-[#FAF9F5] p-12 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={STITCH_IMAGES.hattonVeranda}
            alt="AVENTRA Ceylon Sanctuary"
            className="w-full h-full object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#022C22] via-[#022C22]/55 to-[#022C22]/40" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <img
            src={STITCH_IMAGES.logo}
            alt="AVENTRA"
            className="h-11 w-11 object-contain bg-[#FAF9F5] p-1 rounded-xs"
          />
          <div>
            <span className="font-serif text-xl font-bold tracking-[0.16em] block">AVENTRA</span>
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#D6B56D]">
              Ceylon Atelier • Executive Portal
            </span>
          </div>
        </div>

        <div className="relative z-10 space-y-4 max-w-lg">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#D6B56D] font-semibold">
            Zero-Trust Concierge Administration
          </span>
          <h2 className="font-serif text-4xl leading-tight">
            Stewardship, Bookings & Sanctuary Curation.
          </h2>
          <p className="text-sm text-[#FAF9F5]/80 leading-relaxed">
            Manage Sri Lankan destination dossiers, tour packages, private expedition dispatches, and inbound traveler inquiries inside one protected workspace.
          </p>
        </div>
      </div>

      {/* Right Authentication Form Column */}
      <div className="lg:col-span-6 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-md w-full space-y-8 bg-white border border-[#064E3B]/12 p-8 sm:p-10 shadow-sm">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-[#7B847F] hover:text-[#064E3B]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </Link>
            <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-[#064E3B] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D6B56D]" />
              <span>Firebase Auth</span>
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="font-serif text-3xl text-[#064E3B]">Admin Atelier Sign In</h1>
            <p className="text-sm text-[#404944] leading-relaxed">
              Authenticate via verified Google Account to unlock the AVENTRA management workspace.
            </p>
          </div>

          {!authReady ? (
            <div className="py-8 flex items-center justify-center gap-3 text-xs text-[#7B847F]">
              <Loader2 className="w-4 h-4 animate-spin text-[#064E3B]" />
              <span>Checking session...</span>
            </div>
          ) : user && !isAdmin ? (
            <div className="space-y-4 bg-[#FAF9F5] border border-[#BA1A1A]/25 p-5 text-xs text-[#404944]">
              <p className="font-semibold text-[#BA1A1A]">
                Signed in as {user.email} — Not Authorized
              </p>
              <p>
                Only verified administrators listed in Firestore <code className="bg-white px-1">/admins</code> or the primary owner (<span className="font-mono">{PRIMARY_ADMIN_EMAIL}</span>) may access the portal.
              </p>
              <p className="font-mono bg-white p-2 border border-[#064E3B]/10 break-all text-[11px]">
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

              <button
                type="button"
                disabled={signingIn}
                onClick={() => void signInWithGoogle()}
                className="w-full bg-[#064E3B] hover:bg-[#022C22] text-[#FAF9F5] py-4 px-5 text-xs uppercase tracking-[0.18em] font-semibold flex items-center justify-center gap-3 transition-colors cursor-pointer disabled:opacity-60"
              >
                {signingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <span>Continue With Google (Verified Admin)</span>
                )}
              </button>

              <div className="border-t border-[#064E3B]/10 pt-4 text-[11px] text-[#7B847F] leading-relaxed space-y-1">
                <p>
                  <strong>Security Notice:</strong> Public administrator registration is disabled. Additional concierge accounts must be added by the primary owner in <strong>Admin Profile & Team</strong> or Firebase Console.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
