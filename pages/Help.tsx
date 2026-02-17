
import React from 'react';
import { HelpCircle, FileText, Upload, Shield } from 'lucide-react';

const Help: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-display mb-2">Help Center</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-10">Frequently asked questions and guides to help you navigate VaultHive.</p>

            <div className="grid gap-8">
                {/* Getting Started */}
                <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                            <HelpCircle className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Getting Started</h2>
                    </div>
                    <div className="space-y-4">
                        <details className="group">
                            <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                                <span>What is VaultHive?</span>
                                <span className="transition group-open:rotate-180">
                                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                </span>
                            </summary>
                            <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm leading-relaxed">
                                VaultHive is a decentralized resource sharing platform designed for students. It allows you to share notes, past exam papers, and project resources with your peers securely and efficiently.
                            </p>
                        </details>
                        <details className="group">
                            <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                                <span>Is it specific to my college?</span>
                                <span className="transition group-open:rotate-180">
                                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                </span>
                            </summary>
                            <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm leading-relaxed">
                                Yes! While many resources are public, you can also filter content by your specific college to find materials most relevant to your curriculum.
                            </p>
                        </details>
                    </div>
                </section>

                {/* Uploading Resources */}
                <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                            <Upload className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Uploading & Managing</h2>
                    </div>
                    <div className="space-y-4">
                        <details className="group">
                            <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400">
                                <span>How do I upload a document?</span>
                                <span className="transition group-open:rotate-180">
                                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                </span>
                            </summary>
                            <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm leading-relaxed">
                                Click the "Upload" button in the navigation bar. You'll need to provide a title, subject, description, and the file itself. You can also tag your resource to make it easier to find.
                            </p>
                        </details>
                        <details className="group">
                            <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400">
                                <span>Can I delete my uploads?</span>
                                <span className="transition group-open:rotate-180">
                                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                </span>
                            </summary>
                            <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm leading-relaxed">
                                Yes, you can manage your uploads from your Dashboard. Simply click the delete (trash can) icon next to any resource you've uploaded.
                            </p>
                        </details>
                    </div>
                </section>

                {/* Account & Privacy */}
                <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg text-rose-600 dark:text-rose-400">
                            <Shield className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Account & Privacy</h2>
                    </div>
                    <div className="space-y-4">
                        <details className="group">
                            <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400">
                                <span>Who can see my profile?</span>
                                <span className="transition group-open:rotate-180">
                                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                </span>
                            </summary>
                            <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm leading-relaxed">
                                Your basic profile (name, college) is visible to other users. You can control the privacy of your uploaded resources (Public vs Private to your college) during upload.
                            </p>
                        </details>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Help;
