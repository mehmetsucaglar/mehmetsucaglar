# Kampüs Etkinlikleri (React + TypeScript + Vite)

**Canlı site:** https://mehmetsucaglar-frontend.vercel.app/

Fakültedeki seminer, atölye ve söyleşileri listeleyen, etkinlik ekleme / güncelleme / silme yapılabilen React uygulaması.
Veriler Context ile tutulur; bir sayfada yapılan değişiklik tüm sayfalarda görünür (sayfa yenilenince başlangıç verisine dönülür).

## Sayfalar (10 rota)

| Adres | Sayfa |
| --- | --- |
| `/` | Ana sayfa (yaklaşan 2 etkinlik) |
| `/events` | Tüm etkinlikler, arama ve kategori filtresi |
| `/events/:id` | Etkinlik detayı |
| `/admin` | Yönetim: etkinlik tablosu, düzenle / sil (silmeden önce onay) |
| `/admin/new` | Etkinlik ekle |
| `/admin/:id/edit` | Etkinlik güncelle |
| `/login` | Giriş formu (doğrulamalı) |
| `/register` | Kayıt formu (doğrulamalı) |
| `/forgot-password` | Şifremi unuttum formu (doğrulamalı) |
| `*` | Sayfa bulunamadı |

## Klasör yapısı (`src/`)

- `main.tsx` — giriş dosyası; `BrowserRouter` ve `EventsProvider` ile uygulamayı sarar.
- `App.tsx` — Header, Navigation, Footer ve 10 rotanın tanımı.
- `context/` — `EventsProvider` (etkinlik listesi + ekle/güncelle/sil), `useEvents` hook'u.
- `pages/` — her rota için bir sayfa bileşeni.
- `components/layout/` — Header, Navigation, Footer.
- `components/events/` — EventCard, EventList, EventFilter, EventDetail.
- `components/forms/` — EventForm, FormField.
- `data/events.ts` — başlangıç etkinlikleri.
- `types/campus-event.ts` — veri tipleri.
- `utils/` — arama/filtre (`filter-events.ts`), form doğrulama (`validators.ts`), tarih biçimi (`format.ts`).
- `App.css` — tüm stiller.

## Form doğrulama kuralları

- **Etkinlik:** ad en az 3 karakter, kategori seçili, tarih ve saat dolu, yer boş değil, kontenjan 1–1000 arası tam sayı, açıklama en az 10 karakter.
- **Giriş:** geçerli e-posta, şifre en az 6 karakter.
- **Kayıt:** ad soyad en az 3 karakter, geçerli e-posta, şifre en az 6 karakter, şifre tekrarı aynı.
- **Şifremi unuttum:** geçerli e-posta.

## Kurulum ve çalıştırma

1. Bağımlılıkları yüklemek için: `npm install`
2. Geliştirme sunucusunu başlatmak için: `npm run dev`
3. Yayına hazırlamak için: `npm run build`

`vercel.json` tüm adresleri `index.html`'e yönlendirir; böylece `/events` gibi adresler doğrudan açılınca da çalışır.
