
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/mockApi';
import { Resource, Privacy, Review } from '../types';
import { useAuth } from '../context/AuthContext';
import { FileText, Download, Star, Calendar, User, BookOpen, Lock, MessageSquare, Send, ArrowLeft } from 'lucide-react';

const ResourceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadResource = async () => {
      if (!id) return;
      try {
        const data = await api.fetchResourceById(id);
        if (data) setResource(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadResource();
  }, [id]);

  const hasAccess = resource?.privacy === Privacy.PUBLIC || (resource?.college === user?.college);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !reviewText.trim()) return;
    setSubmitting(true);
    try {
      const newReview = await api.submitReview(id, { comment: reviewText, rating: reviewRating });
      if (resource) {
        setResource({
          ...resource,
          reviews: [newReview, ...resource.reviews]
        });
      }
      setReviewText('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse">Loading details...</div>;
  if (!resource) return <div className="p-10 text-center">Resource not found.</div>;

  if (!hasAccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-rose-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Access Restricted</h1>
        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
          This resource is set to <strong>Private</strong>. Only students from <span className="font-bold">{resource.college}</span> can access this material.
        </p>
        <button onClick={() => navigate(-1)} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold">Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Browse
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          {/* Header Info */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm mb-10">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
                resource.privacy === Privacy.PUBLIC ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
              }`}>
                {resource.privacy}
              </span>
              <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">{resource.type}</span>
            </div>

            <h1 className="text-4xl font-bold text-slate-900 mb-4">{resource.title}</h1>
            <p className="text-lg text-slate-600 mb-8">{resource.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-slate-50 rounded-2xl">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Subject</p>
                <p className="font-semibold text-slate-900">{resource.subject}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Semester</p>
                <p className="font-semibold text-slate-900">{resource.semester}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Batch/Year</p>
                <p className="font-semibold text-slate-900">{resource.year}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Rating</p>
                <div className="flex items-center gap-1 font-semibold text-amber-500">
                  <Star className="w-4 h-4 fill-current" /> {resource.averageRating}
                </div>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-indigo-600" /> Reviews ({resource.reviews.length})
            </h2>

            {user && (
              <form onSubmit={handleSubmitReview} className="mb-10 p-6 bg-slate-50 rounded-2xl">
                <label className="block text-sm font-bold text-slate-700 mb-3">Add a Review</label>
                <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star} 
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className={`${reviewRating >= star ? 'text-amber-500' : 'text-slate-300'} transition-colors`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
                <textarea 
                  className="w-full p-4 bg-white border border-slate-200 rounded-xl mb-4 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
                  placeholder="What do you think about this resource?"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  required
                />
                <button 
                  disabled={submitting}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? 'Posting...' : <><Send className="w-4 h-4" /> Post Review</>}
                </button>
              </form>
            )}

            <div className="space-y-6">
              {resource.reviews.length > 0 ? resource.reviews.map(review => (
                <div key={review.id} className="border-b border-slate-100 pb-6 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs">
                        {review.userName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{review.userName}</p>
                        <p className="text-xs text-slate-400">{review.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 pl-10">{review.comment}</p>
                </div>
              )) : (
                <p className="text-center py-10 text-slate-400 font-medium">No reviews yet. Be the first!</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm sticky top-24">
            <div className="flex items-center justify-center h-48 bg-indigo-50 rounded-2xl border border-dashed border-indigo-200 mb-6">
              <div className="text-center">
                <FileText className="w-12 h-12 text-indigo-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{resource.fileName.split('.').pop()}</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">File Name</span>
                <span className="font-semibold text-slate-700 truncate max-w-[150px]">{resource.fileName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">File Size</span>
                <span className="font-semibold text-slate-700">{resource.fileSize}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Downloads</span>
                <span className="font-semibold text-slate-700">{resource.downloads}</span>
              </div>
            </div>

            <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 mb-4">
              <Download className="w-5 h-5" /> Download File
            </button>

            <div className="pt-6 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Uploaded By</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                  <img src={`https://picsum.photos/seed/${resource.uploaderId}/200`} alt="Uploader" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{resource.uploaderName}</p>
                  <p className="text-xs text-slate-500">{resource.college}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetail;
