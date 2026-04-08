-- Tabel Produk
CREATE TABLE IF NOT EXISTS products (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL,
  image TEXT NOT NULL, -- Ikon emoji atau URL gambar
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel Transaksi
CREATE TABLE IF NOT EXISTS transactions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  total_amount NUMERIC NOT NULL,
  tax_amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  customer_email TEXT,
  items JSONB NOT NULL, -- Menyimpan daftar item belanjaan
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Data Awal (Opsional)
INSERT INTO products (name, price, category, image) VALUES
('Abaya Rose Silk Premium', 450000, 'Dress & Abaya', '👗'),
('Gamis Syari A-Line Jetblack', 320000, 'Dress & Abaya', '👘'),
('Pashmina Inner 2in1 Silk', 85000, 'Hijab & Khimar', '🧕'),
('French Khimar Premium XL', 125000, 'Hijab & Khimar', '🧕'),
('Cadar Tali Sifon Arab', 35000, 'Aksesoris', '✨'),
('Bros Dagu Rose Gold Kristal', 45000, 'Aksesoris', '🌸'),
('Mukena Traveling Parasut', 175000, 'Perlengkapan Shalat', '🌙'),
('Sajadah Muka Turki', 55000, 'Perlengkapan Shalat', '🕌'),
('One Set Rayon Motif', 215000, 'Daily Wear', '🧥'),
('Kaftan Silk Exclusive', 550000, 'Dress & Abaya', '👸'),
('Bergo Maryam Diamond', 35000, 'Hijab & Khimar', '👒'),
('Manset Tangan Rajut', 15000, 'Aksesoris', '🧤');

-- Tabel Profiles (Buku Telepon Username -> Email)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Buka gembok RLS agar aplikasi bisa mencari/menyimpan profil baru
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
