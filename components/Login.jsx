'use client'

import React, { useState } from 'react';
import { User, Lock, Store } from 'lucide-react';

export default function Login({ onNavigate }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');
        
        if (!username || !password) {
            setError('Username dan password harus diisi.');
            return;
        }

        if (username === 'admin' && password === 'admin123') {
            if (onNavigate) {
                onNavigate('dashboard');
            } else {
                window.location.href = '/dashboard';
            }
        } else {
            setError('Username atau password salah. Coba: admin/admin123');
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
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                            className="w-full bg-[#B76E79] hover:bg-[#a05d67] text-white font-medium py-3.5 rounded-xl transition-colors shadow-lg shadow-[#B76E79]/30"
                        >
                            MASUK KE DASHBOARD
                        </button>
                        
                        <button
                            type="button"
                            onClick={() => {
                                setUsername('admin');
                                setPassword('admin123');
                            }}
                            className="w-full bg-[#f9f1f2] hover:bg-[#f2e2e4] text-[#B76E79] font-medium py-3 rounded-xl transition-colors border border-[#B76E79]/20"
                        >
                            ISI KREDENSIAL DEMO
                        </button>
                    </div>
                </form>

                <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Akses Demo (Uji Coba)</p>
                    <div className="flex justify-center gap-4 text-sm text-gray-600">
                        <span>User: <strong className="text-gray-900">admin</strong></span>
                        <span>Pass: <strong className="text-gray-900">admin123</strong></span>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <button type="button" onClick={handleRegisterClick} className="text-sm text-[#B76E79] hover:underline">
                        Belum punya akun? Daftar Mitra
                    </button>
                </div>
            </div>

            <div className="mt-12 text-center text-gray-500 text-sm">
                <p>Mencari Rezeki yang Halal & Thayyib adalah Ibadah.</p>
            </div>
        </div>
    );
}
