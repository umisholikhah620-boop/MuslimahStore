import React, { useState } from 'react';
import {
    User, Lock, Store, ShieldCheck, ChevronRight,
    Trash2, ShoppingBag, CreditCard, QrCode, Banknote, CheckCircle2
} from 'lucide-react';

// --- WARNA TEMA ---
// Rose Gold: #B76E79
// Light Rose: #f9f1f2

// ==========================================
// 1. KOMPONEN LOGIN
// ==========================================
const Login = ({ onNavigate }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');
        
        // Logika Autentikasi Dummy
        if (!username || !password) {
            setError('Username dan password harus diisi.');
            return;
        }

        if (username === 'admin' && password === 'admin123') {
            onNavigate('dashboard');
        } else {
            setError('Username atau password salah. Coba: admin/admin123');
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100">

                {/* Header */}
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

                {/* Form */}
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

                    <button
                        type="submit"
                        className="w-full bg-[#B76E79] hover:bg-[#a05d67] text-white font-medium py-3.5 rounded-xl transition-colors shadow-lg shadow-[#B76E79]/30"
                    >
                        MASUK KE DASHBOARD
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button onClick={() => onNavigate('register')} className="text-sm text-[#B76E79] hover:underline">
                        Belum punya akun? Daftar Mitra
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-12 text-center text-gray-500 text-sm">
                <p>Mencari Rezeki yang Halal & Thayyib adalah Ibadah.</p>
            </div>
        </div>
    );
};


