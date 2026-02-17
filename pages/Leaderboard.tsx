
import React, { useState, useEffect } from 'react';
import { resourcesService } from '../services/resources';
import { Trophy, Medal, Building2, User, Download, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LeaderboardStats {
    topUsers: any[];
    topColleges: any[];
}

const Leaderboard: React.FC = () => {
    const [stats, setStats] = useState<LeaderboardStats>({ topUsers: [], topColleges: [] });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'users' | 'colleges'>('users');

    useEffect(() => {
        // Mock Data for demonstration
        const MOCK_DATA = {
            topUsers: [
                { name: 'Neha Sharma', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', uploads: 42, downloads: 1250 },
                { name: 'Suyash Agarwal', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', uploads: 38, downloads: 980 },
                { name: 'Joyce Mathur', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael', uploads: 35, downloads: 850 },
                { name: 'Kapoor Mathur', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily', uploads: 29, downloads: 720 },
                { name: 'Pranav Deep', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', uploads: 24, downloads: 610 },
            ],
            topColleges: [
                { name: 'Ramaiyah Institute of Technology, Bangalore', uploads: 156, avgRating: '4.8' },
                { name: 'Alliance University, Bangalore', uploads: 142, avgRating: '4.7' },
                { name: 'Christ University, Bangalore', uploads: 128, avgRating: '4.6' },
                { name: 'State Polytechnic, Mumbai', uploads: 95, avgRating: '4.5' },
                { name: 'National Arts College, Kolkata', uploads: 82, avgRating: '4.4' },
            ]
        };

        setStats(MOCK_DATA);
        setLoading(false);
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white font-display mb-4">Leaderboard</h1>
                <p className="text-lg text-slate-500 dark:text-slate-400 mb-6">Recognizing the top contributors and most active communities.</p>

                <div className="inline-block bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 rounded-lg px-4 py-2">
                    <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" /> Mock Data for Demonstration
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-10">
                <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl inline-flex">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'users' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        <User className="w-4 h-4" /> Top Contributors
                    </button>
                    <button
                        onClick={() => setActiveTab('colleges')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'colleges' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        <Building2 className="w-4 h-4" /> Top Colleges
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4 max-w-3xl mx-auto">
                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />)}
                </div>
            ) : (
                <div className="max-w-4xl mx-auto">
                    {activeTab === 'users' ? (
                        <div className="space-y-4">
                            {stats.topUsers.map((user, index) => (
                                <div key={index} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-6 hover:shadow-md transition-shadow">
                                    <div className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold text-xl ${index === 0 ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                                        index === 1 ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' :
                                            index === 2 ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                                                'bg-slate-50 text-slate-400 dark:bg-slate-800/50 dark:text-slate-500'
                                        }`}>
                                        {index + 1}
                                    </div>

                                    <div className="flex-1 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                            <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white text-lg">{user.name}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Top student</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-8 text-right">
                                        <div className="hidden sm:block">
                                            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Uploads</p>
                                            <p className="font-bold text-slate-900 dark:text-white">{user.uploads}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Downloads</p>
                                            <p className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 justify-end">
                                                <Download className="w-3 h-3" /> {user.downloads}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {stats.topUsers.length === 0 && <div className="text-center py-10 text-slate-500 dark:text-slate-400">No data available yet.</div>}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {stats.topColleges.map((college, index) => (
                                <div key={index} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-6 hover:shadow-md transition-shadow">
                                    <div className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold text-xl ${index === 0 ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                                        index === 1 ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' :
                                            index === 2 ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                                                'bg-slate-50 text-slate-400 dark:bg-slate-800/50 dark:text-slate-500'
                                        }`}>
                                        {index + 1}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">{college.name}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Academic Institution</p>
                                    </div>

                                    <div className="flex gap-8 text-right">
                                        <div className="hidden sm:block">
                                            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Avg Rating</p>
                                            <p className="font-bold text-amber-500 flex items-center gap-1 justify-end">
                                                <User className="w-3 h-3" /> {college.avgRating}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Resources</p>
                                            <p className="font-bold text-indigo-600 dark:text-indigo-400">{college.uploads}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {stats.topColleges.length === 0 && <div className="text-center py-10 text-slate-500 dark:text-slate-400">No data available yet.</div>}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Leaderboard;
