
import React, { useState, useEffect } from 'react';
import { resourcesService } from '../services/resources';
import { useAuth } from '../context/AuthContext';
import { Resource, ResourceType } from '../types';
import ResourceCard from '../components/ResourceCard';
import { Search, Filter, SlidersHorizontal, RotateCcw, ChevronDown } from 'lucide-react';

const Browse: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    semester: 'All',
    type: 'All',
    branch: 'All',
    year: 'All',
    privacy: 'All'
  });
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'rating' | 'downloads'>('latest');
  const [showFilters, setShowFilters] = useState(false);

  const semesters = ['All', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
  const types = ['All', ...Object.values(ResourceType)];
  // Updated branches to match Profile options roughly or keep generic
  const branches = [
    'All',
    'Computer Science',
    'Information Science',
    'Electronics',
    'Mechanical',
    'Civil',
    'AIML'
  ];

  const fetchFiltered = async () => {
    setLoading(true);
    try {
      // If not logged in, maybe only show public? Or require login?
      // Requirement: System must verify user's college.
      // If user is guest, user.college is undefined.
      // Query defaults to Public if college doesn't match string "undefined".
      // But safer to pass specific logic.
      const userCollege = user?.college || 'Guest';

      const data = await resourcesService.getAccessibleResources(userCollege, {
        search: searchTerm,
        semester: filters.semester,
        type: filters.type,
        branch: filters.branch,
        year: filters.year,
        privacy: filters.privacy,
        sortBy: sortBy
      });

      setResources(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFiltered();
    }, 500); // Debounce
    return () => clearTimeout(timer);
  }, [searchTerm, filters, sortBy, user?.college]); // Re-fetch if filters or user college changes

  const resetFilters = () => {
    setFilters({ semester: 'All', type: 'All', branch: 'All' });
    setSearchTerm('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white font-display">Resource Library</h1>
          {user?.college && <p className="text-slate-500 dark:text-slate-400 mt-2">Showing Public resources & Private content from <span className="font-semibold text-indigo-600 dark:text-indigo-400">{user.college}</span></p>}
        </div>

        <div className="relative flex-1 max-w-xl group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" />
          <input
            type="text"
            placeholder="Search by title, subject or tags..."
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white placeholder-slate-400 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all ${showFilters ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
        >
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      {/* Filter Sidebar/Top Bar */}
      {showFilters && (
        <div className="mb-10 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm animate-in zoom-in-95 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Semester</label>
              <select
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white"
                value={filters.semester}
                onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
              >
                {semesters.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Resource Type</label>
              <select
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white"
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                {types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Branch</label>
              <select
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white"
                value={filters.branch}
                onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
              >
                {branches.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="w-full flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium py-2.5 transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map(resource => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No resources found</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
};

export default Browse;
