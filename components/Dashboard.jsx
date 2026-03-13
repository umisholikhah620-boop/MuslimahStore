'use client'

import React, { useState } from 'react';
import { ShoppingBag, Trash2, Banknote, QrCode, CreditCard, CheckCircle2 } from 'lucide-react';

const PRODUCTS = [
    { id: 1, name: 'Abaya Rose Silk Premium', price: 450000, category: 'Dress & Abaya', image: '👗' },
    { id: 2, name: 'Gamis Syari A-Line Jetblack', price: 320000, category: 'Dress & Abaya', image: '👘' },
    { id: 3, name: 'Pashmina Inner 2in1 Silk', price: 85000, category: 'Hijab & Khimar', image: '🧕' },
    { id: 4, name: 'French Khimar Premium XL', price: 125000, category: 'Hijab & Khimar', image: '🧕' },
    { id: 5, name: 'Cadar Tali Sifon Arab', price: 35000, category: 'Aksesoris', image: '✨' },
    { id: 6, name: 'Bros Dagu Rose Gold Kristal', price: 45000, category: 'Aksesoris', image: '🌸' },
    { id: 7, name: 'Mukena Traveling Parasut', price: 175000, category: 'Perlengkapan Shalat', image: '🌙' },
    { id: 8, name: 'Sajadah Muka Turki', price: 55000, category: 'Perlengkapan Shalat', image: '🕌' },
    { id: 9, name: 'One Set Rayon Motif', price: 215000, category: 'Daily Wear', image: '🧥' },
    { id: 10, name: 'Kaftan Silk Exclusive', price: 550000, category: 'Dress & Abaya', image: '👸' },
    { id: 11, name: 'Bergo Maryam Diamond', price: 35000, category: 'Hijab & Khimar', image: '👒' },
    { id: 12, name: 'Manset Tangan Rajut', price: 15000, category: 'Aksesoris', image: '🧤' },
];

const CATEGORIES = ['Semua', 'Dress & Abaya', 'Hijab & Khimar', 'Perlengkapan Shalat', 'Daily Wear', 'Aksesoris'];

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
};

