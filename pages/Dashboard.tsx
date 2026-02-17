
import React, { useState, useEffect } from 'react';
import { resourcesService } from '../services/resources';
import { Resource } from '../types';
import { useAuth } from '../context/AuthContext';
import { Book, BarChart3, Star, Download, Edit, Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate, formatFileSize } from '../utils/format';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (user?.id) {
          const data = await resourcesService.getUserResources(user.id);
          setResources(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  const handleDelete = async (id: string, fileUrl: string) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await resourcesService.deleteResource(id, fileUrl);
        setResources(resources.filter(r => r.id !== id));
      } catch (err: any) {
        console.error(err);
        alert('Failed to delete resource: ' + err.message);
      }
    }
  };

  // Calculate stats based on actual data
  const totalDownloads = resources.reduce((acc, curr) => acc + (curr.downloads || 0), 0);
  const avgRating = resources.length > 0
    ? (resources.reduce((acc, curr) => acc + (curr.averageRating || 0), 0) / resources.length).toFixed(1)
    : '0.0';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 font-display">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back, {user?.name.split(' ')[0]}!</p>
        </div>
        <Link to="/upload" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20">
          <Plus className="w-5 h-5" /> New Upload
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
            <Book className="w-6 h-6" />
          </div>
          <p className="text-4xl font-bold text-slate-900">{resources.length}</p>
          <p className="text-slate-500 font-medium mt-1">Total Resources</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
            <Download className="w-6 h-6" />
          </div>
          <p className="text-4xl font-bold text-slate-900">{totalDownloads}</p>
          <p className="text-slate-500 font-medium mt-1">Total Downloads</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6">
            <Star className="w-6 h-6" />
          </div>
          <p className="text-4xl font-bold text-slate-900">{avgRating}</p>
          <p className="text-slate-500 font-medium mt-1">Average Rating</p>
        </div>
      </div>

      {/* My Uploads List */}
      <h2 className="text-2xl font-bold text-slate-900 mb-8">Your Uploads</h2>
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => <div key={i} className="h-24 bg-slate-200 rounded-2xl animate-pulse" />)}
        </div>
      ) : resources.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Resource</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Privacy</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Stats</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {resources.map(res => (
                <tr key={res.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-6">
                    <p className="font-bold text-slate-900">{res.title}</p>
                    <p className="text-xs text-slate-500 mb-1">{res.subject}</p>
                    <span className="text-xs font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{formatFileSize(res.fileSize)}</span>
                  </td>


                  <td className="px-6 py-6 text-sm text-slate-500">{formatDate(res.uploadDate)}</td>
                  <td className="px-6 py-6">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${res.privacy === 'Public' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {res.privacy}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
                      <span className="flex items-center gap-1"><Download className="w-3 h-3" /> {res.downloads}</span>
                      <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-500" /> {res.averageRating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                      <Link to="/upload" state={{ resource: res }} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Edit className="w-4 h-4" /></Link>
                      <button onClick={() => handleDelete(res.id, res.fileUrl)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-medium">You haven't uploaded any resources yet.</p>
          <Link to="/upload" className="mt-4 inline-block text-indigo-600 font-bold hover:underline">Start Contributing</Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
