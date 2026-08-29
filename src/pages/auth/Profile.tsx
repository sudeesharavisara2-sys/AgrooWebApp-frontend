import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Calendar, 
  Phone, 
  MapPin, 
  FileText, 
  Edit3, 
  Key, 
  Save, 
  X, 
  CheckCircle2 
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { userApi } from '../../api/user';
import ErrorAlert from '../../components/common/ErrorAlert';
import Loader from '../../components/common/Loader';
import type { UpdateProfileRequest } from '../../types';
import { formatDate, getErrorMessage } from '../../utils/helpers';

const Profile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState<UpdateProfileRequest>({});
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        district: user.district || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  if (!user) return <Loader />;

  const update = <K extends keyof UpdateProfileRequest>(key: K, value: UpdateProfileRequest[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);
    try {
      await userApi.updateProfile(form);
      await refreshUser();
      setSuccess('Profile updated successfully.');
      setEditing(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-12">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">My Profile</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage your account settings and personal information</p>
        </div>
        <Link 
          to="/change-password" 
          className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:border-gray-400 active:scale-95"
        >
          <Key size={14} className="text-emerald-600" />
          Change Password
        </Link>
      </div>

      <ErrorAlert message={error} />
      
      {success && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800 shadow-sm animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Account Info Summary Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <User size={15} className="text-emerald-600" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Username</span>
          </div>
          <p className="text-sm font-bold text-gray-900 truncate">{user.username}</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <Mail size={15} className="text-emerald-600" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Email</span>
          </div>
          <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <ShieldCheck size={15} className="text-emerald-600" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Role</span>
          </div>
          <p className="text-sm font-bold text-emerald-700 bg-emerald-50 inline-block px-2 py-0.5 rounded-md uppercase tracking-wider text-[11px]">
            {user.role}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <Calendar size={15} className="text-emerald-600" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Member Since</span>
          </div>
          <p className="text-sm font-bold text-gray-900">{formatDate(user.createdAt)}</p>
        </div>
      </div>

      {/* Editable Details Form Card */}
      <form onSubmit={handleSave} className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-base font-extrabold text-gray-900">Personal Details</h2>
            <p className="text-xs text-gray-500">Update your personal information below</p>
          </div>
          {!editing && (
            <button 
              type="button" 
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-600/30 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 transition-all hover:bg-emerald-100 active:scale-95 cursor-pointer" 
              onClick={() => setEditing(true)}
            >
              <Edit3 size={14} />
              Edit Profile
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <User size={13} className="text-emerald-600" />
              Full Name
            </label>
            <input
              className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium transition-all focus:outline-none focus:ring-2 ${
                editing 
                  ? 'border-gray-300 bg-white text-gray-900 focus:border-emerald-500 focus:ring-emerald-500/20 shadow-sm' 
                  : 'border-gray-200 bg-gray-50/70 text-gray-600 cursor-not-allowed'
              }`}
              disabled={!editing}
              value={form.fullName || ''}
              onChange={(e) => update('fullName', e.target.value)}
              placeholder="Enter your full name"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <Phone size={13} className="text-emerald-600" />
              Phone Number
            </label>
            <input
              className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium transition-all focus:outline-none focus:ring-2 ${
                editing 
                  ? 'border-gray-300 bg-white text-gray-900 focus:border-emerald-500 focus:ring-emerald-500/20 shadow-sm' 
                  : 'border-gray-200 bg-gray-50/70 text-gray-600 cursor-not-allowed'
              }`}
              disabled={!editing}
              value={form.phoneNumber || ''}
              onChange={(e) => update('phoneNumber', e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <MapPin size={13} className="text-emerald-600" />
              Address
            </label>
            <input
              className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium transition-all focus:outline-none focus:ring-2 ${
                editing 
                  ? 'border-gray-300 bg-white text-gray-900 focus:border-emerald-500 focus:ring-emerald-500/20 shadow-sm' 
                  : 'border-gray-200 bg-gray-50/70 text-gray-600 cursor-not-allowed'
              }`}
              disabled={!editing}
              value={form.address || ''}
              onChange={(e) => update('address', e.target.value)}
              placeholder="Enter your address"
            />
          </div>

          {/* District */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <MapPin size={13} className="text-emerald-600" />
              District
            </label>
            <input
              className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium transition-all focus:outline-none focus:ring-2 ${
                editing 
                  ? 'border-gray-300 bg-white text-gray-900 focus:border-emerald-500 focus:ring-emerald-500/20 shadow-sm' 
                  : 'border-gray-200 bg-gray-50/70 text-gray-600 cursor-not-allowed'
              }`}
              disabled={!editing}
              value={form.district || ''}
              onChange={(e) => update('district', e.target.value)}
              placeholder="Enter your district"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
            <FileText size={13} className="text-emerald-600" />
            Bio
          </label>
          <textarea
            className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium transition-all focus:outline-none focus:ring-2 resize-none ${
              editing 
                ? 'border-gray-300 bg-white text-gray-900 focus:border-emerald-500 focus:ring-emerald-500/20 shadow-sm' 
                : 'border-gray-200 bg-gray-50/70 text-gray-600 cursor-not-allowed'
            }`}
            rows={3}
            disabled={!editing}
            value={form.bio || ''}
            onChange={(e) => update('bio', e.target.value)}
            placeholder="Tell us a bit about yourself..."
          />
        </div>

        {/* Action Buttons */}
        {editing && (
          <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
            <button 
              type="submit" 
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {saving ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
            <button 
              type="button" 
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-xs font-bold text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-95 cursor-pointer" 
              onClick={() => setEditing(false)}
            >
              <X size={14} />
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;