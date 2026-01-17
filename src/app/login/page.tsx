'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // TODO: Implement Supabase auth
        console.log('Login:', { email, password });
        setTimeout(() => setIsLoading(false), 1000);
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
            <div className="w-full max-w-md p-8 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
                {/* Header */}
                <div className="text-center mb-8">
                    <span className="text-4xl">🔍</span>
                    <h1 className="text-2xl font-bold text-[var(--foreground)] mt-4">Welcome back</h1>
                    <p className="text-[var(--muted-foreground)] mt-2">
                        Sign in to your investigation workspace
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-[var(--muted-foreground)]">
                            <input type="checkbox" className="rounded border-[var(--border)]" />
                            Remember me
                        </label>
                        <Link href="/forgot-password" className="text-[var(--primary)] hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2.5 px-4 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                    >
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-px bg-[var(--border)]" />
                    <span className="text-sm text-[var(--muted-foreground)]">or continue with</span>
                    <div className="flex-1 h-px bg-[var(--border)]" />
                </div>

                {/* OAuth */}
                <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-[var(--border)] hover:bg-[var(--accent)] transition-colors">
                        <span>🔷</span>
                        <span className="text-sm font-medium text-[var(--foreground)]">Google</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-[var(--border)] hover:bg-[var(--accent)] transition-colors">
                        <span>⬛</span>
                        <span className="text-sm font-medium text-[var(--foreground)]">GitHub</span>
                    </button>
                </div>

                {/* Register link */}
                <p className="text-center text-sm text-[var(--muted-foreground)] mt-6">
                    Don't have an account?{' '}
                    <Link href="/register" className="text-[var(--primary)] hover:underline font-medium">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
