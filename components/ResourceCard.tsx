
import React from 'react';
import { Link } from 'react-router-dom';
import { Resource, Privacy } from '../types';
import { Download, Eye, Star, Book, Shield, ShieldAlert } from 'lucide-react';

interface ResourceCardProps {
  resource: Resource;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col">
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start mb-4">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            resource.privacy === Privacy.PUBLIC 
              ? 'bg-emerald-100 text-emerald-700' 
              : 'bg-rose-100 text-rose-700'
          }`}>
            {resource.privacy === Privacy.PUBLIC ? <Shield className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
            {resource.privacy}
          </span>
          <div className="flex items-center gap-1 text-amber-500 font-medium text-sm">
            <Star className="w-4 h-4 fill-current" />
            {resource.averageRating}
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-1">
          {resource.title}
        </h3>
        <p className="text-sm text-slate-500 font-medium mb-3">{resource.subject} • {resource.semester}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {resource.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] uppercase tracking-wider font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 border-t border-slate-100 pt-3">
          <Book className="w-3 h-3" />
          <span>{resource.college}</span>
        </div>
      </div>

      <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between">
        <Link 
          to={`/resource/${resource.id}`}
          className="text-slate-600 hover:text-indigo-600 text-sm font-semibold flex items-center gap-1"
        >
          <Eye className="w-4 h-4" /> Details
        </Link>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors">
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ResourceCard;
