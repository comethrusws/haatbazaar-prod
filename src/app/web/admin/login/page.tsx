'use client';

import { adminLogin } from '@/actions/adminAuth';
import { useActionState } from 'react';

type LoginState = {
    error?: string;
    message?: string;
} | null;

export default function AdminLoginPage() {
    const [state, formAction, isPending] = useActionState(adminLogin, null);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Admin Login</h1>
                <form action={formAction} className="space-y-4">
                    {state?.error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center">
                            {state.error}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            name="email"
                            type="email"
                            defaultValue="system@haatbazaar.com"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            name="password"
                            type="password"
                            defaultValue="admin123"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-bold disabled:opacity-50"
                    >
                        {isPending ? 'Logging in...' : 'Login'}
                    </button>

                </form>
            </div>
        </div>
    );
}
