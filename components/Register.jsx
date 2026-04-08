'use client'

import React, { useState } from 'react';
import { Store, ChevronRight, Mail, Lock, User, Phone, AtSign } from 'lucide-react';
import { supabase } from '../app/lib/supabase';

export default function Register({ onNavigate }) {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLoginClick = () => {
        if (onNavigate) {
            onNavigate('login');
        } else {
            window.location.href = '/login';
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!fullName || !username || !phone || !email || !password) {
            setError('Semua kolom wajib diisi ya, Ukhti.');
            return;
        }

        // Validate username (no spaces allowed)
        if (username.includes(' ')) {
            setError('Username tidak boleh menggunakan spasi.');
            return;
        }

        setLoading(true);
        try {
            if (!supabase) {
                throw new Error('Supabase belum dikonfigurasi. Silakan hubungi admin toko.');
            }

            // 1. Sign up to Supabase Auth
            const { data, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        username: username,
                        phone: phone,
                        role: 'customer'
                    }
                }
            });

            if (authError) throw authError;

            // 2. Insert mapped profile so user can login with username later
            if (data?.user?.id) {
                const { error: profileError } = await supabase.from('profiles').insert([
                    {
                        id: data.user.id,
                        username: username.toLowerCase(),
                        email: email,
                        full_name: fullName
                    }
                ]);

                if (profileError) {
                    console.error("Profile creation error:", profileError);
                    // We don't block the user, but we warn developer
                }
            }

            alert('Alhamdulillah, akun berhasil dibuat! Silakan masuk (Login) menggunakan Username yang baru saja dibuat.');
            if (onNavigate) {
                onNavigate('login');
            } else {
                window.location.href = '/login';
            }
        } catch (err) {
            setError(err.message || 'Maaf, pendaftaran gagal. Mohon pastikan email/username belum terdaftar sebelumnya.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#f9f1f2] rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-[#B76E79]" />
                    </div>
                    <h2 className="text-2xl font-serif text-[#B76E79] font-semibold">Pendaftaran Pelanggan</h2>
                    <p className="text-gray-500 text-sm mt-1 italic">Silakan buat akun untuk mulai berbelanja</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4 animate-fadeIn">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100 text-center animate-fadeIn">
                            {error}
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-sm text-gray-600 mb-1 flex items-center gap-1"><User className="w-4 h-4" /> Nama Lengkap</label>
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Misal: Aisyah Fatimah" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B76E79] focus:outline-none transition-all" />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 mb-1 flex items-center gap-1"><AtSign className="w-4 h-4" /> Username (Tanpa Spasi)</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} placeholder="Misal: aisyah123" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B76E79] focus:outline-none transition-all" />
                    </div>
                    
                    <div>
                        <label className="block text-sm text-gray-600 mb-1 flex items-center gap-1"><Phone className="w-4 h-4" /> No. WhatsApp</label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08xxxxxxxxxx" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B76E79] focus:outline-none transition-all" />
                    </div>
                    
                    <div>
                        <label className="block text-sm text-gray-600 mb-1 flex items-center gap-1"><Mail className="w-4 h-4" /> Email Aktif</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ukhti@contoh.com" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B76E79] focus:outline-none transition-all" />
                    </div>
                    
                    <div>
                        <label className="block text-sm text-gray-600 mb-1 flex items-center gap-1"><Lock className="w-4 h-4" /> Password Minimal 6 Karakter</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="******" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B76E79] focus:outline-none transition-all" />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full mt-6 bg-[#B76E79] hover:bg-[#a05d67] text-white font-medium py-3.5 rounded-xl transition-all shadow-lg flex justify-center items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : 'shadow-[#B76E79]/30'}`}
                    >
                        {loading ? 'Menyimpan Data...' : 'DAFTAR SEKARANG'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button type="button" onClick={handleLoginClick} className="text-sm text-gray-500 hover:text-[#B76E79] font-medium transition-colors">
                        Sudah punya akun? Masuk (Login)
                    </button>
                </div>
            </div>
        </div>
    );
}
