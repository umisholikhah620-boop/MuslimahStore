'use client'

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Trash2, Banknote, QrCode, CreditCard, CheckCircle2 } from 'lucide-react';
import { supabase } from '../app/lib/supabase';

const CATEGORIES = ['Semua', 'Dress & Abaya', 'Hijab & Khimar', 'Perlengkapan Shalat', 'Daily Wear', 'Aksesoris'];

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
};

const FALLBACK_PRODUCTS = [
    { id: 1, name: 'Abaya Rose Silk Premium', price: 450000, category: 'Dress & Abaya', image: '👗' },
    { id: 2, name: 'Gamis Syari A-Line Jetblack', price: 320000, category: 'Dress & Abaya', image: '🥻' },
    { id: 3, name: 'Pashmina Inner 2in1 Silk', price: 85000, category: 'Hijab & Khimar', image: '🧕' },
    { id: 4, name: 'French Khimar Premium XL', price: 125000, category: 'Hijab & Khimar', image: '🧕' },
    { id: 5, name: 'Cadar Tali Sifon Arab', price: 35000, category: 'Aksesoris', image: '🧕' },
    { id: 6, name: 'Bros Dagu Rose Gold Kristal', price: 45000, category: 'Aksesoris', image: '💎' },
    { id: 7, name: 'Mukena Traveling Parasut', price: 175000, category: 'Perlengkapan Shalat', image: '🕋' },
    { id: 8, name: 'Sajadah Muka Turki', price: 55000, category: 'Perlengkapan Shalat', image: '🕌' },
    { id: 9, name: 'One Set Rayon Motif', price: 215000, category: 'Daily Wear', image: '👚' },
    { id: 10, name: 'Kaftan Silk Exclusive', price: 550000, category: 'Dress & Abaya', image: '👘' },
    { id: 11, name: 'Bergo Maryam Diamond', price: 35000, category: 'Hijab & Khimar', image: '🧕' },
    { id: 12, name: 'Manset Tangan Rajut', price: 15000, category: 'Aksesoris', image: '🧤' },
];

