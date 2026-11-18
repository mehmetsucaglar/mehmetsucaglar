# Kampüs Etkinlik API (Backend)

Express ile yazılmış, etkinlikleri JSON olarak sunan REST API. Veriler **MongoDB**'de (Mongoose ile) saklanır; sunucu yeniden başlasa da POST ile eklenen kayıtlar kaybolmaz.

## Çalıştırma

```bash
cd backend
npm install
cp .env.example .env     # Windows: copy .env.example .env
# .env içindeki MONGODB_URI değerini kendi MongoDB adresinle değiştir
npm run seed             # örnek 6 etkinliği veritabanına yükler
npm run dev
```

Sunucu `http://localhost:3000` adresinde açılır. Sağlık kontrolü: <http://localhost:3000/health>

## Ortam değişkenleri

| Değişken | Açıklama | Örnek |
| --- | --- | --- |
| `PORT` | Sunucunun dinleyeceği port (isteğe bağlı) | `3000` |
| `MONGODB_URI` | MongoDB bağlantı adresi (zorunlu) | `mongodb://127.0.0.1:27017/kampus` |

`.env` dosyası GitHub'a gönderilmez. Gerçek adres (kullanıcı adı ve şifre dahil) yalnızca kendi `.env` dosyanda durur. Gerekli değişkenler için `.env.example` dosyasına bakın.

Yerel MongoDB için `mongodb://127.0.0.1:27017/kampus`, MongoDB Atlas için Atlas'ın verdiği `mongodb+srv://...` adresi kullanılabilir. Veritabanı adı adresin sonundaki `/kampus` kısmıdır.

## Komutlar

| Komut | Ne yapar |
| --- | --- |
| `npm run dev` | `node --watch` ile başlatır, dosya değişince yeniden başlar |
| `npm start` | Normal başlatır |
| `npm run seed` | `events` koleksiyonunu boşaltır ve 6 örnek etkinlik ekler. Kaç kez çalıştırılırsa çalıştırılsın sonuçta 6 kayıt kalır. |

## Klasör yapısı

```
backend/
  src/
    app.js                           Express uygulaması, middleware, route bağlama
    server.js                        .env okur, veritabanına bağlanır, portu dinler
    seed.js                          Örnek verileri veritabanına yükler
    config/database.js               MongoDB bağlantısı (MONGODB_URI'yi .env'den okur)
    models/event-model.js            Mongoose schema ve modeli (doğrulama kuralları)
    routes/event-routes.js           Hangi adres hangi fonksiyona gider
    controllers/event-controller.js  İsteği işler, veritabanıyla konuşur, yanıtı döndürür
    data/seed-events.js              Seed için örnek etkinlikler
  requests/kampus-api.json           Postman collection (6 istek)
  .env.example
  .gitignore
  package.json
```

## Veri modeli (Event)

| Alan | Tür | Kural |
| --- | --- | --- |
| `title` | String | zorunlu, boşluklar kırpılır, 3–100 karakter |
| `category` | String | zorunlu, `Seminer`, `Atölye`, `Söyleşi` veya `Yarışma` |
| `date` | String | zorunlu (örn. `2026-12-01`) |
| `time` | String | isteğe bağlı, varsayılan boş |
| `location` | String | isteğe bağlı, boşluklar kırpılır |
| `description` | String | isteğe bağlı, en çok 500 karakter |
| `capacity` | Number | en az 0, varsayılan 0 |
| `createdAt`, `updatedAt` | Date | MongoDB/Mongoose otomatik ekler |

Her kaydın kimliği MongoDB'nin ürettiği `_id` alanıdır.

## REST sözleşmesi

| Method | Endpoint | Amaç | Başarılı | Hata | Durum |
| --- | --- | --- | --- | --- | --- |
| GET | `/health` | Sunucu ayakta mı | 200 | — | Hazır |
| GET | `/events` | Listeyi getir (`?category=Atölye` ile filtrelenebilir) | 200 | — | Hazır |
| GET | `/events/:id` | Tek etkinlik | 200 | 404 | Hazır |
| POST | `/events` | Yeni etkinlik | 201 | 400 | Hazır |
| PATCH | `/events/:id` | Güncelle | 200 | 400, 404 | Sprint 9 |
| DELETE | `/events/:id` | Sil | 204 | 404 | Sprint 9 |

### Status code'lar

- **200** tamam
- **201** oluşturuldu
- **204** içerik yok
- **400** eksik/yanlış veri
- **404** bulunamadı (geçersiz ya da olmayan `_id` dahil)
- **500** beklenmeyen sunucu hatası

### Hata biçimi

Bütün hatalar aynı biçimdedir:

```json
{ "error": { "message": "Event not found" } }
```

### Örnekler

**GET /health** → `200`

```json
{ "status": "ok", "time": "2026-11-18T07:00:00.000Z", "student": "2416501032" }
```

**GET /events/:id** → `200` (`:id` yerine listeden aldığın `_id` yazılır)

```json
{
  "_id": "673ab12f9c4d5e0012a3b4c5",
  "title": "Örnek Etkinlik",
  "category": "Seminer",
  "capacity": 100,
  "date": "2026-12-01",
  "time": "14:00",
  "location": "Kampüs Topluluk Odası",
  "description": "Örnek açıklama.",
  "createdAt": "2026-11-18T07:00:00.000Z",
  "updatedAt": "2026-11-18T07:00:00.000Z"
}
```

**GET /events/yok** veya veritabanında olmayan bir `_id` → `404`

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

Yanıt, kaydın `_id`, `createdAt` ve `updatedAt` alanlarıyla birlikte hâlidir. Eklenen kayıt MongoDB'de saklanır, sunucu yeniden başlayınca da listede görünür.

**POST /events** (sadece `title`) → `400`

```json
{ "error": { "message": "Event validation failed: category: Path `category` is required., date: Path `date` is required." } }
```
