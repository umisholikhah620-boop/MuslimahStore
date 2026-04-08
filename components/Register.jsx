'use client'

import React, { useState } from 'react';
import { Store, ChevronRight, Mail, Lock, User, Phone } from 'lucide-react';
import { supabase } from '../app/lib/supabase';

export default function Register({ onNavigate }) {
    const [fullName, setFullName] = useState('');
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
        
        if (!fullName || !phone || !email || !password) {
            setError('Semua kolom wajib diisi ya, Ukhti.');
            return;
        }

        setLoading(true);
        try {
            if (!supabase) {
                throw new Error('Supabase belum dikonfigurasi. Silakan hubungi admin toko.');
            }

            const { data, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        phone: phone,
                        role: 'customer' // Memberi identitas bahwa ini akun pelanggan
                    }
                }
            });

            if (authError) throw authError;

            alert('Alhamdulillah, akun berhasil dibuat! Silakan pilih "Customer" di layar login.');
            if (onNavigate) {
                onNavigate('login');
            } else {
                window.location.href = '/login';
            }
        } catch (err) {
            setError(err.message || 'Maaf, pendaftaran gagal. Mohon pastikan email belum terdaftar sebelumnya.');
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