export default function Dashboard({ onNavigate }) {
    const [activeCategory, setActiveCategory] = useState('Semua');
    const [cart, setCart] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [customerEmail, setCustomerEmail] = useState('');
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [products, setProducts] = useState(FALLBACK_PRODUCTS);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [adminTab, setAdminTab] = useState('kasir'); // 'kasir' | 'laporan'
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        console.log("Dashboard: useEffect started");
        const fetchProducts = async () => {
            console.log("Dashboard: fetchProducts running, supabase status:", !!supabase);
            
            if (!supabase) {
                console.log("Dashboard: No Supabase, using fallback");
                setProducts(FALLBACK_PRODUCTS);
                setLoading(false);
                return;
            }
            try {
                const { data, error: dbError } = await supabase.from('products').select('*');
                console.log("Dashboard: Supabase response:", { count: data?.length, error: dbError });
                
                if (dbError) throw dbError;
                if (data && data.length > 0) {
                    setProducts(data);
                } else {
                    console.log("Dashboard: DB empty, using fallback");
                    setProducts(FALLBACK_PRODUCTS);
                }
            } catch (err) {
                console.error("Dashboard: Fetch error:", err);
                setError(err.message);
                setProducts(FALLBACK_PRODUCTS);
            } finally {
                console.log("Dashboard: fetchProducts finished");
                setLoading(false);
            }
        };
        fetchProducts();

        const fetchTransactions = async () => {
            if (!supabase) return;
            try {
                const { data, error } = await supabase.from('transactions').select('*').order('created_at', { ascending: false });
                if (!error && data) {
                    setTransactions(data);
                }
            } catch(e) { console.error(e); }
        };
        fetchTransactions();
    }, []);

    console.log("Dashboard: Rendering with state:", { productsCount: products.length, loading, category: activeCategory });
    const filteredProducts = activeCategory === 'Semua' ? products : products.filter(p => p.category === activeCategory);
    console.log("Dashboard: Filtered products count:", filteredProducts.length);

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

    const finishTransaction = async () => {
        setIsSendingEmail(true);
        try {
            if (!supabase) {
                // Skip DB saving if not connected
                console.warn("Supabase not connected. Skipping transaction save.");
            } else {
                // Save to Supabase
                const { error: dbError } = await supabase.from('transactions').insert([
                    {
                        total_amount: total,
                        tax_amount: tax,
                        payment_method: paymentMethod,
                        customer_email: customerEmail || null,
                        items: cart
                    }
                ]);

                if (dbError) throw dbError;
            }

            if (customerEmail) {
                // Send email via API
                try {
                    const response = await fetch('/api/send-receipt', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: customerEmail,
                            items: cart,
                            total,
                            tax,
                            subtotal,
                            paymentMethod
                        }),
                    });

                    if (!response.ok) {
                        throw new Error('Gagal mengirim email.');
                    }

                    alert(`Alhamdulillah, struk belanja telah dikirim ke: ${customerEmail}`);
                } catch (emailErr) {
                    console.error("Error sending email:", emailErr);
                    alert("Maaf, terjadi kesalahan saat mengirim email struk. Transaksi tetap sukses.");
                } finally {
                    setIsSendingEmail(false);
                    setShowConfirmation(false);
                    setPaymentMethod(null);
                    setCart([]);
                    setCustomerEmail('');
                }
            } else {
                setIsSendingEmail(false);
                setShowConfirmation(false);
                setPaymentMethod(null);
                setCart([]);
            }
        } catch (err) {
            console.error("Error saving transaction:", err);
            alert("Maaf, gagal menyimpan transaksi ke database. Tapi pesanan tetap kami proses secara lokal.");
            setIsSendingEmail(false);
            setShowConfirmation(false);
        }
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
        <div className="min-h-screen font-sans flex flex-col bg-gray-50">
            {/* Admin Top Nav */}
            <div className="bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center shadow-sm z-20 sticky top-0">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-serif text-[#B76E79] font-bold">Muslimah Store</h1>
                    <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">Admin</span>
                </div>
                <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                    <button onClick={() => setAdminTab('kasir')} className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all ${adminTab === 'kasir' ? 'bg-white shadow-sm text-[#B76E79]' : 'text-gray-400 hover:text-gray-600'}`}>Kasir POS</button>
                    <button onClick={() => setAdminTab('laporan')} className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all ${adminTab === 'laporan' ? 'bg-white shadow-sm text-[#B76E79]' : 'text-gray-400 hover:text-gray-600'}`}>Laporan Keuangan</button>
                </div>
                <button onClick={handleLogout} className="text-sm font-bold text-gray-400 hover:text-red-500 transition-colors">Keluar 🚪</button>
            </div>

            {adminTab === 'kasir' ? (
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    <div className="flex-1 p-6 overflow-y-auto h-[calc(100vh-80px)]">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-serif text-[#B76E79] font-bold">Kasir Penjualan</h1>
                        <p className="text-sm text-gray-500">Bismillah, melayani dengan hati.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Debug: L={loading ? 'Y' : 'N'} P={products.length}</div>
                    </div>
                </div>

                <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    {CATEGORIES.map(cat => (
                        <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2.5 rounded-full whitespace-nowrap font-medium transition-all ${activeCategory === cat ? 'bg-[#B76E79] text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#B76E79]'}`}>{cat}</button>
                    ))}
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex flex-col gap-1">
                        <p className="font-bold">⚠️ Kendala Koneksi Supabase:</p>
                        <p>{error}</p>
                        <p className="text-xs opacity-70 italic">Sistem beralih ke katalog cadangan sementara.</p>
                    </div>
                )}

                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {loading ? (
                        <div className="col-span-full text-center py-20 text-gray-400">Memuat katalog keberkahan...</div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="col-span-full text-center py-20 text-gray-400">Stok sedang kosong, nantikan koleksi terbaru kami.</div>
                    ) : (
                        filteredProducts.map(product => (
                            <div key={product.id} onClick={() => addToCart(product)} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-[#B76E79]/30 transition-all group flex flex-col h-full bg-blend-overlay">
                                <div className="h-32 bg-[#f9f1f2] rounded-xl mb-4 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform overflow-hidden">
                                    {(product.image && (product.image.includes('http') || product.image.includes('/'))) ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" /> : (product.image || '👗')}
                                </div>
                                <div className="text-xs text-[#B76E79] font-medium mb-1">{product.category}</div>
                                <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2 h-10">{product.name}</h3>
                                <p className="font-bold text-gray-900">{formatRupiah(product.price)}</p>
                            </div>
                        ))
                    )}
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
                                
                                <div className="bg-white p-2 border-2 border-[#B76E79]/20 rounded-2xl inline-block mb-6 shadow-inner">
                                    <img src="/qris.png" alt="QRIS Code" className="w-56 h-auto rounded-xl" />
                                </div>
                                
                                <div className="text-2xl font-bold text-[#B76E79] mb-4">{formatRupiah(total)}</div>

                                <div className="mb-6 text-left">
                                    <label className="text-xs font-semibold text-gray-500 uppercase ml-1">Kirim Struk ke Email (Opsional)</label>
                                    <input 
                                        type="email" 
                                        value={customerEmail}
                                        onChange={(e) => setCustomerEmail(e.target.value)}
                                        placeholder="ukhti@contoh.com"
                                        className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B76E79] outline-none transition-all text-sm"
                                    />
                                </div>
                                
                                <button 
                                    onClick={finishTransaction} 
                                    className="w-full bg-[#B76E79] hover:bg-[#a05d67] text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                                    disabled={isSendingEmail}
                                >
                                    {isSendingEmail ? (
                                        <>Memproses...</>
                                    ) : (
                                        <>KONFIRMASI PEMBAYARAN BERHASIL</>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className="animate-fadeIn">
                                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-10 h-10 text-green-500" /></div>
                                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">Alhamdulillah</h3>
                                <p className="text-gray-600 text-lg leading-relaxed italic mb-8">"Jazaakillahu Khayran atas kunjungannya. Semoga pakaian ini membawa keberkahan dan kenyamanan dalam ketaatan."</p>
                                
                                <div className="mb-6 text-left">
                                    <label className="text-xs font-semibold text-gray-500 uppercase ml-1">Kirim Struk ke Email</label>
                                    <input 
                                        type="email" 
                                        value={customerEmail}
                                        onChange={(e) => setCustomerEmail(e.target.value)}
                                        placeholder="ukhti@contoh.com"
                                        className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B76E79] outline-none transition-all text-sm"
                                    />
                                </div>

                                <button 
                                    onClick={finishTransaction} 
                                    className="w-full bg-[#B76E79] hover:bg-[#a05d67] text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50"
                                    disabled={isSendingEmail}
                                >
                                    {isSendingEmail ? "Mengirim Struk..." : "Tutup & Buat Pesanan Baru"}
                                </button>
                            </div>
                        )}
                        
                        <button onClick={() => setShowConfirmation(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                    </div>
                </div>
            )}
                </div>
            ) : (
                <div className="flex-1 p-8 overflow-y-auto bg-gray-50">
                    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Laporan Keuangan & Riwayat</h2>
                                <p className="text-sm text-gray-500">Seluruh catatan transaksi pembeli & kasir.</p>
                            </div>
                            <div className="bg-[#f9f1f2] px-4 py-2 rounded-xl border border-[#B76E79]/20">
                                <span className="text-xs text-[#B76E79] font-bold uppercase">Total Pendapatan</span>
                                <div className="text-xl font-bold text-gray-900">{formatRupiah(transactions.reduce((acc, t) => acc + (t.total_amount || 0), 0))}</div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                                        <th className="py-3 px-4 font-semibold">TANGGAL</th>
                                        <th className="py-3 px-4 font-semibold">EMAIL PEMBELI</th>
                                        <th className="py-3 px-4 font-semibold">METODE</th>
                                        <th className="py-3 px-4 font-semibold text-right">TOTAL (Rp)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-10 text-gray-400">Belum ada transaksi tercatat.</td>
                                        </tr>
                                    ) : (
                                        transactions.map((t) => (
                                            <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 px-4 text-sm text-gray-800">{new Date(t.created_at).toLocaleString('id-ID')}</td>
                                                <td className="py-3 px-4 text-sm text-gray-600 font-medium">{t.customer_email || 'Pembeli Offline'}</td>
                                                <td className="py-3 px-4 text-xs"><span className={`px-2 py-1 rounded-md font-bold ${t.payment_method === 'QRIS' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{t.payment_method}</span></td>
                                                <td className="py-3 px-4 text-sm font-bold text-right text-gray-900">{formatRupiah(t.total_amount || 0)}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
