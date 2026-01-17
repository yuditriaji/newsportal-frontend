'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        setIsLoading(true);
        // TODO: Implement Supabase auth
        console.log('Register:', formData);
        setTimeout(() => setIsLoading(false), 1000);
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-8">
            <div className="w-full max-w-md p-8 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
                {/* Header */}
                <div className="text-center mb-8">
                    <span className="text-4xl">🔍</span>
                    <h1 className="text-2xl font-bold text-[var(--foreground)] mt-4">Create account</h1>
                    <p className="text-[var(--muted-foreground)] mt-2">
                        Start your investigation journey
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="John Doe"
                            required
                            className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="you@example.com"
                            required
                            className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                            Password
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="••••••••"
                            required
                            minLength={8}
                            className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            placeholder="••••••••"
                            required
                            className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                    </div>
                    <label className="flex items-start gap-2 text-sm text-[var(--muted-foreground)]">
                        <input
                            type="checkbox"
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                            required
                            className="mt-1 rounded border-[var(--border)]"
                        />
                        <span>
                            I agree to the{' '}
                            <Link href="/legal/terms" className="text-[var(--primary)] hover:underline">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="/legal/privacy" className="text-[var(--primary)] hover:underline">
                                Privacy Policy
                            </Link>
                        </span>
                    </label>
                    <button
                        type="submit"
                        disabled={isLoading || !agreedToTerms}
                        className="w-full py-2.5 px-4 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                    >
                        {isLoading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>

                {/* Login link */}
                <p className="text-center text-sm text-[var(--muted-foreground)] mt-6">
                    Already have an account?{' '}
                    <Link href="/login" className="text-[var(--primary)] hover:underline font-medium">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
