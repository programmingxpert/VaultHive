
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';
import { User, Camera, Save, LogOut } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    college: user?.college || '',
    branch: user?.branch || '',
    semester: user?.semester || '',
    bio: user?.bio || ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user) return;

    const file = e.target.files[0];
    setUploading(true);

    try {
      // 1. Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Remove old avatar if exists (optional, could just overwrite if we keep filename constant or list/delete)
      // For now, simpler to just upload new one.

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // 3. Update User Metadata
      await updateUser({ profilePicture: publicUrl });

      // Force reload or just let context update handle it (updateUser in context should trigger state update if we implemented it right, 
      // but strictly speaking we might need to manually update local user state if context relies solely on session subscription which might take a moment)

    } catch (err: any) {
      console.error('Error uploading avatar:', err);
      alert('Failed to upload avatar: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUser(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-slate-900 font-display mb-10">Profile Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
            <div className="relative inline-block mb-6 group">
              <img src={user?.profilePicture || '/default_profile.jpg'} alt="Profile" className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover" />
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full border-2 border-white hover:bg-indigo-700 transition-all cursor-pointer group-hover:scale-110"
              >
                <Camera className="w-4 h-4" />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
                disabled={uploading}
              />
            </div>
            <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <div className="mt-6 pt-6 border-t border-slate-100">
              <button onClick={logout} className="flex items-center justify-center gap-2 w-full py-3 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-all">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Full Name</label>
                <input
                  type="text"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">College / Institution</label>
                <input
                  type="text"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Branch / Dept</label>
                <select
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                >
                  <option value="" disabled>Select Branch</option>
                  {[
                    "Computer Science & Engineering (CSE)",
                    "Information Science & Engineering (ISE)",
                    "Electronics & Communication Engineering (ECE)",
                    "Mechanical Engineering (ME)",
                    "Civil Engineering (CV)",
                    "Electrical & Electronics Engineering (EEE)",
                    "Artificial Intelligence & Machine Learning (AIML)",
                    "Cyber Security",
                    "Data Science",
                    "Biotechnology (BT)",
                    "Aerospace Engineering",
                    "Chemical Engineering",
                    "Other"
                  ].map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Semester</label>
                <select
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                >
                  {['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'].map(s => <option key={s} value={s}>{s} Sem</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Bio</label>
              <textarea
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none min-h-[120px]"
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              {success && <p className="text-emerald-600 font-bold flex items-center gap-1">Changes saved successfully!</p>}
              <button
                type="submit"
                disabled={loading}
                className="ml-auto bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Saving...' : <><Save className="w-5 h-5" /> Save Profile</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
