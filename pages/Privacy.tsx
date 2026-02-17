
import React from 'react';

const Privacy: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-display mb-6">Privacy Policy</h1>
            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 space-y-6">
                <p>Last updated: February 17, 2026</p>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">1. Introduction</h2>
                    <p>
                        Welcome to VaultHive. We respect your privacy and are committed to protecting your personal data.
                        This privacy policy will inform you as to how we look after your personal data when you visit our website
                        and tell you about your privacy rights and how the law protects you.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">2. Data We Collect</h2>
                    <p>
                        We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                        <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                        <li><strong>Contact Data:</strong> includes email address.</li>
                        <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
                        <li><strong>Profile Data:</strong> includes your username, password, contributions, and feedback.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">3. How We Use Your Data</h2>
                    <p>
                        We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                        <li>To register you as a new user.</li>
                        <li>To manage our relationship with you.</li>
                        <li>To enable you to partake in our resource sharing platform.</li>
                        <li>To improve our website, products/services, marketing or customer relationships.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">4. Data Security</h2>
                    <p>
                        We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Privacy;
