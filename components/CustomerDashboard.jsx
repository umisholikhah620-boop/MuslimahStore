'use client'

import React from 'react';
import { Store, ShoppingBag, Search, Bell } from 'lucide-react';

export default function CustomerDashboard() {
    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20">
            {/* Header */}
            <header className="bg-white px-4 py-4 sticky top-0 z-10 shadow-sm border-b border-gray-100">
                <div className="max-w-md mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-[#f9f1f2] rounded-full flex items-center justify-center">
                            <Store className="w-5 h-5 text-[#B76E79]" />
                        </div>
                        <div>
                            <h1 className="font-serif text-[#B76E79] font-bold leading-tight">Muslimah Store</h1>
                            <p className="text-[10px] text-gray-500">Pusat Busana Muslimah</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="relative p-2 text-gray-600 hover:bg-gray-50 flex items-center justify-center rounded-full transition-colors">
                            <Search className="w-5 h-5" />
                        </button>
                        <button className="relative p-2 text-gray-600 hover:bg-gray-50 flex items-center justify-center rounded-full transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-md mx-auto px-4 mt-6">
                {/* Banner */}
                <div className="bg-gradient-to-r from-[#B76E79] to-[#d48c96] rounded-2xl p-6 text-white mb-8 shadow-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-xl"></div>
                    <div className="relative z-10">
                        <h2 className="text-xl font-bold mb-2">Koleksi Terbaru!</h2>
                        <p className="text-sm opacity-90 mb-4 max-w-[200px]">Dapatkan diskon spesial 20% untuk pembelian Gamis Syari set minggu ini.</p>
                        <button className="bg-white text-[#B76E79] text-xs font-bold py-2 px-5 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95">
                            Lihat Koleksi
                        </button>
                    </div>
                </div>

                {/* Categories */}
                <div className="mb-8">
                    <h3 className="text-gray-800 font-bold mb-4">Kategori Pilihan</h3>
                    <div className="grid grid-cols-4 gap-3">
                        {['Gamis', 'Hijab', 'Aksesoris', 'Mukena'].map((cat, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 cursor-pointer group">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 group-hover:border-[#B76E79] group-hover:shadow-md transition-all">
                                    <span className="text-2xl">{['👗', '🧕', '✨', '🕌'][i]}</span>
                                </div>
                                <span className="text-xs text-gray-600 text-center font-medium">{cat}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Popular Products */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-gray-800 font-bold">Produk Terlaris</h3>
                        <button className="text-xs text-[#B76E79] font-bold hover:underline">Lihat Semua</button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        {/* Dummy Products */}
                        {[
                            { name: 'Abaya Rose Silk Premium', price: 'Rp 450.000', icon: '👗' },
                            { name: 'Pashmina Inner 2in1 Silk', price: 'Rp 85.000', icon: '🧕' },
                            { name: 'Gamis Syari A-Line Jetblack', price: 'Rp 320.000', icon: '👘' },
                            { name: 'Cadar Tali Sifon Arab', price: 'Rp 35.000', icon: '✨' },
                        ].map((prod, i) => (
                            <div key={i} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col cursor-pointer hover:shadow-md transition-all group">
                                <div className="h-36 bg-gray-50 rounded-xl mb-3 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-300">
                                    {prod.icon}
                                </div>
                                <h4 className="text-xs font-semibold text-gray-800 mb-1 leading-tight line-clamp-2">{prod.name}</h4>
                                <p className="text-[#B76E79] font-bold text-sm mt-auto pt-1">{prod.price}</p>
                                <button className="mt-2 w-full py-1.5 border border-[#B76E79] text-[#B76E79] rounded-lg text-xs font-bold hover:bg-[#B76E79] hover:text-white transition-colors">
                                    Tambah
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Bottom Nav */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe pt-2 px-4 shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.05)] z-20">
                <div className="max-w-md mx-auto flex justify-between items-center h-14">
                    <button className="flex flex-col items-center flex-1 text-[#B76E79]">
                        <Store className="w-5 h-5 mb-1" />
                        <span className="text-[10px] font-bold">Beranda</span>
                    </button>
                    <button className="flex flex-col items-center flex-1 text-gray-400 hover:text-gray-600 transition-colors">
                        <Search className="w-5 h-5 mb-1" />
                        <span className="text-[10px] font-medium">Jelajah</span>
                    </button>
                    <button className="flex flex-col items-center flex-1 text-gray-400 hover:text-gray-600 transition-colors relative">
                        <div className="absolute top-0 right-3 w-4 h-4 bg-[#B76E79] text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white">2</div>
                        <ShoppingBag className="w-5 h-5 mb-1" />
                        <span className="text-[10px] font-medium">Keranjang</span>
                    </button>
                    <button className="flex flex-col items-center flex-1 text-gray-400 hover:text-gray-600 transition-colors">
                        <div className="w-5 h-5 rounded-full bg-gray-200 mb-1 flex items-center justify-center text-xs font-bold text-gray-500">U</div>
                        <span className="text-[10px] font-medium">Profil</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
