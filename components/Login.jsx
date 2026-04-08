'use client'

import React, { useState } from 'react';
import { User, Lock, Store } from 'lucide-react';
import { supabase } from '../app/lib/supabase';

export default function Login({ onNavigate }) {
    const [loginRole, setLoginRole] = useState('customer'); // 'customer' or 'admin'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!email || !password) {
            setError(loginRole === 'customer' ? 'Username dan password harus diisi.' : 'Email dan password harus diisi.');
            return;
        }

        setLoading(true);
        try {
            if (!supabase) {
                throw new Error('Supabase belum dikonfigurasi. Gunakan login demo.');
            }

            let finalEmail = email;

            // Jika role adalah customer dan input tidak mengandung @ (berarti dia memasukkan Username)
            if (loginRole === 'customer' && !email.includes('@')) {
                // Cari email asli dari tabel profiles berdasarkan username
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('email')
                    .eq('username', email.toLowerCase())
                    .single();

                if (profileError || !profile) {
                    throw new Error('Username tidak ditemukan di sistem kami.');
                }
                
                finalEmail = profile.email;
            } else if (loginRole === 'admin' && !email.includes('@') && email !== 'admin') {
                finalEmail = `${email}@admin.com`;
            }

            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email: finalEmail,
                password: password
            });

            if (authError) throw authError;

            if (onNavigate) {
                onNavigate(loginRole === 'admin' ? 'dashboard' : 'customer');
            } else {
                window.location.href = loginRole === 'admin' ? '/dashboard' : '/customer';
            }
        } catch (err) {
            // Fallback for demo credentials if Supabase is not configured or fails
            if (loginRole === 'admin' && email === 'admin' && password === '123') {
                if (onNavigate) onNavigate('dashboard');
                else window.location.href = '/dashboard';
                return;
            } else if (loginRole === 'customer' && email === 'user' && password === 'user123') {
                if (onNavigate) onNavigate('customer');
                else window.location.href = '/customer';
                return;
            }
            setError(err.message || 'Login gagal. Silakan periksa kembali ketikan Anda.');
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

                <div className="flex mb-6 bg-gray-50 p-1 rounded-xl border border-gray-100">
                    <button
                        type="button"
                        onClick={() => setLoginRole('customer')}
                        className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${loginRole === 'customer' ? 'bg-white shadow-sm text-[#B76E79]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Customer
                    </button>
                    <button
                        type="button"
                        onClick={() => setLoginRole('admin')}
                        className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${loginRole === 'admin' ? 'bg-white shadow-sm text-[#B76E79]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Admin
                    </button>
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
                            placeholder={loginRole === 'admin' ? "Email / Username Pegawai" : "Username (tanpa spasi) atau Email"}
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
                            {loading ? 'Memproses...' : (loginRole === 'admin' ? 'MASUK KE DASHBOARD ADMIN' : 'MASUK KE TOKO')}
                        </button>
                        
                        {loginRole === 'customer' && (
                            <button 
                                type="button" 
                                onClick={handleRegisterClick} 
                                className="text-sm text-gray-500 hover:text-[#B76E79] mt-2 transition-colors font-medium"
                            >
                                Pelanggan Baru? Daftar Akun di sini
                            </button>
                        )}
                    </div>
                </form>


            </div>

            <div className="mt-12 text-center text-gray-500 text-sm">
                <p>Mencari Rezeki yang Halal & Thayyib adalah Ibadah.</p>
            </div>
        </div>
    );
}
