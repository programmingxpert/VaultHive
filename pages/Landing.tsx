
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/mockApi';
import { Resource, LeaderboardEntry } from '../types';
import ResourceCard from '../components/ResourceCard';
import { ArrowRight, TrendingUp, Award, Zap, ShieldCheck } from 'lucide-react';

const Landing: React.FC = () => {
  const [trending, setTrending] = useState<Resource[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [resData, leadData] = await Promise.all([
          api.fetchResources(),
          api.fetchLeaderboard()
        ]);
        setTrending(resData.slice(0, 3));
        setLeaderboard(leadData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="relative isolate overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative pt-20 pb-24 lg:pt-32 lg:pb-40 overflow-hidden">
        {/* Abstract Blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 dark:bg-indigo-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-4000" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
            Unlock the Collective <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Intelligence</span> of Your College
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
            A decentralized resource sharing platform built for the students of Yugastr 2026.
            Access premium notes, question papers, and projects within your institution.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:scale-105 transition-all flex items-center justify-center gap-2">
              Get Started for Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/browse" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-105 transition-all">
              Browse Library
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-8 grayscale opacity-50 dark:opacity-70 dark:grayscale-0">
            <div className="flex items-center gap-2 font-display font-bold text-slate-600 dark:text-slate-400"> <ShieldCheck className="text-indigo-600 dark:text-indigo-400" /> Verified Content</div>
            <div className="flex items-center gap-2 font-display font-bold text-slate-600 dark:text-slate-400"> <Zap className="text-amber-500 dark:text-amber-400" /> Instant Access</div>
            <div className="flex items-center gap-2 font-display font-bold text-slate-600 dark:text-slate-400"> <Award className="text-purple-600 dark:text-purple-400" /> Community Rated</div>
          </div>
        </div>
      </div>

      {/* Trending Section */}
      <section className="py-20 bg-slate-100 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="text-indigo-600 dark:text-indigo-400" /> Trending Resources
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2">The most downloaded materials this week.</p>
            </div>
            <Link to="/browse" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline hidden sm:block">View All Library</Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
              {trending.map(resource => (
                <div key={resource.id} className="dark:bg-slate-800 rounded-2xl p-4">
                  <ResourceCard resource={resource} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">College Leaderboard</h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                Compete with other institutions to become the most resourceful hub.
                Upload high-quality materials to boost your college ranking and unlock exclusive platform perks.
              </p>
              <div className="space-y-4">
                {leaderboard.map((entry, idx) => (
                  <div key={entry.college} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold ${idx === 0 ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                        {entry.rank}
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{entry.college}</span>
                    </div>
                    <span className="text-sm font-medium text-slate-400 dark:text-slate-500">{entry.uploads} uploads</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <img src="https://picsum.photos/seed/yugastr/600/400" alt="Dashboard Preview" className="relative rounded-2xl shadow-2xl border-4 border-white dark:border-slate-800 grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" />
              <div className="absolute -bottom-6 -right-6 bg-indigo-600 text-white p-6 rounded-2xl shadow-xl dark:shadow-indigo-900/20 animate-bounce-slow">
                <p className="text-3xl font-bold">15,000+</p>
                <p className="text-sm opacity-80">Students registered</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
