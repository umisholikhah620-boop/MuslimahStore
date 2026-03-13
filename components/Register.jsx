'use client'

import React, { useState } from 'react';
import { Store, ShieldCheck, ChevronRight, Mail, Lock } from 'lucide-react';
import { supabase } from '../app/lib/supabase';

export default function Register({ onNavigate }) {
    const [step, setStep] = useState(1);
    const [agreed1, setAgreed1] = useState(false);
    const [agreed2, setAgreed2] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [storeName, setStoreName] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLoginClick = () => {
        if (onNavigate) {
            onNavigate('login');
        } else {
            window.location.href = '/login';
        }
    };

    const handleFinishRegister = async () => {
        setError('');
        if (!email || !password) {
            setError('Email dan password wajib diisi.');
            return;
        }

        setLoading(true);
        try {
            if (!supabase) {
                throw new Error('Supabase belum dikonfigurasi. Silakan hubungi pengelola.');
            }

            const { data, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        store_name: storeName,
                        owner_name: ownerName,
                        phone: phone
                    }
                }
            });

            if (authError) throw authError;

            alert('Alhamdulillah, pendaftaran berhasil! Silakan cek email Ukhti untuk verifikasi.');
            if (onNavigate) {
                onNavigate('login');
            } else {
                window.location.href = '/login';
            }
        } catch (err) {
            setError(err.message || 'Maaf, pendaftaran gagal. Mohon coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 font-sans">
            <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-serif text-[#B76E79] font-semibold">Pendaftaran Mitra</h2>
                    <p className="text-gray-500 text-sm mt-1">Bergabunglah dalam ekosistem niaga Islami</p>
                </div>

                <div className="flex items-center justify-center mb-8">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-[#B76E79] text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                    <div className={`w-16 h-0.5 mx-2 ${step >= 2 ? 'bg-[#B76E79]' : 'bg-gray-200'}`}></div>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-[#B76E79] text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                </div>

                <hr className="border-[#B76E79] opacity-20 mb-8" />

                {step === 1 && (
                    <div className="space-y-4 animate-fadeIn">
                        <h3 className="font-medium text-gray-800 flex items-center gap-2 mb-4">
                            <Store className="w-5 h-5 text-[#B76E79]" /> Tahap 1: Profil Toko
                        </h3>
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100 text-center">
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Nama Toko</label>
                            <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="Contoh: Muslimah Store Cabang Solo" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B76E79] outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Nama Pemilik (Sesuai KTP)</label>
                            <input type="text" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="Nama Lengkap" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B76E79] outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Kontak (WhatsApp Aktif)</label>
                            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08xxxxxxxxxx" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B76E79] outline-none" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1 flex items-center gap-1"><Mail className="w-3 h-3" /> Email Akun</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ukhti@contoh.com" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B76E79] outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1 flex items-center gap-1"><Lock className="w-3 h-3" /> Password</label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="******" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B76E79] outline-none" />
                            </div>
                        </div>
                        <button onClick={() => setStep(2)} className="w-full mt-6 bg-[#B76E79] hover:bg-[#a05d67] text-white font-medium py-3.5 rounded-xl transition-colors flex justify-center items-center gap-2" disabled={loading}>
                            {loading ? 'Memproses...' : <>Selanjutnya <ChevronRight className="w-5 h-5" /></>}
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-fadeIn">
                        <h3 className="font-medium text-gray-800 flex items-center gap-2 mb-4">
                            <ShieldCheck className="w-5 h-5 text-[#B76E79]" /> Tahap 2: Komitmen Syariah
                        </h3>
                        <div className="space-y-4">
                            <label className="flex items-start gap-3 cursor-pointer p-3 border border-gray-100 rounded-xl hover:bg-[#f9f1f2]/50 transition-colors">
                                <input type="checkbox" checked={agreed1} onChange={(e) => setAgreed1(e.target.checked)} className="mt-1 w-5 h-5 text-[#B76E79] rounded border-gray-300 focus:ring-[#B76E79]" />
                                <span className="text-gray-700 text-sm leading-relaxed">Saya berkomitmen hanya menjual pakaian yang menutup aurat (tidak transparan/ketat).</span>
                            </label>
                            <label className="flex items-start gap-3 cursor-pointer p-3 border border-gray-100 rounded-xl hover:bg-[#f9f1f2]/50 transition-colors">
                                <input type="checkbox" checked={agreed2} onChange={(e) => setAgreed2(e.target.checked)} className="mt-1 w-5 h-5 text-[#B76E79] rounded border-gray-300 focus:ring-[#B76E79]" />
                                <span className="text-gray-700 text-sm leading-relaxed">Saya berkomitmen menjalankan akad jual beli yang jujur tanpa riba.</span>
                            </label>
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button onClick={() => setStep(1)} className="w-1/3 border border-[#B76E79] text-[#B76E79] hover:bg-[#f9f1f2] font-medium py-3.5 rounded-xl transition-colors">Kembali</button>
                            <button disabled={!agreed1 || !agreed2 || loading} onClick={handleFinishRegister} className={`w-2/3 font-medium py-3.5 rounded-xl transition-colors ${agreed1 && agreed2 && !loading ? 'bg-[#B76E79] hover:bg-[#a05d67] text-white shadow-lg shadow-[#B76E79]/30' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                                {loading ? 'Mendaftarkan...' : 'DAFTARKAN MITRA'}
                            </button>
                        </div>
                    </div>
                )}

                <div className="mt-6 text-center">
                    <button type="button" onClick={handleLoginClick} className="text-sm text-gray-500 hover:text-[#B76E79]">Sudah punya akun? Masuk</button>
                </div>
            </div>
        </div>
    );
}
