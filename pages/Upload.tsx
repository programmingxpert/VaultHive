
import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { resourcesService } from '../services/resources';
import { useAuth } from '../context/AuthContext';
import { Resource, ResourceType, Privacy } from '../types';
import { Upload as UploadIcon, File, X, Info, CheckCircle } from 'lucide-react';

import { z } from 'zod';
import { resourceSchema } from '../utils/validation';

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const location = useLocation();
  const editResource = location.state?.resource as Resource | undefined;

  const [formData, setFormData] = useState({
    title: editResource?.title || '',
    subject: editResource?.subject || '',
    semester: editResource?.semester || '1st',
    type: editResource?.type || ResourceType.NOTES,
    year: editResource?.year || '2024',
    description: editResource?.description || '',
    privacy: editResource?.privacy || Privacy.PUBLIC,
    tags: editResource?.tags || ([] as string[])
  });
  const [tagInput, setTagInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // If editing, file is optional (keep existing)
  const isEditMode = !!editResource;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      }
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // 1. Validation
    const result = resourceSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // File validation
    if (!file && !isEditMode) {
      setErrors(prev => ({ ...prev, file: "Please upload a file." }));
      return;
    }

    if (!user) return;

    setLoading(true);
    try {
      if (isEditMode && editResource) {
        await resourcesService.updateResource(editResource.id, formData);
        // TODO: Implement file replacement if a new file is selected (for now just metadata)
      } else {
        if (!file) return;
        await resourcesService.uploadResource(file, {
          ...formData,
          college: user.college,
          uploaderId: user.id,
          uploaderName: user.name,
          uploaderAvatar: user.profilePicture, // Pass the uploader's avatar
        });
      }
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err: any) {
      console.error(err);
      alert('Upload failed: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-600 animate-bounce">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">{isEditMode ? 'Resource Updated!' : 'Resource Uploaded!'}</h1>
        <p className="text-lg text-slate-600">Your changes are live. Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white font-display mb-2">{isEditMode ? 'Edit Resource' : 'Upload Resource'}</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-10">{isEditMode ? 'Update details for your resource.' : 'Contribute to the collective intelligence by sharing high-quality study materials.'}</p>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-8">
          {/* Main Info */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Resource Title</label>
              <input

                type="text"
                placeholder="e.g. Operating Systems Final Exam Solutions"
                className={`w-full p-4 bg-slate-50 dark:bg-slate-800 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white placeholder-slate-400 ${errors.title ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20' : 'border-slate-200 dark:border-slate-700'}`}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              {errors.title && <p className="text-xs text-rose-600 dark:text-rose-400 font-bold">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Subject</label>
                <input

                  type="text"
                  placeholder="e.g. Computer Science"
                  className={`w-full p-4 bg-slate-50 dark:bg-slate-800 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white placeholder-slate-400 ${errors.subject ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20' : 'border-slate-200 dark:border-slate-700'}`}
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
                {errors.subject && <p className="text-xs text-rose-600 dark:text-rose-400 font-bold">{errors.subject}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Year / Batch</label>
                <input

                  type="text"
                  placeholder="e.g. 2024"
                  className={`w-full p-4 bg-slate-50 dark:bg-slate-800 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white placeholder-slate-400 ${errors.year ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20' : 'border-slate-200 dark:border-slate-700'}`}
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                />
                {errors.year && <p className="text-xs text-rose-600 dark:text-rose-400 font-bold">{errors.year}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Description</label>
              <textarea
                className={`w-full p-4 bg-slate-50 dark:bg-slate-800 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none min-h-[120px] text-slate-900 dark:text-white placeholder-slate-400 ${errors.description ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20' : 'border-slate-200 dark:border-slate-700'}`}
                placeholder="Describe what's inside this resource..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              {errors.description && <p className="text-xs text-rose-600 dark:text-rose-400 font-bold">{errors.description}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tags (Press Enter)</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-bold">
                    {tag} <button type="button" onClick={() => removeTag(tag)}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="e.g. Exams, Networking, OS"
                className={`w-full p-4 bg-slate-50 dark:bg-slate-800 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white placeholder-slate-400 ${errors.tags ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20' : 'border-slate-200 dark:border-slate-700'}`}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
              />
              {errors.tags && <p className="text-xs text-rose-600 dark:text-rose-400 font-bold">{errors.tags}</p>}
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">File Upload {isEditMode && '(Optional)'}</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all ${errors.file ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20' : file ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500'
                  }`}
              >
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                {file ? (
                  <>
                    <File className="w-12 h-12 text-indigo-500 dark:text-indigo-400 mb-2" />
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-full px-2">{file.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="mt-2 text-xs font-bold text-red-500 dark:text-red-400 hover:underline">Change File</button>
                  </>
                ) : isEditMode && editResource ? (
                  <>
                    <File className="w-10 h-10 text-slate-400 dark:text-slate-500 mb-2" />
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Current: {editResource.fileName}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Click to replace</p>
                  </>
                ) : (
                  <>
                    <UploadIcon className="w-10 h-10 text-slate-400 dark:text-slate-500 mb-2" />
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Click or Drag & Drop</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">PDF, DOCX, PPT, Images</p>
                  </>
                )}
              </div>
              {errors.file && <p className="text-xs text-rose-600 dark:text-rose-400 font-bold text-center">{errors.file}</p>}
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Resource Type</label>
              <select
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as ResourceType })}
              >
                {Object.values(ResourceType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Privacy</label>
              <div className="flex gap-4">
                <label className="flex-1 flex items-center justify-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-white dark:hover:bg-slate-700 transition-all has-[:checked]:bg-indigo-50 dark:has-[:checked]:bg-indigo-900/30 has-[:checked]:border-indigo-500">
                  <input type="radio" name="privacy" value={Privacy.PUBLIC} checked={formData.privacy === Privacy.PUBLIC} onChange={() => setFormData({ ...formData, privacy: Privacy.PUBLIC })} className="hidden" />
                  <span className={`text-sm font-bold ${formData.privacy === Privacy.PUBLIC ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>Public</span>
                </label>
                <label className="flex-1 flex items-center justify-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-white dark:hover:bg-slate-700 transition-all has-[:checked]:bg-rose-50 dark:has-[:checked]:bg-rose-900/30 has-[:checked]:border-rose-500">
                  <input type="radio" name="privacy" value={Privacy.PRIVATE} checked={formData.privacy === Privacy.PRIVATE} onChange={() => setFormData({ ...formData, privacy: Privacy.PRIVATE })} className="hidden" />
                  <span className={`text-sm font-bold ${formData.privacy === Privacy.PRIVATE ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>Private</span>
                </label>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 flex items-start gap-1">
                <Info className="w-3 h-3 flex-shrink-0" /> Private materials are only visible to your college mates.
              </p>
            </div>

            <button
              disabled={loading || (!file && !isEditMode)}
              className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-indigo-700 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              {loading ? 'Processing...' : isEditMode ? 'Update Resource' : 'Upload Resource'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UploadPage;
