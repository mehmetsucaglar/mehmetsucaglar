# Kampüs Etkinlik API (Backend)

Express ile yazılmış, etkinlikleri JSON olarak sunan REST API. Veri şimdilik bellekte (RAM) tutulur; sunucu yeniden başlayınca POST ile eklenenler kaybolur (Sprint 8'de MongoDB gelecek).

## Çalıştırma

```bash
cd backend
npm install
copy .env.example .env     # Mac/Linux: cp .env.example .env
npm run dev
```

Sunucu `http://localhost:3000` adresinde açılır. Sağlık kontrolü: <http://localhost:3000/health>

## Ortam değişkenleri

| Değişken | Açıklama | Varsayılan |
| --- | --- | --- |
| `PORT` | Sunucunun dinleyeceği port | `3000` |

`.env` dosyası GitHub'a gönderilmez. Gerekli değişkenler için `.env.example` dosyasına bakın.

## Komutlar

| Komut | Ne yapar |
| --- | --- |
| `npm run dev` | `node --watch` ile başlatır, dosya değişince yeniden başlar |
| `npm start` | Normal başlatır |

## Klasör yapısı

```
backend/
  src/
    app.js                           Express uygulaması, middleware, route bağlama
    server.js                        .env okur, portu dinler
    routes/event-routes.js           Hangi adres hangi fonksiyona gider
    controllers/event-controller.js  İsteği işler, yanıtı döndürür
    data/events.js                   Bellek içi etkinlik dizisi
  requests/kampus-api.json           Postman collection (6 istek)
  .env.example
  .gitignore
  package.json
```

## REST sözleşmesi

| Method | Endpoint | Amaç | Başarılı | Hata | Durum |
| --- | --- | --- | --- | --- | --- |
| GET | `/health` | Sunucu ayakta mı | 200 | — | Bu sprint |
| GET | `/events` | Listeyi getir (`?category=Atölye` ile filtrelenebilir) | 200 | — | Bu sprint |
| GET | `/events/:id` | Tek etkinlik | 200 | 404 | Bu sprint |
| POST | `/events` | Yeni etkinlik | 201 | 400 | Bu sprint |
| PATCH | `/events/:id` | Güncelle | 200 | 400, 404 | Sprint 9 |
| DELETE | `/events/:id` | Sil | 204 | 404 | Sprint 9 |

### Status code'lar

- **200** tamam
- **201** oluşturuldu
- **204** içerik yok
- **400** eksik/yanlış veri
- **404** bulunamadı

### Hata biçimi

Bütün hatalar aynı biçimdedir:

```json
{ "error": { "message": "Event not found" } }
```

### Örnekler

**GET /health** → `200`

```json
{ "status": "ok", "time": "2026-11-11T07:42:58.378Z", "student": "2416501032" }
```

**GET /events/event-2** → `200`

```json
{
  "id": "event-2",
  "title": "Docker ile Konteynerlere Giriş",
  "category": "Atölye",
  "capacity": 25,
  "date": "2026-11-24",
  "time": "10:00",
  "location": "Mühendislik Fakültesi Lab 4",
  "description": "Kendi bilgisayarında ilk konteynerini çalıştır, Dockerfile yaz ve imaj oluştur."
}
```

**GET /events/yok** → `404`

```json
{ "error": { "message": "Event not found" } }
```

**POST /events** (Body: raw JSON) → `201`

```json
{
  "title": "Git Atölyesi",
  "category": "Atölye",
  "date": "2026-12-01",
  "capacity": 30
}
```

`title`, `category` ve `date` zorunludur. `time`, `location`, `description` isteğe bağlıdır; verilmezse boş string, `capacity` verilmezse `0` olur.

**POST /events** (sadece `title`) → `400`

```json
{ "error": { "message": "title, category and date are required" } }
```
