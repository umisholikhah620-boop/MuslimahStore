'use client'

import React, { useState } from 'react';
import { User, Lock, Store } from 'lucide-react';
import { supabase } from '../app/lib/supabase';

export default function Login({ onNavigate }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!email || !password) {
            setError('Email dan password harus diisi.');
            return;
        }

        setLoading(true);
        try {
            if (!supabase) {
                throw new Error('Supabase belum dikonfigurasi. Gunakan login demo.');
            }

            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email: email.includes('@') ? email : `${email}@admin.com`, // Support username and email
                password: password
            });

            if (authError) throw authError;

            if (onNavigate) {
                onNavigate('dashboard');
            } else {
                window.location.href = '/dashboard';
            }
        } catch (err) {
            // Fallback for demo credentials if Supabase is not configured or fails
            if (email === 'admin' && password === 'admin123') {
                if (onNavigate) {
                    onNavigate('dashboard');
                } else {
                    window.location.href = '/dashboard';
                }
                return;
            }
            setError(err.message || 'Login gagal. Cek email dan password Ukhti.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterClick = () => {
        if (onNavigate) {
            onNavigate('register');
        } else {
            window.location.href = '/register';
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-[#f9f1f2] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Store className="w-8 h-8 text-[#B76E79]" />
                    </div>
                    <h1 className="text-3xl font-serif text-[#B76E79] font-semibold mb-2">Muslimah Store</h1>
                    <h2 className="text-xl text-gray-800 font-medium">Ahlan wa Sahlan, Ukhti</h2>
                    <p className="text-sm text-gray-500 mt-2 italic">
                        "Awali pekerjaan dengan Bismillah untuk menjemput keberkahan."
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100 animate-fadeIn text-center">
                            {error}
                        </div>
                    )}
                    
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Username / Email Pegawai"
                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B76E79] focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B76E79] focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-[#B76E79] hover:bg-[#a05d67] text-white font-medium py-3.5 rounded-xl transition-colors shadow-lg shadow-[#B76E79]/30 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Memproses...' : 'MASUK KE DASHBOARD'}
                        </button>
                    </div>
                </form>


            </div>

            <div className="mt-12 text-center text-gray-500 text-sm">
                <p>Mencari Rezeki yang Halal & Thayyib adalah Ibadah.</p>
            </div>
        </div>
    );
}
