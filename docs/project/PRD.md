# WeldTrack — Ürün Gereksinim Dokümanı (PRD)

## Ürün Özeti
WeldTrack, kaynak atölyeleri ve metal işleri dükkanları için geliştirilmiş kapsamlı bir iş yönetim platformudur. İş emri takibi, malzeme envanteri, usta yönetimi, müşteri ilişkileri ve faturalama işlemlerini tek bir yerden yönetmeyi sağlar.

## Hedef Kitle
- Kaynak atölyeleri
- Metal işleri dükkanları
- Çelik konstrüksiyon firmaları
- Endüstriyel bakım-onarım işletmeleri

## Temel Özellikler

### 1. İş Emri Yönetimi
- Sipariş oluşturma ve takip
- Durum yönetimi: Beklemede → Devam Ediyor → Kaynak → Kalite Kontrol → Tamamlandı
- Önceliklendirme: Düşük, Orta, Yüksek, Acil
- İş kalemleri ile malzeme ve işçilik takibi
- Termin tarihi ve maliyet hesaplaması

### 2. Müşteri Yönetimi
- Firma bilgileri, iletişim kişileri
- Vergi numarası ve adres kayıtları
- İş geçmişi ve fatura bağlantıları

### 3. Usta/İşçi Yönetimi
- Kaynak ustaları profilleri
- Uzmanlık alanları (TIG, MIG/MAG, Elektrik Ark, vb.)
- Sertifika kayıtları (ISO 9606, ASME IX, AWS)
- Günlük ücret takibi

### 4. Malzeme Envanteri
- Kategori bazlı stok yönetimi (Çelik, Kaynak Teli, Gaz, Sarf Malzeme, Alet)
- Minimum stok uyarıları
- Birim fiyat ve tedarikçi takibi

### 5. Kalite Kontrol
- Görsel muayene, radyografik test kayıtları
- Geçti/Başarısız/Koşullu sonuçlar
- İş emrine bağlı kontrol geçmişi

### 6. Faturalama
- Otomatik fatura numarası üretimi
- KDV hesaplaması
- Durum takibi: Taslak → Gönderildi → Ödendi
- İş emrine bağlı fatura kalemleri

### 7. Dashboard
- Aktif iş emirleri, gelir/gider özeti
- Durum dağılımı grafikleri
- Son işlemler ve düşük stok uyarıları

## Tasarım Yönü
**Industrial Technical** — Koyu çelik tonları, güvenlik turuncusu vurgular, grid tabanlı veri-yoğun düzenler

### Renk Paleti
- Birincil: Steel Blue #334155
- Vurgu: Safety Orange #EA580C
- Arkaplan (Koyu): #0F172A
- Arkaplan (Açık): #F8FAFC
- Başarı: #059669
- Uyarı: #D97706

### Tipografi
- UI: Inter
- Data/Code: JetBrains Mono

## Teknik Altyapı
- **Backend:** NestJS + Prisma ORM + PostgreSQL
- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **Hosting:** Railway (Backend + PostgreSQL), Vercel (Frontend)
- **CI/CD:** GitHub Actions
