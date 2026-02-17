import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resourcesService } from '../services/resources';
import { Resource, Privacy, Review } from '../types';
import { useAuth } from '../context/AuthContext';
import { FileText, Download, Star, Calendar, User, BookOpen, Lock, MessageSquare, Send, ArrowLeft, Pencil, Trash2, X } from 'lucide-react';
import { reviewSchema } from '../utils/validation';
import { formatFileSize } from '../utils/format';

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
        const data = await resourcesService.getResourceById(id);
        if (data) {
          setResource(data);
          // Fetch reviews separately
          const reviews = await resourcesService.getReviews(id);
          setResource(prev => prev ? ({ ...prev, reviews }) : null);
        }
      } catch (err) {
        console.error('Error loading resource:', err);
      } finally {
        setLoading(false);
      }
    };
    loadResource();
  }, [id]);

  // Privacy Check Logic
  const hasAccess = resource?.privacy === Privacy.PUBLIC || (resource?.college === user?.college);

  // Handle Review Submission (Mock for now or needs update in service)
  // We need addReview to service if we want it real. For now, skipping real backend review update unless requested.
  // The user asked for "Browse" and "Privacy". Review is extra but good to keep working if possible.
  // I will leave review submission as mock-ish local state update or simple log for now, 
  // as the prompt didn't explicitly ask for review backend implementation, but I should probably disable it if real backend is needed.
  // Actually, resources table has `reviews` jsonb column. I can implement `addReview` in service easily.
  // I'll stick to local state update for now to avoid scope creep, or just comment it out.
  // Wait, I should probably implement `addReview` in service for completeness if I have time, but sticking to requested scope first.

  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);



  // ...

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !user || !resource) return;

    // Validation
    const validation = reviewSchema.safeParse({ rating: reviewRating, comment: reviewText });
    if (!validation.success) {
      setStatus({ type: 'error', message: validation.error.issues[0].message });
      return;
    }

    setSubmitting(true);
    setStatus(null);

    try {
      const newReview = await resourcesService.addReview(id, {
        userId: user.id,
        userName: user.name,
        userAvatar: user.profilePicture,
        rating: reviewRating,
        comment: reviewText
      });

      // Update state: Remove old review by this user if exists, then add new one
      const otherReviews = resource.reviews.filter(r => r.userId !== user.id);
      const updatedReviews = [newReview, ...otherReviews];

      setResource({ ...resource, reviews: updatedReviews });

      setReviewText('');
      setStatus({ type: 'success', message: 'Review posted successfully!' });

      // Clear success message
      setTimeout(() => setStatus(null), 3000);

    } catch (err: any) {
      console.error(err);
      setStatus({ type: 'error', message: 'Failed to submit review: ' + (err.message || 'Unknown error') });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse">Loading details...</div>;
  if (!resource) return <div className="p-10 text-center">Resource not found.</div>;

  if (!hasAccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-rose-600 dark:text-rose-400" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Access Restricted</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
          This resource is set to <strong>Private</strong>. Only students from <span className="font-bold text-indigo-600 dark:text-indigo-400">{resource.college}</span> can access this material.
        </p>
        <button onClick={() => navigate(-1)} className="px-6 py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors">Go Back</button>
      </div>
    );
  }

  // Check if user has already reviewed to pre-fill (optional UX improvement, for now just handling submission)
  // We could implement useEffect to setReviewText/Rating if user review exists in resource.reviews

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 font-semibold mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Browse
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          {/* Header Info */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm mb-10">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${resource.privacy === Privacy.PUBLIC
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                }`}>
                {resource.privacy}
              </span>
              <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-sm font-bold">{resource.type}</span>
            </div>

            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{resource.title}</h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">{resource.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Subject</p>
                <p className="font-semibold text-slate-900 dark:text-white">{resource.subject}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Semester</p>
                <p className="font-semibold text-slate-900 dark:text-white">{resource.semester}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Batch/Year</p>
                <p className="font-semibold text-slate-900 dark:text-white">{resource.year}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Rating</p>
                <div className="flex items-center gap-1 font-semibold text-amber-500">
                  <Star className="w-4 h-4 fill-current" /> {resource.averageRating ? Number(resource.averageRating).toFixed(1) : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> Reviews ({resource.reviews.length})
            </h2>

            {user && (
              <form onSubmit={handleSubmitReview} className="mb-10 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                  {resource.reviews.some(r => r.userId === user.id) ? 'Edit Your Review' : 'Add a Review'}
                </label>
                <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className={`${reviewRating >= star ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600'} transition-colors`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
                <textarea
                  className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl mb-4 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px] text-slate-900 dark:text-white placeholder-slate-400"
                  placeholder="What do you think about this resource?"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  required
                />

                {status && (
                  <div className={`mb-4 p-3 rounded-lg text-sm font-bold ${status.type === 'success' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                    {status.message}
                  </div>
                )}

                <button
                  disabled={submitting}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-600/20"
                >
                  {submitting ? 'Posting...' : <><Send className="w-4 h-4" /> {resource.reviews.some(r => r.userId === user.id) ? 'Update Review' : 'Post Review'}</>}
                </button>
              </form>
            )}

            <div className="space-y-6">
              {resource.reviews.length > 0 ? resource.reviews.map(review => (
                <div key={review.id} className="border-b border-slate-100 dark:border-slate-800 pb-6 last:border-0 group">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs overflow-hidden dark:text-slate-300">
                        {review.userAvatar ? (
                          <img src={review.userAvatar} alt={review.userName} className="w-full h-full object-cover" />
                        ) : (
                          review.userName.charAt(0)
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{review.userName}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{review.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-slate-200 dark:text-slate-700'}`} />
                        ))}
                      </div>
                      {user && user.id === review.userId && (
                        <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setReviewText(review.comment);
                              setReviewRating(review.rating);
                              document.querySelector('textarea')?.focus();
                            }}
                            className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded transition-colors"
                            title="Edit Review"
                          >
                            <FileText className="w-3 h-3" />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm('Are you sure you want to delete your review?')) {
                                try {
                                  await resourcesService.deleteReview(review.id);
                                  setResource({
                                    ...resource,
                                    reviews: resource.reviews.filter(r => r.id !== review.id)
                                  });
                                  setStatus({ type: 'success', message: 'Review deleted.' });
                                  setTimeout(() => setStatus(null), 3000);
                                  // Reset form if it was matching this review
                                  setReviewText('');
                                  setReviewRating(5);
                                } catch (e) {
                                  alert('Failed to delete review');
                                }
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded transition-colors"
                            title="Delete Review"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 pl-10">{review.comment}</p>
                </div>
              )) : (
                <p className="text-center py-10 text-slate-400 dark:text-slate-500 font-medium">No reviews yet. Be the first!</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24">
            <div className="flex items-center justify-center h-48 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-dashed border-indigo-200 dark:border-indigo-800 mb-6">
              <div className="text-center">
                <FileText className="w-12 h-12 text-indigo-400 dark:text-indigo-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{resource.fileName.split('.').pop()}</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 dark:text-slate-500">File Name</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[150px]" title={resource.fileName}>{resource.fileName}</span>
              </div>


              <div className="flex justify-between text-sm">
                <span className="text-slate-400 dark:text-slate-500">File Size</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{formatFileSize(resource.fileSize)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 dark:text-slate-500">Downloads</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{resource.downloads}</span>
              </div>
            </div>

            <button
              onClick={() => window.open(resource.fileUrl, '_blank')}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 hover:scale-[1.02] transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 mb-4"
            >
              <Download className="w-5 h-5" /> Download File
            </button>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Uploaded By</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                  <img src={resource.uploaderAvatar || '/default_profile.jpg'} alt="Uploader" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{resource.uploaderName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{resource.college}</p>
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