export default function Dashboard({ onNavigate }) {
    const [activeCategory, setActiveCategory] = useState('Semua');
    const [cart, setCart] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(null);

    const filteredProducts = activeCategory === 'Semua' ? PRODUCTS : PRODUCTS.filter(p => p.category === activeCategory);

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
            }
            return [...prev, { ...product, qty: 1 }];
        });
    };

    const updateQty = (productId, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === productId) {
                const newQty = Math.max(0, item.qty + delta);
                return { ...item, qty: newQty };
            }
            return item;
        }).filter(item => item.qty > 0));
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const handlePayment = (method) => {
        if (cart.length === 0) {
            alert('Afwan Ukhti, keranjang masih kosong. Silakan pilih produk terlebih dahulu.');
            return;
        }
        setPaymentMethod(method);
        setShowConfirmation(true);
    };

    const finishTransaction = () => {
        setShowConfirmation(false);
        setPaymentMethod(null);
        setCart([]);
    };

    const handleLogout = () => {
        if (onNavigate) {
            onNavigate('login');
        } else {
            window.location.href = '/login';
        }
    };

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = subtotal * 0.10;
    const total = subtotal + tax;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
            <div className="flex-1 p-6 overflow-y-auto h-screen">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-serif text-[#B76E79] font-bold">Muslimah Store POS</h1>
                        <p className="text-sm text-gray-500">Bismillah, melayani dengan hati.</p>
                    </div>
                    <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-[#B76E79] border border-gray-200 px-4 py-2 rounded-lg bg-white">Keluar</button>
                </div>

                <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    {CATEGORIES.map(cat => (
                        <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2.5 rounded-full whitespace-nowrap font-medium transition-all ${activeCategory === cat ? 'bg-[#B76E79] text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#B76E79]'}`}>{cat}</button>
                    ))}
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredProducts.map(product => (
                        <div key={product.id} onClick={() => addToCart(product)} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-[#B76E79]/50 hover:shadow-md transition-all cursor-pointer group">
                            <div className="h-32 bg-[#f9f1f2] rounded-xl mb-4 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform">{product.image}</div>
                            <div className="text-xs text-[#B76E79] font-medium mb-1">{product.category}</div>
                            <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2 h-10">{product.name}</h3>
                            <p className="font-bold text-gray-900">{formatRupiah(product.price)}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full md:w-96 bg-white border-l border-gray-200 flex flex-col h-screen shadow-xl z-10">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-[#B76E79]" />Pesanan Saat Ini</h2>
                    <p className="text-sm text-gray-500 mt-1">Meja / No. Antrian: <span className="font-semibold text-[#B76E79]">A-01</span></p>
                </div>

                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                    {cart.length === 0 ? (
                        <div className="text-center text-gray-400 mt-10 flex flex-col items-center">
                            <ShoppingBag className="w-12 h-12 mb-3 opacity-20" />
                            <p>Keranjang masih kosong</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="flex justify-between items-center gap-3 pb-4 border-b border-gray-50">
                                <div className="flex-1">
                                    <h4 className="font-medium text-sm text-gray-800 line-clamp-1">{item.name}</h4>
                                    <div className="text-[#B76E79] font-medium text-xs mt-0.5">{formatRupiah(item.price)}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-8">
                                        <button onClick={() => updateQty(item.id, -1)} className="px-2 hover:bg-gray-100 text-[#B76E79] font-bold">-</button>
                                        <span className="px-2 text-xs font-semibold w-8 text-center">{item.qty}</span>
                                        <button onClick={() => updateQty(item.id, 1)} className="px-2 hover:bg-gray-100 text-[#B76E79] font-bold">+</button>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-6 bg-gray-50/50 border-t border-gray-100">
                    <div className="space-y-2 mb-6">
                        <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span className="font-medium">{formatRupiah(subtotal)}</span></div>
                        <div className="flex justify-between text-sm text-gray-600"><span>Infaq / Pajak (10%)</span><span className="font-medium">{formatRupiah(tax)}</span></div>
                        <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200"><span>Total Akhir</span><span className="text-[#B76E79]">{formatRupiah(total)}</span></div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                        <button onClick={() => handlePayment('TUNAI')} className="flex flex-col items-center justify-center gap-1 p-2 border border-gray-200 rounded-lg hover:border-[#B76E79] hover:bg-[#f9f1f2] text-xs font-medium text-gray-600 transition-colors"><Banknote className="w-5 h-5 text-[#B76E79]" />TUNAI</button>
                        <button onClick={() => handlePayment('QRIS')} className="flex flex-col items-center justify-center gap-1 p-2 border-2 border-[#B76E79] bg-[#f9f1f2] rounded-lg hover:bg-[#f2e2e4] text-xs font-bold text-[#B76E79] transition-colors animate-pulse"><QrCode className="w-5 h-5 text-[#B76E79]" />BAYAR QRIS</button>
                        <button onClick={() => handlePayment('DEBIT')} className="flex flex-col items-center justify-center gap-1 p-2 border border-gray-200 rounded-lg hover:border-[#B76E79] hover:bg-[#f9f1f2] text-xs font-medium text-gray-600 transition-colors"><CreditCard className="w-5 h-5 text-[#B76E79]" />DEBIT</button>
                    </div>

                    <button disabled={cart.length === 0} onClick={() => handlePayment('TUNAI')} className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${cart.length > 0 ? 'bg-[#B76E79] hover:bg-[#a05d67] text-white shadow-lg shadow-[#B76E79]/30' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                        {cart.length === 0 ? 'KERANJANG KOSONG' : 'BAYAR SEKARANG'}
                    </button>
                </div>
            </div>

            {showConfirmation && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
                        
                        {paymentMethod === 'QRIS' ? (
                            <div className="animate-fadeIn">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Pembayaran QRIS</h3>
                                <p className="text-sm text-gray-500 mb-6">Silakan scan kode QR di bawah ini</p>
                                
                                <div className="bg-white p-4 border-4 border-[#B76E79]/20 rounded-2xl inline-block mb-6 relative">
                                    {/* Simulasi QR Code menggunakan CSS & Lucide */}
                                    <div className="w-48 h-48 bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-200">
                                        <QrCode className="w-32 h-32 text-gray-800" />
                                    </div>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-lg shadow-md">
                                        <Store className="w-8 h-8 text-[#B76E79]" />
                                    </div>
                                </div>
                                
                                <div className="text-2xl font-bold text-[#B76E79] mb-8">{formatRupiah(total)}</div>
                                
                                <button onClick={finishTransaction} className="w-full bg-[#B76E79] hover:bg-[#a05d67] text-white font-bold py-4 rounded-xl transition-all shadow-lg">KONFIRMASI PEMBAYARAN BERHASIL</button>
                            </div>
                        ) : (
                            <div className="animate-fadeIn">
                                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-10 h-10 text-green-500" /></div>
                                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">Alhamdulillah</h3>
                                <p className="text-gray-600 text-lg leading-relaxed italic mb-8">"Jazaakillahu Khayran atas kunjungannya. Semoga pakaian ini membawa keberkahan dan kenyamanan dalam ketaatan."</p>
                                <div className="text-sm font-semibold text-[#B76E79] mb-8">— Muslimah Store</div>
                                <button onClick={finishTransaction} className="w-full bg-[#B76E79] hover:bg-[#a05d67] text-white font-medium py-3 rounded-xl transition-colors">Tutup & Buat Pesanan Baru</button>
                            </div>
                        )}
                        
                        <button onClick={() => setShowConfirmation(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                    </div>
                </div>
            )}
        </div>
    );
}