// ==========================================
// 2. KOMPONEN REGISTRASI (Multi-step)
// ==========================================
const Register = ({ onNavigate }) => {
    const [step, setStep] = useState(1);
    const [agreed1, setAgreed1] = useState(false);
    const [agreed2, setAgreed2] = useState(false);

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 font-sans">
            <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100">

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-serif text-[#B76E79] font-semibold">Pendaftaran Mitra</h2>
                    <p className="text-gray-500 text-sm mt-1">Bergabunglah dalam ekosistem niaga Islami</p>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center justify-center mb-8">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-[#B76E79] text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                    <div className={`w-16 h-0.5 mx-2 ${step >= 2 ? 'bg-[#B76E79]' : 'bg-gray-200'}`}></div>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-[#B76E79] text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                </div>

                <hr className="border-[#B76E79] opacity-20 mb-8" />

                {/* Step 1: Profil Toko */}
                {step === 1 && (
                    <div className="space-y-4 animate-fadeIn">
                        <h3 className="font-medium text-gray-800 flex items-center gap-2 mb-4">
                            <Store className="w-5 h-5 text-[#B76E79]" /> Tahap 1: Profil Toko
                        </h3>

                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Nama Toko</label>
                            <input type="text" placeholder="Contoh: Muslimah Store Cabang Solo" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B76E79] outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Nama Pemilik (Sesuai KTP)</label>
                            <input type="text" placeholder="Nama Lengkap" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B76E79] outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Kontak (WhatsApp Aktif)</label>
                            <input type="tel" placeholder="08xxxxxxxxxx" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B76E79] outline-none" />
                        </div>

                        <button
                            onClick={() => setStep(2)}
                            className="w-full mt-6 bg-[#B76E79] hover:bg-[#a05d67] text-white font-medium py-3.5 rounded-xl transition-colors flex justify-center items-center gap-2"
                        >
                            Selanjutnya <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Step 2: Komitmen Syariah */}
                {step === 2 && (
                    <div className="space-y-6 animate-fadeIn">
                        <h3 className="font-medium text-gray-800 flex items-center gap-2 mb-4">
                            <ShieldCheck className="w-5 h-5 text-[#B76E79]" /> Tahap 2: Komitmen Syariah
                        </h3>

                        <div className="space-y-4">
                            <label className="flex items-start gap-3 cursor-pointer p-3 border border-gray-100 rounded-xl hover:bg-[#f9f1f2]/50 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={agreed1}
                                    onChange={(e) => setAgreed1(e.target.checked)}
                                    className="mt-1 w-5 h-5 text-[#B76E79] rounded border-gray-300 focus:ring-[#B76E79]"
                                />
                                <span className="text-gray-700 text-sm leading-relaxed">
                                    Saya berkomitmen hanya menjual pakaian yang menutup aurat (tidak transparan/ketat).
                                </span>
                            </label>

                            <label className="flex items-start gap-3 cursor-pointer p-3 border border-gray-100 rounded-xl hover:bg-[#f9f1f2]/50 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={agreed2}
                                    onChange={(e) => setAgreed2(e.target.checked)}
                                    className="mt-1 w-5 h-5 text-[#B76E79] rounded border-gray-300 focus:ring-[#B76E79]"
                                />
                                <span className="text-gray-700 text-sm leading-relaxed">
                                    Saya berkomitmen menjalankan akad jual beli yang jujur tanpa riba.
                                </span>
                            </label>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setStep(1)}
                                className="w-1/3 border border-[#B76E79] text-[#B76E79] hover:bg-[#f9f1f2] font-medium py-3.5 rounded-xl transition-colors"
                            >
                                Kembali
                            </button>
                            <button
                                disabled={!agreed1 || !agreed2}
                                onClick={() => onNavigate('login')}
                                className={`w-2/3 font-medium py-3.5 rounded-xl transition-colors ${agreed1 && agreed2
                                    ? 'bg-[#B76E79] hover:bg-[#a05d67] text-white shadow-lg shadow-[#B76E79]/30'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                DAFTARKAN MITRA
                            </button>
                        </div>
                    </div>
                )}

                <div className="mt-6 text-center">
                    <button onClick={() => onNavigate('login')} className="text-sm text-gray-500 hover:text-[#B76E79]">
                        Sudah punya akun? Masuk
                    </button>
                </div>
            </div>
        </div>
    );
};


// ==========================================
// 3. KOMPONEN DASHBOARD POS
// ==========================================
const PRODUCTS = [
    { id: 1, name: 'Abaya Rose Silk', price: 450000, category: 'Dress & Abaya', image: '👗' },
    { id: 2, name: 'Gamis Syari A-Line', price: 320000, category: 'Dress & Abaya', image: '👘' },
    { id: 3, name: 'Pashmina Inner 2in1', price: 850000, category: 'Hijab & Khimar', image: '🧕' },
    { id: 4, name: 'French Khimar Premium', price: 125000, category: 'Hijab & Khimar', image: '🧕' },
    { id: 5, name: 'Cadar Tali Sifon', price: 35000, category: 'Aksesoris', image: '✨' },
    { id: 6, name: 'Bros Dagu Rose Gold', price: 45000, category: 'Aksesoris', image: '🌸' },
];

const CATEGORIES = ['Semua', 'Dress & Abaya', 'Hijab & Khimar', 'Aksesoris'];

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
};

const Dashboard = ({ onNavigate }) => {
    const [activeCategory, setActiveCategory] = useState('Semua');
    const [cart, setCart] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);

    // Filter Products
    const filteredProducts = activeCategory === 'Semua'
        ? PRODUCTS
        : PRODUCTS.filter(p => p.category === activeCategory);

    // Cart Functions
    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
            }
            return [...prev, { ...product, qty: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const handlePayment = () => {
        if (cart.length > 0) {
            setShowConfirmation(true);
        }
    };

    const finishTransaction = () => {
        setShowConfirmation(false);
        setCart([]);
    };

    // Calculations
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = subtotal * 0.10; // 10% Infaq/Pajak
    const total = subtotal + tax;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">

            {/* A. Area Katalog Produk (Kiri/Tengah) */}
            <div className="flex-1 p-6 overflow-y-auto h-screen">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-serif text-[#B76E79] font-bold">Muslimah Store POS</h1>
                        <p className="text-sm text-gray-500">Bismillah, melayani dengan hati.</p>
                    </div>
                    <button onClick={() => onNavigate('login')} className="text-sm text-gray-500 hover:text-[#B76E79] border border-gray-200 px-4 py-2 rounded-lg bg-white">
                        Keluar
                    </button>
                </div>

                {/* Categories */}
                <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2.5 rounded-full whitespace-nowrap font-medium transition-all ${activeCategory === cat
                                ? 'bg-[#B76E79] text-white shadow-md'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-[#B76E79]'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredProducts.map(product => (
                        <div
                            key={product.id}
                            onClick={() => addToCart(product)}
                            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-[#B76E79]/50 hover:shadow-md transition-all cursor-pointer group"
                        >
                            <div className="h-32 bg-[#f9f1f2] rounded-xl mb-4 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform">
                                {product.image}
                            </div>
                            <div className="text-xs text-[#B76E79] font-medium mb-1">{product.category}</div>
                            <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">{product.name}</h3>
                            <p className="font-bold text-gray-900">{formatRupiah(product.price)}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* B. Sidebar Keranjang (Kanan) */}
            <div className="w-full md:w-96 bg-white border-l border-gray-200 flex flex-col h-screen shadow-xl z-10">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-[#B76E79]" />
                        Pesanan Saat Ini
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Meja / No. Antrian: <span className="font-semibold text-[#B76E79]">A-01</span></p>
                </div>

                {/* Cart Items */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                    {cart.length === 0 ? (
                        <div className="text-center text-gray-400 mt-10 flex flex-col items-center">
                            <ShoppingBag className="w-12 h-12 mb-3 opacity-20" />
                            <p>Keranjang masih kosong</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="flex justify-between items-start gap-3 pb-4 border-b border-gray-50">
                                <div className="flex-1">
                                    <h4 className="font-medium text-sm text-gray-800">{item.name}</h4>
                                    <div className="text-[#B76E79] font-medium text-sm mt-1">{formatRupiah(item.price)}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded font-medium">
                                        {item.qty}x
                                    </span>
                                    <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-1">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Rincian Biaya & Pembayaran */}
                <div className="p-6 bg-gray-50/50 border-t border-gray-100">
                    <div className="space-y-2 mb-6">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Subtotal</span>
                            <span className="font-medium">{formatRupiah(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Infaq / Pajak (10%)</span>
                            <span className="font-medium">{formatRupiah(tax)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                            <span>Total Akhir</span>
                            <span className="text-[#B76E79]">{formatRupiah(total)}</span>
                        </div>
                    </div>

                    {/* C. Metode Pembayaran */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        <button className="flex flex-col items-center justify-center gap-1 p-2 border border-gray-200 rounded-lg hover:border-[#B76E79] hover:bg-[#f9f1f2] text-xs font-medium text-gray-600 transition-colors">
                            <Banknote className="w-5 h-5 text-[#B76E79]" />
                            TUNAI
                        </button>
                        <button className="flex flex-col items-center justify-center gap-1 p-2 border border-gray-200 rounded-lg hover:border-[#B76E79] hover:bg-[#f9f1f2] text-xs font-medium text-gray-600 transition-colors">
                            <QrCode className="w-5 h-5 text-[#B76E79]" />
                            TRANSFER / QRIS
                        </button>
                        <button className="flex flex-col items-center justify-center gap-1 p-2 border border-gray-200 rounded-lg hover:border-[#B76E79] hover:bg-[#f9f1f2] text-xs font-medium text-gray-600 transition-colors">
                            <CreditCard className="w-5 h-5 text-[#B76E79]" />
                            DEBIT CARD
                        </button>
                    </div>

                    <button
                        disabled={cart.length === 0}
                        onClick={handlePayment}
                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${cart.length > 0
                            ? 'bg-[#B76E79] hover:bg-[#a05d67] text-white shadow-lg shadow-[#B76E79]/30'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        PROSES PEMBAYARAN
                    </button>
                </div>
            </div>

            {/* D. Pesan Konfirmasi (Setelah Bayar) */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-fadeIn">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                        </div>

                        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">Alhamdulillah</h3>
                        <p className="text-gray-600 text-lg leading-relaxed italic mb-8">
                            "Jazaakillahu Khayran atas kunjungannya. Semoga pakaian ini membawa keberkahan dan kenyamanan dalam ketaatan."
                        </p>
                        <div className="text-sm font-semibold text-[#B76E79] mb-8">— Muslimah Store</div>

                        <button
                            onClick={finishTransaction}
                            className="w-full bg-[#B76E79] hover:bg-[#a05d67] text-white font-medium py-3 rounded-xl transition-colors"
                        >
                            Tutup & Buat Pesanan Baru
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

// ==========================================
// ROOT APP (Router Sederhana)
// ==========================================
export default function App() {
    const [currentPage, setCurrentPage] = useState('login');

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}} />

            {currentPage === 'login' && <Login onNavigate={setCurrentPage} />}
            {currentPage === 'register' && <Register onNavigate={setCurrentPage} />}
            {currentPage === 'dashboard' && <Dashboard onNavigate={setCurrentPage} />}
        </>
    );
}