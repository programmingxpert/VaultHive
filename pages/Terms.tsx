
import React from 'react';

const Terms: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-display mb-6">Terms of Service</h1>
            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 space-y-6">
                <p>Last updated: February 17, 2026</p>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">1. Acceptance of Terms</h2>
                    <p>
                        By accessing and using VaultHive, you accept and agree to be bound by the terms and provision of this agreement.
                        In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">2. User Conduct</h2>
                    <p>
                        You agree effectively not to use the platform to:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                        <li>Upload any content that is unlawful, harmful, threatening, abusive, harassing, defaming, vulgar, obscene, or libellous.</li>
                        <li>Impersonate any person or entity.</li>
                        <li>Forge headers or otherwise manipulate identifiers in order to disguise the origin of any content transmitted through the Service.</li>
                        <li>Upload any content that infringes any patent, trademark, trade secret, copyright or other proprietary rights of any party.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">3. Content Ownership & Responsibility</h2>
                    <p>
                        You retain all rights and ownership in your content. VaultHive does not claim any ownership rights in your content.
                        However, by uploading content to VaultHive, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display usage.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">4. Termination</h2>
                    <p>
                        We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Terms;
