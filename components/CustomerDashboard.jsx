'use client'

import React, { useState, useEffect } from 'react';
import { Store, ShoppingBag, Search, Bell, X, Trash2, Banknote, QrCode, CreditCard, CheckCircle2 } from 'lucide-react';
import { supabase } from '../app/lib/supabase';

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
};

const FALLBACK_PRODUCTS = [
    { id: 1, name: 'Abaya Rose Silk Premium', price: 450000, category: 'Dress & Abaya', image: '👗' },
    { id: 2, name: 'Gamis Syari A-Line Jetblack', price: 320000, category: 'Dress & Abaya', image: '👘' },
    { id: 3, name: 'Pashmina Inner 2in1 Silk', price: 85000, category: 'Hijab & Khimar', image: '🧕' },
    { id: 4, name: 'Cadar Tali Sifon Arab', price: 35000, category: 'Aksesoris', image: '✨' },
];

export default function CustomerDashboard({ onNavigate }) {
    const [products, setProducts] = useState(FALLBACK_PRODUCTS);
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [customerEmail, setCustomerEmail] = useState('');

    useEffect(() => {
        // Fetch products
        const fetchProducts = async () => {
            if (!supabase) return;
            try {
                const { data, error } = await supabase.from('products').select('*');
                if (!error && data && data.length > 0) {
                    setProducts(data);
                }
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        };

        // Fetch user context for auto-email
        const fetchUser = async () => {
            if (!supabase) {
                setCustomerEmail('user@demo.com'); // demo fallback
                return;
            }
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user && user.email) {
                    setCustomerEmail(user.email);
                } else {
                    setCustomerEmail('user@demo.com');
                }
            } catch (err) {
                setCustomerEmail('user@demo.com');
            }
        };

        fetchProducts();
        fetchUser();
    }, []);

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
                return { ...item, qty: Math.max(0, item.qty + delta) };
            }
            return item;
        }).filter(item => item.qty > 0));
    };

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = subtotal * 0.10;
    const total = subtotal + tax;

    const handleCheckout = () => {
        if (cart.length === 0) return;
        setShowCart(false);
        setShowPayment(true);
    };

    const finishPayment = async (method) => {
        setPaymentMethod(method);
        setIsProcessing(true);
        
        try {
            // Save to database
            if (supabase) {
                await supabase.from('transactions').insert([
                    {
                        total_amount: total,
                        tax_amount: tax,
                        payment_method: method,
                        customer_email: customerEmail,
                        items: cart
                    }
                ]);
            }

            // Send receipt via API
            try {
                // If it's the demo email, it probably won't be sent physically, but API will accept.
                await fetch('/api/send-receipt', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: customerEmail,
                        items: cart,
                        total, tax, subtotal,
                        paymentMethod: method
                    }),
                });
            } catch (ignore) {}

            alert(`Alhamdulillah, pembayaran ${method} berhasil! Struk dikirim ke ${customerEmail}`);
            setCart([]);
            setShowPayment(false);
        } catch (err) {
            console.error("Error transacting:", err);
            alert("Maaf, ada kendala jaringan, namun pesanan Anda sedang kami proses.");
        } finally {
            setIsProcessing(false);
            setPaymentMethod(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20 relative">
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
                </div>
            </header>

            <main className="max-w-md mx-auto px-4 mt-6">
                <div className="bg-gradient-to-r from-[#B76E79] to-[#d48c96] rounded-2xl p-6 text-white mb-8 shadow-md">
                    <h2 className="text-xl font-bold mb-2">Koleksi Terbaru!</h2>
                    <p className="text-sm opacity-90 mb-4 max-w-[200px]">Dapatkan diskon spesial 20% minggu ini.</p>
                </div>

                <div>
                    <h3 className="text-gray-800 font-bold mb-4">Produk Pilihan</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {products.map(prod => (
                            <div key={prod.id} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col group">
                                <div className="h-36 bg-gray-50 rounded-xl mb-3 flex items-center justify-center text-5xl">
                                    {prod.image || '👗'}
                                </div>
                                <h4 className="text-xs font-semibold text-gray-800 mb-1 leading-tight line-clamp-2">{prod.name}</h4>
                                <p className="text-[#B76E79] font-bold text-sm mt-auto pt-1">{formatRupiah(prod.price)}</p>
                                <button onClick={() => addToCart(prod)} className="mt-2 w-full py-1.5 border border-[#B76E79] text-[#B76E79] rounded-lg text-xs font-bold hover:bg-[#B76E79] hover:text-white transition-colors">
                                    Tambah
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe pt-2 px-4 shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.05)] z-20">
                <div className="max-w-md mx-auto flex justify-between items-center h-14">
                    <button className="flex flex-col items-center flex-1 text-[#B76E79]">
                        <Store className="w-5 h-5 mb-1" />
                        <span className="text-[10px] font-bold">Beranda</span>
                    </button>
                    <button onClick={() => setShowCart(true)} className="flex flex-col items-center flex-1 text-gray-400 hover:text-[#B76E79] relative">
                        {cart.reduce((s,i)=>s+i.qty, 0) > 0 && <div className="absolute top-0 right-5 w-4 h-4 bg-[#B76E79] text-white text-[9px] font-bold flex items-center justify-center rounded-full">{cart.reduce((s,i)=>s+i.qty,0)}</div>}
                        <ShoppingBag className="w-5 h-5 mb-1" />
                        <span className="text-[10px] font-medium">Keranjang</span>
                    </button>
                    <button onClick={() => {if(onNavigate) onNavigate('login'); else window.location.href='/login';}} className="flex flex-col items-center flex-1 text-gray-400 hover:text-red-500">
                        <div className="w-5 h-5 rounded-full bg-gray-200 mb-1 flex items-center justify-center text-xs font-bold">🚪</div>
                        <span className="text-[10px] font-medium">Keluar</span>
                    </button>
                </div>
            </div>

            {/* Cart Slide-up */}
            {showCart && (
                <div className="fixed inset-0 z-50 flex flex-col justify-end">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCart(false)}></div>
                    <div className="w-full max-w-md mx-auto bg-white rounded-t-3xl relative flex flex-col max-h-[85vh]">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="font-bold text-gray-800">Keranjang Belanja</h3>
                            <button onClick={() => setShowCart(false)} className="p-1 text-gray-500"><X size={20}/></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {cart.length === 0 ? (
                                <p className="text-center text-gray-400 py-10">Keranjang masih kosong.</p>
                            ) : (
                                cart.map(item => (
                                    <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold">{item.name}</p>
                                            <p className="text-xs text-[#B76E79]">{formatRupiah(item.price)}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => updateQty(item.id, -1)} className="px-2 py-1 bg-white rounded shadow-sm text-sm">-</button>
                                            <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                                            <button onClick={() => updateQty(item.id, 1)} className="px-2 py-1 bg-white rounded shadow-sm text-sm">+</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        {cart.length > 0 && (
                            <div className="p-4 border-t bg-white safe-bottom">
                                <div className="flex justify-between mb-4">
                                    <span className="font-bold text-gray-600">Total:</span>
                                    <span className="font-bold text-[#B76E79] text-lg">{formatRupiah(total)}</span>
                                </div>
                                <button onClick={handleCheckout} className="w-full bg-[#B76E79] py-3 rounded-xl text-white font-bold shadow-lg">Lanjut Pembayaran</button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {showPayment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white max-w-sm w-full rounded-3xl p-6 text-center transform transition-all">
                        <h3 className="text-xl font-bold mb-2 text-gray-800">Pilih Pembayaran</h3>
                        <p className="text-sm text-gray-500 mb-6">Total Tagihan: <strong className="text-[#B76E79]">{formatRupiah(total)}</strong></p>
                        
                        <div className="grid gap-3 mb-6">
                            <button onClick={() => finishPayment('QRIS')} disabled={isProcessing} className="flex items-center justify-center gap-2 p-3 border-2 border-[#B76E79] bg-[#f9f1f2] rounded-xl font-bold text-[#B76E79]"><QrCode className="w-5 h-5"/> Bayar via QRIS</button>
                            <button onClick={() => finishPayment('DEBIT')} disabled={isProcessing} className="flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-xl font-medium text-gray-600"><CreditCard className="w-5 h-5"/> Transfer Bank</button>
                        </div>
                        
                        <p className="text-[10px] text-gray-400 mb-4">Struk akan otomatis dikirim ke: {customerEmail}</p>

                        <button onClick={() => setShowPayment(false)} disabled={isProcessing} className="text-sm text-gray-400 underline">Batal</button>
                    </div>
                </div>
            )}
        </div>
    );
}
