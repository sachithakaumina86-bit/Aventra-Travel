import React, { useState } from 'react';
import { Loader2, LogOut, ShieldCheck, Trash2, UserPlus } from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { PRIMARY_ADMIN_EMAIL, useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const AdminProfilePage: React.FC = () => {
  const { user, adminProfile, isBootstrappedOwner, logout } = useAuth();
  const { admins, addAdminUser, removeAdminUser } = useData();

  const [newUid, setNewUid] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'concierge_admin' | 'super_admin'>('concierge_admin');
  const [saving, setSaving] = useState(false);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUid.trim() || !newEmail.trim() || !newName.trim()) return;
    setSaving(true);
    try {
      await addAdminUser(newUid.trim(), newEmail.trim(), newName.trim(), newRole);
      setNewUid('');
      setNewEmail('');
      setNewName('');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-3xl">
        <div>
          <span className="text-[10px] uppercase tracking-[0.24em] text-[#745B1C] font-semibold">
            Authenticated Session & Team Access
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#064E3B] mt-1">
            Admin Profile & Access
          </h1>
        </div>

        <div className="bg-white border border-[#064E3B]/12 p-7 space-y-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#064E3B]" />
            <div>
              <h2 className="font-serif text-2xl text-[#064E3B]">
                {adminProfile?.name || user?.displayName}
              </h2>
              <p className="text-xs text-[#7B847F]">{user?.email}</p>
            </div>
          </div>
          <div className="bg-[#FAF9F5] border border-[#064E3B]/10 p-4 text-xs space-y-1">
            <p><strong>Firebase UID:</strong> <span className="font-mono select-all">{user?.uid}</span></p>
            <p><strong>Role:</strong> {isBootstrappedOwner ? 'Primary Bootstrapped Owner' : adminProfile?.role}</p>
            <p><strong>Email Verified:</strong> {user?.emailVerified ? 'Verified' : 'Unverified'}</p>
          </div>
          <button
            type="button"
            onClick={() => void logout()}
            className="bg-[#064E3B] text-white px-5 py-2.5 text-xs uppercase tracking-[0.16em] font-semibold inline-flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {isBootstrappedOwner && (
          <div className="bg-white border border-[#064E3B]/12 p-7 space-y-5">
            <div>
              <h2 className="font-serif text-2xl text-[#064E3B]">Authorized Admin Roster</h2>
              <p className="text-xs text-[#404944] mt-1">
                Primary owner (<span className="font-mono">{PRIMARY_ADMIN_EMAIL}</span>) can grant or revoke additional Firebase-authenticated staff by UID.
              </p>
            </div>

            <form onSubmit={handleAddAdmin} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#FAF9F5] p-4 border border-[#064E3B]/10">
              <input
                type="text"
                required
                placeholder="Firebase User UID"
                value={newUid}
                onChange={(e) => setNewUid(e.target.value)}
                className="bg-white border border-[#064E3B]/15 px-3 py-2"
              />
              <input
                type="email"
                required
                placeholder="Staff Google Email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="bg-white border border-[#064E3B]/15 px-3 py-2"
              />
              <input
                type="text"
                required
                placeholder="Display Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-white border border-[#064E3B]/15 px-3 py-2"
              />
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as 'concierge_admin' | 'super_admin')}
                className="bg-white border border-[#064E3B]/15 px-3 py-2"
              >
                <option value="concierge_admin">Concierge Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
              <button
                type="submit"
                disabled={saving}
                className="sm:col-span-2 bg-[#064E3B] text-white py-2.5 uppercase tracking-[0.14em] font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4 text-[#D6B56D]" />}
                <span>Authorize Admin User</span>
              </button>
            </form>

            {admins.length > 0 && (
              <div className="divide-y divide-[#064E3B]/10 text-xs">
                {admins.map((a) => (
                  <div key={a.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-[#064E3B]">{a.name}</p>
                      <p className="text-[#7B847F]">
                        {a.email} • <span className="font-mono">{a.id}</span> ({a.role})
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void removeAdminUser(a.id)}
                      className="p-1.5 text-[#BA1A1A] hover:bg-[#FFDAD6] cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
